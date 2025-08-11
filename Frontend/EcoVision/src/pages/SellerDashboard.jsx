import { useEffect, useState } from 'react';
import api from '../lib/api';
import Dashboard from '../components/Dashboard';
import PointsSection from '../components/PointsSection';
import TopSellers from '../components/TopSellers';
import AcceptedAndRejectedOrders from '../components/AcceptedAndRejectedOrders';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SellerDashboard = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Ensure seller profile exists
      await api.get('/api/seller/ensure-profile/');

      const response = await api.get('/api/seller/my-offers/');

      setAcceptedOrders(response.data.accepted || []);
      setRejectedOrders(response.data.rejected || []);
    } catch (error) {
      console.error('Failed to load seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex flex-col">
      <Header />

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pt-24">
        <PointsSection />
        <Dashboard onOfferCreated={fetchSellerData} />
        <TopSellers />
      </main>

      <div className="px-6">
        <AcceptedAndRejectedOrders
          accepted={acceptedOrders}
          rejected={rejectedOrders}
          onRefresh={fetchSellerData}
        />
      </div>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
