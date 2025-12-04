import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { ProjectProvider } from './Context/ProjectContext'
import { ProjectProvider as ProjectProvider2 } from './Context/ProjectContext2'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectProvider>
      <ProjectProvider2>
        <BrowserRouter basename="/Bhisi">
          <App />
        </BrowserRouter>
      </ProjectProvider2>
    </ProjectProvider>
  </StrictMode>,
)
