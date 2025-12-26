import { useState, useEffect } from "react";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";

export default function ProductivityTip() {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const PRODUCTIVITY_TIP_API_URL = import.meta.env
    .VITE_PRODUCTIVITY_TIP_API_URL;

  const fetchTip = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PRODUCTIVITY_TIP_API_URL}?t=${Date.now()}`);
      const data = await res.json();
      setTip(data.slip.advice);
    } catch (e) {
      console.error("API Error:", e);
      setTip("Focus on being productive instead of busy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-yellow-400">
          <Lightbulb size={20} />
          <h3 className="font-bold">Daily Wisdom</h3>
        </div>
        <button
          onClick={fetchTip}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center text-center">
        {loading ? (
          <Loader2 className="animate-spin text-brand-cyan" size={32} />
        ) : (
          <div className="animate-fade-in">
            <p className="text-xl text-white font-medium leading-relaxed">
              "{tip}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
