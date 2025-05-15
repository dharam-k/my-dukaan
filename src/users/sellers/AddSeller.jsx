// src/components/Sellers/AddSeller.jsx  
import React from "react";  
import {  
  Box,  
  VStack,  
  FormControl,  
  FormLabel,  
  Input,  
  Button,  
} from "@chakra-ui/react";  

export default function AddSeller({  
  newSeller,  
  setNewSeller,  
  onSave,  
  onCancel,  
}) {  
  const handleChange = (field, value) => {  
    setNewSeller((prev) => ({ ...prev, [field]: value }));  
  };  

  return (  
    <Box p={4} borderWidth="1px" borderRadius="md" bg="yellow.50" mt={4}>  
      <VStack spacing={3} align="stretch">  
        <FormControl isRequired>  
          <FormLabel>Name</FormLabel>  
          <Input  
            value={newSeller.name}  
            onChange={(e) => handleChange("name", e.target.value)}  
          />  
        </FormControl>  
        <FormControl>  
          <FormLabel>Address</FormLabel>  
          <Input  
            value={newSeller.address}  
            onChange={(e) => handleChange("address", e.target.value)}  
          />  
        </FormControl>  
        <FormControl>  
          <FormLabel>Phone</FormLabel>  
          <Input  
            value={newSeller.phone}  
            onChange={(e) => handleChange("phone", e.target.value)}  
          />  
        </FormControl>  
        <Button colorScheme="green" onClick={onSave}>  
          Save Seller  
        </Button>  
        <Button variant="ghost" onClick={onCancel}>  
          Cancel  
        </Button>  
      </VStack>  
    </Box>  
  );  
}