const axios = require('axios');
require('dotenv').config(); // 👈 Load .env variables

const initiateWaafiPayment = async ({ accountNo, amount, referenceId, invoiceId, description }) => {
  const payload = {
    schemaVersion: '1.0',
    requestId: referenceId,
    timestamp: new Date().toISOString(),
    channelName: 'WEB',
    serviceName: 'API_PURCHASE',
    serviceParams: {
      merchantUid: process.env.WAAFI_MERCHANT_UID,
      apiUserId: process.env.WAAFI_API_USER_ID,
      apiKey: process.env.WAAFI_API_KEY,
      paymentMethod: 'mwallet_account',
      payerInfo: {
        accountNo: accountNo
      },
      transactionInfo: {
        referenceId,
        invoiceId,
        amount,
        currency: 'USD',
        description
      }
    }
  };

  try {
    const response = await axios.post(process.env.WAAFI_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Waafi API Error:', error.response?.data || error.message);
    throw new Error('Failed to connect to WaafiPay API');
  }
};

module.exports = { initiateWaafiPayment };
