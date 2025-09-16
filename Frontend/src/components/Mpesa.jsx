import React, { useState } from 'react';
import axios from 'axios';
//import './Mpesa.css';

const MpesaPayment = ({ isOpen, onClose, amount, destination, companyName }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validatePhoneNumber = (number) => {
    // Accepts formats like 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXXX
    const regex = /^(07|01)\d{8}$|^(254)\d{9}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setPaymentStatus(null);
    
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number (e.g., 07XXXXXXXX or 254XXXXXXXXX)');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format phone number to ensure it has 254 prefix
      let formattedNumber = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedNumber = '254' + phoneNumber.substring(1);
      }
      
      // Make API call to your backend
      const response = await axios.post('http://localhost:3000/stk/stkpush', {
        phoneNumber: formattedNumber,
        amount: amount,
        destination: destination,
        companyName: companyName
      });
      
      setPaymentStatus({
        success: true,
        message: 'Payment request sent successfully! Please check your phone for the STK push prompt.',
        checkoutRequestID: response.data.CheckoutRequestID
      });
      
     
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({
        success: false,
        message: error.response?.data?.message || 'Payment request failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mpesa-overlay">
      <div className="mpesa-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="mpesa-header">
          <h2>M-Pesa Payment</h2>
          <div className="mpesa-details">
            <p><strong>Destination:</strong> {destination}</p>
            <p><strong>Transport:</strong> {companyName}</p>
            <p><strong>Amount:</strong> KSh {amount}</p>
          </div>
        </div>
        
        {!paymentStatus ? (
          <form onSubmit={handleSubmit} className="mpesa-form">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter M-Pesa phone number (e.g., 07XXXXXXXX)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
            </div>
            <button 
              type="submit" 
              className="pay-button"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        ) : (
          <div className={`payment-status ${paymentStatus.success ? 'success' : 'error'}`}>
            <p>{paymentStatus.message}</p>
            {paymentStatus.success && (
              <button className="close-button" onClick={onClose}>
                Done
              </button>
            )}
            {!paymentStatus.success && (
              <button className="retry-button" onClick={() => setPaymentStatus(null)}>
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MpesaPayment;