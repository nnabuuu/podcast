// src/generate/dto/generate.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class GenerateDto {
    @IsString()
    article: string;

    @IsString()
    @IsOptional()
    language?: string;
}
