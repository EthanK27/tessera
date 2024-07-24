import React from 'react';
import { Box, Flex, Text, Button, Spacer, LightMode } from '@chakra-ui/react';
import { CgProfile } from "react-icons/cg";
import ColorChange from './ColorChange';
import { useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider} from '@chakra-ui/react';


function Navbar() {
  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');
  const menuColor = useColorModeValue('gray.600', 'gray.800');
  return (
    <Flex bg={bg} color={color} p="4" alignItems="center">
      <Box p="2">
        <Text href="" fontSize="xl" fontWeight="bold"  as={Link} to={`/events`}>Tessera Events</Text>
      </Box>
        <Spacer />
      <Box>

        {/* Calls dark mode component */}
        <ColorChange/>
        {/*  Defaults light mode */}
        <LightMode>
          
          <Menu bg={bg} color={color}>
            {/* Profile button. Opens Menu */}
            <MenuButton as={Button} bg={bg} color={color} leftIcon={<CgProfile />} colorScheme="blue" size='lg'>
              Profile
            </MenuButton>
            <MenuList minWidth='240px'>
              {/* Profile part of menu takes you to login if not logged in */}
              <MenuItem color={menuColor} as={Link} to={'/profile'}>Profile</MenuItem>
              <MenuItem color={menuColor}>Manage Tickets</MenuItem>
              <MenuItem color={menuColor}>Settings</MenuItem>    
              <MenuItem>Sign out</MenuItem>
              <MenuDivider></MenuDivider>    
              <MenuItem color={menuColor} as={Link} to={`/login`}>Log in</MenuItem>
            </MenuList>
          </Menu>
          
        
        </LightMode>
      </Box>
    </Flex>
  );
}

export default Navbar;