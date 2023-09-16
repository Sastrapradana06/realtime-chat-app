import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { BrowserRouter } from "react-router-dom";
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from 'react-router-dom'
// import Chat from './components/chat/chat.jsx'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />
//   }, 
//   {
//     path: '/chat',
//     element: <Chat />
//   }
// ])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
    {/* <RouterProvider router={router}/> */}
  </React.StrictMode>,
)
