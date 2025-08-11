import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onOfferCreated }) => {
  const [productType, setProductType] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [prices, setPrices] = useState({});
  const [accepting, setAccepting] = useState({});
  const navigate = useNavigate();

  const states = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa',
    'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa',
    'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif',
    'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine',
    'Médéa', 'Mostaganem', 'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
    'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
    'Aïn Témouchent', 'Ghardaïa', 'Relizane'
  ];

  // Match the backend PRODUCT_CHOICES exactly
  const products = ['plastic', 'metal', 'paper', 'glass'];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const userType = localStorage.getItem('user_type');
    if (userType !== 'seller') {
      navigate('/');
    }
  }, [navigate]);

  const handleSearch = async () => {
    if (!productType || !state) {
      alert("Please select product and state");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Searching for:', { product_type: productType, state: state });
      
      const response = await api.get('/api/buyer/public-requests/', {
        params: {
          product_type: productType,
          state: state,
        },
      });

      console.log('API Response:', response.data);
      setResults(response.data);
      
      // Initialize prices for new results
      const newPrices = {};
      response.data.forEach(req => {
        newPrices[req.id] = '';
      });
      setPrices(newPrices);
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status === 401) {
        navigate('/');
      } else {
        alert("Failed to fetch requests");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    const price = prices[requestId];
    if (!price || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      setAccepting(prev => ({ ...prev, [requestId]: true }));
      const token = localStorage.getItem('token');
      
      const response = await api.post('/api/seller/create-offer/', {
        request_id: requestId,
        price: parseFloat(price),
        message: `Offer for ${price} DZD/kg`
      });

      alert("Offer sent successfully! The buyer will be notified.");
      
      // Remove the accepted request from the results
      setResults(prev => prev.filter(req => req.id !== requestId));
      
      // Clear the price for this request
      setPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[requestId];
        return newPrices;
      });
      
      // Refresh the seller's orders if callback is provided
      if (onOfferCreated) {
        onOfferCreated();
      }
      
    } catch (error) {
      console.error('Accept error:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to send offer. Please try again.");
      }
    } finally {
      setAccepting(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handlePriceChange = (requestId, value) => {
    setPrices(prev => ({
      ...prev,
      [requestId]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 w-full" data-aos="fade-up">
      <h1 className="text-2xl font-bold text-logoGreen text-center mb-4">Find Buyers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div data-aos="zoom-in">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select</option>
            {products.map((prod) => (
              <option key={prod} value={prod}>{prod.charAt(0).toUpperCase() + prod.slice(1)}</option>
            ))}
          </select>
        </div>

        <div data-aos="zoom-in" data-aos-delay="100">
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select</option>
            {states.map((wilaya) => (
              <option key={wilaya} value={wilaya}>{wilaya}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-logoGreen text-white py-2 rounded-xl font-semibold hover:bg-logoGreenDark transition disabled:opacity-60"
        data-aos="fade-up"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>

      <div className="pt-6 space-y-4">
        {results.length > 0 ? (
          results.map((req) => (
            <div key={req.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
              <p><span className="font-semibold">Product:</span> {req.product}</p>
              <p><span className="font-semibold">Quantity:</span> {req.quantity} kg</p>
              <p><span className="font-semibold">State:</span> {req.state}</p>
              <p><span className="font-semibold">Status:</span> {req.status}</p>
              
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Price (DZD/kg)"
                  value={prices[req.id] || ''}
                  onChange={(e) => handlePriceChange(req.id, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                  min="0"
                  step="0.01"
                />
                <button
                  onClick={() => handleAccept(req.id)}
                  disabled={accepting[req.id]}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition disabled:opacity-60"
                >
                  {accepting[req.id] ? 'Sending...' : 'Accept'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No requests found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
