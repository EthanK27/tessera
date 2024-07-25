import { Avatar, Box, Text, Card, Flex, HStack, TableContainer, Table, TableCaption, Thead, Tr, Tbody, Td, Tfoot, Th, Wrap, WrapItem, Button } from "@chakra-ui/react";
import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function ProfileInfo({user_id, username, email, password_hash, first_name, last_name, profile_pic}) {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.700');
    const textCol = useColorModeValue('gray.700', 'gray.300');

    return (
        <Box 
            padding="50px" 
            h="100vh" 
            align="center" 
            backgroundRepeat={"no-repeat"}
            backgroundSize={'cover'}
            backgroundImage="https://img.freepik.com/premium-photo/colorful-mountain-landscape-with-pink-sky-clouds_664601-5865.jpg"
        >    
            <HStack padding={3} justifyContent={'center'} spacing='10'>
            </HStack>
            <Box bg={color} center="center" justifyContent={'center'} rounded={30} h="70%" w="60%" padding={5}>
                <Avatar size="2xl" mt={15} src={`${profile_pic}`}></Avatar>
                <Card mt={20}>
                    <TableContainer>
                        <Table variant='striped' colorScheme='teal'>
                            <Tbody>
                                <Tr>
                                    <Td>Name</Td>
                                    <Td>{first_name} {last_name}</Td>
                                    
                                </Tr>
                                <Tr>
                                    <Td>Username</Td>
                                    <Td>{username}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Email Address</Td>
                                    <Td>{email}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
                <Button mt={20}>Logout</Button>
            </Box>
        </Box>
        
    );
}
export default ProfileInfo;