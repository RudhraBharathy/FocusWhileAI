import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Check, Terminal, TrendingUp, Coffee, Gamepad2, ArrowRight } from 'lucide-react';

function Onboarding() {
  const [selected, setSelected] = useState(['coding']);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleFinish = () => {
    // TODO: Save 'selected' to Firebase or Chrome Storage here
    console.log("Saved interests:", selected);
    window.close();
  };

  return (
    <div className="max-w-2xl w-full text-center space-y-10 animate-fade-in">
      
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Welcome to FocusWhileAI
        </h1>
        <p className="text-slate-400 text-xl">
          Turn your waiting time into learning time. What keeps you in flow?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left">
        <Option 
          id="coding" 
          label="Coding Tips" 
          icon={<Terminal />} 
          active={selected.includes('coding')} 
          onClick={() => toggle('coding')} 
        />
        <Option 
          id="finance" 
          label="Finance & Market" 
          icon={<TrendingUp />} 
          active={selected.includes('finance')} 
          onClick={() => toggle('finance')} 
        />
        <Option 
          id="zen" 
          label="Zen & Breathwork" 
          icon={<Coffee />} 
          active={selected.includes('zen')} 
          onClick={() => toggle('zen')} 
        />
        <Option 
          id="gaming" 
          label="Gaming Trivia" 
          icon={<Gamepad2 />} 
          active={selected.includes('gaming')} 
          onClick={() => toggle('gaming')} 
        />
      </div>

      <button 
        onClick={handleFinish}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ring-offset-slate-900"
      >
        <span>Get Started</span>
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
}

const Option = ({ id, label, icon, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
      ${active 
        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
        : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800'}
    `}
  >
    <div className={`p-3 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
      {icon}
    </div>
    <span className={`text-lg font-medium ${active ? 'text-white' : 'text-slate-400'}`}>
      {label}
    </span>
    {active && (
      <div className="absolute top-4 right-4 text-blue-400">
        <Check size={20} />
      </div>
    )}
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Onboarding />
  </React.StrictMode>
);