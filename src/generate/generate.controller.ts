// src/generate/generate.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { GenerateDto } from './dto/generate.dto';
import { GenerateService } from './generate.service';
import { Response } from 'express';

@Controller('generate')
export class GenerateController {
    constructor(private readonly generateService: GenerateService) {}

    @Post()
    async generatePodcast(@Body() dto: GenerateDto, @Res() res: Response) {
        const filePath = await this.generateService.generate(dto.article);
        res.download(filePath, 'podcast.mp3');
    }
}
