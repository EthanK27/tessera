import { Image, Grid, GridItem, Button, Box, Stack, HStack, VStack, Flex, Text, StackDivider, Divider, InputLeftElement, Card, Spacer } from '@chakra-ui/react';
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
import { MdDateRange } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { Table, TableContainer, Tr, Td, Tbody, Thead, Th } from '@chakra-ui/react';
import TicketsReserved from './TicketsReserved';

// function EventCard(props) {
// props.id, props.name
function SingleEvent({ id, name, description, date, time, location, imageUrl }) {
  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');
  const [user, setUser] = useState(null);
  const [reservedPrice, setReservedPrice] = useState(0.0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reservedTickets, setReservedTickets] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/user/current`, { credentials: 'include' })
      .then(response => response.json())
      .then(user => { setUser(user[0]) }) //user => setUser(user[0])
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  // Calculates the total price of the seats and gets some information from child component
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
          // setTickets( // Replace the state
          //   [ // with a new array
          //     ...tickets, // that contains all the old items
          //     row + number + '$ ' + price // and one new item at the end
          //   ]
          // );
          setReservedTickets(prev => [...prev, { row, number, price }]);
        }
        else if (reserved == "false") {
          setReservedPrice(reservedPrice - price);
          setReservedTickets(prev => prev.filter(ticket => ticket.row !== row || ticket.number != number));
        }
      })
      .catch(error => console.error('Unable to reserve seat', error));
  }

  return (
    <Box minW={{ base: "100%", md: "500px" }} minH={{ base: "100%", md: "500px" }}>
      <Stack>

        <HStack justifyContent='center' alignContent='center' divider={<StackDivider borderColor='gray.200' opacity='40%' />} spacing='10%'>
          <VStack alignItems='left' justifyContent='left' divider={<StackDivider borderColor='gray.200' opacity='40%' />}>
            <Box>
              <Text fontSize="4xl" fontWeight="bold">
                {name}
              </Text>
            </Box>
            <Box>
              <Image borderRadius="md" src={imageUrl} alt={`Image for ${name}`} width="500px" padding="2" />
            </Box>
            <Box>
              <HStack>
                <MdDateRange />
                <Text fontWeight='bold' fontSize='lg'>
                  Event Date
                </Text>
              </HStack>
              {date}
            </Box>
            <Box>
              <HStack>
                <IoIosTime />
                <Text fontWeight='bold' fontSize='lg'>
                  Event Time
                </Text>
              </HStack>
              {time}
            </Box>
            <Box>
              <HStack>
                <FaLocationDot />
                <Text fontWeight='bold' fontSize='lg'>
                  Event Location
                </Text>
              </HStack>
              {location}
            </Box>
            <Box>
              <HStack>
                <FaInfoCircle />
                <Text fontWeight='bold' fontSize='lg'>
                  Event Description
                </Text>
              </HStack>
              {description}
            </Box>
            <Button onClick={onOpen} leftIcon={<FaShoppingCart />}>
              Checkout: ${reservedPrice}
              <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Cart</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {
                      user ?
                        <PaymentForm totalAmount={reservedPrice} event_id={id} user_id={user.user_id} event_name={name} />

                        : null
                    }
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Button>
          </VStack>
          <Box>

            {
              user ?
                <Box position='relative'>
                  <SeatPicker
                    user_id={user.user_id}
                    event_id={id}
                    priceCb={setPrice}
                  />
                  <Box height='200px' maxH='200px'><TicketsReserved overflowY='auto' resTickets={reservedTickets}></TicketsReserved></Box>
                </Box>
                : null
            }
          </Box>
        </HStack>
      </Stack>
    </Box>

    // <Box position="flex">
    //   <Grid
    //     templateAreas={`"header header header button"
    //                     "nav main main main"`}
    //     gridTemplateRows={'40px 1fr 80px'}
    //     gridTemplateColumns={'300px 600px'}
    //     h='800px'
    //     gap='2'
    //     fontWeight='bold'
    //   >
    //     <GridItem alignContent='center' rounded='md' pl='2' bg={bg} color={color} area={'header'}>
    //       {name}
    //     </GridItem>
    //     <GridItem rounded='md' padding={2} pl='2' bg={bg} color={color} placeItems={'center'} area={'nav'}>
    //       <Image borderRadius="md" src={imageUrl} alt={`Image for ${name}`} width="500px" padding="2" />
    //       About the Event: {description}
    //     </GridItem>
    //     <GridItem rounded='md' pl='2' bg={bg} color={color} area={'main'} alignContent="center" alignItems="center" justifyContent="center" center="center">
    //       {
    //         user ?
    //           <SeatPicker
    //             user_id={user.user_id}
    //             event_id={id}
    //             priceCb={setPrice}
    //           />
    //           : null
    //       }
    //       {/* {user.map(u => (
    //           <SeatPicker
    //             key={u.user_id}
    //             user_id={u.user_id}
    //             event_id={id}
    //             priceCb={setPrice}
    //           />
    //       ))} */}

    //     </GridItem>
    //     <GridItem as={Button} onClick={onOpen} leftIcon={<FaShoppingCart />} rounded='md' pl='2' bg={bg} color={color} area={'button'} alignContent="center" alignItems="center" justifyContent="center" center="center">
    //       Checkout: ${reservedPrice}
    // <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
    //   <ModalOverlay />
    //   <ModalContent>
    //     <ModalHeader>Cart</ModalHeader>
    //     <ModalCloseButton />
    //     <ModalBody>
    //       {
    //         user ?
    //           <PaymentForm totalAmount={reservedPrice} event_id={id} user_id={user.user_id} event_name={name} />

    //           : null
    //       }

    //     </ModalBody>
    //   </ModalContent>
    // </Modal>
    //     </GridItem>

    //   </Grid>
    // </Box>


  );

}

export default SingleEvent;
