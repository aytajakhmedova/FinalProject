import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { SiteContentProvider } from './context/SiteContentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </LanguageProvider>
  </StrictMode>,
)
