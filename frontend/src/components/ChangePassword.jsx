import { 
    Avatar, 
    Box, 
    Text, 
    Card, 
    Flex, 
    HStack, 
    Wrap, 
    WrapItem, 
    Button,
    FormControl,
    InputGroup, 
    InputLeftElement,
    InputRightElement,
    Input,
    ChakraProvider,
    Container,
    Stack,
    chakra,
    Heading,
    InputLeftAddon
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";

function ChangePassword({user_id,  first_name, last_name, profile_pic}) {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.700');
    const textCol = useColorModeValue('gray.700', 'gray.300');
    const leftAddonCol = useColorModeValue('gray.200', 'rgb(78, 88, 102)');
    const extraBorderCol = useColorModeValue('gray.200', 'gray.700');

    const [check_username, setUsername] = useState("");
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");

    async function handleClick() {    
        fetch(`http://localhost:5000/user/password/change`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify (
                {
                    check_username: check_username,
                    old_password: old_password,
                    new_password: new_password
                }
            ),
            credentials: 'include', 
        })
        .then(
            response => {
                if (response.status == '201') {
                    location.reload(); 
                }
        } )
        .catch(error => console.error('Invalid Credentials:', error));
    }

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
            <Box bg={color} center="center" justifyContent={'center'} rounded={30} h="70%" w="60%">
                <ChakraProvider alignItems="center" justifyContent="center" center="center" w="60%">
                    <Container alignItems="center" justifyContent="center" center="center">
                        <Stack
                            flexDir="column"
                            mb="2"
                        >
                                <form>
                                    <Stack mt={10}>

                                        <Heading mb={5} padding={2} color={bg}>Change Password</Heading>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="25%">Username: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<FaUserAlt color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="username"
                                                    rounded='xl'
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="25%">Old Password: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<FaKey color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="original password"
                                                    rounded='xl'
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="25%">New Password: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<FaKey color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="new password"
                                                    rounded='xl'
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                      
                                    </Stack>
                                </form>
                                
                                <Button mt={20} color={bg} variant="outline" borderColor={bg} onClick={handleClick}>Update Password</Button>
                            
                        </Stack>
                    </Container>
                </ChakraProvider>
            </Box>
        </Box>
    );
}
export default ChangePassword;