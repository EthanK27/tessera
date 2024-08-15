import Tickets from "../components/Tickets"
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Box, IconButton, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';



function TicketsPage() {
    const [user, setUser] = useState(null);

    // Call to get logged in  users information
    useEffect(() => {
        fetch(`http://localhost:5000/user/current`, { credentials: 'include' }, {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(user => { setUser(user[0])})
            .catch(error => console.error('Error fetching profile:', error));
    }, []);
    return (
        <Box 
            padding="50px"
            h="100vh"
            align="center"
            justifyContent="center"
            alignContent="center"
            backgroundRepeat={"no-repeat"}
            backgroundSize={'cover'}
            overflow={'auto'}
            backgroundImage="https://img.freepik.com/premium-photo/beautiful-mountain-landscape-with-blue-sky-pink-clouds_900706-2512.jpg">
            {
                user ?
                    <Tickets
                        user_id={user.user_id}
                    />
                    : null
            }

        </Box>
    );
}
export default TicketsPage;