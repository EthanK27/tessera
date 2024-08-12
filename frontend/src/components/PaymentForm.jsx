import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Input, FormControl, FormLabel, Text } from '@chakra-ui/react';


// Get your key from your dashboard
const stripePromise = loadStripe('pk_test_51PlwJLHqBfXkID6miV609tG6KQiColRjb4WnQ50aQIWFi9FAIEPJRhntBKY7JkMZIJV5W3YLHTCDNRDxfBJ4iVv200HQBpcEeI');

const CheckoutForm = ({ totalAmount, user_id, event_id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const response = await fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalAmount * 100 }), // Amount should be in the lowest denomination (For USD thats cents)
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Test User',
        },
      },
    });
    console.log(clientSecret)

    async function buyTickets() {
      fetch(`http://localhost:5000/inventory/buy/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            event_id: event_id
          }
        ),
        credentials: 'include'
      })
        .catch(error => console.error('Invalid Credentials:', error));
    }




    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        buyTickets();
      }
    }
  };


  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <FormControl mb={4}>
        <FormLabel>Total Amount</FormLabel>
        <Text fontSize="xl">${totalAmount.toFixed(2)}</Text>
      </FormControl>
      <FormControl>
        <FormLabel>Card Details</FormLabel>
        <CardElement />
      </FormControl>
      <Button mt={4} colorScheme="blue" type="submit" disabled={!stripe}>
        Pay
      </Button>
      {paymentSuccess && <Text mt={4} color="green.500">Payment Successful!</Text>}
      {error && <Text mt={4} color="red.500">{error}</Text>}
    </Box>
  );
};

const PaymentForm = ({ totalAmount, user_id, event_id }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm totalAmount={totalAmount} user_id={user_id} event_id={event_id} />
  </Elements>
);

export default PaymentForm;