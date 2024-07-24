import { useState } from "react";
import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement, 
  Container,
  extendTheme,
  ChakraProvider,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useColorModeValue } from '@chakra-ui/react';
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const theme = extendTheme({
    shadows: {
        xs: '0 0 5px rgba(49, 130, 206, 0.5)',
        base: '0 0 5px rgba(208, 50, 150, 1)',
    },
});

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();

  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('white', 'gray.200')
  const butCol = useColorModeValue('gray.200', 'gray.700');
  const textCol = useColorModeValue('gray.700', 'gray.200');

    // Helper to send data back to the page/parent function
    function handleClick() {    
        fetch(`http://localhost:5000/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify (
                {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    username: username,
                    password: password,
                    confirm_password: confirm_password
                }
                
            ),
            credentials: 'include',  // Include cookies in the request
        })
        .then(
            response => {
                if (response.status == '201') {
                    navigate('/events')
                }
            } 
        )
        .catch(error => console.error('Error fetching events:', error));
    }

  return (
    <Grid
        templateAreas={`"left middle right"`}
        gridTemplateRows={'100v'}
        gridTemplateColumns={'100v'}
        height='100vh'
        color='blackAlpha.700'
        fontWeight='bold'
        textColor={textCol}
        backgroundImage={'https://www.shutterstock.com/image-photo/close-shot-crowd-pov-mode-600nw-2304001181.jpg'}
        backgroundRepeat={'no-repeat'}
        backgroundSize='cover'
    >
        <GridItem pl='2' area={'left'}>
        </GridItem>
        <GridItem boxShadow="0 0 100px rgba(255, 255, 255, 1)" bg={color} area={'middle'}>
            <ChakraProvider theme={theme}>
                <Container>
                    <Stack
                        flexDir="column"
                        mb="2"
                        justifyContent="center"
                        alignItems="center"
                        height="700px" // need to fix this
                    >
                        <form>
                        <Box minW={{ base: "100%", md: "500px"}}>
                            <Stack boxShadow="base" border={border} borderWidth={1} rounded="lg" padding={5}>
                                <Stack
                                    spacing={3}
                                    p="3rem"
                                    backgroundColor={color}
                                    boxShadow="xs"
                                    border={border}
                                    borderWidth={1}
                                    rounded='lg'
                                >
                                    <Heading padding={2} color={bg}>Sign Up</Heading>
                                    <HStack>
                                        <FormControl>
                                            <InputGroup>
                                                <InputLeftElement
                                                    children={<CFaUserAlt />}
                                                /> 
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="First name"
                                                    rounded='xl'
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <InputGroup>
                                                <InputLeftElement
                                                    children={<CFaUserAlt />}
                                                />
                                                <Input 
                                                    boxShadow="xs"  
                                                    placeholder="Last name"
                                                    rounded='xl'
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    </HStack>
                                    <FormControl>
                                        <InputGroup>
                                            <InputLeftElement
                                                // pointerEvents="none"
                                                children={<CFaUserAlt />}
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
                                        <InputGroup>
                                            <InputLeftElement
                                                children={<MdEmail />}
                                            />
                                            <Input 
                                                boxShadow="xs"  
                                                placeholder="email address"
                                                rounded='xl'
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents="none"
                                                
                                                children={<CFaLock />}
                                            />
                                                <Input 
                                                    rounded='xl' 
                                                    type={showPassword ? "text" : "password"} 
                                                    boxShadow="xs" 
                                                    placeholder="password"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            <InputRightElement width="4.5rem">
                                                <Button 
                                                    h="1.75rem" 
                                                    bg={butCol} 
                                                    color={textCol}
                                                    size="sm" 
                                                    onClick={handleShowClick}>
                                                        {showPassword ? "Hide" : "Show"}

                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                        
                                    </FormControl>
                                    <FormControl>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents="none"
                                                
                                                children={<CFaLock />}
                                            />
                                                <Input 
                                                    rounded='xl' 
                                                    type={showPassword ? "text" : "password"} 
                                                    boxShadow="xs" 
                                                    placeholder="confirm password"
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            <InputRightElement width="4.5rem">
                                                <Button 
                                                    h="1.75rem" 
                                                    bg={butCol} 
                                                    color={textCol}
                                                    size="sm" 
                                                    onClick={handleShowClick}>
                                                        {showPassword ? "Hide" : "Show"}

                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                        
                                    </FormControl>
                                    <Button
                                        borderRadius={0}
                                        variant="outline"
                                        color="blue.500"
                                        width="full"
                                        rounded='xl'
                                        border='2px'
                                        onClick={handleClick}
                                    >
                                        Sign up
                                    </Button>
                                </Stack>
                            </Stack>    
                        </Box>
                        </form>
                    </Stack>
                </Container>
            </ChakraProvider>
        </GridItem>
        <GridItem pl='2' area={'right'}>
        </GridItem>
    </Grid>
    
  );
};
export default Register;