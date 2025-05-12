// src/components/Order/WarehouseSelect.jsx  
import React from "react";  
import { Box, FormControl, FormLabel } from "@chakra-ui/react";  
import CreatableSelect from "react-select/creatable";  

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
        <FormLabel>Warehouse</FormLabel>  
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