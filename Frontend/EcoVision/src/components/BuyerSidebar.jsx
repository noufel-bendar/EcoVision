import { useEffect } from "react";
import AOS from "aos";

const BuyerSidebar = ({ onNewRequest, previousRequests }) => {
  useEffect(() => {
    AOS.init({ duration: 700 });
    AOS.refresh();
  }, []);

  return (
    <div
      className="w-full bg-white p-4 rounded-xl shadow-md"
      data-aos="fade-right"
    >
      <h2
        className="text-xl font-bold mb-2 text-green-700"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        Buyer Info
      </h2>
      <p
        className="text-sm text-gray-700 mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Welcome back!
      </p>

      <button
        onClick={onNewRequest}
        className="bg-green-700 text-white px-4 py-2 rounded mb-6 hover:bg-green-800 transition"
        data-aos="zoom-in"
        data-aos-delay="300"
      >
        New Request
      </button>

      <div data-aos="fade-up" data-aos-delay="400">
        <h3 className="text-md font-semibold mb-2">Previous Requests</h3>
        {previousRequests.length === 0 ? (
          <p className="text-gray-500">No requests yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {previousRequests.map((req, index) => (
              <li
                key={index}
                className="border p-3 rounded-lg shadow-sm bg-gray-50"
                data-aos="fade-up"
                data-aos-delay={500 + index * 100} 
              >
                <p><strong>Product:</strong> {req.product}</p>
                <p><strong>Quantity:</strong> {req.quantity} kg</p>
                <p><strong>Price:</strong> {req.price} DZD/kg</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={req.status === "done" ? "text-green-600" : "text-yellow-600"}>
                    {req.status === "done" ? "Completed" : "Pending"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BuyerSidebar;
