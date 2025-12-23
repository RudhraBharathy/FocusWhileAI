import { useState } from "react";
import { Sparkles, Copy, RefreshCw, Check, Terminal } from "lucide-react";
import { PROMPTS } from "@/data/llmPrompts";

export default function LlmPromptTips() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * PROMPTS.length)
  );
  const [copied, setCopied] = useState(false);

  const prompt = PROMPTS[index];

  const nextPrompt = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * PROMPTS.length);
    } while (newIndex === index);
    setIndex(newIndex);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles size={20} />
          <h3 className="font-bold">LLM Prompt Tip</h3>
        </div>
        <button
          onClick={nextPrompt}
          className="p-2 hover:bg-white/10 rounded-full transition-colors group"
        >
          <RefreshCw
            size={16}
            className="text-slate-500 group-hover:text-white active:rotate-180 transition-all"
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center animate-fade-in">
        <div className="mb-3">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-indigo-500/30">
            {prompt.category}
          </span>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative group">
          <p className="text-white text-sm font-mono leading-relaxed pr-8">
            "{prompt.text}"
          </p>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all shadow-lg"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-sm text-slate-500">
        <Terminal size={10} />
        <span>Paste into AI to optimize results</span>
      </div>
    </div>
  );
}
