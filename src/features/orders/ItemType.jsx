import React from "react";  
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";  
import CreatableSelect from "react-select/creatable";  
import { FaTag } from "react-icons/fa";  

const options = [  
  { eng: "Mansoori Dhaan", hin: "मंसूरीधान" },  
  { eng: "Mota Dhaan", hin: "मोटाधान" },  
  { eng: "Sambha Dhaan", hin: "संभांधान" },  
  { eng: "Gehu", hin: "गेहूँ" },  
  { eng: "Makka", hin: "मक्का" },  
  { eng: "Sarso", hin: "सरसों" },  
  { eng: "Rice", hin: "चावल" },  
];  

const SELECT_OPTIONS = options.map(({ eng, hin }) => ({ label: hin, value: hin })); 

export default function ItemType({  
  itemType,  
  setItemType,   
}) {  

 // Show Hindi label and value for selected English itemType  
  const selectedItem = itemType  
    ? (() => {  
        const found = options.find(({ eng }) => eng === itemType);  
        return found ? { label: found.hin, value: found.hin } : { label: itemType, value: itemType };  
      })()  
    : null;  

  const handleItemTypeChange = (selectedOption) => {  
    if (selectedOption) {  
      const found = options.find(({ hin }) => hin === selectedOption.value);  
      setItemType(found ? found.eng : selectedOption.value); // store English internally  
    } else {  
      setItemType("");  
    }  
  };  

  return (  
    <Box mt={4}>  
      <FormControl mb={4}>  
        <FormLabel>  
          <HStack spacing={2}>  
            <Box color="cyan.600"><FaTag /></Box>  
            <Box>वस्तु का प्रकार</Box>  
          </HStack>  
        </FormLabel>  
        <CreatableSelect  
          isClearable  
          options={SELECT_OPTIONS}  
          onChange={handleItemTypeChange}  
          value={selectedItem}  
          placeholder="वस्तु का प्रकार चुनें या बनाएँ..."  
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}  
        />  
      </FormControl>  
    </Box>  
  );  
}