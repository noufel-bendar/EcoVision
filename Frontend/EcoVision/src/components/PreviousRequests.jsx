const PreviousRequests = ({ requests }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-3"> Previous Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No previous requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req, index) => (
            <li
              key={index}
              className="border p-4 rounded-lg shadow-sm bg-white text-sm"
            >
              <p>
                <strong>Product:</strong> {req.product}
              </p>
              <p>
                <strong>Quantity:</strong> {req.quantity} kg
              </p>
              <p>
                <strong>Price:</strong> {req.price} DZD/kg
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    req.status === "done"
                      ? "text-green-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {req.status === "done" ? "Completed" : "Pending"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviousRequests;
