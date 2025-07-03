import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureTtsService {
  private readonly key: string;
  private readonly region: string;
  private readonly voices: { voice1: string; voice2: string };

  constructor(private configService: ConfigService) {
    this.key = this.configService.get<string>('AZURE_TTS_KEY');
    this.region = this.configService.get<string>('AZURE_TTS_REGION');
    this.voices = {
      voice1:
        this.configService.get<string>('AZURE_TTS_VOICE1') ||
        'zh-CN-XiaoxiaoNeural',
      voice2:
        this.configService.get<string>('AZURE_TTS_VOICE2') ||
        'zh-CN-YunxiNeural',
    };
  }

  async speak(
    text: string,
    voice: 'voice1' | 'voice2',
    index: number,
    dir: string,
  ): Promise<string> {
    const endpoint = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `<speak version='1.0' xml:lang='zh-CN'><voice name='${this.voices[voice]}'>${text}</voice></speak>`;
    const response = await axios.post(endpoint, ssml, {
      responseType: 'arraybuffer',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
    });

    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `part-${index}.mp3`);
    fs.writeFileSync(filePath, response.data);
    return filePath;
  }
}
