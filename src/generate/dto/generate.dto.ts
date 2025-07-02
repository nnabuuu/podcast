// src/generate/dto/generate.dto.ts
import { IsString } from 'class-validator';

export class GenerateDto {
    @IsString()
    article: string;
}
