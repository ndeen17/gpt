import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Send, Plus, MessageSquare, Menu, X } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { generateResponse } from './lib/openai';
import type { Message, Chat } from './types/chat';
import HomePage from './types/HomePage';  // Import the HomePage component

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New chat',
      messages: [],
      createdAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  const updateChatTitle = (chatId: string, messages: Message[]) => {
    if (messages.length === 1) {
      const title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentChatId) return;

    const userMessage: Message = { role: 'user', content: input };
    
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    
    setInput('');
    setIsLoading(true);

    try {
      const messages = [...(currentChat?.messages || []), userMessage];
      updateChatTitle(currentChatId, messages);
      
      const response = await generateResponse(messages);
      if (response) {
        setChats(prev =>
          prev.map(chat =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      role: "assistant",
                      content: response?.content || "No response available.", // Ensure content is always a string
                    },
                  ],
                }
              : chat
          )
        );
        
      }
    } catch (error) {
      console.error('Error:', error);
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }] 
            }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={
          <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <div 
              className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } md:relative md:translate-x-0`}
            >
              <div className="flex flex-col h-full">
                <div className="p-3">
                  <button
                    onClick={createNewChat}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus size={16} />
                    <span className="text-sm font-medium">New chat</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {chats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setCurrentChatId(chat.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 text-sm hover:bg-gray-100 transition-colors duration-200 ${
                        chat.id === currentChatId ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      <MessageSquare size={16} />
                      <span className="truncate font-medium">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
              <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-white/80 backdrop-blur-sm">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-gray-600 hover:text-gray-900 md:hidden"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentChat?.title || 'ChatGPT'}
                </h1>
              </div>

              <div className="flex-1 container mx-auto max-w-3xl px-4 py-4 md:px-8 flex flex-col">
                <div className="flex-1 space-y-6 overflow-y-auto">
                  {!currentChat?.messages.length ? (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">What name can I help you explore today?</h2>
                      <p className="text-gray-600 max-w-md">I’m Orúkọ.mi, your guide to uncovering the meanings, heritage, and beauty behind Nigerian names.</p>
                    </div>
                  ) : (
                    currentChat.messages.map((message, index) => (
                      <ChatMessage key={index} {...message} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 relative border-t border-gray-100 pt-4">
                  <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message ChatGPT..."
                      className="w-full resize-none rounded-lg border border-gray-200 bg-white pl-4 pr-12 py-3 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 disabled:opacity-50"
                      style={{ maxHeight: '200px' }}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 bottom-2.5 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                      disabled={isLoading}
                    >
                      <Send size={16} />
                    </button>
                  </form>
                  <p className="mt-2 text-xs text-center text-gray-400">
                  Orúkọ.mi is still under development may produce inaccurate information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
