import React from "react";  
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";  
import CreatableSelect from "react-select/creatable";  
import { FaIdBadge } from "react-icons/fa";  

const DEFAULT_DHARMKATA = [  
  { value: "DharmKata A", label: "DharmKata A" },  
  { value: "DharmKata B", label: "DharmKata B" },  
  { value: "DharmKata C", label: "DharmKata C" },  
];  

export default function DharmKataName({ dharmKata, setDharmKata }) {  
  const selected = dharmKata ? { value: dharmKata, label: dharmKata } : null;  

  const handleChange = (selectedOption) => {  
    setDharmKata(selectedOption ? selectedOption.value : "");  
  };  

  return (  
    <Box>  
      <FormControl>  
        <FormLabel>  
          <HStack spacing={2}>  
            <Box color="teal.600">  
              <FaIdBadge />  
            </Box>  
            <Box>धर्म कांटा</Box>  
          </HStack>  
        </FormLabel>  
        <CreatableSelect  
          isClearable  
          options={DEFAULT_DHARMKATA}  
          onChange={handleChange}  
          value={selected}  
          placeholder="धर्म कांटा चुनें या बनाएँ..."  
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}  
        />  
      </FormControl>  
    </Box>  
  );  
}