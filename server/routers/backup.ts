import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import type { Express } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

// 儲存下載任務狀態
const downloadTasks = new Map<string, {
  stage: string;
  progress: number;
  message: string;
  result?: any;
  error?: string;
}>();

/**
 * 註冊直接下載路由到 Express app
 */
export function registerBackupDownloadRoutes(app: Express) {
  // 直接下載完整備份檔案
  app.get("/api/backup/download/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = downloadTasks.get(taskId);
      
      if (!task || task.stage !== "completed" || !task.result?.filePath) {
        return res.status(404).json({ error: "備份檔案不存在或尚未完成" });
      }
      
      const filePath = task.result.filePath;
      
      // 安全性檢查
      if (!filePath.startsWith("/tmp/business-website-full-backup-")) {
        return res.status(403).json({ error: "無效的檔案路徑" });
      }
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "檔案不存在" });
      }
      
      // 設定回應標頭
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${task.result.filename}"`);
      
      // 串流傳輸檔案
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on("error", (error) => {
        console.error("檔案串流錯誤:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "檔案下載失敗" });
        }
      });
    } catch (error) {
      console.error("下載備份檔案錯誤:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "下載失敗" });
      }
    }
  });
}

export const backupRouter = router({
  /**
   * 匯出資料庫為 SQL 檔案
   * 生成完整的 SQL INSERT 語句,可直接匯入資料庫
   */
  exportDatabaseSQL: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("只有管理員可以匯出資料庫");
    }

    try {
      const db = await getDb();
      
      // 定義所有需要備份的表
      const tables = [
        "users",
        "productModels",
        "faqs",
        "supportTickets",
        "ticketReplies",
        "warrantyRegistrations",
        "subscribers",
        "partners",
        "siteSettings",
        "seoSettings",
        "socialLinks",
        "dealers",
        "serviceCenters",
        "onlineStores",
        "jobs",
      ];

      let sqlContent = `-- Apolnus 資料庫備份
-- 生成時間: ${new Date().toISOString()}
-- 資料庫版本: 1.0
-- 
-- 使用說明:
-- 1. 確保目標資料庫已建立所有表結構 (執行 schema.sql)
-- 2. 執行此 SQL 檔案匯入資料
-- 3. 注意: 此檔案會清空並重新插入所有資料
--

SET FOREIGN_KEY_CHECKS = 0;

`;

      let totalRecords = 0;

      // 逐表匯出資料
      for (const table of tables) {
        try {
          const result: any = await db.execute(`SELECT * FROM ${table}`);
          const rows = result.rows || [];
          
          if (rows.length === 0) {
            sqlContent += `-- 表 ${table}: 無資料\n\n`;
            continue;
          }

          sqlContent += `-- 表 ${table}: ${rows.length} 筆記錄\n`;
          sqlContent += `DELETE FROM ${table};\n`;

          // 取得欄位名稱
          const columns = Object.keys(rows[0]);
          
          // 生成 INSERT 語句 (批次插入,每 100 筆一組)
          const batchSize = 100;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            
            sqlContent += `INSERT INTO ${table} (${columns.map(c => `\`${c}\``).join(', ')}) VALUES\n`;
            
            const valueStrings = batch.map((row: any) => {
              const values = columns.map(col => {
                const value = row[col];
                if (value === null || value === undefined) return 'NULL';
                if (typeof value === 'number') return value;
                if (typeof value === 'boolean') return value ? '1' : '0';
                // 字串需要跳脫單引號和反斜線
                const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `'${escaped}'`;
              });
              return `  (${values.join(', ')})`;
            });
            
            sqlContent += valueStrings.join(',\n');
            sqlContent += ';\n\n';
          }

          totalRecords += rows.length;
        } catch (err) {
          console.warn(`跳過表 ${table}:`, err);
          sqlContent += `-- 表 ${table}: 匯出失敗 (${err})\n\n`;
        }
      }

      sqlContent += `SET FOREIGN_KEY_CHECKS = 1;

-- 備份完成
-- 總計: ${totalRecords} 筆記錄
`;

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `apolnus-database-${timestamp}.sql`;

      return {
        success: true,
        filename,
        content: sqlContent,
        recordCount: totalRecords,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("資料庫匯出失敗:", error);
      throw new Error(
        `資料庫匯出失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
      );
    }
  }),

  /**
   * 啟動程式碼下載任務（異步執行）
   * 生成 tar.gz 壓縮包,不包含 node_modules, .git, dist 等大型目錄
   */
  startDownloadCode: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("只有管理員可以下載代碼");
    }

    const taskId = `task-${Date.now()}`;
    
    // 初始化任務狀態
    downloadTasks.set(taskId, {
      stage: "preparing",
      progress: 0,
      message: "正在準備..."
    });

    // 異步執行壓縮任務
    (async () => {
      try {
        const projectRoot = path.resolve(__dirname, "../..");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const archiveName = `business-website-code-${timestamp}.tar.gz`;
        const archivePath = path.join("/tmp", archiveName);

        // 階段 1: 開始壓縮
        downloadTasks.set(taskId, {
          stage: "compressing",
          progress: 10,
          message: "正在壓縮程式碼檔案..."
        });

        // 排除不必要的大型目錄
        const excludePatterns = [
          "--exclude=node_modules",
          "--exclude=.git",
          "--exclude=dist",
          "--exclude=.next",
          "--exclude=.turbo",
          "--exclude=*.log",
          "--exclude=.DS_Store",
          "--exclude=coverage",
          "--exclude=.vscode",
          "--exclude=.idea",
        ];

        const tarCommand = `tar -czf ${archivePath} ${excludePatterns.join(" ")} -C ${projectRoot} .`;
        
        // 執行壓縮並監控進度
        const compressionPromise = execAsync(tarCommand, {
          maxBuffer: 100 * 1024 * 1024, // 100MB buffer
        });
        const startTime = Date.now();
        const estimatedDuration = 15000; // 估計 15 秒

        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(80, 10 + Math.floor((elapsed / estimatedDuration) * 70));
          downloadTasks.set(taskId, {
            stage: "compressing",
            progress,
            message: `正在壓縮程式碼檔案... ${progress}%`
          });
        }, 500);

        await compressionPromise;
        clearInterval(progressInterval);

        // 階段 2: 檢查檔案
        downloadTasks.set(taskId, {
          stage: "checking",
          progress: 85,
          message: "檢查壓縮包..."
        });

        if (!fs.existsSync(archivePath)) {
          throw new Error("壓縮包生成失敗");
        }

        const stats = fs.statSync(archivePath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

        // 階段 3: 生成下載路徑 (不讀取到記憶體)
        downloadTasks.set(taskId, {
          stage: "ready",
          progress: 100,
          message: "壓縮包已準備完成！"
        });

        // 完成 - 回傳檔案路徑而非內容
        downloadTasks.set(taskId, {
          stage: "completed",
          progress: 100,
          message: "壓縮包生成完成！",
          result: {
            success: true,
            filename: archiveName,
            size: `${fileSizeInMB} MB`,
            filePath: archivePath, // 儲存檔案路徑
            timestamp: new Date().toISOString(),
          }
        });
      } catch (error) {
        console.error("代碼下載失敗:", error);
        downloadTasks.set(taskId, {
          stage: "error",
          progress: 0,
          message: `代碼下載失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
          error: error instanceof Error ? error.message : "未知錯誤"
        });
      }
    })();

    return { taskId };
  }),

  /**
   * 下載壓縮檔案 (串流方式)
   * 使用檔案路徑串流下載,避免記憶體溢出
   */
  downloadCodeFile: protectedProcedure
    .input(z.object({ filePath: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("只有管理員可以下載代碼");
      }

      try {
        // 安全性檢查: 只允許下載 /tmp 目錄下的檔案
        if (!input.filePath.startsWith("/tmp/business-website-code-") && 
            !input.filePath.startsWith("/tmp/business-website-full-backup-")) {
          throw new Error("無效的檔案路徑");
        }

        if (!fs.existsSync(input.filePath)) {
          throw new Error("檔案不存在");
        }

        const stats = fs.statSync(input.filePath);
        const fileSizeInMB = stats.size / (1024 * 1024);

        // 對於大於 50MB 的檔案,分塊讀取
        if (fileSizeInMB > 50) {
          // 分塊讀取並收集所有二進位資料
          const chunkSize = 10 * 1024 * 1024; // 10MB per chunk
          const chunks: Buffer[] = [];
          const fileHandle = fs.openSync(input.filePath, 'r');
          const buffer = Buffer.alloc(chunkSize);
          
          let bytesRead = 0;
          let totalBytesRead = 0;
          
          while ((bytesRead = fs.readSync(fileHandle, buffer, 0, chunkSize, totalBytesRead)) > 0) {
            const chunk = buffer.slice(0, bytesRead);
            chunks.push(chunk);
            totalBytesRead += bytesRead;
          }
          
          fs.closeSync(fileHandle);
          
          // 合併所有 Buffer 後再轉換為 Base64
          const completeBuffer = Buffer.concat(chunks);
          const base64Content = completeBuffer.toString('base64');
          
          // 讀取完成後刪除臨時檔案
          fs.unlinkSync(input.filePath);
          
          return {
            success: true,
            content: base64Content,
          };
        } else {
          // 小檔案直接讀取
          const fileBuffer = fs.readFileSync(input.filePath);
          const base64Content = fileBuffer.toString("base64");
          
          // 讀取完成後刪除臨時檔案
          fs.unlinkSync(input.filePath);
          
          return {
            success: true,
            content: base64Content,
          };
        }
      } catch (error) {
        console.error("檔案下載失敗:", error);
        throw new Error(
          `檔案下載失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
        );
      }
    }),

  /**
   * 查詢下載任務狀態
   */
  getDownloadProgress: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(({ input }) => {
      const task = downloadTasks.get(input.taskId);
      if (!task) {
        return {
          stage: "not_found",
          progress: 0,
          message: "任務不存在"
        };
      }
      return task;
    }),

  /**
   * 清理已完成的任務
   */
  clearDownloadTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(({ input }) => {
      const task = downloadTasks.get(input.taskId);
      
      // 如果任務有檔案路徑,清理檔案
      if (task?.result?.filePath) {
        try {
          if (fs.existsSync(task.result.filePath)) {
            fs.unlinkSync(task.result.filePath);
          }
        } catch (err) {
          console.warn("清理臨時檔案失敗:", err);
        }
      }
      
      downloadTasks.delete(input.taskId);
      return { success: true };
    }),

  /**
   * 啟動完整備份任務（程式碼 + 資料庫 SQL）
   */
  startFullBackup: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("只有管理員可以執行完整備份");
    }

    const taskId = `full-backup-${Date.now()}`;
    
    downloadTasks.set(taskId, {
      stage: "preparing",
      progress: 0,
      message: "正在準備完整備份..."
    });

    (async () => {
      try {
        const projectRoot = path.resolve(__dirname, "../..");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupDir = path.join("/tmp", `backup-${timestamp}`);
        const archiveName = `business-website-full-backup-${timestamp}.zip`;
        const archivePath = path.join("/tmp", archiveName);

        // 建立臨時備份目錄
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }

        // 階段 1: 匯出資料庫 (0-30%)
        downloadTasks.set(taskId, {
          stage: "exporting_db",
          progress: 5,
          message: "正在匯出資料庫..."
        });

        const db = await getDb();
        const tables = [
          "users", "productModels", "faqs", "supportTickets", "ticketReplies",
          "warrantyRegistrations", "subscribers", "partners", "siteSettings",
          "seoSettings", "socialLinks", "dealers", "serviceCenters", "onlineStores", "jobs",
        ];

        let sqlContent = `-- Apolnus 完整資料庫備份\n-- 生成時間: ${new Date().toISOString()}\n\nSET FOREIGN_KEY_CHECKS = 0;\n\n`;
        let totalRecords = 0;

        for (let i = 0; i < tables.length; i++) {
          const table = tables[i];
          const progress = 5 + Math.floor((i / tables.length) * 25);
          
          downloadTasks.set(taskId, {
            stage: "exporting_db",
            progress,
            message: `正在匯出資料庫表: ${table}...`
          });

          try {
            const result: any = await db.execute(`SELECT * FROM ${table}`);
            const rows = result.rows || [];
            
            if (rows.length === 0) {
              sqlContent += `-- 表 ${table}: 無資料\n\n`;
              continue;
            }

            sqlContent += `-- 表 ${table}: ${rows.length} 筆記錄\nDELETE FROM ${table};\n`;
            const columns = Object.keys(rows[0]);
            
            const batchSize = 100;
            for (let j = 0; j < rows.length; j += batchSize) {
              const batch = rows.slice(j, j + batchSize);
              sqlContent += `INSERT INTO ${table} (${columns.map(c => `\`${c}\``).join(', ')}) VALUES\n`;
              
              const valueStrings = batch.map((row: any) => {
                const values = columns.map(col => {
                  const value = row[col];
                  if (value === null || value === undefined) return 'NULL';
                  if (typeof value === 'number') return value;
                  if (typeof value === 'boolean') return value ? '1' : '0';
                  const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                  return `'${escaped}'`;
                });
                return `  (${values.join(', ')})`;
              });
              
              sqlContent += valueStrings.join(',\n') + ';\n\n';
            }

            totalRecords += rows.length;
          } catch (err) {
            console.warn(`跳過表 ${table}:`, err);
            sqlContent += `-- 表 ${table}: 匯出失敗\n\n`;
          }
        }

        sqlContent += `SET FOREIGN_KEY_CHECKS = 1;\n-- 總計: ${totalRecords} 筆記錄\n`;
        
        // 寫入 SQL 檔案
        const sqlFilePath = path.join(backupDir, "database.sql");
        fs.writeFileSync(sqlFilePath, sqlContent, "utf-8");

        // 階段 2: 複製程式碼檔案 (30-70%)
        downloadTasks.set(taskId, {
          stage: "copying_code",
          progress: 35,
          message: "正在複製程式碼檔案..."
        });

        const codeDir = path.join(backupDir, "code");
        fs.mkdirSync(codeDir, { recursive: true });

        const excludePatterns = [
          "--exclude=node_modules",
          "--exclude=.git",
          "--exclude=dist",
          "--exclude=.next",
          "--exclude=.turbo",
          "--exclude=*.log",
        ];

        const copyCommand = `tar -c ${excludePatterns.join(" ")} -C ${projectRoot} . | tar -x -C ${codeDir}`;
        await execAsync(copyCommand);

        downloadTasks.set(taskId, {
          stage: "copying_code",
          progress: 70,
          message: "程式碼複製完成"
        });

        // 階段 3: 建立 README
        const readmePath = path.join(backupDir, "README.md");
        const readmeContent = `# Apolnus 完整備份

## 備份資訊
- 生成時間: ${new Date().toISOString()}
- 資料庫記錄數: ${totalRecords}

## 目錄結構
- \`code/\`: 完整專案程式碼 (不含 node_modules)
- \`database.sql\`: 資料庫 SQL 備份檔案

## 還原步驟

### 1. 還原程式碼
\`\`\`bash
cd code/
pnpm install
\`\`\`

### 2. 還原資料庫
\`\`\`bash
# 連線到資料庫並執行
mysql -u username -p database_name < database.sql
\`\`\`

### 3. 設定環境變數
複製 \`.env.example\` 為 \`.env\` 並填入必要的環境變數

### 4. 啟動專案
\`\`\`bash
pnpm dev
\`\`\`
`;
        fs.writeFileSync(readmePath, readmeContent, "utf-8");

        // 階段 4: 壓縮備份目錄 (70-95%)
        downloadTasks.set(taskId, {
          stage: "compressing",
          progress: 75,
          message: "正在壓縮備份檔案..."
        });

        const zipCommand = `cd /tmp && zip -r ${archiveName} backup-${timestamp}`;
        await execAsync(zipCommand, { maxBuffer: 200 * 1024 * 1024 });

        // 清理臨時目錄
        await execAsync(`rm -rf ${backupDir}`);

        const stats = fs.statSync(archivePath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

        // 完成
        downloadTasks.set(taskId, {
          stage: "completed",
          progress: 100,
          message: "完整備份生成完成！",
          result: {
            success: true,
            filename: archiveName,
            size: `${fileSizeInMB} MB`,
            filePath: archivePath,
            recordCount: totalRecords,
            timestamp: new Date().toISOString(),
          }
        });
      } catch (error) {
        console.error("完整備份失敗:", error);
        downloadTasks.set(taskId, {
          stage: "error",
          progress: 0,
          message: `完整備份失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
          error: error instanceof Error ? error.message : "未知錯誤"
        });
      }
    })();

    return { taskId };
  }),
});
