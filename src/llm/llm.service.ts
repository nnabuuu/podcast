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

    async generateDialogue(article: string, language: string): Promise<string> {
        let prompt: string;
        if (language === 'zh') {
            prompt = `
文章："""${article}"""

任务：基于上方内容，创作一段有趣又富有信息量的播客风格对话，主持人是 Amy，嘉宾专家是 Evan。两者均为中国大陆居民，因此请考虑适合中国大陆的对话。

格式如下：
[Amy]：……
[Evan]：……
[Amy]：……
[Evan]：……

要求口吻自然，内容有吸引力。
`;
        } else {
            prompt = `
Article: """${article}"""

Task: Create a fun and informative podcast-style conversation between [Amy] (host) and [Evan] (expert) discussing the content above.

Format:
[Amy]: ...
[Evan]: ...
[Amy]: ...
[Evan]: ...

Be engaging and natural.`;
        }

        const res = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });

        return res.choices[0].message?.content || '';
    }
}
