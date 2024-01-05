export class Logger {
    private static getTimeStamp(): string {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    static info(message: any): void {
        console.log(`[${Logger.getTimeStamp()}] [INFO] ${message}`);
    }

    static error(message: any): void {
        console.error(`[${Logger.getTimeStamp()}] [ERROR] ${message}`);
    }

    static warn(message: any): void {
        console.warn(`[${Logger.getTimeStamp()}] [WARNING] ${message}`);
    }
}
