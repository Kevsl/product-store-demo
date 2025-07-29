import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly openai: OpenAI) {}

  async ask(dto: ChatDto) {
    const res = await this.openai.responses.create({
      model: 'gpt-4o-mini',
      input: dto.prompt,
      instructions: 'Répond moi en francais, sans utiliser de gros mots',
    });
    return res.output_text;
  }

  async createProductDescription(keywords: string) {
    const res = await this.openai.responses.create({
      model: 'gpt-4o-mini',
      input: keywords,
      instructions: `A partir des mots clefs présent dans la partie input, crée moi la description d'un produit. Optimise cette description afin d'optimiser le seo. `,
    });
    return res.output_text;
  }
}
