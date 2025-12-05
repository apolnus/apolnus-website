# 使用 Node 20 Alpine 作為基底映像檔 (輕量且穩定)
FROM node:20-alpine AS builder

# 啟用 pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 複製 package.json 和 lock 檔
COPY package.json pnpm-lock.yaml ./

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製所有原始碼
COPY . .

# 執行建置 (Vite Build + Backend Build)
# 注意：確保 .env 在建置時不需要 (若依賴環境變數則需在 Runtime 注入)
RUN pnpm run build

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 安裝必要工具 (因為 pnpm 在 alpine 需要額外設定)
RUN corepack enable

# 從 builder 階段複製建置產物與 node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# 暴露服務埠口
EXPOSE 3000

# 啟動指令：先推入 Schema -> 匯入資料 -> 啟動伺服器
CMD ["pnpm", "start"]
