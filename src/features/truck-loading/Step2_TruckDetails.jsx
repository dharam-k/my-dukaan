// src/features/truckLoading/Step2_TruckDetails.jsx
import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, HStack } from "@chakra-ui/react";

export default function Step2_TruckDetails({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.driverName) newErrors.driverName = "Driver name is required";
    if (!data.mobile || !/^\d{10}$/.test(data.mobile)) newErrors.mobile = "Valid 10-digit mobile required";
    if (!data.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext();
  };

  return (
    <Box>
      <FormControl isRequired mb={4} isInvalid={!!errors.driverName}>
        <FormLabel>Truck Driver Name</FormLabel>
        <Input
          placeholder="Enter driver name"
          value={data.driverName}
          onChange={(e) => onChange({ ...data, driverName: e.target.value })}
        />
        <FormErrorMessage>{errors.driverName}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!errors.mobile}>
        <FormLabel>Mobile Number</FormLabel>
        <Input
          placeholder="Enter 10-digit mobile"
          type="tel"
          value={data.mobile}
          onChange={(e) => onChange({ ...data, mobile: e.target.value })}
          maxLength={10}
        />
        <FormErrorMessage>{errors.mobile}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired mb={6} isInvalid={!!errors.address}>
        <FormLabel>Address</FormLabel>
        <Input
          placeholder="Enter driver address"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
        />
        <FormErrorMessage>{errors.address}</FormErrorMessage>
      </FormControl>

      <HStack spacing={4}>
        <Button onClick={onPrev}>Back</Button>
        <Button colorScheme="green" onClick={handleSubmit}>
          Save & Continue
        </Button>
      </HStack>
    </Box>
  );
}