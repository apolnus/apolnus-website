import mysql from 'mysql2/promise';

async function main() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("No DATABASE_URL");
        return;
    }

    console.log("Connecting to:", dbUrl.replace(/:[^:@]+@/, ':***@'));

    try {
        const conn = await mysql.createConnection({
            uri: dbUrl,
            ssl: { rejectUnauthorized: false }
        });
        console.log("Connected!");

        const [tables] = await conn.query("SHOW TABLES");
        console.log("Tables:", tables);

        // Check users table
        try {
            const [columns] = await conn.query("SHOW COLUMNS FROM users");
            console.log("Users Columns:", columns);
        } catch (e: any) {
            console.error("Could not show columns from users:", e.message);
        }

        // Try insert
        try {
            console.log("Attempting test insert...");
            await conn.execute("INSERT INTO users (openId, name, email, loginMethod) VALUES (?, ?, ?, ?)",
                ['test_123', 'Test User', 'test@example.com', 'test']);
            console.log("Insert success!");
            await conn.execute("DELETE FROM users WHERE openId = ?", ['test_123']);
        } catch (e: any) {
            console.error("Insert failed:", e);
        }

        await conn.end();
    } catch (e) {
        console.error("Connection failed:", e);
    }
}

main();
