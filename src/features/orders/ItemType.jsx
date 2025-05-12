import React from "react";  
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";  
import CreatableSelect from "react-select/creatable";  
import { FaTag } from "react-icons/fa";  

const DEFAULT_OPTIONS = [  
  { value: "Mansoori Dhaan", label: "Mansoori Dhaan" },  
  { value: "Mota Dhaan", label: "Mota Dhaan" },  
  { value: "Sambha Dhaan", label: "Sambha Dhaan" },  
  { value: "Gehu", label: "Gehu" },  
  { value: "Makka", label: "Makka" },  
  { value: "Sarso", label: "Sarso" },  
  { value: "Rice", label: "Rice" },  
];  

export default function ItemType({  
  itemType,  
  setItemType,   
}) {  
  const selectedItem = itemType  
    ? { value: itemType, label: itemType }  
    : null;  

  const handleItemTypeChange = (selectedOption) => {  
    setItemType(selectedOption ? selectedOption.value : "");  
  };  

  return (  
    <Box mt={4}>  
      <FormControl mb={4}>  
        <FormLabel>  
          <HStack spacing={2}>  
            <Box color="cyan.600"><FaTag /></Box>  
            <Box>Type of Item</Box>  
          </HStack>  
        </FormLabel>  
        <CreatableSelect  
          isClearable  
          options={DEFAULT_OPTIONS}  
          onChange={handleItemTypeChange}  
          value={selectedItem}  
          placeholder="Select or create item type..."  
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}  
        />  
      </FormControl>  
    </Box>  
  );  
}