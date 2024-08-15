import React, { useEffect, useState } from 'react';
import { Table, TableContainer, Tr, Td, Tbody, Thead, Th } from '@chakra-ui/react';

function TicketsTable({ event_id, row_name, seat_number, purchase_date }) {
    const [event, setEvent] = useState([]);
    
    // Gets the event information to print
    useEffect(() => {
        fetch(`http://localhost:5000/events/${event_id}`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then((event) => setEvent(event[0]))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    return (
        // Individual ticket
        <Tr>
            <Td>{event.name}</Td>
            <Td>{event.date}</Td>
            <Td>{row_name}</Td>
            <Td>{seat_number}</Td>
            <Td>{purchase_date}</Td>
        </Tr>

    );
}

export default TicketsTable;