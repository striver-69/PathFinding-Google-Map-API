import { Box, Center, HStack, Input } from '@chakra-ui/react';

import { Autocomplete } from '@react-google-maps/api';

export const InputsContainer = ({ Icon, Ref, placeholder }) => {
  return (
    <HStack mb={3}>
      <Center>
        <Icon size={30} />
      </Center>
      <Box flex="1" ml={2}>
        <Autocomplete>
          <Input flex="1" type="text" placeholder={placeholder} ref={Ref} />
        </Autocomplete>
      </Box>
    </HStack>
  );
};
