// src/llm/llm.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LlmService {

    constructor(private configService: ConfigService) {
    }
    private readonly openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async generateDialogue(article: string): Promise<string> {
        const prompt = `
Article: """${article}"""

Task: Create a fun and informative podcast-style conversation between Alex (host) and Blake (expert) discussing the content above.

Format:
Alex: ...
Blake: ...
Alex: ...
Blake: ...

Be engaging and natural.
`;

        const res = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });

        return res.choices[0].message?.content || '';
    }
}
