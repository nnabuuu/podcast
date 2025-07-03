// src/generate/generate.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { TtsService } from '../tts/tts.service';
import { concatAudioFiles } from '../utils/audio-utils';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GenerateService {
    constructor(
        private readonly llmService: LlmService,
        private readonly ttsService: TtsService,
    ) {}
    private readonly logger = new Logger(GenerateService.name);

    async generate(article: string, language: string): Promise<string> {
        const baseDir = path.join(__dirname, '../../output');
        const taskDir = path.join(baseDir, `${Date.now()}`);
        fs.mkdirSync(taskDir, { recursive: true });

        const dialogue = await this.llmService.generateDialogue(article, language);
        this.logger.log(`Dialogue generated:\n${dialogue}`);
        fs.writeFileSync(path.join(taskDir, 'dialogue.txt'), dialogue);
        const lines = dialogue.split('\n').filter(Boolean);

        const audioPaths: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(/^(.+?)[:\uff1a]\s*(.*)$/);
            if (!match) continue;
            const speaker = match[1];
            const content = match[2];
            const voice = speaker.includes('[Amy]') ? 'voice1' : 'voice2';
            const audioPath = await this.ttsService.speak(content, voice, i, taskDir);
            audioPaths.push(audioPath);
        }

        const podcastPath = path.join(taskDir, 'podcast.mp3');
        await concatAudioFiles(audioPaths, podcastPath);
        audioPaths.forEach(p => fs.unlinkSync(p)); // clean up
        return podcastPath;
    }
}
