import * as fs from "fs";
import * as XLSX from "xlsx";
import * as path from "path";

async function generateSeoSql() {
    // Current working directory is /app/scripts or /Users/.../code
    // The CSV file was moved to the code root in the previous step
    const csvPath = path.join(process.cwd(), "seoSettings_20251205_104245.csv");
    const sqlPath = path.join(process.cwd(), "scripts", "restore_seo.sql");

    console.log(`Reading CSV from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
        console.error("CSV file not found!");
        process.exit(1);
    }

    const fileContent = fs.readFileSync(csvPath);
    const workbook = XLSX.read(fileContent, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet) as any[];

    console.log(`Found ${data.length} records. Generating SQL...`);

    let sqlContent = "-- Auto-generated SEO restoration SQL\n";
    sqlContent += "USE apolnus;\n\n";

    for (const row of data) {
        if (!row.page || !row.language || !row.title) continue;

        const page = String(row.page).replace(/'/g, "''");
        const language = String(row.language).replace(/'/g, "''");
        const title = String(row.title).replace(/'/g, "''");
        const description = row.description ? `'${String(row.description).replace(/'/g, "''")}'` : 'NULL';
        const keywords = row.keywords ? `'${String(row.keywords).replace(/'/g, "''")}'` : 'NULL';

        sqlContent += `INSERT INTO seoSettings (page, language, title, description, keywords, updatedAt) VALUES ('${page}', '${language}', '${title}', ${description}, ${keywords}, NOW()) ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), keywords=VALUES(keywords), updatedAt=NOW();\n`;
    }

    fs.writeFileSync(sqlPath, sqlContent);
    console.log(`SQL generated at: ${sqlPath}`);
    process.exit(0);
}

generateSeoSql().catch((err) => {
    console.error("Script failed:", err);
    process.exit(1);
});
