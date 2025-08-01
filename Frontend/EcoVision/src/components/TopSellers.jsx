import React from 'react';

const TopSellers = () => {
  const sellers = [
    { name: 'Ali S.', sales: 150 },
    { name: 'Sarah K.', sales: 130 },
    { name: 'Omar B.', sales: 100 },
  ];

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
        {sellers.map((seller, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 rounded-lg border bg-gray-50"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="font-medium text-gray-800">{seller.name}</div>
            <div className="text-sm text-gray-600">{seller.sales} kg</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellers;
