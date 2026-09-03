import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  User, 
  Shield, 
  RefreshCw, 
  Award, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ChatBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const ChatBoardModal: React.FC<ChatBoardModalProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'ai' | 'community'>('ai');
  
  // AI Assistant State
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! Welcome to the UPRSA Official AI Sports Assistant. How can I assist you today? You can ask about 2026 age categories, skater registration, tournament entries, state points system (Gold=5, Silver=3, Bronze=1), or certificate verification.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'uprsa-official-core'
    }
  ]);

  // Community Chat State
  const [communityMessages, setCommunityMessages] = useState<ChatMessage[]>([]);
  const [communityInput, setCommunityInput] = useState('');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || 'Lucknow');

  const aiEndRef = useRef<HTMLDivElement>(null);
  const commEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'community') {
      loadCommunityMessages();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  useEffect(() => {
    commEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [communityMessages]);

  const loadCommunityMessages = async () => {
    try {
      const res = await api.getChatMessages();
      if (res.success) {
        setCommunityMessages(res.data);
      }
    } catch (e) {
      console.error('Error fetching chat messages:', e);
    }
  };

  const handleSendAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userText = aiInput.trim();
    setAiInput('');
    
    const userMsg: AIMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg]);
    setAiLoading(true);

    try {
      const res = await api.askAI(userText);
      const assistantMsg: AIMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: res.reply || 'Thank you for your query. Please check the official circulars for details.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source
      };
      setAiMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setAiMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: 'Unable to connect to the assistant server right now. Please check our official FAQs or contact UPRSA Secretariat.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityInput.trim()) return;

    const name = user ? user.name : (senderName.trim() || 'Skater / Parent');
    const role = isAdmin ? 'admin' : (user ? 'skater' : 'public');

    try {
      const res = await api.sendChatMessage({
        senderName: name,
        senderRole: role,
        district: user?.district || district,
        message: communityInput.trim(),
        isAnnouncement: isAdmin
      });

      if (res.success && res.data) {
        setCommunityMessages(prev => [...prev, res.data!]);
        setCommunityInput('');
      }
    } catch (err) {
      console.error('Failed to post message:', err);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setAiInput(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full sm:max-w-xl h-[85vh] sm:h-[620px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">UPRSA Sports Assistant</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Knowledge Engine & Community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Assistant (Gemini)</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'community'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Board</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'ai' ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/40">
            {/* Quick Prompts */}
            <div className="p-2.5 bg-slate-900/40 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
              <button
                onClick={() => handlePromptClick('What are the 2026 age categories and cut-off dates?')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-700"
              >
                🎂 Age Categories
              </button>
              <button
                onClick={() => handlePromptClick('How are state points and rankings calculated?')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-700"
              >
                🏆 Points (5-3-1 Rule)
              </button>
              <button
                onClick={() => handlePromptClick('What documents are required for Skater Registration?')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-700"
              >
                📝 Registration Documents
              </button>
              <button
                onClick={() => handlePromptClick('How to verify an official UPRSA certificate?')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-700"
              >
                🔍 QR Verification
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                      {msg.sender === 'assistant' ? (
                        <>
                          <Bot className="w-3 h-3 text-amber-400" />
                          <span className="font-semibold text-amber-300">UPRSA Assistant</span>
                          {msg.source && (
                            <span className="text-[9px] bg-slate-900 px-1 rounded text-slate-400">
                              {msg.source}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-blue-200" />
                          <span className="font-semibold text-blue-100">You</span>
                        </>
                      )}
                      <span className="ml-auto">{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-300 rounded-2xl rounded-bl-none p-3 border border-slate-700 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Consulting UPRSA Official Rules...</span>
                  </div>
                </div>
              )}
              <div ref={aiEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendAI} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about age groups, rules, registrations, points..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/40">
            {/* Community Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {communityMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border ${
                    msg.isAnnouncement
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {msg.senderRole === 'admin' ? (
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span className="font-bold text-white">{msg.senderName}</span>
                      {msg.district && (
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                          {msg.district}
                        </span>
                      )}
                      {msg.isAnnouncement && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 rounded">
                          ANNOUNCEMENT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              ))}
              <div ref={commEndRef} />
            </div>

            {/* Community Input */}
            <form onSubmit={handleSendCommunity} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
              {!user && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="District (e.g. Lucknow)"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={communityInput}
                  onChange={(e) => setCommunityInput(e.target.value)}
                  placeholder="Post a query or message on the community board..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!communityInput.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
