// src/tts/tts.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { AzureTtsService } from './azure-tts.service';

@Injectable()
export class TtsService {
  constructor(
    private configService: ConfigService,
    private azureTtsService: AzureTtsService,
  ) {
    this.API_KEY = this.configService.get<string>('ELEVENLABS_API_KEY');
    this.VOICES = {
      voice1: this.configService.get<string>('ELEVENLABS_VOICE1_ID'),
      voice2: this.configService.get<string>('ELEVENLABS_VOICE2_ID'),
    };
  }

  private readonly API_KEY = process.env.ELEVENLABS_API_KEY;
  private readonly VOICES = {
    voice1: 'YOUR_VOICE_ID_1',
    voice2: 'YOUR_VOICE_ID_2',
  };

  async speak(
    text: string,
    voice: 'voice1' | 'voice2',
    index: number,
    dir: string,
    language: string,
  ): Promise<string> {
    if (language === 'zh') {
      return this.azureTtsService.speak(text, voice, index, dir);
    }
    console.log(`Speaking with ${voice}: ${text}`);
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${this.VOICES[voice]}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'xi-api-key': this.API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `part-${index}.mp3`);
    fs.writeFileSync(filePath, response.data);
    return filePath;
  }
}
