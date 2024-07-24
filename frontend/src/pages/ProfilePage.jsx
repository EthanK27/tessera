import ProfileInfo from "../components/ProfileInfo"
import { Button, ButtonGroup, Box, IconButton } from '@chakra-ui/react';
function ProfilePage() {
    // profile information, tickets, maybe credit card info   
    // One tab for info, one to update info
    /*
        fetch(`http://localhost:5000/user/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        })
        .then(
            response => {
                if (response.status == '200') {
                    navigate('/events')
                }
            } 
        )
        .catch(error => console.error('Error fetching profile:', error));
        */

    return (
        <Box>
            <ProfileInfo padding={5}>

            </ProfileInfo>
        </Box>
    );
    
}
export default ProfilePage;