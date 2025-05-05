import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const LOG_DIR = process.env.LOG_DIR || "./logs";
const LOG_FILE = process.env.LOG_FILE || "app";
const LOG_MAX_HISTORY = process.env.LOG_MAX_HISTORY || "14d";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const dailyRotateFileTransport = new winstonDaily({
    dirname: LOG_DIR,
    filename: `%DATE%-${LOG_FILE}.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: LOG_MAX_HISTORY,
    level: LOG_LEVEL,
});

const commonLogFormat = [
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
];

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
        ...commonLogFormat,
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                ...commonLogFormat
            ),
        }),
        dailyRotateFileTransport,
    ],
});

export default logger;