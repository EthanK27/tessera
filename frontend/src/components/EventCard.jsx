import React, { useEffect, useState } from 'react';
import { Image, Text, VStack, Heading, LinkBox, Button, useDisclosure } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

// function EventCard(props) {
// props.id, props.name
function EventCard({ id, name, date, time, location, imageUrl, category }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [eventStarted, setEventStarted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  // Redirects the user if they are/aren't logged in
  async function redirect() {
    fetch(`http://localhost:5000/user/current`, { credentials: 'include' }, {
    })
      .then(response => {
        if (response.status == 200) {
          if (eventStarted == false) {
            navigate(`/events/${id}`)
          }
          else {
            setShowAlert(true);
            onOpen();
          }
        }
        else {
          navigate(`/login`)
        }
      })

      .catch(error => console.error('Error fetching profile:', error));
  }

  useEffect(() => {
    const updateTimer = () => {
      const eventDate = new Date(date + ' ' + time).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      // Checks if event has already started
      if (distance < 0) {
        setTimeLeft('Event has started');
        setEventStarted(true);
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
          <Button colorScheme="blue" mt="4" onClick={redirect}>
            Buy Tickets!
          </Button>
          {showAlert ?
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Event has Started</ModalHeader>
                <ModalCloseButton />
                <ModalBody padding={10}>
                  This event has already started. Please select a different event.
                </ModalBody>
                <ModalFooter/>
              </ModalContent>
            </Modal> : <></>
          }
        </VStack>
      </VStack>
    </LinkBox>
  );
}

export default EventCard;