import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import { ENTERPRISE_CONFIG } from './config/enterpriseKeys'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={ENTERPRISE_CONFIG.GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
)
