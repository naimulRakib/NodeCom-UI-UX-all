'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Package, HelpCircle, MapPin, Search } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  options?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'নমস্কার! আমি নোডঅন-কমার্স অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
      options: ['আমার অর্ডার কোথায়?', 'পণ্য রিটার্ন', 'ডেলিভারি সময়', 'অফার দেখুন']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (text: string = inputText) => {
    if (!text.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      let aiResponseText = 'দুঃখিত, আমি আপনার প্রশ্নটি বুঝতে পারিনি। আপনি কি অন্যভাবে জিজ্ঞেস করতে পারেন?';
      let options: string[] | undefined = undefined;

      const lowerText = text.toLowerCase();
      if (lowerText.includes('অর্ডার') || lowerText.includes('order')) {
        aiResponseText = 'আপনার সাম্প্রতিক অর্ডারটি (ID: #ORD-4512) এখন ডেলিভারি প্রক্রিয়ায় আছে। এটি আপনার স্থানীয় নোড (বুরিচং) থেকে মাত্র ১০ মিনিটের মধ্যে আপনার কাছে পৌঁছাবে।';
        options = ['অর্ডার ম্যাপ দেখুন', 'ডেলিভারি বয়কে কল করুন'];
      } else if (lowerText.includes('রিটার্ন') || lowerText.includes('return')) {
        aiResponseText = 'আমাদের রিটার্ন প্রক্রিয়া সম্পূর্ণ বিনামূল্যে। আপনি পণ্যটি পাওয়ার ৩ দিনের মধ্যে রিটার্ন করতে পারবেন। স্থানীয় নোড থেকে কেউ এসে এটি নিয়ে যাবে। আপনি কি রিটার্ন শুরু করতে চান?';
        options = ['হ্যাঁ, রিটার্ন শুরু করুন', 'না, ধন্যবাদ'];
      } else if (lowerText.includes('ডেলিভারি') || lowerText.includes('delivery')) {
        aiResponseText = 'নোডঅন-কমার্স আপনার নিকটস্থ লোকাল নোড থেকে মাত্র ১৫-২০ মিনিটের মধ্যে ডেলিভারি নিশ্চিত করে।';
      } else if (lowerText.includes('অফার') || lowerText.includes('offer')) {
        aiResponseText = 'আজকের সেরা অফার: স্মার্টওয়াচ আল্ট্রাতে ৩০% ছাড় এবং প্রো ট্রিমার X5-এ ৩২% ছাড় চলছে। স্টক সীমিত!';
        options = ['স্মার্টওয়াচ কিনুন', 'সব অফার দেখুন'];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponseText,
          options
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 pulse-dot ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-4rem)] rounded-2xl flex flex-col overflow-hidden slide-up"
          style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between"
            style={{ background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">AI অ্যাসিস্ট্যান্ট</h3>
                <p className="text-indigo-300 text-xs">সবসময় অনলাইনে</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-first' : ''}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white/10 text-slate-200 border border-white/5 rounded-bl-sm'
                    }`}>
                    {msg.text}
                  </div>

                  {msg.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                      style={{ animation: `slide-up 0.5s ease-in-out ${i * 0.15}s infinite alternate` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Carousel */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {[
                { icon: <Package className="w-3 h-3" />, label: 'অর্ডার' },
                { icon: <HelpCircle className="w-3 h-3" />, label: 'রিটার্ন' },
                { icon: <MapPin className="w-3 h-3" />, label: 'ট্র্যাকিং' },
                { icon: <Search className="w-3 h-3" />, label: 'খুঁজুন' }
              ].map((action, i) => (
                <button key={i} onClick={() => handleSend(action.label)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs whitespace-nowrap hover:bg-white/10 transition-colors">
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-slate-900/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="এখানে মেসেজ লিখুন..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white disabled:opacity-50 disabled:bg-slate-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}