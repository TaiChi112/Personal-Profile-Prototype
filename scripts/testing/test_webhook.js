const crypto = require('crypto');

const channelSecret = process.env.LINE_CHANNEL_SECRET || 'de038f0bca31a8339a35c3fdfd6de6fc';

const body = JSON.stringify({
  destination: "Uxxxx",
  events: [
    {
      type: "message",
      message: {
        type: "text",
        id: "1234567890",
        text: "วันนี้ซื้อกาแฟไป 120 บาท"
      },
      timestamp: 1625665242211,
      source: {
        type: "user",
        userId: "U1234567890" // Dummy user ID
      },
      replyToken: "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
      mode: "active"
    }
  ]
});

const signature = crypto
  .createHmac('SHA256', channelSecret)
  .update(body)
  .digest('base64');

fetch('http://localhost:3001/api/webhooks/line', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-line-signature': signature
  },
  body: body
}).then(async res => {
  console.log('Status:', res.status);
  console.log('Response:', await res.text());
}).catch(console.error);
