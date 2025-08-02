import { useState, useEffect } from "react";
import AOS from "aos";

const BuyerRequestForm = ({ onSubmit, onClose }) => {
  const [product, setProduct] = useState("Plastic");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
    AOS.refresh();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity) return;
    const newRequest = {
      product,
      quantity: parseFloat(quantity),
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
          >
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
            <option value="Metal">Metal</option>
            <option value="Electronics">Electronics</option>
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
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyerRequestForm;
