const axios = require('axios');

const BASE_URL = 'http://localhost:10000/api';

async function runTests() {
  try {
    console.log('--- ARIA API TESTING SUITE ---');

    console.log('\n[1] Testing POST /api/users ...');
    let userRes = await axios.post(`${BASE_URL}/users`, {
      device_id: 'test-device-uuid-' + Date.now(),
      name: 'Agent Tester'
    });
    console.log('✅ Users Output:', userRes.data);
    const userId = userRes.data.user_id;

    console.log('\n[2] Testing POST /api/sessions ...');
    let sessionRes = await axios.post(`${BASE_URL}/sessions`, {
      user_id: userId
    });
    console.log('✅ Sessions Output:', sessionRes.data);
    const sessionId = sessionRes.data.session_id;

    console.log('\n[3] Testing POST /api/chat (Groq Integration) ...');
    console.log('Sending message to ARIA: "Hello, who developed you?"');
    let chatRes = await axios.post(`${BASE_URL}/chat`, {
      session_id: sessionId,
      user_id: userId,
      message: 'Hello, who developed you?'
    });
    console.log('✅ Groq Response:', chatRes.data.reply);

    console.log('\n[4] Testing GET /api/messages/:session_id ...');
    let messagesRes = await axios.get(`${BASE_URL}/messages/${sessionId}`);
    console.log('✅ Messages Output Length:', messagesRes.data.length);
    console.log('Latest message in thread:', messagesRes.data[messagesRes.data.length -1]);

    console.log('\n[5] Testing GET /api/sessions/:user_id ...');
    let listRes = await axios.get(`${BASE_URL}/sessions/${userId}`);
    console.log('✅ User Sessions Count:', listRes.data.length);

    console.log('\n🔥 ALL TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('❌ API Test Failed!');
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error(error.message);
    }
  }
}

runTests();
