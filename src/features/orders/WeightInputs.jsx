// src/components/Order/WeightInputs.jsx  
import React from "react";  
import { Box, FormControl, FormLabel, Input, SimpleGrid } from "@chakra-ui/react";  

export default function WeightInputs({ totalWeight, setTotalWeight, totalItem, setTotalItem,  totalPoldar,  
  setTotalPoldar }) {  
  return (  
    <Box mt={4}>  
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>  
        <FormControl>  
          <FormLabel>Total Weight (kg)</FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter total weight"  
            value={totalWeight}  
            onChange={(e) => setTotalWeight(e.target.value)}  
          />  
        </FormControl>  
        <FormControl>  
          <FormLabel>Total Item</FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter total items"  
            value={totalItem}  
            onChange={(e) => setTotalItem(e.target.value)}  
          />  
        </FormControl>
        <FormControl>  
          <FormLabel>Total Poldar</FormLabel>  
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