import { useState } from "react";
import API from "../api/api";

function PaymentModule({ totalAmount, onPaymentComplete, deliveryAddress }) {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const paymentMethods = [
    { id: "COD", label: "Cash on Delivery", icon: "💵" },
    { id: "Online", label: "Online Payment", icon: "💳" }
  ];

  const handlePayment = async () => {
    setError("");
    
    // Validation
    if (!deliveryAddress || deliveryAddress.trim() === "") {
      setError("⚠️ Please enter a delivery address");
      return;
    }

    if (selectedMethod === "COD") {
      // Direct order placement for COD
      onPaymentComplete(selectedMethod);
    } else {
      // Process online payment via Razorpay Payment Link
      processRazorpayPayment();
    }
  };

  const processRazorpayPayment = () => {
    setProcessing(true);
    
    // Your Razorpay Payment Page Link
    const paymentUrl = "https://rzp.io/rzp/9FfJ7boy";
    
    // Open Razorpay payment page in new tab
    const paymentWindow = window.open(paymentUrl, '_blank', 'width=600,height=700');
    
    // Create a payment completion checker
    const checkPaymentInterval = setInterval(() => {
      if (paymentWindow && paymentWindow.closed) {
        clearInterval(checkPaymentInterval);
        setProcessing(false);
        
        // Show confirmation dialog
        const confirmed = window.confirm(
          `Have you completed the payment of ₹${totalAmount}?\n\n` +
          `Click "OK" if payment was successful to place your order.\n` +
          `Click "Cancel" to try again.`
        );
        
        if (confirmed) {
          onPaymentComplete("Online");
        }
      }
    }, 1000);
    
    // Fallback - if payment window doesn't open
    setTimeout(() => {
      if (!paymentWindow || paymentWindow.closed) {
        clearInterval(checkPaymentInterval);
        setProcessing(false);
        setError("⚠️ Unable to open payment window. Please check your popup blocker.");
      }
    }, 3000);
  };

  return (
    <div className="payment-module">
      <h5 className="fw-bold mb-4">💳 Payment Method</h5>
      
      {/* Payment Methods Grid */}
      <div className="payment-methods-grid mb-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card ${selectedMethod === method.id ? "selected" : ""}`}
            onClick={() => !processing && setSelectedMethod(method.id)}
          >
            <div className="payment-icon">{method.icon}</div>
            <div className="payment-label">{method.label}</div>
            <div className="payment-radio">
              <input
                type="radio"
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                disabled={processing}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Online Payment Info */}
      {selectedMethod === "Online" && (
        <div className="payment-details-form animate-fadeIn">
          <div className="alert alert-info">
            <strong>💳 Online Payment via Razorpay</strong>
            <p className="mb-2 small mt-2">
              <strong>Payment Amount: ₹{totalAmount}</strong>
            </p>
            <p className="mb-2 small">
              Pay using your preferred method:
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-2 mb-3">
              <span className="badge bg-light text-dark border">UPI</span>
              <span className="badge bg-light text-dark border">Cards</span>
              <span className="badge bg-light text-dark border">Net Banking</span>
              <span className="badge bg-light text-dark border">Wallets</span>
            </div>
          </div>
          <div className="alert alert-warning">
            <strong>📱 Payment Steps:</strong>
            <ol className="small mb-2 ps-3">
              <li>Click "Open Payment Page" button below</li>
              <li>Complete payment of ₹{totalAmount} on Razorpay</li>
              <li>Return here and click "I've Completed Payment"</li>
            </ol>
            <p className="small mb-0 text-muted">
              <strong>Note:</strong> You will be redirected to secure Razorpay payment page. Enter the amount ₹{totalAmount} when prompted.
            </p>
          </div>
        </div>
      )}

      {/* COD Info */}
      {selectedMethod === "COD" && (
        <div className="payment-details-form animate-fadeIn">
          <div className="alert alert-success">
            <strong>Cash on Delivery</strong>
            <p className="mb-0 small mt-2">
              💵 Pay ₹{totalAmount} when your order is delivered. Please keep exact change ready.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mt-3 animate-fadeIn">
          {error}
        </div>
      )}

      {/* Place Order Button */}
      <button
        className="pill-btn accent w-100 mt-4"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Waiting for payment...
          </>
        ) : (
          selectedMethod === "COD" ? `Place Order • ₹${totalAmount}` : `Open Payment Page • ₹${totalAmount}`
        )}
      </button>
      
      {selectedMethod === "Online" && !processing && (
        <>
          <p className="small text-muted text-center mt-2 mb-2">
            Or pay manually:
          </p>
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => {
              const confirmed = window.confirm(
                `Please pay ₹${totalAmount} via Razorpay payment page\n\n` +
                `After completing payment, click OK to place your order.`
              );
              if (confirmed) {
                onPaymentComplete("Online");
              }
            }}
          >
            I've Completed Payment Manually
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentModule;
