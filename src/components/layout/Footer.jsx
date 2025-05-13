import React from "react";  
import { Box, Text, Link, HStack, VStack, StackDivider } from "@chakra-ui/react";  

export default function Footer() {  
  return (  
    <Box  
      as="footer"  
      bg="green.600"  
      color="white"  
      py={4}  
      mt={10}  
      textAlign="center"
      maxWidth={800}  
      minWidth={{base: 330, md: 1000}}
    >  
      <VStack spacing={2}>  
        <Text fontSize="sm">  
          &copy; {new Date().getFullYear()} My Dukaan. All rights reserved.  
        </Text>  
        <HStack spacing={4} divider={<StackDivider borderColor="whiteAlpha.600" />}>  
          <Link fontSize="sm" href="#" _hover={{ textDecoration: "underline" }}>  
            Privacy Policy  
          </Link>  
          <Link fontSize="sm" href="#" _hover={{ textDecoration: "underline" }}>  
            Terms of Service  
          </Link>  
          <Link fontSize="sm" href="#" _hover={{ textDecoration: "underline" }}>  
            Contact Us  
          </Link>  
        </HStack>  
      </VStack>  
    </Box>  
  );  
}