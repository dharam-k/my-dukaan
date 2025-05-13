import React from "react";  
import { Box, FormControl, FormLabel, Input, HStack, SimpleGrid, Box as ChakraBox } from "@chakra-ui/react";  
import DharmKataName from "./DharmKataName";  
import { FaRupeeSign, FaMoneyBillWave } from "react-icons/fa";  

export default function RateInput({  
  ratePerQuantal,  
  setRatePerQuantal,  
  poldariRate,  
  setPoldariRate,  
  dharmKata,  
  setDharmKata  
}) {  
  return (  
    <Box mt={4}>  
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>  
        <FormControl>  
          <FormLabel>  
            <HStack spacing={2}>  
              <ChakraBox color="green.600">  
                <FaRupeeSign />  
              </ChakraBox>  
              <Box>प्रति क्वांटल दर (100 किग्रा)</Box>  
            </HStack>  
          </FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter rate per quantal"  
            value={ratePerQuantal}  
            onChange={(e) => setRatePerQuantal(e.target.value)}  
          />  
        </FormControl>  

        <FormControl>  
          <FormLabel>  
            <HStack spacing={2}>  
              <ChakraBox color="orange.600">  
                <FaRupeeSign />  
              </ChakraBox>  
              <Box>पोलदारी भाव</Box>  
            </HStack>  
          </FormLabel>  
          <Input  
            type="number"  
            min="0"  
            placeholder="Enter poldari rate"  
            value={poldariRate}  
            onChange={(e) => setPoldariRate(e.target.value)}  
          />  
        </FormControl>  

        {/* DharmKataName already has icon, so just include it */}  
        <DharmKataName dharmKata={dharmKata} setDharmKata={setDharmKata} />  
      </SimpleGrid>  
    </Box>  
  );  
}