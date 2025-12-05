import 'dotenv/config';
import { createConnection } from 'mysql2/promise';

async function diagnose() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('Testing connection to:', dbUrl);

    try {
        const connection = await createConnection(dbUrl);
        console.log('Successfully connected!');
        await connection.end();
        process.exit(0);
    } catch (error: any) {
        console.error('Connection failed!');
        console.error('Code:', error.code);
        console.error('Message:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('DIAGNOSIS: MySQL server is not running on this port.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('DIAGNOSIS: Password or username is incorrect.');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('DIAGNOSIS: Database "apolnus" does not exist. We need to create it.');
        }
        process.exit(1);
    }
}

diagnose();
