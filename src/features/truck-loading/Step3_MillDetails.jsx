// src/features/truckLoading/Step3_MillDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  HStack,
  Text,
  Select,
} from "@chakra-ui/react";

export default function Step3_MillDetails({ data, onChange, onNext, onPrev }) {
  const [mills, setMills] = useState([]);
  const [errors, setErrors] = useState({});

  // Load mills from localStorage once on mount
  useEffect(() => {
    const storedMills = JSON.parse(localStorage.getItem("mills") || "[]");
    if (Array.isArray(storedMills)) {
      // Ensure mill ids are strings for consistent matching
      const normalized = storedMills.map((m) => ({ ...m, id: String(m.id) }));
      setMills(normalized);
    } else {
      setMills([]);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!data.id) newErrors.id = "Please select a mill";
    if (!data.ratePerQuintal || Number(data.ratePerQuintal) <= 0)
      newErrors.ratePerQuintal = "Enter valid rate per quintal";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler when a mill is selected from dropdown
  const onMillSelect = (id) => {
    const selectedMill = mills.find((mill) => mill.id === id);
    // Debug log, remove in production
    // console.log("Selected mill:", selectedMill);
    if (selectedMill) {
      onChange({
        ...data,
        id: selectedMill.id,
        name: selectedMill.millName,
        mobile: selectedMill.mobile,
        address: selectedMill.address,
        gstn: selectedMill.gstn,
        ratePerQuintal: data.ratePerQuintal || "",
      });
    } else {
      // Reset mill info when no mill selected
      onChange({
        id: "",
        name: "",
        mobile: "",
        address: "",
        gstn: "",
        ratePerQuintal: data.ratePerQuintal || "",
      });
    }
  };

  const handleSubmit = () => {
    if (validate()) onNext();
  };

  return (
    <Box>
      <FormControl mb={4} isInvalid={!!errors.id} isRequired>
        <FormLabel>Mill Name (Select)</FormLabel>
        <Select
          placeholder="Select mill"
          value={data.id || ""}
          onChange={(e) => onMillSelect(e.target.value)}
          size="md"
          maxW="100%"
        >
          {mills.length > 0 ? (
            mills.map((mill) => (
              <option key={mill.id} value={mill.id}>
                {mill.millName}
              </option>
            ))
          ) : (
            <option disabled>No mills found</option>
          )}
        </Select>
        <FormErrorMessage>{errors.id}</FormErrorMessage>
      </FormControl>

      {data.id && (
        <>
          <Text mb={2} fontWeight="bold">
            Mill Details:
          </Text>
          <Text>
            <strong>Name:</strong> {data.name}
          </Text>
          <Text>
            <strong>Mobile:</strong> {data.mobile}
          </Text>
          <Text>
            <strong>Address:</strong> {data.address}
          </Text>
          <Text>
            <strong>GSTN:</strong> {data.gstn ? data.gstn : "N/A"}
          </Text>
        </>
      )}

      <FormControl mt={4} isInvalid={!!errors.ratePerQuintal} isRequired>
        <FormLabel>Rate per Quintal (₹)</FormLabel>
        <Input
          type="number"
          placeholder="Enter rate per quintal"
          value={data.ratePerQuintal}
          onChange={(e) => onChange({ ...data, ratePerQuintal: e.target.value })}
          min={0}
        />
        <FormErrorMessage>{errors.ratePerQuintal}</FormErrorMessage>
      </FormControl>

      <HStack spacing={4} mt={6}>
        <Button onClick={onPrev}>Back</Button>
        <Button colorScheme="green" onClick={handleSubmit}>
          Save & Continue
        </Button>
      </HStack>
    </Box>
  );
}