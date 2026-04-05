import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from '../Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/AboutUs.jsx'
import Contact from './pages/ContactUs.jsx'
import Services from './pages/Services.jsx'
import Products from './pages/Products.jsx'
import Clients from './pages/Clients.jsx'
import Downloads from './pages/Downloads.jsx'
import Events from './pages/Events.jsx'
import Gallery from './pages/Gallery.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
       <Route path='' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='services' element={<Services />} />
        <Route path='products' element={<Products />} />
        <Route path='clients' element={<Clients />} />
        <Route path='downloads' element={<Downloads />} />
        <Route path='events' element={<Events />} />
        <Route path='gallery' element={<Gallery />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<h1 className='text-center text-4xl mt-20'>404 Not Found</h1>} />

      
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
