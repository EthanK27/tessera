import ProfileInfo from "../components/ProfileInfo"
import UpdateProfile from "../components/UpdateProfile";
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Box, IconButton, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import ChangePassword from "../components/ChangePassword";
function ProfilePage() {
    // profile information, tickets, maybe credit card info   
    // One tab for info, one to update info
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:5000/user/current`, {credentials:'include'}, {
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
                    <Tab>Update Profile</Tab>
                    <Tab>Change Password</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {users.map(user => (
                            <ProfileInfo
                                key={user.user_id}
                                user_id={user.user_id}
                                username={user.username}
                                email={user.email}
                                phone_number={user.phone_number}
                                password_hash={user.password_hash}
                                first_name={user.first_name}
                                last_name={user.last_name}
                                profile_pic={user.profile_pic}
                            />
                        ))}
                    </TabPanel>
                    <TabPanel>
                    {users.map(user => (
                            <UpdateProfile
                                key={user.user_id}
                                user_id={user.user_id}
                                username={user.username}
                                email={user.email}
                                phone_number={user.phone_number}
                                password_hash={user.password_hash}
                                first_name={user.first_name}
                                last_name={user.last_name}
                                profile_pic={user.profile_pic}
                            />
                        ))}
                    </TabPanel>
                    <TabPanel>
                    {users.map(user => (
                        <ChangePassword
                        key={user.user_id}
                            user_id={user.user_id}
                            username={user.username}
                            email={user.email}
                            phone_number={user.phone_number}
                            password_hash={user.password_hash}
                            first_name={user.first_name}
                            last_name={user.last_name}
                            profile_pic={user.profile_pic}
                        />
                    ))}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
    
}
export default ProfilePage;