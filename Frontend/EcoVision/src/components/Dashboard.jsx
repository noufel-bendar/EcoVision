import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [productType, setProductType] = useState('');
  const [weight, setWeight] = useState('');
  const [state, setState] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
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

  const products = ['pain', 'papier', 'plastique', 'déchets organiques'];

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
      const response = await axios.get('http://127.0.0.1:8000/api/buyer/requests/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          product_type: productType,
          state: state,
        },
      });

      setResults(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate('/');
      } else {
        alert("Failed to fetch requests");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 w-full" data-aos="fade-up">
      <h1 className="text-2xl font-bold text-logoGreen text-center mb-4">Trouver des acheteurs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div data-aos="zoom-in">
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de produit</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Sélectionner</option>
            {products.map((prod) => (
              <option key={prod} value={prod}>{prod}</option>
            ))}
          </select>
        </div>

        <div data-aos="zoom-in" data-aos-delay="100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Sélectionner</option>
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
        {loading ? 'Chargement...' : 'Rechercher'}
      </button>

      <div className="pt-6 space-y-4">
        {results.length > 0 ? (
          results.map((req) => (
            <div key={req.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
              <p><span className="font-semibold">Produit:</span> {req.product_type}</p>
              <p><span className="font-semibold">Quantité:</span> {req.quantity} kg</p>
              <p><span className="font-semibold">Wilaya:</span> {req.state}</p>
              <p><span className="font-semibold">Municipalité:</span> {req.municipality}</p>
              <p><span className="font-semibold">Prix:</span> {req.price} DZD</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucune demande trouvée</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
