import React, { useMemo } from 'react';
import { Terminal, TrendingUp, Gamepad2, Coffee } from 'lucide-react';

// Mock Data - Eventually you will fetch this from Firebase
const DATA_DECKS = {
    coding: [
        { title: "JS Tip", content: "Use `console.table(array)` to view data as a clean table instead of a list." },
        { title: "Regex", content: "/^[^@]+@[^@]+\.[^@]+$/ checks for basic email validity." },
        { title: "React", content: "The `useId` hook generates unique IDs for accessibility attributes." }
    ],
    finance: [
        { title: "Rule of 72", content: "Divide 72 by the interest rate to see how many years it takes to double your money." },
        { title: "Market", content: "S&P 500 is technically a 'market-cap weighted' index." }
    ],
    zen: [
        { title: "Breathe", content: "Inhale for 4 seconds... Hold for 4... Exhale for 4." },
        { title: "Focus", content: "Multitasking drops IQ by 10 points. Stay on this one task." }
    ]
};

const ICONS = {
    coding: <Terminal className="w-8 h-8 text-blue-400" />,
    finance: <TrendingUp className="w-8 h-8 text-green-400" />,
    zen: <Coffee className="w-8 h-8 text-orange-400" />
};

export default function WidgetCard({ category }) {
    // Pick a random card from the deck every time this component mounts
    const card = useMemo(() => {
        const deck = DATA_DECKS[category] || DATA_DECKS.coding;
        return deck[Math.floor(Math.random() * deck.length)];
    }, [category]);

    return (
        <div className="bg-slate-800/90 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-700 rounded-full">
                    {ICONS[category] || ICONS.coding}
                </div>
                <h3 className="text-slate-200 font-bold text-lg uppercase tracking-wider">
                    {category}
                </h3>
            </div>
            
            <div className="space-y-2">
                <h4 className="text-white text-2xl font-bold">{card.title}</h4>
                <p className="text-slate-300 text-lg leading-relaxed">
                    {card.content}
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-500">
                <span>FocusWhileAI</span>
                <span>Generating Response...</span>
            </div>
        </div>
    );
}