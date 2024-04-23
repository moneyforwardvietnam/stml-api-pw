import {Blob} from 'buffer'
import fs from 'fs'
import path from 'path'

export class FileHelper {
    static readFileAsBlob(filePath: string) {
        const fileBuffer = fs.readFileSync(filePath, 'binary')
        return new Blob([fileBuffer])
    }

    static readFileSync(filePath: string) {
        return fs.readFileSync(filePath)
    }

    static readPDFFileAsMultipart(filePath: string) {
        const info = path.parse(filePath)
        const buffer = fs.readFileSync(filePath)
        return {
            name: `${info.name}${info.ext}`,
            mimeType: 'application/pdf',
            buffer,
        }
    }
}
