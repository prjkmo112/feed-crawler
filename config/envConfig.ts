import * as dotenv from 'dotenv';

const MODE = process.env.MODE || 'dev';
dotenv.config({ path: `.env.${MODE}` });


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MYSQL_URL: string;
            MYSQL_USER: string;
            MYSQL_PASSWORD: string;
            MYSQL_DRIVER: string;
            MYSQL_CONNECTOR_PATH: string;

            ZSTD_COMPRESSED_LEVEL: number;

            LOG_DIR: string;
            LOG_LEVEL: "verbose" | "debug" | "info" | "warn" | "error";
            LOG_FILE_NAME: string;
            LOG_MAX_HISTORY: string;
        }
    }
}

for (const key in process.env) {
    if (key === "ZSTD_COMPRESSED_LEVEL") 
        process.env[key] = parseInt(`${process.env[key]}`.trim());
    
}