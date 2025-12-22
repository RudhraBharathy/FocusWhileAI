import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Quote, Loader2, RefreshCw, Scroll } from "lucide-react";

export default function StoicQuote() {
  const [data, setData] = useState({ quote: "", author: "" });
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  const fetchQuote = () => {
    setLoading(true);

    chrome.runtime.sendMessage({ action: "FETCH_STOIC_QUOTE" }, (response) => {
      if (response && response.success) {
        setData({
          quote: response.data.quote,
          author: response.data.author,
        });
      } else {
        console.error("Fetch failed:", response?.error);
        setData({
          quote: "The obstacle is the way.",
          author: "Ryan Holiday",
        });
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchQuote();
    }
  }, []);

  return (
    <div className="h-full flex flex-col p-6 relative overflow-hidden">
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-10 text-white/5 pointer-events-none"
      >
        <Quote size={100} />
      </motion.div>

      <div className="flex justify-between items-center mb-4 z-10 relative">
        <div className="flex items-center gap-2 text-slate-400">
          <Scroll size={18} />
          <h3 className="font-bold text-sm tracking-wider text-slate-300">
            Stoic Wisdom
          </h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchQuote}
          className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors"
          title="Get new quote"
        >
          <RefreshCw size={14} />
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col justify-center z-10 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-500 h-full">
            <Loader2 className="animate-spin text-slate-400" size={24} />
            <span className="text-xs font-light tracking-wide">
              Consulting the ancients...
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col h-full justify-between"
          >
            <div className="flex-1 flex items-center">
              <p className="text-xl md:text-2xl text-slate-200 font-serif leading-relaxed italic drop-shadow-lg">
                "{data.quote}"
              </p>
            </div>

            <div className="mt-4 border-t border-white/10 pt-3 flex items-end justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] pl-1">
                — {data.author}
              </span>

              <span className="text-[10px] text-slate-600 font-mono">
                Source: stoic.tekloon.net
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
