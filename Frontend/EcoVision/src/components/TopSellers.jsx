import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://127.0.0.1:8000/api/seller/top-sellers/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTopSellers(response.data || []);
      } catch (error) {
        console.error('Failed to fetch top sellers:', error);
        // Fallback to sample data if API fails
        setTopSellers([
          { name: 'Ali S.', points: 150, sales: 45, transactions: 8 },
          { name: 'Sarah K.', points: 130, sales: 38, transactions: 6 },
          { name: 'Omar B.', points: 100, sales: 30, transactions: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 space-y-4"
      data-aos="fade-left"
    >
      <h2
        className="text-xl font-semibold text-logoGreen text-center"
        data-aos="fade-down"
      >
        Top Sellers
      </h2>

      <ul className="space-y-3">
        {topSellers.map((seller, index) => (
          <li
            key={index}
            className={`flex justify-between items-center p-3 rounded-lg border ${
              index === 0 ? 'bg-yellow-50 border-yellow-200' : 
              index === 1 ? 'bg-gray-50 border-gray-200' : 
              index === 2 ? 'bg-orange-50 border-orange-200' : 
              'bg-gray-50 border-gray-200'
            }`}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-yellow-400 text-white' : 
                index === 1 ? 'bg-gray-400 text-white' : 
                index === 2 ? 'bg-orange-400 text-white' : 
                'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-800">{seller.name}</div>
                <div className="text-xs text-gray-500">{seller.points} points</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">{seller.sales} kg</div>
              <div className="text-xs text-gray-500">
                {seller.transactions} {seller.transactions === 1 ? 'deal' : 'deals'}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {topSellers.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No sellers data available
        </div>
      )}

      <div className="text-xs text-gray-500 text-center mt-4">
        Points are earned based on quantity sold and transaction count
      </div>
    </div>
  );
};

export default TopSellers;
