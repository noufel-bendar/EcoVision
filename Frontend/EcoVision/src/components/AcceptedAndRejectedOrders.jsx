import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AcceptedAndRejectedOrders = ({ accepted, rejected }) => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 space-y-6">
      <div data-aos="fade-right">
        <h2 className="text-xl font-bold text-green-700 mb-2">Accepted Orders</h2>
        {accepted.length === 0 ? (
          <p className="text-gray-600">No accepted orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {accepted.map((order, index) => (
              <li
                key={index}
                className="border border-green-200 bg-green-50 p-4 rounded"
                data-aos="zoom-in"
              >
                <p><strong>Buyer Name:</strong> {order.buyerName}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Product:</strong> {order.product}</p>
                <p><strong>Quantity:</strong> {order.quantity} kg</p>
                <p><strong>Price:</strong> {order.price} DZD</p>
                <p><strong>Status:</strong> <span className="text-green-700 font-semibold">Accepted</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div data-aos="fade-left">
        <h2 className="text-xl font-bold text-red-700 mb-2">Rejected Orders</h2>
        {rejected.length === 0 ? (
          <p className="text-gray-600">No rejected orders.</p>
        ) : (
          <ul className="space-y-4">
            {rejected.map((order, index) => (
              <li
                key={index}
                className="border border-red-200 bg-red-50 p-4 rounded"
                data-aos="zoom-in"
              >
                <p><strong>Buyer Name:</strong> {order.buyerName}</p>
                <p><strong>Product:</strong> {order.product}</p>
                <p><strong>Quantity:</strong> {order.quantity} kg</p>
                <p><strong>Price:</strong> {order.price} DZD</p>
                <p><strong>Status:</strong> <span className="text-red-700 font-semibold">Rejected</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AcceptedAndRejectedOrders;
