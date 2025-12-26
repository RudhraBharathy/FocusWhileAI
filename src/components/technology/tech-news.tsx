import { useState, useEffect } from "react";
import {
  Newspaper,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function TechNews() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const HACKER_NEWS_API_URL = import.meta.env.VITE_HACKER_NEWS_API_URL;

  const fetchNews = async () => {
    setLoading(true);
    try {
      const idsRes = await fetch(`${HACKER_NEWS_API_URL}/topstories.json`);
      const ids = await idsRes.json();

      const randomIds: any[] = [];
      while (randomIds.length < 3) {
        const id = ids[Math.floor(Math.random() * 50)];
        if (!randomIds.includes(id)) randomIds.push(id);
      }

      const storyPromises = randomIds.map((id) =>
        fetch(`${HACKER_NEWS_API_URL}/item/${id}.json`).then((res) =>
          res.json()
        )
      );

      const results = await Promise.all(storyPromises);
      setStories(results);
    } catch (e) {
      console.error("HN Fetch Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-cyan-500">
          <Newspaper size={20} />
          <h3 className="font-bold">Tech Information</h3>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-cyan-500" size={24} />
          </div>
        ) : (
          stories.map((story) => (
            <a
              key={story.id}
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
            >
              <h4 className="text-white font-medium text-base leading-snug mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                {story.title}
              </h4>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1">
                    <ArrowUpRight size={10} /> {story.score}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={10} /> {story.descendants}
                  </span>
                </div>
                <span>
                  {new URL(story.url || window.location.href).hostname.replace(
                    "www.",
                    ""
                  )}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
