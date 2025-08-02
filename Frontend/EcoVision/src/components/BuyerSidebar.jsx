import { useEffect } from "react";
import AOS from "aos";
import PreviousRequests from "./PreviousRequests";

const BuyerSidebar = ({ onNewRequest, previousRequests, onDeleteRequest }) => {
  useEffect(() => {
    AOS.init({ duration: 700 });
    AOS.refresh();
  }, []);

  const safeRequests = Array.isArray(previousRequests) ? previousRequests : [];

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

      <PreviousRequests 
        requests={safeRequests} 
        onDelete={onDeleteRequest}
      />
    </div>
  );
};

export default BuyerSidebar;
