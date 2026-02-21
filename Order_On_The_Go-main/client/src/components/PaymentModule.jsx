import { useState } from "react";

function PaymentModule({ totalAmount, onPaymentComplete, deliveryAddress }) {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const RAZORPAY_PAYMENT_LINK = "https://rzp.io/rzp/L1dyZRi";

  const handlePayment = () => {
    setError("");

    if (!deliveryAddress || deliveryAddress.trim() === "") {
      setError("⚠️ Please enter a delivery address");
      return;
    }

    if (selectedMethod === "COD") {
      onPaymentComplete("COD");
    } else {
      openRazorpayPaymentPage();
    }
  };

  const openRazorpayPaymentPage = () => {
    setProcessing(true);

    // Open Razorpay payment page
    const paymentWindow = window.open(
      RAZORPAY_PAYMENT_LINK,
      "_blank",
      "width=600,height=700"
    );

    // Check when user closes the payment window
    const timer = setInterval(() => {
      if (paymentWindow && paymentWindow.closed) {
        clearInterval(timer);
        setProcessing(false);

        const confirmed = window.confirm(
          `Have you completed the payment of ₹${totalAmount}?\n\nClick OK to place your order.`
        );

        if (confirmed) {
          onPaymentComplete("ONLINE");
        }
      }
    }, 1000);
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

      {selectedMethod === "ONLINE" && (
        <div className="alert alert-info small">
          You will be redirected to Razorpay to complete payment of ₹{totalAmount}.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <button
        className="pill-btn accent w-100"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing
          ? "Waiting for payment..."
          : selectedMethod === "COD"
          ? `Place Order • ₹${totalAmount}`
          : `Pay Now • ₹${totalAmount}`}
      </button>
    </div>
  );
}

export default PaymentModule;