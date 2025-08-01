import React from 'react';
import Auth from './pages/Auth.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SellerDashboard from './pages/SellerDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';


function App() {


  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/seller" element={<SellerDashboard  />} />
        
      </Routes>
    </BrowserRouter>
  )
}
export default App
