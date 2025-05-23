import React from "react";  
import { Box, Text, HStack } from "@chakra-ui/react";  
import { FaUser, FaMapMarkerAlt, FaPhone } from "react-icons/fa";  

export default function SellerCardDetail({ seller }) {  
  if (!seller) return null;  

  return (  
    <Box minW={'51%'} flex="1">  
      <Text fontSize="lg" fontWeight="bold" mb={2}>  
        विक्रेता विवरण
      </Text>  

      <HStack mb={1} spacing={2}>  
        <Box color="blue.500">  
          <FaUser />  
        </Box>  
        <Text>{seller.name || "Unknown Seller"}</Text>  
      </HStack>  

      <HStack mb={1} spacing={2}>  
        <Box color="green.500">  
          <FaMapMarkerAlt />  
        </Box>  
        <Text>{seller.address || "-"}</Text>  
      </HStack>  

      <HStack mb={1} spacing={2}>  
        <Box color="purple.500">  
          <FaPhone />  
        </Box>  
        <Text>{seller.phone || "-"}</Text>  
      </HStack>  
    </Box>  
  );  
}