/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const QUICK_QUESTIONS = [
  "Tell me about Aabiskar's background",
  "What 3D tools does he master?",
  "How can I commission a project?"
];

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I am Aabiskar's portfolio assistant. Ask me anything about his 3D art, video & motion works, graphic systems, or how to collaborate on a project." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 50);

    const responseText = await sendMessageToGemini(query);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[92vw] sm:w-[380px] bg-[#0d1017] border border-[#00f0ff]/50 rounded-lg overflow-hidden shadow-2xl flex flex-col h-[520px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-[#08090d] p-3.5 px-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#00f0ff] text-black flex items-center justify-center font-mono font-bold text-xs">
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Portfolio Assistant
                  </h3>
                  <p className="text-[10px] font-mono text-[#00f0ff]">
                    Aabiskar Multidisciplinary Guide
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2.5 bg-[#0a0c10] border-b border-white/5 flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-[11px] font-mono text-gray-300 hover:text-[#00f0ff] hover:border-[#00f0ff] border border-white/10 px-2.5 py-1 rounded bg-[#12151e] transition-colors text-left cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Scrollable Messages Thread */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth bg-[#0d1017]"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded text-xs font-mono leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#00f0ff] text-black font-medium'
                        : 'bg-[#151924] text-gray-200 border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#151924] border border-white/10 p-3 rounded text-xs font-mono text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                    <span>Consulting Aabiskar's portfolio archive...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/10 bg-[#08090d]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about 3D works, video, or booking..."
                  className="flex-1 bg-[#12151e] border border-white/15 px-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#00f0ff] text-black px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center"
                  aria-label="Send Message"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-4 rounded-full bg-[#00f0ff] text-black font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-white transition-colors cursor-pointer border border-[#00f0ff] shadow-lg"
        data-hover="true"
        aria-label="Toggle Portfolio Guide"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4 stroke-[2.5]" />
            <span>Portfolio Guide</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIChat;
