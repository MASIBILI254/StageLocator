import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();

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
// STK Push route with middleware
  
  
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
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `StageLocator-${destination}`,
      TransactionDesc: `Payment for ${companyName} to ${destination}`
    };
    
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