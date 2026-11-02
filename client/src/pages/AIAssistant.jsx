import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  User,
  Loader2,
  HelpCircle,
  ArrowRight,
  Target
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'What should I learn next based on my current skill set?',
  'Am I ready for a backend developer internship?',
  'Which skills am I missing for my recent job analyses?',
  'Suggest high-impact portfolio projects using my skills',
  'Explain database indexing and connection pooling simply',
  'How can I prepare for a senior full stack interview?',
];

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await aiService.getHistory();
      setMessages(res.data.history || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMsg = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await aiService.sendMessage(text);
      const assistantMsg = {
        role: 'assistant',
        content: res.data.message,
        created_at: res.data.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const msg = err.response?.data?.error || 'AI Assistant encountered an error.';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all conversation history?')) return;
    try {
      await aiService.clearHistory();
      setMessages([]);
      toast.success('Chat history cleared.');
    } catch {
      toast.error('Failed to clear history.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] bg-white rounded-3xl border border-[#e9ebf2] shadow-premium overflow-hidden font-sans">
      {/* Chat Header */}
      <div className="p-4 sm:px-6 bg-[#0b0f19] text-white flex items-center justify-between shrink-0 border-b border-[#1e2638]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-orange-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-glow">
            <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white font-sans">SkillSync Career AI</h3>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Personalized with PostgreSQL profile context
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message List Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#fcfcfd]">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-brand-600 border border-orange-100 flex items-center justify-center shadow-sm">
              <Sparkles className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-slate-900 font-sans">
                Hi {user?.fullName?.split(' ')[0] || 'there'}, how can I accelerate your tech career today?
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-body">
                I have full access to your technical skills, job analyses, and roadmap progress stored in PostgreSQL.
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="p-3.5 rounded-2xl bg-white hover:bg-orange-50/70 border border-[#e9ebf2] hover:border-orange-200 text-xs text-slate-700 hover:text-brand-900 font-semibold transition-all shadow-card flex items-start justify-between gap-2 group"
                >
                  <span className="font-body">{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={index}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-sm'
                  }`}
                >
                  {isUser ? user?.fullName?.charAt(0) || 'U' : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-brand-600 via-orange-600 to-amber-600 text-white shadow-glow'
                      : 'bg-white border border-[#e9ebf2] text-slate-800 shadow-card whitespace-pre-wrap font-body'
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isUser ? 'text-orange-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {sending && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#e9ebf2] text-slate-500 text-xs flex items-center gap-2 font-body">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>SkillSync AI is analyzing your career profile...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-white border-t border-[#e9ebf2] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about your skills, interview prep, or career roadmap..."
            className="flex-1 px-4 py-3 rounded-2xl border border-[#e9ebf2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-body"
            disabled={sending}
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 text-white hover:shadow-glow transition-all disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
