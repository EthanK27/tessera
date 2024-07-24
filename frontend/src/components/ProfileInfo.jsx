import { Avatar, Box, Card, Flex, HStack } from "@chakra-ui/react";
import { useColorModeValue } from '@chakra-ui/react';

function ProfileInfo() {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.600');

    return (
        <Box padding="100px" h="100vh">
            <Box bg={color} center="center" justifyContent={'center'} rounded={lg} h="90%">
                <HStack spacing={0} h="full" rounded={lg}>
                    <Box bg="orange" h="full" w="30%"> 
                        <Avatar size="2xl"></Avatar>
                    </Box>
                    <Box bg="green" w="full" h="full">
                        hi
                    </Box>
                    
                </HStack>
                    
            </Box>
        </Box>
        
    )
}
export default ProfileInfo;