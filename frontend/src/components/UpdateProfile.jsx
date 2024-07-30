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
import { FaPhoneAlt } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { GrUpdate } from "react-icons/gr";


function UpdateProfile({user_id,  first_name, last_name, profile_pic}) {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.700');
    const textCol = useColorModeValue('gray.700', 'gray.300');
    const leftAddonCol = useColorModeValue('gray.200', 'rgb(78, 88, 102)');
    const extraBorderCol = useColorModeValue('gray.200', 'gray.700');

    const [new_username, setUsername] = useState("");
    const [new_email, setEmail] = useState("");
    const [new_phone_number, setPhoneNumber] = useState("");
    const [new_profile_pic, setProfilePic] = useState("");

    // Call update endpoint when click button
    async function handleClick() {    
        fetch(`http://localhost:5000/user/update/${user_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify (
                {
                    new_username: new_username,
                    new_email: new_email,
                    new_profile_pic: new_profile_pic,
                    new_phone_number: new_phone_number
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
            <Box bg={color} center="center" justifyContent={'center'} rounded={30} h="70%" w="60%">
                <ChakraProvider alignItems="center" justifyContent="center" center="center" w="60%">
                    <Container alignItems="center" justifyContent="center" center="center">
                        <Stack
                            flexDir="column"
                            mb="2"
                        >
                            {/* Input section */}
                                <form>
                                    <Stack mt={10}>

                                        <Heading mb={5} padding={2} color={bg}>Update User</Heading>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="28%">Username: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<FaUserAlt color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="update username"
                                                    rounded='xl'
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="28%">Email: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<MdEmail color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="update email"
                                                    rounded='xl'
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="28%">Profile Picture: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<AiFillPicture color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="update profile picture"
                                                    rounded='xl'
                                                    onChange={(e) => setProfilePic(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <InputGroup mt={8}>
                                                <InputLeftAddon bg={leftAddonCol} width="28%">Phone Number: </InputLeftAddon>
                                                <InputRightElement
                                                    children={<FaPhoneAlt color="gray.300" />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="update phone number"
                                                    rounded='xl'
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                      
                                    </Stack>
                                </form>
                                
                                <Button mt={20} color={bg} variant="outline" borderColor={bg} onClick={handleClick} rightIcon={<GrUpdate />}>Update</Button>
                            
                        </Stack>
                    </Container>
                </ChakraProvider>
            </Box>
        </Box>
    );
}
export default UpdateProfile;