import axios from 'axios';

const createPaymentIntent = data => {
  return new Promise((resolve, reject) => {
    axios
      .post('http://192.168.29.128:4002/payment-sheet', data)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default createPaymentIntent;
