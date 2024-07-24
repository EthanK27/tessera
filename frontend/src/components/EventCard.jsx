import React, { useEffect, useState } from 'react';
import { Image, Text, VStack, Heading, LinkBox, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

// function EventCard(props) {
// props.id, props.name
function EventCard({ id, name, date, time, location, imageUrl }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const eventDate = new Date(date + ' ' + time).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      // Checks if event has already started
      if (distance < 0) {
        setTimeLeft('Event has started');
        return;
      }
      
      // Converts time to useable format
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update the timer text
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    // Update the timer every second
    const timerId = setInterval(updateTimer, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timerId);
  }, [date]);

  return (
    <LinkBox as="article" w="full" borderWidth="1px" rounded="md" overflow="hidden" boxShadow="md">
      <VStack align="stretch">
        {imageUrl && (
          <Image borderRadius="md" src={imageUrl} alt={`Image for ${name}`} objectFit="cover" width="full" />
        )}
        <VStack align="stretch" p="4">
        <Heading size="md" my="2">{name}</Heading>
          <Text fontSize="sm">Date: {date}</Text>
          <Text fontSize="sm">Event Time: {time}</Text>
          <Text fontSize="sm">Location: {location}</Text>
          <Text fontSize="sm" color="red.500">{timeLeft}</Text>
          <Button colorScheme="blue" mt="4" as={Link} to={`/events/${id}`}>
            Buy Tickets!
          </Button>
        </VStack>
      </VStack>
    </LinkBox>
  );
}

export default EventCard;