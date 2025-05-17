import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import Select from "react-select"; // <- change here from creatable to regular Select
import { FaTag } from "react-icons/fa";
import { hindiDictionary } from "../../utils/constants";

export default function ItemType({ itemType, setItemType }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const storedItemTypes = JSON.parse(localStorage.getItem("itemTypes") || "[]");
    if (Array.isArray(storedItemTypes) && storedItemTypes.length > 0) {
      const mappedOptions = storedItemTypes.map((eng) => ({
        eng,
        hin: hindiDictionary[eng] || eng, // fallback to English if Hindi not found
      }));
      setOptions(mappedOptions);
    } else {
      setOptions([]);
    }
  }, []);

  const selectedItem = itemType
    ? (() => {
        const found = options.find(({ eng }) => eng === itemType);
        return found ? { label: found.hin, value: found.hin } : { label: itemType, value: itemType };
      })()
    : null;

  const handleItemTypeChange = (selectedOption) => {
    if (selectedOption) {
      const found = options.find(({ hin }) => hin === selectedOption.value);
      setItemType(found ? found.eng : selectedOption.value);
    } else {
      setItemType("");
    }
  };

  return (
    <Box mt={4}>
      <FormControl mb={4}>
        <FormLabel>
          <HStack spacing={2}>
            <Box color="cyan.600">
              <FaTag />
            </Box>
            <Box>वस्तु का प्रकार</Box>
          </HStack>
        </FormLabel>
        <Select
          isClearable
          options={options.map(({ hin }) => ({ label: hin, value: hin }))}
          onChange={handleItemTypeChange}
          value={selectedItem}
          placeholder="वस्तु का प्रकार चुनें..."
        />
      </FormControl>
    </Box>
  );
}