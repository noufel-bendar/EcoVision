import Dashboard from '../components/Dashboard';
import PointsSection from '../components/PointsSection';
import TopSellers from '../components/TopSellers';
import AcceptedAndRejectedOrders from '../components/AcceptedAndRejectedOrders';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SellerDashboard = () => {
  const acceptedOrders = [
    {
      buyerName: "Ahmed R.",
      phone: "0556-123-456",
      product: "Plastic",
      quantity: 30,
      price: 40
    },
    {
      buyerName: "Sara B.",
      phone: "0667-987-654",
      product: "Metal",
      quantity: 20,
      price: 55
    }
  ];

  const rejectedOrders = [
    {
      buyerName: "Yacine D.",
      product: "Glass",
      quantity: 15,
      price: 25
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex flex-col">
      <Header />

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pt-24">
        <PointsSection />
        <Dashboard />
        <TopSellers />
      </main>

      <div className="px-6">
        <AcceptedAndRejectedOrders
          accepted={acceptedOrders}
          rejected={rejectedOrders}
        />
      </div>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
