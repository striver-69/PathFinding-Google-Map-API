import { Center, HStack, Text } from '@chakra-ui/react';

export const Results = ({ errors, distance, duration }) => {
  return (
    <>
      <HStack spacing={4} mt={4} justifyContent="space-around">
        <Text>Distance: {distance} </Text>
        <Text>Duration: {duration} </Text>
      </HStack>
      {errors && (
        <Center m={4}>
          <Text fontWeight="bold">{errors}</Text>
        </Center>
      )}
    </>
  );
};
