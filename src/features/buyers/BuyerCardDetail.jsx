import React from "react";  
import { Box, Text, HStack } from "@chakra-ui/react";  
import { FaUser, FaMapMarkerAlt, FaPhone } from "react-icons/fa";  

export default function BuyerCardDetail({ buyer }) {  
  if (!buyer) return null;  

  return (  
    <Box bg="green.50" p={4} borderRadius="md" boxShadow="sm">  
      <Text fontSize="lg" fontWeight="bold" mb={4}>  
        Buyer Detail  
      </Text>  

      <HStack mb={2} spacing={3}>  
        <Box color="green.600">  
          <FaUser />  
        </Box>  
        <Text>{buyer.name}</Text>  
      </HStack>  

      <HStack mb={2} spacing={3}>  
        <Box color="green.600">  
          <FaMapMarkerAlt />  
        </Box>  
        <Text>{buyer.address}</Text>  
      </HStack>  

      <HStack mb={2} spacing={3}>  
        <Box color="green.600">  
          <FaPhone />  
        </Box>  
        <Text>{buyer.phone}</Text>  
      </HStack>  
    </Box>  
  );  
}