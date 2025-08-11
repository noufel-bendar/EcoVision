import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../lib/api";

const AcceptedAndRejectedOrders = ({ accepted, rejected, onRefresh }) => {
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleDelete = async (offerId, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} order?`)) {
      return;
    }

    try {
      setDeleting(prev => ({ ...prev, [offerId]: true }));
      const token = localStorage.getItem('token');
      
      await api.delete(`/api/seller/delete-offer/${offerId}/`);

      alert(`${type} order deleted successfully!`);
      
      // Refresh the data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to delete order. Please try again.');
      }
    } finally {
      setDeleting(prev => ({ ...prev, [offerId]: false }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-700">Accepted Orders</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
          >
            Refresh
          </button>
        )}
      </div>
      
      <div data-aos="fade-right">
        {accepted.length === 0 ? (
          <p className="text-gray-600">No accepted orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {accepted.map((order, index) => (
              <li
                key={order.id || index}
                className="border border-green-200 bg-green-50 p-4 rounded"
                data-aos="zoom-in"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p><strong>Buyer Name:</strong> {order.buyerName}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Product:</strong> {order.product}</p>
                    <p><strong>Quantity:</strong> {order.quantity} kg</p>
                    <p><strong>Price:</strong> {order.price} DZD/kg</p>
                    <p><strong>Status:</strong> <span className="text-green-700 font-semibold">Accepted</span></p>
                    {order.created_at && (
                      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(order.id, 'accepted')}
                    disabled={deleting[order.id]}
                    className="ml-4 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {deleting[order.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
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
                key={order.id || index}
                className="border border-red-200 bg-red-50 p-4 rounded"
                data-aos="zoom-in"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p><strong>Buyer Name:</strong> {order.buyerName}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Product:</strong> {order.product}</p>
                    <p><strong>Quantity:</strong> {order.quantity} kg</p>
                    <p><strong>Price:</strong> {order.price} DZD/kg</p>
                    <p><strong>Status:</strong> <span className="text-red-700 font-semibold">Rejected</span></p>
                    {order.created_at && (
                      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(order.id, 'rejected')}
                    disabled={deleting[order.id]}
                    className="ml-4 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {deleting[order.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AcceptedAndRejectedOrders;
