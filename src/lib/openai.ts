import OpenAI from 'openai';
import type { Message } from '../types/chat';

const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is missing. Please add your API key to the .env file.');
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateResponse = async (messages: Message[]) => {
  try {
    const openai = getOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};