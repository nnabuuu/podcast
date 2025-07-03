// src/utils/audio-utils.ts
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export async function concatAudioFiles(files: string[], outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    const listFile = path.join(dir, 'list.txt');
    const content = files.map(f => `file '${f}'`).join('\n');
    fs.writeFileSync(listFile, content);

    return new Promise((resolve, reject) => {
        exec(`ffmpeg -f concat -safe 0 -i ${listFile} -c copy ${outputPath}`, (error) => {
            fs.unlinkSync(listFile);
            if (error) reject(error);
            else resolve();
        });
    });
}
