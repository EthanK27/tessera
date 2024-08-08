import { Box, Flex, Text, Button, Spacer, LightMode } from '@chakra-ui/react';
import { CgProfile } from "react-icons/cg";
import ColorChange from './ColorChange';
import { useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider} from '@chakra-ui/react';
import LoggedInMenu from '../components/LoggedInMenu'
import LoggedOutMenu from '../components/LoggedOutMenu'
import React, { useEffect, useState } from 'react';


function Navbar() {
  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');
  const menuColor = useColorModeValue('gray.600', 'gray.800');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      fetch(`http://localhost:5000/user/current`, {credentials:'include'}, {
      })
        .then(response => {
          if (response.status == 200) {
              setIsLoggedIn(true)
            }
            else {
              setIsLoggedIn(false)
            }
        })
        
        .catch(error => console.error('Error fetching profile:', error));
    }, []);

  return (
    <Flex bg={bg} color={color} p="4" alignItems="center">
      <Box p="2">
        <Text fontSize="xl" fontWeight="bold"  as={Link} to={`/events`}>Tessera Events</Text>
      </Box>
        <Spacer />
      <Box>

        {/* Calls dark mode component */}
        <ColorChange/>
        {/*  Defaults light mode */}

          {isLoggedIn == true ? <LoggedInMenu/> : <LoggedOutMenu/>}

      </Box>
    </Flex>
  );
}

export default Navbar;