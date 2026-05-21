import dotenv from "dotenv";
dotenv.config();

import https from "https";

function sendSMS(to, body) {
    return new Promise((resolve) => {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_FROM_NUMBER;

        if (!sid || !token || !from) {
            console.error("[Twilio] Credentials or from number are missing in .env.");
            return resolve({ success: false, reason: "Credentials missing" });
        }

        const authHeader = "Basic " + Buffer.from(`${sid}:${token}`).toString("base64");
        const postData = new URLSearchParams({
            To: to,
            From: from,
            Body: body
        }).toString();

        const options = {
            hostname: "api.twilio.com",
            port: 443,
            path: `/2010-04-01/Accounts/${sid}/Messages.json`,
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const parsed = JSON.parse(data);
                    console.log(`[Twilio] Success! Message SID: ${parsed.sid}`);
                    resolve({ success: true, sid: parsed.sid });
                } else {
                    console.error("[Twilio] Error response from Twilio:", data);
                    resolve({ success: false, error: data });
                }
            });
        });

        req.on("error", (err) => {
            console.error("[Twilio] Exception while sending SMS:", err);
            resolve({ success: false, error: err.message });
        });

        req.write(postData);
        req.end();
    });
}

// Read phone number from argument or prompt
const targetPhone = process.argv[2];
if (!targetPhone) {
    console.log("Usage: node test_sms.js <your_phone_number>");
    console.log("Example: node test_sms.js +91XXXXXXXXXX");
    process.exit(1);
}

sendSMS(targetPhone, "Test message from Akalwadi Associates system! Twilio integration works perfectly! 🎉").then(result => {
    if (result.success) {
        console.log("\n✅ Test SMS completed successfully!");
    } else {
        console.log("\n❌ Test SMS failed. Check error details above.");
    }
});
