import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async getArtCritique(title: string, artist: string, description: string): Promise<string> {
    try {
      const prompt = `You are a sophisticated and slightly pretentious art critic. Write a very short (max 40 words) critique of an artwork titled "${title}" by "${artist}". The artist describes it as: "${description}". Sound impressed but esoteric.`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text;
      }
      throw new Error("No response text generated");
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}