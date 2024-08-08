import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Box, Flex, Text, Button, Spacer, LightMode } from '@chakra-ui/react';
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function LoggedInMenu() {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.800');
    const menuColor = useColorModeValue('gray.600', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const navigate = useNavigate();


    async function clickLogout() {
        fetch(`http://localhost:5000/logout`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
               },
               credentials: 'include', 
         })
         .then( response => {
             if (response.status === 200)
                {
                    navigate(`/events`)
                    location.reload(); 
                }
           })
           
         .catch(error => console.error('Invalid Credentials:', error));
         
     }

    return (

        <Menu bg={bg} color={color}>
        {/* Profile button. Opens Menu */}
        <MenuButton as={Button} bg={bg} color={color} leftIcon={<CgProfile />} colorScheme="blue" size='lg'>
            Profile
        </MenuButton>
        <MenuList minWidth='240px'>
            {/* Profile part of menu takes you to login if not logged in */}
            <MenuItem color={textColor} as={Link} to={'/profile'}>Profile</MenuItem>
            <MenuItem color={textColor}>Manage Tickets</MenuItem>
            <MenuItem color={textColor}>Settings</MenuItem>    
            <MenuDivider></MenuDivider>    
            <MenuItem color={textColor} onClick={clickLogout}>Sign Out</MenuItem>
        </MenuList>
        </Menu>

        
    );
}
export default LoggedInMenu;