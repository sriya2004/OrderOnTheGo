import { useState } from "react";

function PaymentModule({ totalAmount, onPaymentComplete, deliveryAddress }) {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = () => {
    setError("");

    if (!deliveryAddress || deliveryAddress.trim() === "") {
      setError("⚠️ Please enter a delivery address");
      return;
    }

    if (selectedMethod === "COD") {
      onPaymentComplete("COD");
    } else {
      openRazorpay();
    }
  };

  const openRazorpay = () => {
    setProcessing(true);

    const options = {
      key: "RAZORPAY_KEY_ID", // 🔑 replace with your test key
      amount: totalAmount * 100, // paise
      currency: "INR",
      name: "Food Ordering App",
      description: "Order Payment",
      handler: function (response) {
        setProcessing(false);
        onPaymentComplete("ONLINE", response.razorpay_payment_id);
      },
      prefill: {
        name: "Customer",
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="payment-module">
      <h5 className="fw-bold mb-4">💳 Payment Method</h5>

      <div className="payment-methods-grid mb-4">
        <label className="payment-method-card">
          <input
            type="radio"
            checked={selectedMethod === "COD"}
            onChange={() => setSelectedMethod("COD")}
          />
          💵 Cash on Delivery
        </label>

        <label className="payment-method-card">
          <input
            type="radio"
            checked={selectedMethod === "ONLINE"}
            onChange={() => setSelectedMethod("ONLINE")}
          />
          💳 Online Payment
        </label>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button
        className="pill-btn accent w-100"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing
          ? "Processing..."
          : selectedMethod === "COD"
          ? `Place Order • ₹${totalAmount}`
          : `Pay Now • ₹${totalAmount}`}
      </button>
    </div>
  );
}

export default PaymentModule;