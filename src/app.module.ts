import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GenerateService } from './generate/generate.service';
import { LlmService } from './llm/llm.service';
import { TtsService } from './tts/tts.service';
import { AzureTtsService } from './tts/azure-tts.service';
import { GenerateController } from './generate/generate.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, GenerateController],
  providers: [
    AppService,
    GenerateService,
    LlmService,
    AzureTtsService,
    TtsService,
  ],
})
export class AppModule {}
