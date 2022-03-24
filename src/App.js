import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { FaTimes, FaRegCircle, FaRegDotCircle } from 'react-icons/fa';

import {
  useJsApiLoader,
  GoogleMap,
  // Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { useRef, useState } from 'react';

const center = { lat: 22.9731069, lng: 78.6566496 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  // const [obj, setObj] = useState({});
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState('');

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      setErrors(
        'Enter both source and destination location to get the distance and estimated interval'
      );
      setDistance('NA');
      setDuration('NA');
      return;
    }
    try {
      setErrors('');
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destiantionRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      console.log(results);
      const startingLocation =
        results.routes[0].legs[0].start_location.toJSON();
      console.log(startingLocation);
      // const endingLocation = results.routes[0].legs[0].end_location.toJSON();
      // setObj({ startingLocation, endingLocation });
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      setErrors(error.message);
      setDuration('NA');
      setDistance('NA');
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setErrors('');
    originRef.current.value = '';
    destiantionRef.current.value = '';
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={6}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            clickableIcons: true,
          }}
          // onLoad={(map) => setMap(map)}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <Center mb={3}>
          <Text fontWeight="bold" fontSize="4xl">
            Path Tracking Application
          </Text>
        </Center>
        <Flex flexDirection="column">
          <HStack mb={3}>
            <Center>
              <FaRegCircle size={30} />
            </Center>
            <Box flex="1" ml={2}>
              <Autocomplete>
                <Input type="text" placeholder="Origin" ref={originRef} />
              </Autocomplete>
            </Box>
          </HStack>
          <HStack mb={3}>
            <Center>
              <FaRegDotCircle size={30} />
            </Center>
            <Box flex="1" ml={2}>
              <Autocomplete>
                <Input
                  flex="1"
                  type="text"
                  placeholder="Destination"
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>
          </HStack>
        </Flex>
        <Center>
          <ButtonGroup>
            <Button colorScheme="green" type="submit" onClick={calculateRoute}>
              Calculate Distance!
            </Button>
            <Tooltip
              hasArrow
              placement="right"
              label="Clear Source and Destination"
              fontSize="md"
            >
              <IconButton
                aria-label="center back"
                isRound
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </Tooltip>
          </ButtonGroup>
        </Center>

        <HStack spacing={4} mt={4} justifyContent="space-around">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
        </HStack>
        {errors && (
          <Center m={4}>
            <Text fontWeight="bold">{errors}</Text>
          </Center>
        )}
      </Box>
    </Flex>
  );
}

export default App;
