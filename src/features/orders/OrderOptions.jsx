
import { VStack, Button, Box } from "@chakra-ui/react";  
import { useNavigate } from "react-router-dom";

export function OrderOptions() {  
  const navigate = useNavigate(); 
  const handleOptionClick = (option) => {  
    // alert("Selected option : "+option); 
    if(option == "DharmKata")  navigate("/create-order");
    if(option == "Bora")  alert("comming soon..");
    if(option == "truck-load") navigate("/truck-load");
  };  

  return (  
    <VStack mb={8} align="stretch" maxW={{ base: "100%", md: "320px" }}>  
      <Box display="flex" gap={4}>  
        <Button  
          colorScheme="blue"  
          flex={1} 
          padding={6} 
          onClick={() => handleOptionClick("DharmKata")}  
        >  
          धर्म कांटा  
        </Button>  
        <Button  
          colorScheme="purple"  
          flex={1}  
          padding={6} 
          onClick={() => handleOptionClick("Bora")}  
        >  
          खुदरा
        </Button>  
        <Button  
          colorScheme="green"  
          flex={1}  
          padding={6} 
          onClick={() => handleOptionClick("truck-load")}  
        >  
          ट्रक लोड
        </Button>  
      </Box> 
    </VStack>  
  );  
}  
