import React from "react";  
import { Box, FormControl, FormLabel, Input, SimpleGrid, HStack } from "@chakra-ui/react";  
import { FaWeight, FaBoxes, FaUsers } from "react-icons/fa";  

export default function WeightInputs({  
  totalWeight,  
  setTotalWeight,  
  totalItem,  
  setTotalItem,  
  totalPoldar,  
  setTotalPoldar,  
}) {  
  return (  
    <Box mt={4}>  
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>  
        <FormControl>  
          <FormLabel>  
            <HStack spacing={2}>  
              <Box color="teal.500">  
                <FaWeight />  
              </Box>  
              <Box> कुल वजन (kg)</Box>  
            </HStack>  
          </FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter total weight"  
            value={totalWeight}  
            onChange={(e) => setTotalWeight(e.target.value)}  
          />  
        </FormControl>  

        <FormControl>  
          <FormLabel>  
            <HStack spacing={2}>  
              <Box color="orange.500">  
                <FaBoxes />  
              </Box>  
              <Box>कुल बोरा</Box>  
            </HStack>  
          </FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter total items"  
            value={totalItem}  
            onChange={(e) => setTotalItem(e.target.value)}  
          />  
        </FormControl>  

        <FormControl>  
          <FormLabel>  
            <HStack spacing={2}>  
              <Box color="purple.500">  
                <FaUsers />  
              </Box>  
              <Box>कुल पोल्डर</Box>  
            </HStack>  
          </FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter total poldar"  
            value={totalPoldar}  
            onChange={(e) => setTotalPoldar(e.target.value)}  
          />  
        </FormControl>  
      </SimpleGrid>  
    </Box>  
  );  
}