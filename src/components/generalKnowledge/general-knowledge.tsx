import { useState, useEffect } from "react";
import { RefreshCw, Lightbulb, Loader2, CalendarDays } from "lucide-react";

export default function GeneralKnowledge() {
  const [facts, setFacts] = useState<string[]>([]);
  const [historyEvent, setHistoryEvent] = useState<{
    year: string;
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const RANDOM_FACTS_API_URL = import.meta.env.VITE_RANDOM_FACTS_API_URL;
  const WIKIPEDIA_API_URL = import.meta.env.VITE_WIKIPEDIA_API_URL;

  const fetchFacts = async () => {
    setLoading(true);
    setError(false);
    try {
      const [res1, res2] = await Promise.all([
        fetch(RANDOM_FACTS_API_URL),
        fetch(RANDOM_FACTS_API_URL),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      setFacts([data1.text, data2.text]);
    } catch (err) {
      console.error("Failed to fetch facts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  async function getHistoryEvent() {
    const date = new Date();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    try {
      const response = await fetch(
        `${WIKIPEDIA_API_URL}${mm}/${dd}`
      );
      const data = await response.json();
      const event =
        data.selected[Math.floor(Math.random() * data.selected.length)];

      return {
        year: event.year,
        text: event.text,
        type: "history",
      };
    } catch (error) {
      console.error("History fetch failed", error);
      return null;
    }
  }

  useEffect(() => {
    fetchFacts();
    getHistoryEvent().then((event) => {
      if (event) {
        setHistoryEvent(event);
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-brand-cyan">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-bold text-lg tracking-wide text-white">
            Did You Know?
          </h3>
        </div>

        <button
          onClick={fetchFacts}
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
          title="Get new facts"
        >
          <RefreshCw
            className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6 min-h-[140px]">
        {error ? (
          <div className="flex-1 flex items-center justify-center text-red-400 text-sm">
            Failed to load facts. Try refreshing.
          </div>
        ) : loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-brand-cyan" />
            <span className="text-xs">Gathering facts...</span>
          </div>
        ) : (
          <>
            <div className="bg-slate-900/50 p-3 rounded-lg border-l-2 border-brand-purple animate-fade-in">
              <p className="text-slate-200 text-base leading-relaxed font-medium">
                {facts[0]}
              </p>
            </div>

            <div
              className="bg-slate-900/50 p-3 rounded-lg border-l-2 border-brand-cyan animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <p className="text-slate-200 text-base leading-relaxed font-medium">
                {facts[1]}
              </p>
            </div>

            {historyEvent && (
              <div>
                <div className="flex items-center gap-2 text-brand-cyan mb-4">
                  <CalendarDays className="w-5 h-5" />
                  <h3 className="font-bold text-lg tracking-wide text-white">
                    On This Day
                  </h3>
                </div>
                <div
                  className="bg-slate-900/50 p-3 rounded-lg border-l-2 border-brand-green animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <p className="text-slate-200 text-base leading-relaxed font-medium">
                    {historyEvent.year}: {historyEvent.text}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 text-[12px] text-slate-600 text-right">
        Source: Wikimedia API, uselessfacts.jsph.pl
      </div>
    </div>
  );
}
