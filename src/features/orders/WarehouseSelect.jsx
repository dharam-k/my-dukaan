import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import Select from "react-select"; // use regular Select, no creation
import { FaWarehouse } from "react-icons/fa";

export default function WarehouseSelect({ warehouse, setWarehouse }) {
  const [options, setOptions] = useState([]);

  // Load warehouse names from localStorage on mount
  useEffect(() => {
    const storedWarehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");
    if (Array.isArray(storedWarehouses) && storedWarehouses.length > 0) {
      const opts = storedWarehouses.map((w) => ({ value: w, label: w }));
      setOptions(opts);
    } else {
      setOptions([]);
    }
  }, []);

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
            <Box>गोदाम</Box>
          </HStack>
        </FormLabel>
        <Select
          isClearable
          options={options}
          onChange={handleChange}
          value={selectedWarehouse}
          placeholder="गोदाम चुनें..."
        />
      </FormControl>
    </Box>
  );
}