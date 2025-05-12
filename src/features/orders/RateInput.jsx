// src/components/Order/RateInput.jsx  
import React from "react";  
import { Box, FormControl, FormLabel, Input, HStack, SimpleGrid } from "@chakra-ui/react";  
import DharmKataName from "./DharmKataName";

export default function RateInput({ ratePerQuantal, setRatePerQuantal, poldariRate, setPoldariRate , dharmKata,  
  setDharmKata }) {  
  return (  
    <Box mt={4}>  
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>  
        <FormControl>  
          <FormLabel>Rate per Quantal(100kg)</FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter rate per quantal"  
            value={ratePerQuantal}  
            onChange={(e) => setRatePerQuantal(e.target.value)}  
          />  
        </FormControl>  

        <FormControl>  
          <FormLabel>Poldari Rate(Rs)</FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter poldari rate"  
            value={poldariRate}  
            onChange={(e) => setPoldariRate(e.target.value)}  
          />  
        </FormControl>  
        {/* DharmKata Name creatable select */}  
        <DharmKataName dharmKata={dharmKata} setDharmKata={setDharmKata} />  
      </SimpleGrid>  
    </Box>  
  );  
}