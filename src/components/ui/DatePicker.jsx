import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useState } from 'react'

const todayDate = new Date().toISOString().slice(0, 10); // yyyy-mm-dd  

export const DatePicker = () => {
  const [orderDate, setOrderDate] = useState(todayDate);  
  return (
    <Box> 
      <FormControl>  
        <FormLabel>Date</FormLabel>  
        <Input  
          type="date"  
          value={orderDate}  
          onChange={(e) => setOrderDate(e.target.value)}  
          max={todayDate}  
        />  
      </FormControl> 
    </Box>
  )
}
