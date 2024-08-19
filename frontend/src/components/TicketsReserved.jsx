import { Table, TableContainer, Tr, Td, Tbody, Thead, Th, Text, Card } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

function TicketsReserved({ resTickets }) {
    const color = useColorModeValue('white', 'gray.800');

    return (
        <Card p={5} bg={color}>
            <TableContainer overflowY='auto' maxH='250px'>
                <Text fontWeight='bold' fontSize='2xl' >Tickets in Cart</Text>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>
                                Row
                            </Th>
                            <Th>
                                Seat Number
                            </Th>
                            <Th>
                                Price
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {resTickets.map((ticket, index) => (
                            <Tr key={index}>
                                <Td>
                                    {ticket.row}
                                </Td>
                                <Td>
                                    {ticket.number}
                                </Td>
                                <Td>
                                    ${ticket.price.toFixed(2)}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Card>

    )
}

export default TicketsReserved;