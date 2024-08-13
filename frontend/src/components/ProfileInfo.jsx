import { Avatar, Box, Card, HStack, TableContainer, Table, Tr, Tbody, Td, Button, useDisclosure } from "@chakra-ui/react";
import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiSignOutBold } from "react-icons/pi";
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaLock } from "react-icons/fa";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    InputGroup,
    InputLeftElement,
    Input,
    Text
} from '@chakra-ui/react'


function ProfileInfo({ user_id, username, email, phone_number, password_hash, first_name, last_name, profile_pic }) {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.700');
    const textCol = useColorModeValue('gray.700', 'gray.300');
    const deleteUserButton = useColorModeValue('#FF033E', '#E32636')
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    

    const [password, setPassword] = useState("");

    async function logout() {
        fetch(`http://localhost:5000/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            credentials: 'include',
        })
            .then(
                response => {
                    if (response.status == '200') {
                        navigate('/login')
                    }
                })
            .catch(error => console.error('Invalid Credentials:', error));
    }

    async function deleteLogout() {
        fetch(`http://localhost:5000/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            credentials: 'include',
        })
            .then(
                response => {
                    if (response.status == '200') {
                        navigate('/events')
                        location.reload();
                    }
                })
            .catch(error => console.error('Invalid Credentials:', error));
    }

    async function deleteUser() {
        await fetch(`http://localhost:5000/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password
                }
            ),
            credentials: 'include',
        })
            .then(
                response => {
                    if (response.status == '201') {
                        deleteLogout();
                    }
                })
            .catch(error => console.error('Incorrect password:', error));
    }

    return (
        // Background
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
            {/* Display the users information based on what was sent from the map */}
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
                                <Tr>
                                    <Td>Phone Number</Td>
                                    <Td>{phone_number}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
                <HStack spacing='12px' center="center" justifyContent={'center'}>
                    <Button mt={20} leftIcon={<PiSignOutBold />} onClick={logout}>Sign Out</Button>
                    <Button mt={20} leftIcon={<TiUserDeleteOutline />} onClick={onOpen} bg={deleteUserButton}>Delete User</Button>

                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Delete User</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                Are you sure you want to delete this user?
                                <Text color={deleteUserButton}>This can't be undone</Text>
                            </ModalBody>
                            <ModalBody>
                                <FormControl>
                                    <InputGroup>
                                        <InputLeftElement
                                            children={<FaLock color="gray.300" />}
                                        />
                                        <Input
                                            boxShadow="xs"
                                            placeholder="confirm password"
                                            rounded='xl'
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={deleteUser} bg={deleteUserButton}>Delete</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </HStack>

            </Box>
        </Box>

    );
}
export default ProfileInfo;