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

      <main className="flex flex-1 flex-col lg:flex-row gap-6 p-6">
        <div className="lg:w-1/3 w-full mt-24">
          <BuyerSidebar
            onNewRequest={() => setShowForm(true)}
            previousRequests={previousRequests}
            onDeleteRequest={handleDeleteRequest}
          />
          {showForm && (
            <BuyerRequestForm
              onClose={() => setShowForm(false)}
              onSubmit={handleAddRequest}
            />
          )}
        </div>

        <div className="lg:w-2/3 w-full mt-24">
          <IncomingSellerRequests
            sellerRequests={sellerRequests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
