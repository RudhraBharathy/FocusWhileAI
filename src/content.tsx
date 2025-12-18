import React from 'react';
import ReactDOM from 'react-dom/client';
import Overlay from './components/Overlay';
import styleText from './index.css?inline';

console.log("[FocusWhileAI] Content script loaded.");

const rootElement = document.createElement('div');
rootElement.id = 'focus-while-ai-root';

const appendTarget = document.body || document.documentElement;
appendTarget.appendChild(rootElement);

const shadowRoot = rootElement.attachShadow({ mode: 'open' });

const styleTag = document.createElement('style');
styleTag.textContent = styleText;
shadowRoot.appendChild(styleTag);

const reactRoot = ReactDOM.createRoot(shadowRoot);
reactRoot.render(
  <React.StrictMode>
    <Overlay />
  </React.StrictMode>
);