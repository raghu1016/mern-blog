import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import Projects from "./pages/Pojects.jsx"
import Header from "./components/Header.jsx"

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/projects" element={<Projects/>}/>
      </Routes>
    </BrowserRouter>
  )
}
