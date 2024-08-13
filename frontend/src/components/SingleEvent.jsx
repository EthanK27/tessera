import { Image, Grid, GridItem, Button } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import SeatPicker from './SeatPicker';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { FaShoppingCart } from "react-icons/fa";
import PaymentForm from './PaymentForm';

// function EventCard(props) {
// props.id, props.name
function SingleEvent({ id, name, description, date, time, location, imageUrl }) {
  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');
  const [user, setUser] = useState(null);
  const [reservedPrice, setReservedPrice] = useState(0.0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`http://localhost:5000/user/current`, { credentials: 'include' })
      .then(response => response.json())
      .then(user => { setUser(user[0]) }) //user => setUser(user[0])
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  const setPrice = async ({ row, number, reserved }) => {
    await fetch(`http://localhost:5000/inventory/seat/price/${id}/${row}/${number}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(price => {
        if (reserved == "true") {
          setReservedPrice(reservedPrice + price);
        }
        else if (reserved == "false") {
          setReservedPrice(reservedPrice - price);
        }
      })
      .catch(error => console.error('Unable to reserve seat', error));
  }

  return (
      <Grid
      templateAreas={`"header header header button"
                        "nav main main main"
                        "footer footer footer footer"`}
      gridTemplateRows={'40px 1fr 80px'}
      gridTemplateColumns={'300px 600px'}
      h='800px'
      gap='2'

      fontWeight='bold'
    >
      <GridItem alignContent='center' rounded='md' pl='2' bg={bg} color={color} area={'header'}>
        {name}
      </GridItem>
      <GridItem rounded='md' padding={2} pl='2' bg={bg} color={color} placeItems={'center'} area={'nav'}>
        <Image borderRadius="md" src={imageUrl} alt={`Image for ${name}`} width="500px" padding="2" />
      </GridItem>
      <GridItem rounded='md' pl='2' bg={bg} color={color} area={'main'} alignContent="center" alignItems="center" justifyContent="center" center="center">
        {
          user ?
            <SeatPicker
              user_id={user.user_id}
              event_id={id}
              priceCb={setPrice}
            />
            : null
        }
        {/* {user.map(u => (
              <SeatPicker
                key={u.user_id}
                user_id={u.user_id}
                event_id={id}
                priceCb={setPrice}
              />
          ))} */}

      </GridItem>
      <GridItem rounded='md' pl='2' bg={bg} color={color} area={'footer'}>
        About the Event: {description}
      </GridItem>
      <GridItem as={Button} onClick={onOpen} leftIcon={<FaShoppingCart />} rounded='md' pl='2' bg={bg} color={color} area={'button'} alignContent="center" alignItems="center" justifyContent="center" center="center">
        Checkout: ${reservedPrice}
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cart</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {
                user ?
                  <PaymentForm totalAmount={reservedPrice} event_id={id} user_id={user.user_id} event_name={name}/>

                : null
              }
              
            </ModalBody>
          </ModalContent>
        </Modal>
      </GridItem>

    </Grid>
    // What is displayed in the EventDetail page
    


  );

}

export default SingleEvent;
// import React, {useState} from 'react';
// export function App(props) {
//   const [value, setValue] = useState(0)
//   const increment = function() {
//     value_new = value + 1;
//     setValue(value_new)
//   }
//   return (
//     <div className='App'>
//       <CounterDisplay current_val={value}/>
//       <IncrementButton callback_function={increment}/>
//     </div>
//   );
// }
// function CounterDisplay({current_val}) {
//   return (
//     <h2>{current_val}</h2>
//   )
// }
// function IncrementButton({callback_function}) {
//   return (
//     <button onClick={() => callback_function()}>Add One</button>
//   )
// }