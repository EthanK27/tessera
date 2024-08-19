import React, { useEffect, useState } from 'react';
import { SimpleGrid, Container, Button } from '@chakra-ui/react';
import EventCard from '../components/EventCard';
import Filter from '../components/Filter';

function EventsPage() {
  // Use states to update events and event components
  const [events, setEvents] = useState([]);
  const [name, setNameFromFilter] = useState("");
  const [location, setLocationFromFilter] = useState("");
  const [afterDate, setAfterDateFromFilter] = useState("");
  const [beforeDate, setBeforeDateFromFilter] = useState("");
  const [category, setCategoryFromFilter] = useState("");

  // Helper function to update states of each event attribute
  function handleDataFromChild(name, location, afterDate, beforeDate, category) {
    setNameFromFilter(name);
    setLocationFromFilter(location);
    setAfterDateFromFilter(afterDate);
    setBeforeDateFromFilter(beforeDate);
    setCategoryFromFilter(category);
  }

  // Fetches the endpoint to refresh the page
  useEffect(() => {
    console.log(category)
    fetch(`http://localhost:5000/events?name=${name}&location=${location}&afterDate=${afterDate}&beforeDate=${beforeDate}&category=${category}`)
      .then(response => response.json())
      .then(setEvents)
      .catch(error => console.error('Error fetching events:', error));

  }, [name, location, afterDate, beforeDate, category]);

  return (
    <Container maxW="container.xl" centerContent>
      {/* Call to Filter Component. Sends the data from the search bars to the component */}
      <Filter sendDataToParent={handleDataFromChild} />
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10} py={5}>
        {events.map(event => (
          // Call of the Event Card component to place each event with corresponding info
          <EventCard
            key={event.event_id}
            id={event.event_id}
            name={event.name}
            date={event.date}
            time={event.time}
            location={event.location}
            imageUrl={event.url}
            category={event.category}
          />
        ))}
      </SimpleGrid>
    </Container>

  );
}

export default EventsPage;