
import React, { useState, useEffect, useRef } from 'react';
import { createConciergeChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
  links?: { title: string; uri: string }[];
}

const RoyalConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك في فضاء علاء الخزاعي. أنا مساعدك الشخصي للبحث عن القطع التي تليق بمقامك، كيف يمكنني إرشادك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = createConciergeChat();
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatRef.current.sendMessage({ message: userMsg });
      const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const links = groundingChunks
        ?.filter((chunk: any) => chunk.web)
        ?.map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri,
        })) || [];

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text || 'نعتذر، نظام الذكاء الاصطناعي يمر بمرحلة تحديث لحظية.',
        links: links.length > 0 ? links : undefined
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً، يبدو أن هناك ضغطاً على خوادم الخزاعي الفائقة. يرجى المحاولة لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[2005]">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-white border border-slate-100 rounded-[35px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-500 ease-out">
          <div className="p-6 border-b border-slate-50 bg-brand-midnight text-white flex justify-between items-center relative">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-pulse shadow-[0_0_10px_#32CD32]"></div>
              <div>
                <h3 className="font-bold text-xs">مساعد الخزاعي الذكي</h3>
                <p className="text-[8px] text-brand-primary font-black uppercase tracking-widest mt-0.5">Concierge Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center">✕</button>
            <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`max-w-[88%] p-4 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-brand-midnight text-white font-medium rounded-br-none shadow-md' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'}`}>
                  {m.text}
                  {m.links && m.links.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">إليك بعض المصادر:</p>
                      {m.links.map((link, idx) => (
                        <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] text-brand-primary hover:text-brand-teal transition-colors truncate font-bold">
                          <span className="w-1 h-1 bg-brand-primary rounded-full"></span>
                          {link.title || 'رابط خارجي'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-brand-primary/30 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-brand-primary/40 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="كيف يمكننا خدمتك؟"
                className="flex-1 bg-transparent border-none px-3 py-1 text-xs outline-none text-brand-midnight placeholder:text-slate-300"
              />
              <button onClick={handleSend} className="bg-brand-midnight w-10 h-10 rounded-xl flex items-center justify-center hover:bg-brand-primary transition-all tap-active">
                <span className="text-white text-lg">✨</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-midnight text-white px-7 py-4 rounded-full font-black text-xs shadow-2xl hover:scale-110 transition-all flex items-center gap-3 border border-white/5 animate-float active:scale-95"
        >
          <span className="text-xl bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">🤖</span>
          <span className="tracking-widest uppercase">Concierge</span>
        </button>
      )}
    </div>
  );
};

export default RoyalConcierge;
