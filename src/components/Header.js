import { Center, Text } from '@chakra-ui/react';
export const Header = ({ applicationName }) => {
  return (
    <Center mb={3}>
      <Text fontWeight="bold" fontSize="4xl">
        {applicationName}
      </Text>
    </Center>
  );
};
