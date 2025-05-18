import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import Select from "react-select";
import { FaWarehouse } from "react-icons/fa";
import { fetchWarehouses } from "../../services/stock-maitain/WarehouseService";

export default function WarehouseSelect({ warehouse, setWarehouse }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function loadWarehouses() {
      try {
        const warehousesFromDb = await fetchWarehouses();
        // Assuming warehousesFromDb = [{ id, name }]
        const opts = warehousesFromDb.map((w) => ({ value: w.name, label: w.name }));
        setOptions(opts);
      } catch (error) {
        console.error("Failed to fetch warehouses from Firestore:", error);
        setOptions([]);
      }
    }
    loadWarehouses();
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