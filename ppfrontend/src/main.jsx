import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthPro } from './context/AuthPro'
import { BrowserRouter } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PrimeReactProvider>
      <AuthPro>
        <App />
      </AuthPro>
    </PrimeReactProvider>
  </BrowserRouter>,
)
