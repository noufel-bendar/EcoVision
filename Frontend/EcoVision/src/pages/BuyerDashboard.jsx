import { useState } from "react";
import BuyerSidebar from "../components/BuyerSidebar";
import BuyerRequestForm from "../components/BuyerRequestForm";
import IncomingSellerRequests from "../components/IncomingSellerRequests";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BuyerDashboard = () => {
  const [previousRequests, setPreviousRequests] = useState([
    { product: "Plastic", quantity: 20, price: 30, status: "Pending" },
    { product: "Paper", quantity: 10, price: 25, status: "Completed" },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddRequest = (product, quantity, price) => {
    const newRequest = { product, quantity, price, status: "Pending" };
    setPreviousRequests((prev) => [newRequest, ...prev]);
    setShowForm(false);
  };

  const [sellerRequests, setSellerRequests] = useState([
    {
      product: "Plastic",
      quantity: 40,
      price: 35,
      sellerName: "Karim L.",
      region: "Blida",
    },
    {
      product: "Paper",
      quantity: 15,
      price: 22,
      sellerName: "Samir T.",
      region: "Setif",
    },
  ]);

  const handleAccept = (index) => {
    const updated = [...sellerRequests];
    updated.splice(index, 1);
    setSellerRequests(updated);
    alert("Request accepted.");
  };

  const handleReject = (index) => {
    const updated = [...sellerRequests];
    updated.splice(index, 1);
    setSellerRequests(updated);
    alert("Request rejected.");
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
