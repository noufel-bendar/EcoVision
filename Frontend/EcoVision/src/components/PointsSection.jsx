import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const PointsSection = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch seller profile
        const profileRes = await api.get('/api/seller/profile/');
        if (profileRes.data && profileRes.data.length > 0) {
          setPoints(profileRes.data[0].total_points || 0);
        }

        // Fetch rewards list
        const rewardsRes = await api.get('/api/seller/rewards/');
        setRewards(rewardsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClaimReward = async (rewardId) => {
    if (points < 100) {
      alert('You need at least 100 points to claim a reward!');
      return;
    }

    try {
      setClaiming(true);
      const token = localStorage.getItem('token');
      
      await api.post('/api/seller/claim-reward/', {
        reward: rewardId
      });

      alert('Reward claimed successfully!');
      setPoints(prev => prev - 100);
    } catch (error) {
      console.error('Failed to claim reward:', error);
      alert('Failed to claim reward. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const handleDebugPoints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/seller/debug-points/');
      
      setDebugInfo(response.data);
      console.log('Debug info:', response.data);
    } catch (error) {
      console.error('Failed to fetch debug info:', error);
      alert('Failed to fetch debug info');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-16 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center space-y-6"
      data-aos="fade-up"
    >
      <h2 className="text-xl font-semibold text-logoGreen" data-aos="fade-down">
        My Points
      </h2>

      <div className="text-center" data-aos="zoom-in">
        <div className="text-5xl font-bold text-logoGreen">{points}</div>
        <div className="text-sm text-gray-500">Total Collected</div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="w-full bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs">
          <h4 className="font-medium text-yellow-800 mb-2">Debug Info:</h4>
          <div className="text-yellow-700 space-y-1">
            <div>Total Sales: {debugInfo.total_sales_kg} kg</div>
            <div>Accepted Offers: {debugInfo.accepted_offers}</div>
            <div>Expected Base Points: {debugInfo.expected_base_points}</div>
            <div>Expected Bonus Points: {debugInfo.expected_bonus_points}</div>
            <div>Expected Total: {debugInfo.expected_total_points}</div>
            <div>Actual Total: {debugInfo.total_points}</div>
          </div>
        </div>
      )}

      {/* Points System Info */}
      <div className="w-full bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">How to earn points:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 2 points per kg sold</li>
          <li>• 5 bonus points per successful transaction</li>
          <li>• Maximum 50 bonus points per transaction</li>
        </ul>
      </div>

      <div className="w-full" data-aos="fade-up">
        <h3 className="text-md font-medium text-gray-700 mb-2">Available Rewards</h3>
        <ul className="space-y-3">
          {rewards.length > 0 ? (
            rewards.map((reward, index) => (
              <li
                key={reward.id}
                className={`p-3 rounded-lg flex justify-between items-center border ${
                  points >= 100 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
                data-aos="fade-left"
                data-aos-delay={index * 100}
              >
                <div>
                  <span className="font-medium">{reward.title}</span>
                  <p className="text-xs text-gray-500 mt-1">{reward.description}</p>
                </div>
                <span className="text-sm text-gray-600">100 pts</span>
              </li>
            ))
          ) : (
            <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-500">
              No rewards available
            </li>
          )}
        </ul>
      </div>

      <div className="w-full space-y-2">
        <button
          className="w-full bg-logoGreen hover:bg-logoGreenDark text-white py-2 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          data-aos="zoom-in-up"
          disabled={points < 100 || claiming}
          onClick={() => rewards.length > 0 && handleClaimReward(rewards[0].id)}
        >
          {claiming ? 'Claiming...' : 
           points >= 100 ? 'Claim Reward' : 
           `Earn ${100 - points} more to unlock`}
        </button>
        
        <button
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-1 rounded-lg text-sm transition"
          onClick={handleDebugPoints}
        >
          Debug Points
        </button>
      </div>
    </div>
  );
};

export default PointsSection;
