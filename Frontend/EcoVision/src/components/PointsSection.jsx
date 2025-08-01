import React from 'react';

const PointsSection = () => {
  const points = 120;
  const rewards = [
    { title: 'Eco Gift Box', requiredPoints: 100 },
    { title: 'Free Pickup', requiredPoints: 200 },
    { title: 'VIP Badge', requiredPoints: 300 },
  ];

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center space-y-6"
      data-aos="fade-up"
    >
      <h2 className="text-xl font-semibold text-logoGreen" data-aos="fade-down">My Points</h2>

      <div className="text-center" data-aos="zoom-in">
        <div className="text-5xl font-bold text-logoGreen">{points}</div>
        <div className="text-sm text-gray-500">Total Collected</div>
      </div>

      <div className="w-full" data-aos="fade-up">
        <h3 className="text-md font-medium text-gray-700 mb-2">Available Rewards</h3>
        <ul className="space-y-3">
          {rewards.map((reward, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg flex justify-between items-center border ${
                points >= reward.requiredPoints ? 'bg-green-50 border-green-200' : 'bg-gray-50'
              }`}
              data-aos="fade-left"
              data-aos-delay={index * 100}
            >
              <span>{reward.title}</span>
              <span className="text-sm text-gray-600">{reward.requiredPoints} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="w-full bg-logoGreen hover:bg-logoGreenDark text-white py-2 rounded-xl font-semibold transition"
        data-aos="zoom-in-up"
      >
        {points >= 100 ? 'Claim Reward' : `Earn ${100 - points} more to unlock`}
      </button>
    </div>
  );
};

export default PointsSection;
