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
      className="mobile-card"
      data-aos="fade-right"
    >
      {/* Header Section */}
      <div className="text-center sm:text-left mb-6">
        <h2
          className="mobile-title text-logoGreen"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Buyer Dashboard
        </h2>
        <p
          className="mobile-text text-gray-600"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Welcome back! Manage your requests and view offers.
        </p>
      </div>

      {/* New Request Button */}
      <div className="mb-6" data-aos="zoom-in" data-aos-delay="300">
        <button
          onClick={onNewRequest}
          className="mobile-btn-primary w-full"
        >
          + New Request
        </button>
      </div>

      {/* Previous Requests Section */}
      <div className="space-y-4">
        <h3
          className="mobile-subtitle text-logoGreen"
          data-aos="fade-down"
          data-aos-delay="400"
        >
          Your Requests
        </h3>
        
        <div data-aos="fade-up" data-aos-delay="500">
          <PreviousRequests 
            requests={safeRequests} 
            onDelete={onDeleteRequest}
          />
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 sm:hidden">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-logoGreen">
              {safeRequests.length}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {safeRequests.filter(r => r.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerSidebar;
