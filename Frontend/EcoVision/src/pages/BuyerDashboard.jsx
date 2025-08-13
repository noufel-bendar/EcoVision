import { useEffect, useState } from "react";
import api from "../lib/api";

import BuyerSidebar from "../components/BuyerSidebar";
import BuyerRequestForm from "../components/BuyerRequestForm";
import IncomingSellerRequests from "../components/IncomingSellerRequests";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BuyerDashboard = () => {
  const [previousRequests, setPreviousRequests] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBuyerData = async () => {
    try {
      const [requestsRes, offersRes] = await Promise.all([
        api.get("/api/buyer/requests/"),
        api.get("/api/buyer/incoming-offers/")
      ]);

      setPreviousRequests(requestsRes.data);
      setSellerRequests(offersRes.data);
    } catch (error) {
      console.error("Failed to load buyer data:", error);
    }
  };

  useEffect(() => {
    if (token) fetchBuyerData();
  }, [token]);

  const handleAddRequest = async ({ product, quantity, state }) => {
    try {
      const res = await api.post("/api/buyer/requests/", {
        product,
        quantity,
        state
      });

      setPreviousRequests((prev) => [res.data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  const handleAccept = async (index) => {
    const offer = sellerRequests[index];
    try {
      await api.post(`/api/buyer/offer/${offer.id}/accept/`);

      const updated = [...sellerRequests];
      updated.splice(index, 1);
      setSellerRequests(updated);
      alert("Offer accepted.");
      fetchBuyerData();
    } catch (error) {
      console.error("Failed to accept offer:", error);
    }
  };

  const handleReject = async (index) => {
    const offer = sellerRequests[index];
    try {
      await api.post(`/api/buyer/offer/${offer.id}/reject/`);

      const updated = [...sellerRequests];
      updated.splice(index, 1);
      setSellerRequests(updated);
      alert("Offer rejected.");
      fetchBuyerData();
    } catch (error) {
      console.error("Failed to reject offer:", error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await api.delete(`/api/buyer/requests/${requestId}/`);
        
        setPreviousRequests((prev) => 
          prev.filter(request => request.id !== requestId)
        );
        alert("Request deleted successfully.");
      } catch (error) {
        console.error("Failed to delete request:", error);
        alert("Failed to delete request. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4e8]">
      <Header />

      {/* Main Content with Mobile-First Layout */}
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Mobile-Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Sidebar - Full width on mobile, 1/3 on desktop */}
            <div className="lg:col-span-1 order-1 lg:order-1">
              <BuyerSidebar 
                onNewRequest={() => setShowForm(true)}
                previousRequests={previousRequests}
                onDeleteRequest={handleDeleteRequest}
              />
            </div>

            {/* Main Content Area - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 order-2 lg:order-2 space-y-4 sm:space-y-6">
              
              {/* Request Form Modal/Overlay */}
              {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          New Request
                        </h3>
                        <button
                          onClick={() => setShowForm(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <BuyerRequestForm onSubmit={handleAddRequest} />
                    </div>
                  </div>
                </div>
              )}

              {/* Incoming Seller Requests */}
              <div className="mobile-card">
                <IncomingSellerRequests 
                  requests={sellerRequests}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
