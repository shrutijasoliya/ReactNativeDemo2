const stripe = require('stripe')(
  'sk_test_51NNCvtSJLSxw8PMLygu3hHGq0lTG3wfs1RBPac2V116OgHAn4WrhExehpCCSRDaIo5l7QpxdS06Mf4Hzd5p0t4Ie00G5KeAX7f',
);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('backend...');
});

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const {amount, currency} = req.body;
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'},
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    customer: customer.id,
    payment_method_types: ['card'],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});

app.listen(4002, () => {
  console.log('Running on 4002');
});
