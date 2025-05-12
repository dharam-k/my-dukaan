import React from "react";  
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";  
import CreatableSelect from "react-select/creatable";  
import { FaWarehouse } from "react-icons/fa";  

const DEFAULT_WAREHOUSES = [  
  { value: "Katye", label: "Katye" },  
  { value: "Banakata", label: "Banakata" },  
  { value: "Bhore", label: "Bhore" },  
];  

export default function WarehouseSelect({ warehouse, setWarehouse }) {  
  const selectedWarehouse = warehouse ? { value: warehouse, label: warehouse } : null;  

  const handleChange = (selectedOption) => {  
    setWarehouse(selectedOption ? selectedOption.value : "");  
  };  

  return (  
    <Box>  
      <FormControl>  
        <FormLabel>  
          <HStack spacing={2}>  
            <Box color="blue.500">  
              <FaWarehouse />  
            </Box>  
            <Box>Warehouse</Box>  
          </HStack>  
        </FormLabel>  
        <CreatableSelect  
          isClearable  
          options={DEFAULT_WAREHOUSES}  
          onChange={handleChange}  
          value={selectedWarehouse}  
          placeholder="Select or create warehouse..."  
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}  
        />  
      </FormControl>  
    </Box>  
  );  
}