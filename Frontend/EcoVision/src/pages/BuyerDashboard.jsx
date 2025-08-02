import { useEffect, useState } from "react";
import axios from "axios";

import BuyerSidebar from "../components/BuyerSidebar";
import BuyerRequestForm from "../components/BuyerRequestForm";
import IncomingSellerRequests from "../components/IncomingSellerRequests";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BuyerDashboard = () => {
  const [previousRequests, setPreviousRequests] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        const [requestsRes, offersRes] = await Promise.all([
          axios.get("/api/buyer/requests/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/buyer/incoming-offers/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPreviousRequests(requestsRes.data);
        setSellerRequests(offersRes.data);
      } catch (error) {
        console.error("Failed to load buyer data:", error);
      }
    };

    fetchBuyerData();
  }, [token]);

  const handleAddRequest = async ({ product, quantity, price }) => {
    try {
      const res = await axios.post(
        "/api/buyer/requests/",
        { product, quantity, price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPreviousRequests((prev) => [res.data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  const handleAccept = async (index) => {
    const offer = sellerRequests[index];
    try {
      await axios.post(`/api/buyer/offer/${offer.id}/accept/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = [...sellerRequests];
      updated.splice(index, 1);
      setSellerRequests(updated);
      alert("Offer accepted.");
    } catch (error) {
      console.error("Failed to accept offer:", error);
    }
  };

  const handleReject = async (index) => {
    const offer = sellerRequests[index];
    try {
      await axios.post(`/api/buyer/offer/${offer.id}/reject/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = [...sellerRequests];
      updated.splice(index, 1);
      setSellerRequests(updated);
      alert("Offer rejected.");
    } catch (error) {
      console.error("Failed to reject offer:", error);
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
