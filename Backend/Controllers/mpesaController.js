import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Configure middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced callback handler for M-Pesa
app.post('/callback', (req, res) => {
  console.log('\n===== M-PESA PAYMENT CALLBACK =====');
  
  try {
    const callbackData = req.body;
    
    // Check if this is a callback from STK Push
    if (callbackData.Body && callbackData.Body.stkCallback) {
      const stkCallback = callbackData.Body.stkCallback;
      const resultCode = stkCallback.ResultCode;
      const resultDesc = stkCallback.ResultDesc;
      
      console.log(`Result Code: ${resultCode}`);
      console.log(`Result Description: ${resultDesc}`);
      
      // Check if payment was successful (ResultCode 0)
      if (resultCode === 0) {
        console.log('✅ PAYMENT SUCCESSFUL');
        
        // Extract payment details if available
        if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
          const items = stkCallback.CallbackMetadata.Item;
          
          // Helper function to find an item by Name
          const findItem = (name) => {
            const item = items.find(i => i.Name === name);
            return item ? item.Value : null;
          };
          
          const amount = findItem('Amount');
          const mpesaReceiptNumber = findItem('MpesaReceiptNumber');
          const transactionDate = findItem('TransactionDate');
          const phoneNumber = findItem('PhoneNumber');
          
          console.log(`Amount: ${amount}`);
          console.log(`Receipt Number: ${mpesaReceiptNumber}`);
          console.log(`Transaction Date: ${transactionDate}`);
          console.log(`Phone Number: ${phoneNumber}`);
        }
      } else {
        console.log('❌ PAYMENT FAILED OR CANCELED');
        console.log(`Reason: ${resultDesc}`);
      }
    } else {
      console.log('Unknown callback format:');
      console.log(JSON.stringify(callbackData, null, 2));
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    console.log('Raw callback data:', JSON.stringify(req.body, null, 2));
  }
  
  console.log('===================================\n');
  
  // Send acknowledgement to M-Pesa
  res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Callback received successfully"
  });
});

export const getMpesaAccessToken = async (req, res, next) => {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();
    
    // Validate credentials
    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({ message: 'M-Pesa credentials are not configured' });
    }

    // Create Base64-encoded auth
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    // Make request to Safaricom OAuth endpoint
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );
    
    const accessToken = response.data.access_token;

    if (!accessToken) {
      return res.status(500).json({ message: 'Failed to obtain access token' });
    }

    // Attach token to request
    req.mpesaAccessToken = accessToken;
    next();

  } catch (error) {
    console.error('Detailed M-Pesa Token Error:', {
      message: error.message,
      response: error.response?.data || "No response",
      status: error.response?.status || "Unknown"
    });

    return res.status(500).json({ 
      message: 'Failed to obtain M-Pesa access token', 
      error: error.response?.data || error.message 
    });
  }
};
  
export const initiateSTKPush = async (req, res) => {
  try {
    // Use the access token from middleware
    const accessToken = req.mpesaAccessToken;

    const { phoneNumber, amount, destination, companyName } = req.body;

    // Validate required fields
    if (!phoneNumber || !amount) {
      return res.status(400).json({ message: 'Phone number and amount are required' });
    }

    // Current timestamp
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    
    // Create password (format: BusinessShortCode + Passkey + Timestamp)
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    // Use the ngrok URL from your logs
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://104b-129-222-147-114.ngrok-free.app/callback';
    
    // Prepare request data
    const data = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: `StageLocator-${destination || 'Payment'}`,
      TransactionDesc: `Payment for ${companyName || 'Service'} to ${destination || 'Destination'}`
    };
    
    console.log('Initiating STK push with callback URL:', callbackUrl);
    
    // Make STK push request
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('STK Push initiated successfully. Checkout Request ID:', response.data.CheckoutRequestID);
    
    // Return response to client
    res.status(200).json(response.data);
    
  } catch (error) {
    console.error('M-Pesa payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to process payment', 
      error: error.response?.data || error.message 
    });
  }
};