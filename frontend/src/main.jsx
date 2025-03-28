import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthProvider } from './context/authContext'
import LandingPage from './components/LandingPage'
import Chatbot from './components/ChatBot/chatbot'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/book/:bookId", // Add this route
        element: <Home />,
      },
      {
        path: '/landingpage',
        element: <LandingPage />,
      },
      {
        path: '/auth',
        element: <Login />,
      },
      {
        path: '/chatbot',
        element: <Chatbot />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
