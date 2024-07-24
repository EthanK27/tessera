import {Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider} from '@chakra-ui/react';
import { Button, ButtonGroup, Box, IconButton } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, } from '@chakra-ui/react';
import {FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, InputLeftElement, InputGroup, HStack, StackDivider, Flex } from '@chakra-ui/react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";

function Filter({ sendDataToParent }) {
    const bg = useColorModeValue('blue.500', 'blue.400');
    const color = useColorModeValue('white', 'gray.800');
    const placeholderColor = useColorModeValue('gray.400', 'gray.100');
    const textColor = useColorModeValue('gray.800', 'white');

    // Use state for each event attribute
    const [name, setNameFromFilter] = useState("");
    const [location, setLocationFromFilter] = useState("");
    const [afterDate, setAfterDateFromFilter] = useState("");
    const [beforeDate, setBeforeDateFromFilter] = useState("");

    // Helper to send data back to the page/parent function
    function handleClick() {    
        sendDataToParent(name, location, afterDate, beforeDate);
    }
    // Same thing but sends empty data to reset
    // Also deletes what was in the filter boxes
    function clearFilters() {
        sendDataToParent("", "", "", "");
        setNameFromFilter('');
        setLocationFromFilter('');
        setAfterDateFromFilter('');
        setBeforeDateFromFilter('');
    }

    return (
        // Drop down aspect of the filter
        
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        {/* Button part of filter */}
                        <AccordionButton _expanded={{ /* Can put something in here later if I want to make the button do something on click */}}>
                            <Box as='span' flex='1' textAlign='center'>
                                Filter Results
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    
                    <AccordionPanel pb={4}>
                        <FormControl >
                            <HStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
                                {/* Date part of filter */}
                                <InputGroup>
                                    <Input placeholder='Select Date and Time' size='md' type='date' value={afterDate} onChange={(e) => setAfterDateFromFilter(e.target.value)}/>
                                    <>_</>
                                    <Input placeholder='Select Date and Time' size='md' type='date' value={beforeDate} onChange={(e) => setBeforeDateFromFilter(e.target.value)}/>
                                </InputGroup>
                                
                                {/* Location part of filter */}
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaLocationDot />
                                    </InputLeftElement>       
                                    <Input color={textColor} bg={color} placeholder='Search by Location' _placeholder={{ color: {placeholderColor} }} type="text" value={location} onChange={(e) => setLocationFromFilter(e.target.value)}/>
                                </InputGroup>

                                {/* Name part of filter */}
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaMagnifyingGlass />
                                    </InputLeftElement> 
                                    <Input color={textColor} bg={color} placeholder='Search by Name' _placeholder={{ color: {placeholderColor} }} type="text" value={name} onChange={(e) => setNameFromFilter(e.target.value)}/>          
                                </InputGroup>

                                {/* Button to filter or reset filter */}
                                <ButtonGroup isAttached variant='outline'>
                                    <Button color={textColor} onClick={handleClick}>Filter</Button>
                                    <IconButton onClick={clearFilters} icon={<TiDeleteOutline />} />
                                </ButtonGroup>
                            </HStack>
                        </FormControl>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        
        
    );
    
}
export default Filter