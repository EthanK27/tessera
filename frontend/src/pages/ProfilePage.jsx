import ProfileInfo from "../components/ProfileInfo"
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Box, IconButton, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
function ProfilePage() {
    // profile information, tickets, maybe credit card info   
    // One tab for info, one to update info
    const [users, setUsers] = useState([]);
    
    
    useEffect(() => {
        fetch(`http://localhost:5000/user/current`, {
            credentials: 'include', 
        })
        .then(response => response.json())
        .then(setUsers)
        .catch(error => console.error('Error fetching profile:', error));
    }, []);
    

    return (
        <Box>
            <Tabs isFitted>
                <TabList>
                    <Tab>
                        Profile Information
                    </Tab>
                    <Tab>Two</Tab>
                    <Tab>Three</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {users.map(user => (
                            <ProfileInfo
                                key={user.user_id}
                                user_id={user.user_id}
                                username={user.username}
                                email={user.email}
                                password_hash={user.password_hash}
                                first_name={user.first_name}
                                last_name={user.last_name}
                                profile_pic={user.profile_pic}
                            />
                        ))}
                    </TabPanel>
                    <TabPanel>
                    <p>two!</p>
                    </TabPanel>
                    <TabPanel>
                    <p>three!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
    
}
export default ProfilePage;