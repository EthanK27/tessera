import { useColorMode } from '@chakra-ui/color-mode';
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/react';


const ColorChange = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.800');

    return (
        // When click button, change color mode and swap the icon
        <Button colorScheme={color} onClick={() => toggleColorMode()}>
            {colorMode === 'light' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
        </Button>

    )
}

export default ColorChange;