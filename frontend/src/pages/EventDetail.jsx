import { useParams } from 'react-router-dom';
import { Grid, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SingleEvent from '../components/SingleEvent';
import { useColorModeValue } from '@chakra-ui/react';


function EventDetail() {
  const { id } = useParams(); 
  const [events, setEvents] = useState([]);
  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');

  // Get corresponding event page based on id
    useEffect(() => {
        fetch(`http://localhost:5000/events/${id}`, {credentials:'include'})
        .then(response => response.json())
        .then(setEvents)
        .catch(error => console.error('Error fetching events:', error));
    }, []);


  return (
    <Box padding={5}>
      
        {events.map(event => (
          // Calls single event component and populates site with information for the event
          <SingleEvent
            key={event.event_id}
            id={event.event_id}
            name={event.name}
            description={event.description}
            date={event.date}
            time={event.time}
            location={event.location}
            imageUrl={event.url} 
          />
        ))}
    </Box>
    
                
  );
}
export default EventDetail;