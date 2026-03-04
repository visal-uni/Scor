import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider} from './context/AuthContext.jsx';
import './index.css'
import App from './App.jsx'

//Create a Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,  //Only retry failed request once 
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_OAUTH_CLIENTID}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App/>
          </AuthProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);