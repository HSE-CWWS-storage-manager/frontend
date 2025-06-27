import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//       <App />
//   </StrictMode>,
// )
createRoot(document.getElementById('root')!).render(
    <App />
)