import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  FormHelperText,
  InputRightElement, 
  Container,
  extendTheme,
  ChakraProvider,
  Spacer,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useColorModeValue } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const theme = extendTheme({
    shadows: {
        xs: '0 0 8px rgba(49, 130, 206, 1)',
        base: '0 0 8px rgba(208, 50, 150, 1)',
    },
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowClick = () => setShowPassword(!showPassword);
    const navigate = useNavigate()
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");

    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('white', 'gray.200');
    const butCol = useColorModeValue('gray.200', 'gray.700');
    const textCol = useColorModeValue('gray.700', 'gray.300');

    async function handleClick() {    
        await fetch(`http://localhost:5000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify (
                {
                    userEmail: userEmail,
                    password: password
                }
            ),
            credentials: 'include', 
        })
        .then(
            response => {
                if (response.status == '200') {
                    navigate('/events')
                }
            } 
        )
        .catch(error => console.error('Invalid Credentials:', error));
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
            <Button as={Link} to={`/events`} variant='outline' textColor={textCol}>Go Back</Button>
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
                                <Heading padding={2} color={bg}>Login</Heading>
                                <FormControl>
                                    <InputGroup>
                                        <InputLeftElement
                                            children={<CFaUserAlt color="gray.300" />}
                                        />
                                        <Input 
                                            boxShadow="xs"  
                                            placeholder="username or email"
                                            rounded='xl'
                                            onChange={(e) => setUserEmail(e.target.value)}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            textColor={textCol}
                                            children={<CFaLock color="gray.300" />}
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
                                    <Flex>
                                        <Box>
                                            <FormHelperText textAlign="left">
                                                <Link size={'sm'}>Forgot password?</Link>
                                            </FormHelperText>
                                        </Box>
                                    <Spacer/>
                                        <Box>
                                            <FormHelperText textAlign="right">
                                                <Link as={Link} to='/register' size={'sm'}>New? Sign up</Link>
                                            </FormHelperText>
                                        </Box>
                                    </Flex>
                                </FormControl>
                                <Button
                                    borderRadius={0}
                                    variant="outline"
                                    color="blue.500"
                                    width="full"
                                    rounded='xl'
                                    border='2px'
                                    onClick={handleClick}
                                    //as={Link} to={isValid ? `/events` : `/login`}
                                >
                                    Log in
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
export default Login;