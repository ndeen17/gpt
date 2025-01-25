import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={`py-5 ${isAssistant ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto max-w-3xl flex gap-6 px-4 md:px-8">
        <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
          isAssistant ? 'bg-green-600' : 'bg-gray-900'
        }`}>
          {isAssistant ? (
            <Bot size={20} className="text-white" />
          ) : (
            <MessageSquare size={20} className="text-white" />
          )}
        </div>
        <div className="prose prose-sm flex-1 prose-p:leading-relaxed prose-pre:bg-gray-100">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}