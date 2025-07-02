// src/utils/audio-utils.ts
import { exec } from 'child_process';

export async function concatAudioFiles(files: string[], outputPath: string): Promise<void> {
    const listFile = 'tmp/list.txt';
    const content = files.map(f => `file '${f}'`).join('\n');
    require('fs').writeFileSync(listFile, content);

    return new Promise((resolve, reject) => {
        exec(`ffmpeg -f concat -safe 0 -i ${listFile} -c copy ${outputPath}`, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}
