// src/components/Order/DharmKataName.jsx  
import React from "react";  
import { Box, FormControl, FormLabel } from "@chakra-ui/react";  
import CreatableSelect from "react-select/creatable";  

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
        <FormLabel>DharmKata Name</FormLabel>  
        <CreatableSelect  
          isClearable  
          options={DEFAULT_DHARMKATA}  
          onChange={handleChange}  
          value={selected}  
          placeholder="Select or create DharmKata..."  
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}  
        />  
      </FormControl>  
    </Box>  
  );  
}