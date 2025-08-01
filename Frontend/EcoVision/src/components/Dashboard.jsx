import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Dashboard = () => {
  const [productType, setProductType] = useState('');
  const [weight, setWeight] = useState('');
  const [state, setState] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSearch = () => {
    const buyers = [
      { name: 'Buyer A', distance: '2 km', quantity: '50 kg' },
      { name: 'Buyer B', distance: '5 km', quantity: '80 kg' },
      { name: 'Buyer C', distance: '7 km', quantity: '30 kg' },
    ];
    setResults(buyers);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5 w-full" data-aos="fade-up">
      <h1 className="text-2xl font-bold text-logoGreen text-center mb-4" data-aos="fade-down">
        Find Nearby Buyers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div data-aos="zoom-in">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select product</option>
            <option value="plastic">Plastic</option>
            <option value="metal">Metal</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
          </select>
        </div>

        <div data-aos="zoom-in" data-aos-delay="100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div data-aos="zoom-in" data-aos-delay="200">
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            placeholder="Enter state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div data-aos="zoom-in" data-aos-delay="300">
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
          <input
            type="text"
            placeholder="Enter municipality"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-logoGreen text-white py-2 rounded-xl font-semibold hover:bg-logoGreenDark transition"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Search Buyers
      </button>

      {results.length > 0 && (
        <div className="mt-6" data-aos="fade-up">
          <h2 className="text-lg font-semibold text-logoGreen mb-4">Nearby Buyers</h2>
          <ul className="space-y-3">
            {results.map((buyer, i) => (
              <li key={i} className="p-3 bg-gray-50 border rounded-lg" data-aos="fade-left" data-aos-delay={i * 100}>
                <p className="font-medium">{buyer.name}</p>
                <p className="text-sm text-gray-600">Distance: {buyer.distance}</p>
                <p className="text-sm text-gray-600">Quantity: {buyer.quantity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
