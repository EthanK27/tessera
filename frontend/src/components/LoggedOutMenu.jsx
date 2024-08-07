import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Box, Flex, Text, Button, Spacer, LightMode } from '@chakra-ui/react';
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';

function LoggedOutMenu() {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.800');
    const menuColor = useColorModeValue('gray.600', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');


    return (
        <Menu bg={bg} color={color}>
        {/* Profile button. Opens Menu */}
        <Button as={Link} to={`/login`} bg={bg} color={color} leftIcon={<CgProfile />} colorScheme="blue" size='lg'>
          Profile
        </Button>
      </Menu>
    );
}
export default LoggedOutMenu;