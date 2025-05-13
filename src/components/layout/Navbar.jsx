import {  
  Box,  
  Flex,  
  Text,  
  useBreakpointValue,  
  IconButton,  
} from "@chakra-ui/react";  
import { useState } from "react";  
import { FaUserCircle } from "react-icons/fa";  

export default function Navbar({ onOpenUserMenu }) {  
  const welcomeFontSize = useBreakpointValue({ base: "md", md: "xl" });  
  const [buyerName] = useState("Jai Hanuman Traders");  

  return (  
    <Box p={{ base: 4, md: 8 }} maxWidth={{ base: 300, md: 600 }}>  
      <Flex direction="row" align="center" mb={6}>  
        {/* User icon with border and circle */}  
        <IconButton  
          icon={<FaUserCircle />}  
          aria-label="User Profile Menu"  
          variant="ghost"  
          fontSize="3xl"  
          mr={4}  
          onClick={onOpenUserMenu}  
          title="Open User Profile Menu"  
          border="2px solid"  
          borderColor="green.500"  
          borderRadius="full"  
          p={1}  
          _hover={{  
            bg: "green.50",  
            borderColor: "green.600",  
            color: "green.600",  
          }}  
          size="lg"  
        />  

        {/* Welcome Text */}  
        <Text fontSize={welcomeFontSize} fontWeight="medium" whiteSpace="nowrap">  
          Welcome, <strong>{buyerName}</strong>!  
        </Text>  
      </Flex>  
    </Box>  
  );  
}