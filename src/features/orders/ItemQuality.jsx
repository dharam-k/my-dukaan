import React from "react";  
import { Box, FormControl, FormLabel, Select, HStack } from "@chakra-ui/react";  
import { FaStar } from "react-icons/fa";  

export default function ItemQuality({  
  quality,  
  setQuality,  
}) {  
  return (  
    <FormControl>  
      <FormLabel>  
        <HStack spacing={2}>  
          <Box color="yellow.500">  
            <FaStar />  
          </Box>  
          <Box>Quality</Box>  
        </HStack>  
      </FormLabel>  
      <Select  
        placeholder="Select quality"  
        value={quality}  
        onChange={(e) => setQuality(e.target.value)}  
      >  
        <option value="Bad">Bad</option>  
        <option value="Avg">Avg</option>  
        <option value="Good">Good</option>  
      </Select>  
    </FormControl>  
  );  
}