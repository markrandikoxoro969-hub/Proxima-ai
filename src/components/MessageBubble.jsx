import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[tag]));
}

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}



export default function MessageBubble({ role, content = '', id, time, streaming = false, streamingText = '', userName = 'USER' }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (window.Prism) {
      try { window.Prism.highlightAllUnder(contentRef.current); } catch (e) { /* noop */ }
    }
    const btn = contentRef.current.querySelector('.copy-code-btn');
    if (btn) {
      btn.onclick = () => copyCode(btn, btn.getAttribute('data-code'));
    }
  }, [content, streamingText]);

  const showTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const displayText = streaming ? streamingText : content;
  const isAI = role === 'ai';
  const parsedContent = isAI
    ? (window.DOMPurify ? window.DOMPurify.sanitize(window.marked.parse(displayText || '')) : escapeHTML(displayText || ''))
    : escapeHTML(displayText || '');

  function copyCode(btnElement, text) {
    try {
      navigator.clipboard.writeText(text).then(() => animateCopy(btnElement)).catch(() => fallbackCopy(btnElement, text));
    } catch (err) {
      fallbackCopy(btnElement, text);
    }
  }

  function fallbackCopy(btnElement, text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-999999px';
      document.body.appendChild(ta);
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      if (success) animateCopy(btnElement);
    } catch (err) { /* noop */ }
  }

  function animateCopy(btnElement) {
    const original = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="ph-bold ph-check text-emerald-500"></i> COPIED';
    setTimeout(() => { btnElement.innerHTML = original; }, 2000);
  }

  const bubbleVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const aiHeader = (
    <div className="flex items-center gap-2 mb-2 ml-1">
      <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md">
        <Globe className="text-xs" />
      </div>
      <span className="font-extrabold text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/60">Proxima</span>
      <span className="text-[9px] font-bold text-slate-400 dark:text-white/20">{showTime}</span>
    </div>
  );

  const userHeader = (
    <div className="flex items-center gap-2 mb-2 mr-1">
      <span className="text-[9px] font-bold text-slate-400 dark:text-white/20">{showTime}</span>
      <span className="font-extrabold text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/60">{userName}</span>
    </div>
  );

  const renderBody = () => {
    if (streaming) {
      return (
        <div className="glass-panel rounded-2xl rounded-tl-sm p-4 min-w-[40%]">
          <div className="flex items-center gap-1 py-1">
            <span className="typing-dot" /> <span className="typing-dot" /> <span className="typing-dot" />
          </div>
          <div ref={contentRef} className="prose mt-3" dangerouslySetInnerHTML={{ __html: parsedContent }} />
          <span className="animate-pulse">█</span>
        </div>
      );
    }

    const bgClass = isAI ? 'glass-panel text-slate-900 dark:text-white' : 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md';
    const radiusClass = isAI ? 'rounded-2xl rounded-tl-sm' : 'rounded-2xl rounded-tr-sm';
    const actions = isAI
      ? `
      <div class="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2 absolute -bottom-8 left-0 z-10">
        <button class="action-btn p-1.5 text-slate-400 hover:text-slate-950 dark:text-white/30 dark:hover:text-white rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-black/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-md" title="Copy Response">
          <i class="ph-bold ph-copy text-xs"></i>
        </button>
      </div>`
      : '';

    return (
      <div className={`${bgClass} ${radiusClass} px-5 py-4 w-full prose prose-invert group relative`} ref={contentRef} dangerouslySetInnerHTML={{ __html: parsedContent + actions }} />
    );
  };

  return (
    <motion.div
      initial={bubbleVariants.hidden}
      animate={bubbleVariants.visible}
      exit={bubbleVariants.hidden}
      className={`flex flex-col max-w-full lg:max-w-3xl w-full min-w-0 ${isAI ? 'mr-auto items-start' : 'ml-auto items-end'} fade-in`}
    >
      {isAI ? aiHeader : userHeader}
      {renderBody()}
    </motion.div>
  );
}
