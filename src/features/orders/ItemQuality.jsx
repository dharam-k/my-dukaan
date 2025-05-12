// src/components/Order/ItemTypeQuality.jsx  

import React from "react";  
import { Box, FormControl, FormLabel, Select } from "@chakra-ui/react"; 
 

export default function ItemQuality({  
  quality,  
  setQuality,  
}) {  
  // react-select expects value as object {value,label}  
 

  return (  
    
      <FormControl>  
        <FormLabel>Quality</FormLabel>  
        <Select  
          placeholder="Select quality"  
          value={quality}  
          onChange={(e) => setQuality(e.target.value)}  
        >  
          <option value="Bad">Bad</option>  
          <option value="Avg">Avg</option>  
          <option value="Good">Good</option>  
        </Select>  
      </FormControl>  
    
  );  
}