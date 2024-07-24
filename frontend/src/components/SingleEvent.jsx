import { Image, Grid, GridItem, } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

// function EventCard(props) {
// props.id, props.name
function SingleEvent({ id, name, description, date, time, location, imageUrl }) {
  const bg = useColorModeValue('blue.500', 'blue.400');
  const color = useColorModeValue('white', 'gray.800');

  return (
      // What is displayed in the EventDetail page
      <Grid 
        templateAreas={`"header header header"
                        "nav main main"
                        "footer footer buytickets"`}
        gridTemplateRows={'50px 1fr 80px'}
        gridTemplateColumns={'300px 600px'}
        h='800px'
        gap='2'

        fontWeight='bold'
      >
        <GridItem alignContent='center' rounded='md' pl='2' bg={bg} color={color} area={'header'}>
          {name}
        </GridItem>
        <GridItem rounded='md' padding={2} pl='2' bg={bg} color={color} placeItems={'center'} area={'nav'}>
          <Image borderRadius="md" src={imageUrl} alt={`Image for ${name}`} width="500px" padding="2" />
        </GridItem>
        <GridItem rounded='md' pl='2' bg={bg} color={color} area={'main'}>
          Map thing
        </GridItem>
        <GridItem rounded='md' pl='2' bg={bg} color={color} area={'footer'}>
          About the Event: {description}
        </GridItem>
        <GridItem rounded='md' pl='2' bg={bg} color={color} area={'buytickets'}>
          Buy Tickets
        </GridItem>
      </Grid>
    
      


    
      
      
  );

  
}

export default SingleEvent;