import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import PromptBtn from './PromptBtn';

export default function EmptyState({ user }) {
  return (
    <div id="empty-state" className="m-auto flex flex-col items-center justify-center text-center max-w-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 rounded-full bg-slate-900/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center mb-6 shadow-glow"
      >
        <Globe className="text-4xl text-slate-800 dark:text-white" />
      </motion.div>
      <h2 className="text-2xl font-black mb-3 text-glow">HOW CAN I HELP?</h2>
      <p className="text-slate-400 dark:text-white/40 font-bold mb-8 text-sm leading-relaxed">
        Proxima V2.81 is ready. Ask anything, formulate algorithms, or brainstorm creative design logic.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <PromptBtn label="Write a clean Python script" icon="code" />
        <PromptBtn label="Explain Quantum Physics simply" icon="brain" />
      </div>
    </div>
  );
}
