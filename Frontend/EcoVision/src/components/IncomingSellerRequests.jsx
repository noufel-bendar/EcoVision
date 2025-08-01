import { useEffect } from "react";
import AOS from "aos";

const IncomingSellerRequests = ({ sellerRequests, onAccept, onReject }) => {
  useEffect(() => {
    AOS.init({ duration: 700 });
    AOS.refresh();
  }, []);

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md"
      data-aos="fade-left"
    >
      <div className="mb-4" data-aos="fade-down" data-aos-delay="100">
        <h2 className="text-xl font-bold text-green-700 mb-1">
          📬 Incoming Offers
        </h2>
        <p className="text-sm text-gray-700">
          When you accept an offer, your phone number will be sent to the seller for direct communication.
        </p>
      </div>

      {sellerRequests.length === 0 ? (
        <p className="text-gray-600" data-aos="fade-up" data-aos-delay="200">
          No incoming offers at the moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {sellerRequests.map((req, index) => (
            <li
              key={index}
              className="border p-4 rounded bg-gray-50 shadow-sm"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              <p><strong>Seller:</strong> {req.sellerName}</p>
              <p><strong>Region:</strong> {req.region}</p>
              <p><strong>Product:</strong> {req.product}</p>
              <p><strong>Quantity:</strong> {req.quantity} kg</p>
              <p><strong>Price:</strong> {req.price} DZD</p>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => onAccept(index)}
                  className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncomingSellerRequests;
