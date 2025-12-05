import { describe, it, expect } from 'vitest';
import OpenAI from 'openai';

describe('OpenAI API Key Validation', () => {
  it('should successfully connect to OpenAI API with provided key', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^sk-/);
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Test with a simple completion request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Hello'" },
      ],
      max_tokens: 10,
    });

    expect(completion).toBeDefined();
    expect(completion.choices).toBeDefined();
    expect(completion.choices.length).toBeGreaterThan(0);
    expect(completion.choices[0].message.content).toBeDefined();
    
    console.log('✅ OpenAI API Key is valid and working');
  }, 30000); // 30 second timeout for API call
});
