// Automated Test Script for Portfolio Email & Submission System
const { app, getTransporter } = require('./server');
const http = require('http');

async function runTest() {
  console.log('--- 🧪 STARTING COMPLETE SUBMISSION & EMAIL WORKFLOW TEST ---');

  // Start temporary test server instance on port 3099
  const testPort = 3099;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(testPort, resolve));
  console.log(`[Test Server] Running on http://127.0.0.1:${testPort}`);

  try {
    // 1. Health check test
    console.log('\n[Step 1] Testing GET /api/health ...');
    const healthRes = await fetch(`http://127.0.0.1:${testPort}/api/health`);
    const healthData = await healthRes.json();
    console.log('Health Response:', healthData);
    if (!healthRes.ok || healthData.status !== 'ok') {
      throw new Error('Health check failed');
    }
    console.log('✅ Step 1 Passed: Server health check responded with status "ok"');

    // 2. Validation test (missing required fields)
    console.log('\n[Step 2] Testing Validation Errors on invalid submission ...');
    const invalidRes = await fetch(`http://127.0.0.1:${testPort}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: 'A', email: 'not-an-email', subject: '', message: '' })
    });
    const invalidData = await invalidRes.json();
    console.log('Validation Error Response:', invalidData);
    if (invalidRes.status !== 400 || invalidData.success !== false) {
      throw new Error('Validation check failed: expected 400 Bad Request');
    }
    console.log('✅ Step 2 Passed: Validation correctly rejected invalid input');

    // 3. Complete submission workflow test
    console.log('\n[Step 3] Testing Complete Submission & Dual Email Dispatch ...');
    const testPayload = {
      full_name: 'Jane Doe Enterprise Partner',
      email: 'jane.partner@example.com',
      subject: 'Custom Web Platform & Growth Strategy Project',
      message: 'Hello Ashish, we reviewed your portfolio and would like to discuss a 3-month contract to develop our client acquisition portal and sales pipeline integration.'
    };

    const submitRes = await fetch(`http://127.0.0.1:${testPort}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const submitData = await submitRes.json();
    console.log('Submission Response:', submitData);

    if (!submitRes.ok || !submitData.success) {
      throw new Error(`Submission failed with status ${submitRes.status}: ${JSON.stringify(submitData)}`);
    }

    if (!submitData.delivery?.admin) {
      throw new Error('Admin email was not dispatched!');
    }
    if (!submitData.delivery?.client) {
      throw new Error('Client confirmation email was not dispatched!');
    }

    console.log('✅ Step 3 Passed: Both Admin and Client emails were successfully dispatched!');
    if (submitData.delivery?.previews?.admin_url) {
      console.log(`   🔗 Admin Email Preview:  ${submitData.delivery.previews.admin_url}`);
    }
    if (submitData.delivery?.previews?.client_url) {
      console.log(`   🔗 Client Email Preview: ${submitData.delivery.previews.client_url}`);
    }

    // 4. Verification in inquiry database
    console.log('\n[Step 4] Verifying Lead Persistence in DB ...');
    const listRes = await fetch(`http://127.0.0.1:${testPort}/api/inquiries`);
    const listData = await listRes.json();
    console.log(`Total Leads in Database: ${listData.count}`);
    const found = listData.data.find((inq) => inq.id === submitData.inquiryId);
    if (!found) {
      throw new Error('Submitted inquiry was not persisted in database');
    }
    console.log('Persisted Inquiry Record:', {
      id: found.id,
      name: found.full_name,
      email: found.email,
      subject: found.subject,
      email_delivery: found.email_delivery
    });
    console.log('✅ Step 4 Passed: Inquiry correctly stored in db/inquiries.json');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The email submission workflow is verified.');
  } finally {
    server.close();
  }
}

runTest().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
