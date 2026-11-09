import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Mic, Send } from 'lucide-react';

export default function InputArea({ disabled, onSend }) {
  const textareaRef = useRef(null);
  const [value, setValue] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const autoGrow = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '56px';
    ta.style.height = ta.scrollHeight + 'px';
  }, []);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    autoGrow();
  }, [autoGrow]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSend = useCallback(() => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
    textareaRef.current && (textareaRef.current.style.height = '56px');
  }, [value, disabled, onSend]);

  const handleVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.onstart = () => {
        const toast = document.createElement('div');
        toast.textContent = 'Microphone recording active...';
        document.dispatchEvent(new CustomEvent('proxima-toast', { detail: { message: 'Microphone recording active...', type: 'info' } }));
      };
      rec.onresult = e => {
        setValue(prev => prev + e.results[0][0].transcript);
        autoGrow();
      };
      rec.start();
    } else {
      document.dispatchEvent(new CustomEvent('proxima-toast', { detail: { message: 'Voice recognition engine not supported in your browser.', type: 'error' } }));
    }
  }, [autoGrow]);

  const handleAttach = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    if (e.target.files.length) {
      document.dispatchEvent(new CustomEvent('proxima-toast', { detail: { message: `Attached: ${e.target.files[0].name}`, type: 'success' } }));
      setValue(prev => `${prev}\n[Attached File: ${e.target.files[0].name}]\n`);
      autoGrow();
    }
  }, [autoGrow]);

  return (
    <div className="absolute bottom-0 w-full p-4 lg:p-8 bg-gradient-to-t from-slate-100 via-slate-100/95 dark:from-black dark:via-black/95 to-transparent z-20">
      <div className="max-w-4xl mx-auto relative group">
        <div className="input-glow-bg absolute -inset-0.5 rounded-2xl blur opacity-25 group-focus-within:opacity-100 group-focus-within:duration-300 transition duration-1000" />
        <div className="relative glass-panel rounded-2xl flex flex-col p-2 border border-black/15 dark:border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.02)] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] focus-within:border-black/25 dark:focus-within:border-white/20 transition-all duration-300 bg-white/70 dark:bg-black/70">
          <div className="flex items-end gap-2 p-1">
            <button
              id="attach-btn"
              className="p-3 text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all self-end shrink-0 hover:scale-110 active:scale-95"
              title="Attach File"
              onClick={handleAttach}
            >
              <Paperclip className="text-lg" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </button>

            <textarea
              id="chat-input"
              ref={textareaRef}
              rows="1"
              className="w-full bg-transparent font-bold text-[14px] lg:text-[15px] placeholder:text-slate-400 dark:placeholder:text-white/20 border-none outline-none py-3 px-2 resize-none max-h-[160px] overflow-y-auto leading-relaxed"
              placeholder="Message Proxima... (Shift+Enter for new line)"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />

            <button
              id="voice-btn"
              className="p-3 text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all self-end shrink-0 hover:scale-110 active:scale-95"
              title="Voice Input"
              onClick={handleVoice}
              disabled={disabled}
            >
              <Mic className="text-lg" />
            </button>

            <motion.button
              id="send-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={disabled || !value.trim()}
              className="p-3 ml-1 bg-slate-900 text-white dark:bg-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-all self-end shrink-0 flex items-center justify-center w-11 h-11 shadow-md"
              onClick={handleSend}
            >
              <Send className="text-lg" />
            </motion.button>
          </div>

          <div className="flex justify-between items-center px-3 pb-1 pt-2 border-t border-black/5 dark:border-white/5 mt-1">
            <span className="text-[8px] font-extrabold text-slate-400 dark:text-white/20 uppercase tracking-widest">
              <i className="ph-bold ph-lock-key" /> SECURE CONTEXT ENGINE ACTIVE
            </span>
            <span id="char-counter" className="text-[8px] font-extrabold text-slate-400 dark:text-white/20" style={{ color: charCount > 3900 ? '#ef4444' : '' }}>
              {charCount} / 4000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
