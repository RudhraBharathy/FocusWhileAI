import { useEffect, useState } from 'react';
import WidgetCard from './WidgetCard';
import { getCurrentSite, isAIThinking } from '../utils/site-detect';

export default function Overlay() {
    const [visible, setVisible] = useState(false);
    const [siteConfig, setSiteConfig] = useState(null);
    
    // Default interest for MVP (Later, load from Firebase/Storage)
    const [currentInterest, setCurrentInterest] = useState('coding');

    useEffect(() => {
        const config = getCurrentSite();
        if (config) {
            console.log("[FocusWhileAI] Active on:", config.host);
            setSiteConfig(config);
        }
    }, []);

    useEffect(() => {
        if (!siteConfig) return;

        const interval = setInterval(() => {
            const thinking = isAIThinking(siteConfig);
            
            if (thinking && !visible) {
                const interests = ['coding', 'finance', 'zen'];
                setCurrentInterest(interests[Math.floor(Math.random() * interests.length)]);
                setVisible(true);
            } else if (!thinking && visible) {
                setVisible(false);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [siteConfig, visible]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-2147483647 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
            <WidgetCard category={currentInterest} />
        </div>
    );
}