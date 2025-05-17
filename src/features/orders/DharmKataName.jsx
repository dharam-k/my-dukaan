import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import CreatableSelect from "react-select/creatable";
import { FaIdBadge } from "react-icons/fa";

export default function DharmKataName({ dharmKata, setDharmKata }) {
  const [options, setOptions] = useState([]);

  // Load dharmakatas from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dharmakatas") || "[]");
    if (Array.isArray(stored) && stored.length > 0) {
      const opts = stored.map((d) => ({ value: d, label: d }));
      setOptions(opts);
    }
  }, []);

  // Update localStorage and options state when a new dharmkata is created
  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };

    // Avoid duplicates
    if (!options.find((opt) => opt.value === inputValue)) {
      const newOptions = [...options, newOption];
      setOptions(newOptions);
      localStorage.setItem(
        "dharmakatas",
        JSON.stringify(newOptions.map((opt) => opt.value))
      );
    }
    setDharmKata(inputValue);
  };

  const selected = dharmKata ? { value: dharmKata, label: dharmKata } : null;

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setDharmKata(selectedOption.value);
    } else {
      setDharmKata("");
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>
          <HStack spacing={2}>
            <Box color="teal.600">
              <FaIdBadge />
            </Box>
            <Box>धर्म कांटा</Box>
          </HStack>
        </FormLabel>
        <CreatableSelect
          isClearable
          options={options}
          onChange={handleChange}
          onCreateOption={handleCreate}
          value={selected}
          placeholder="धर्म कांटा चुनें या बनाएँ..."
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}
        />
      </FormControl>
    </Box>
  );
}