const https = require('https');

const apiKey = '8umkobkk515shwdiyfibdqipujtamahdxar2bcimkzdngu2nlgntjdrmks0j4q00';
const testPaymentId = 'test_payment_id';

const options = {
  hostname: 'api.minepi.com',
  path: `/v2/payments/${testPaymentId}`,
  method: 'GET',
  headers: {
    'Authorization': `Key ${apiKey}`,
    'Content-Type': 'application/json',
  },
};

console.log('Testing Pi API key...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.on('data', (data) => {
    console.log('Response:', data.toString());
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();