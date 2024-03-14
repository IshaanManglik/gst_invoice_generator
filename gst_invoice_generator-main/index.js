const express = require('express');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const port = 3000;

app.use(cors());

var serviceAccount = require('./gst-project-c0478-firebase-adminsdk-7nfpk-8d26e9297f.json');

admin.initializeApp({
    credential: admn.credential.cert(serviceAccount)
});

var db = admin.firestore();


app.get('/calculate-gst', async (req, res) => {
    const name = req.query.name;
    const amount = parseFloat(req.query.amount);
    const gstRate = 0.12;
    const withoutgst= amount/(1+gstRate);
    const gstAmount = withoutgst * gstRate;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    const data = {
        name: name,
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        originalAmount: withoutgst.toFixed(2),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        Status: "Finished"
    };

    try {
        await db.collection('gstCalculations').add(data);
        res.json(data);
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        res.status(500).send('Error saving data');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});