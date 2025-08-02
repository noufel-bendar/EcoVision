import { useState, useEffect } from "react";
import AOS from "aos";

const BuyerRequestForm = ({ onSubmit, onClose }) => {
  const [product, setProduct] = useState("plastic");
  const [quantity, setQuantity] = useState("");
  const [state, setState] = useState("");

  const states = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa',
    'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa',
    'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif',
    'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine',
    'Médéa', 'Mostaganem', 'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
    'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
    'Aïn Témouchent', 'Ghardaïa', 'Relizane'
  ];

  useEffect(() => {
    AOS.init({ duration: 800 });
    AOS.refresh();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !state) {
      alert("Please fill in all required fields");
      return;
    }
    const newRequest = {
      product,
      quantity: parseFloat(quantity),
      state,
      status: "pending",
    };
    onSubmit(newRequest);
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md my-6 border border-gray-200"
      data-aos="fade-up"
    >
      <h3 className="text-lg font-bold mb-4" data-aos="fade-right">
        📝 New Request
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div data-aos="fade-left">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Product
          </label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Product</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
            <option value="metal">Metal</option>
          </select>
        </div>

        <div data-aos="fade-right">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Quantity (kg)
          </label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div data-aos="fade-left">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select State</option>
            {states.map((stateName) => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2" data-aos="zoom-in">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyerRequestForm;
