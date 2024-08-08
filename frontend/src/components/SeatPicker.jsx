import React, { useState, useEffect } from 'react';
import TesseraSeatPicker from 'tessera-seat-picker';
import { Grid, Box, Text, Button } from '@chakra-ui/react';


function SeatPicker({ event_id, user_id }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [rows, setRows] = useState([]);
  const [reservedPrice, setReservedPrice] = useState(0.0);
  const [seatPrice, setSeatPrice] = useState(0.0);

  // Grabs the data for the seats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/inventory/${event_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchData();
  }, [event_id]);


    useEffect(() => {
    if (seats.length > 0) {
      const newRows = Object.values(
        seats.reduce((acc, curr) => {
          // Puts the information into the proper format so the map can be populated in the front end
          const seat_info = {id: curr.row_name + curr.seat_number, number: curr.seat_number, isReserved: curr.status !== 'AVAILABLE', tooltip: String('$' + curr.value)};
          // If the row doesn't exist yet, create it
          if (!acc[curr.row_name]) {
            // Add the seat info into the newly created row
            acc[curr.row_name] = [seat_info];
          } else {
            // If the row already exists, just add the seat
            acc[curr.row_name].push(seat_info);
          }
          return acc;
        }, {})
      );
      // Update the rows state 
      setRows(newRows);
      setLoading(false); 
    }
  }, [seats]);

  const addPrice = async ({row, number}) => {
    await fetch(`http://localhost:5000/inventory/seat/price/${event_id}/${row}/${number}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', 
    })
    .then(response => response.json()) 
    .then(price => {
      setReservedPrice(reservedPrice + price);
    })
    .catch(error => console.error('Unable to reserve seat', error));
  }

  const subtractPrice = async ({row, number}) => {
    await fetch(`http://localhost:5000/inventory/seat/price/${event_id}/${row}/${number}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', 
    })
    .then(response => response.json()) 
    .then(price => {
      setReservedPrice(reservedPrice - price);
    })
    .catch(error => console.error('Unable to reserve seat', error));
  }



  const addSeatCallback = async ({ row, number, id }, addCb) => {

    setLoading(true);

    try {
      
        // Your custom logic to reserve the seat goes here...
      fetch(`http://localhost:5000/inventory/reserve/${user_id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify (
              {
                  event_id: event_id,
                  row_name: row,
                  seat_number: number
              }
          ),
          credentials: 'include', 
      })
      .then(response => response.json()) 
      .catch(error => console.error('Unable to reserve seat', error));
      // debugger
      addPrice({row, number});
      
      
      console.log(reservedPrice)
   
      // Assuming everything went well...
      setSelected((prevItems) => [...prevItems, id]);
      const updateTooltipValue = 'Added to cart';

      // Important to call this function if the seat was successfully selected - it helps update the screen
      addCb(row, number, id, updateTooltipValue);
    } catch (error) {
      // Handle any errors here
      console.error('Error adding seat:', error);
    } finally {
      setLoading(false);
      // setReservedPrice(reservedPrice + seatPrice)
    }
  };

  const removeSeatCallback = async ({ row, number, id }, removeCb) => {
    setLoading(true);

    try {
      fetch(`http://localhost:5000/inventory/unreserve`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify (
              {
                  event_id: event_id,
                  row_name: row,
                  seat_number: number
              }
          ),
          credentials: 'include', 
      })
      .then(response => response.json()) 
      .catch(error => console.error('Unable to unreserve seat', error));

      setSelected((list) => list.filter((item) => item !== id));
      removeCb(row, number);
    } catch (error) {
      // Handle any errors here
      console.error('Error removing seat:', error);
    } finally {
      setLoading(false);
    }

    subtractPrice({row, number});
  };

  return (
    //.. A bunch of other stuff...
    <Box bg="orange" minW={{ base: "100%", md: "500px"}} minH={{ base: "100%", md: "500px"}}>
      <TesseraSeatPicker
      addSeatCallback={addSeatCallback}
      removeSeatCallback={removeSeatCallback}
      rows={rows}
      maxReservableSeats={3}
      alpha
      visible
      loading={loading}
      />
      <Box mt={40} ml={10}>Price: ${reservedPrice}</Box>
      <Button mt={10} ml={10}>Checkout</Button>
    </Box>
    
  );
}

export default SeatPicker;

//Backend
// setTimeout(c) => {
//     ...
// }, 5
// How to run python code every 5 minutes?

// Add another component so we can pass in all the prices into and then we can call that component into the grid in the pag