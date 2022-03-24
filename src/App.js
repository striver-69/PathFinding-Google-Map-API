import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  SkeletonText,
  Tooltip,
} from '@chakra-ui/react';
import { FaTimes, FaRegCircle, FaRegDotCircle } from 'react-icons/fa';
import {
  initialCoords,
  applicationName,
  googleMapContainerOptions,
  libraries,
  customErrorMessage,
} from './constants';

import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from '@react-google-maps/api';
import { useRef, useState } from 'react';
import { InputsContainer } from './components/InputsContainer';
import { Header } from './components/Header';
import { Results } from './components/Results';

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState('');

  const originRef = useRef();
  const destinationRef = useRef();

  if (loadError) {
    return <div>Error in loading the Google Map</div>;
  }
  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      handleErrorMessage(customErrorMessage);
      return;
    }
    try {
      setErrors('');
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      const { distance, duration } = getDistanceAndDuration(results);
      setDistance(distance);
      setDuration(duration);
    } catch (error) {
      handleErrorMessage(error.message);
      return;
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setErrors('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  function handleErrorMessage(errorMessage) {
    setErrors(errorMessage);
    setDuration('NA');
    setDistance('NA');
  }

  function getDistanceAndDuration(results) {
    const distance = results.routes[0].legs[0].distance.text;
    const duration = results.routes[0].legs[0].duration.text;
    return { duration, distance };
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
          center={initialCoords}
          zoom={6}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={googleMapContainerOptions}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="3xl"
        m={4}
        bgColor="white"
        minW="container.md"
        zIndex="1"
      >
        <Header applicationName={applicationName} />
        <InputsContainer
          Icon={FaRegCircle}
          Ref={originRef}
          placeholder="Enter Source Location"
        />
        <InputsContainer
          Icon={FaRegDotCircle}
          Ref={destinationRef}
          placeholder="Enter Destination Location"
        />
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

        <Results distance={distance} duration={duration} errors={errors} />
      </Box>
    </Flex>
  );
}

export default App;
