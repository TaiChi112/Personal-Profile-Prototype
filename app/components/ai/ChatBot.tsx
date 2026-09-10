"use client";

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onError: (error) => {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('500') || errorMsg.includes('timeout') || errorMsg.includes('failed to fetch')) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: 'Connection lost. Please check your internet or try again.',
          },
        ]);
      }
    },
  });

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-fd-primary text-fd-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-fd-background border border-fd-border rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-fd-border bg-fd-card rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-sm">AI Knowledge Assistant</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-fd-accent rounded-md text-fd-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-fd-muted-foreground text-sm mt-10">
              <p>สวัสดีครับ! ผมคือ AI Assistant ประจำเว็บไซต์</p>
              <p className="mt-2">คุณสามารถสอบถามข้อมูลด้าน Computer Science, Business, หรือ Finance ได้เลยครับ</p>
            </div>
          )}
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-sm ${
                  m.role === 'user'
                    ? 'bg-fd-primary text-fd-primary-foreground rounded-br-sm'
                    : 'bg-fd-muted text-fd-foreground rounded-bl-sm border border-fd-border'
                }`}
              >
                {/* Render simple text, robust parsing for a real app would use a markdown renderer */}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-fd-muted text-fd-foreground rounded-lg rounded-bl-sm p-3 text-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-fd-border bg-fd-card rounded-b-xl flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-1 bg-fd-background border border-fd-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fd-primary"
          />
          <button
            type="submit"
            disabled={isLoading || !input?.trim()}
            className="p-2 bg-fd-primary text-fd-primary-foreground rounded-md disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
