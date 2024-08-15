import React, { useEffect, useState } from 'react';
import { Box, VStack, Text, Heading, Avatar, Center, Spacer, Card, ChakraProvider, HStack } from '@chakra-ui/react';
import { Table, TableContainer, Tr, Td, Tbody, Thead, Th } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import TicketsTable from './TicketsTable';
import { useColorModeValue } from '@chakra-ui/react';
import { IoTicket } from "react-icons/io5";
import { FaTicketAlt } from "react-icons/fa";

function Tickets({ user_id }) {
    const [tickets, setTickets] = useState([]);
    const color = useColorModeValue('white', 'gray.700');

    // Gets all the tickets for the current user
    useEffect(() => {
        fetch(`http://localhost:5000/inventory/user/${user_id}`, {
            credentials: 'include'
        })

            .then(response => response.json())
            .then(setTickets)
            .catch(error => console.error('Error fetching tickets:', error));
    }, []);

    return (
        <ChakraProvider>
            <Box bg={color} rounded={30} w='60vw'>
                <Center height='70vh' overflowX='auto'>
                    <VStack spacing={20}>
                        <HStack>
                            <FaTicketAlt />
                            <Heading overflowX="unset" overflowY="unset" >
                                Your Tickets
                            </Heading>
                            <FaTicketAlt />
                        </HStack>

                        <Card rounded='5px' boxShadow={'5px'} overflowY="auto" overflowX="auto" maxHeight="400px" overflow='auto' >
                            {/* Allows scrolling in the tickets table */}
                            <TableContainer overflowY="auto" overflowX="auto" >
                                <Table variant='simple' colorScheme='teal' overflowX="unset" overflowY="unset">
                                    <Thead overflowX="unset" overflowY="unset" position="sticky" top={0} z-index="sticky" x-index='sticky'>
                                        <Tr bg={color}>
                                            <Th fontWeight='bold'>Event</Th>
                                            <Th fontWeight='bold'>Event Date</Th>
                                            <Th fontWeight='bold'>Row Name</Th>
                                            <Th fontWeight='bold'>Seat Number</Th>
                                            <Th fontWeight='bold'>Purchase Date</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {/* Map for each individual ticket */}
                                        {tickets.map(ticket => (
                                            <TicketsTable
                                                key={ticket.event_id + ticket.row_name + ticket.seat_number}
                                                event_id={ticket.event_id}
                                                row_name={ticket.row_name}
                                                seat_number={ticket.seat_number}
                                                purchase_date={ticket.purchase_date}
                                            />
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>

                        </Card>
                    </VStack>

                </Center>
            </Box>
        </ChakraProvider>

    );
}

export default Tickets;