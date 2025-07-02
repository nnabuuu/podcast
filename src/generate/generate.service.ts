// src/generate/generate.service.ts
import { Injectable } from '@nestjs/common';
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

    async generate(article: string): Promise<string> {
        const dialogue = await this.llmService.generateDialogue(article);
        console.log(dialogue);
        const lines = dialogue.split('\n').filter(Boolean);
        const audioPaths: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const [speaker, content] = lines[i].split(': ');
            const voice = speaker.includes('Amy') ? 'voice1' : 'voice2';
            const audioPath = await this.ttsService.speak(content, voice, i);
            audioPaths.push(audioPath);
        }

        const podcastPath = path.join(__dirname, '../../tmp/podcast.mp3');
        await concatAudioFiles(audioPaths, podcastPath);
        audioPaths.forEach(p => fs.unlinkSync(p)); // clean up
        return podcastPath;
    }
}
