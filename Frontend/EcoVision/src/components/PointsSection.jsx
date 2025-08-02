import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PointsSection = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // تأكد أن التوكن موجود مسبقًا بعد تسجيل الدخول

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch seller profile
    axios
      .get('/api/seller/profile/', config)
      .then((res) => {
        if (res.data.length > 0) {
          setPoints(res.data[0].total_points);
        }
      })
      .catch((err) => console.error('Failed to fetch profile:', err));

    // Fetch rewards list
    axios
      .get('/api/seller/rewards/', config)
      .then((res) => {
        console.log('Rewards API response:', res.data);
        setRewards(res.data);
      })
      .catch((err) => console.error('Failed to fetch rewards:', err));
  }, []);

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

      <div className="w-full" data-aos="fade-up">
        <h3 className="text-md font-medium text-gray-700 mb-2">Available Rewards</h3>
        <ul className="space-y-3">
          {Array.isArray(rewards) &&
            rewards.map((reward, index) => (
              <li
                key={reward.id}
                className={`p-3 rounded-lg flex justify-between items-center border ${
                  points >= reward.required_points ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                }`}
                data-aos="fade-left"
                data-aos-delay={index * 100}
              >
                <span>{reward.title}</span>
                <span className="text-sm text-gray-600">{reward.required_points} pts</span>
              </li>
            ))}
        </ul>
      </div>

      <button
        className="w-full bg-logoGreen hover:bg-logoGreenDark text-white py-2 rounded-xl font-semibold transition"
        data-aos="zoom-in-up"
        disabled={points < 100}
      >
        {points >= 100 ? 'Claim Reward' : `Earn ${100 - points} more to unlock`}
      </button>
    </div>
  );
};

export default PointsSection;
