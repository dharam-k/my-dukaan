import { Box, Button, Flex, Heading, Spacer, Text, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Navbar() { 
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });  
  const welcomeFontSize = useBreakpointValue({ base: "md", md: "xl" });  
  const [buyerName] = useState("John Doe");  
  const navigate = useNavigate();  


  const handleLogout = () => {  
    // Clear auth tokens if needed here  
    navigate("/login");  
  }; 
  
  
  return <>
      <Box p={{ base: 4, md: 8 }} maxWidth={{ base: 300, md: 400 }}>
          <Flex direction={{ base: "column", md: "row" }} align="center" mb={6}>  
            <Heading size={headingSize}>Buyer Dashboard</Heading>  
            <Spacer />  
            <Button  
              colorScheme="green"  
              variant="outline"  
              mt={{ base: 4, md: 0 }}  
              width={{ base: "100%", md: "auto" }}  
              onClick={handleLogout}  
            >  
              Logout  
            </Button>  
          </Flex>  
    
          {/* Welcome Text */}  
          <Text fontSize={welcomeFontSize} mb={6}>  
            Welcome back, <strong>{buyerName}</strong>!  
          </Text>  
      </Box>
  </>
}