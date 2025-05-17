import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormHelperText,
  FormErrorMessage,
  HStack,
} from "@chakra-ui/react";
import { hindiDictionary } from "../../utils/constants"; // your dictionary import

const truckNumberRegex = /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/;

export default function Step1_TruckEntry({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});
  const [itemTypes, setItemTypes] = useState([]);

  useEffect(() => {
    const storedItemTypes = JSON.parse(localStorage.getItem("itemTypes") || "[]");
    if (Array.isArray(storedItemTypes) && storedItemTypes.length > 0) {
      const mappedTypes = storedItemTypes.map((eng) => ({
        value: eng,
        label: `${hindiDictionary[eng] || eng} (${eng})`,
      }));
      setItemTypes(mappedTypes);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!data.truckNumber || !truckNumberRegex.test(data.truckNumber.toUpperCase())) {
      newErrors.truckNumber = "Invalid truck number format (e.g. UP16AQ8243)";
    }
    if (!data.itemType) {
      newErrors.itemType = "Please select an item type";
    }
    if (!data.billNo) {
      newErrors.billNo = "Please enter or generate Bill No.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext();
  };

  const generateBillNo = () => {
    onChange({ ...data, billNo: `BILL-${Date.now()}` });
  };

  return (
    <Box>
      <FormControl isRequired mb={4} isInvalid={!!errors.truckNumber}>
        <FormLabel>Truck Number</FormLabel>
        <Input
          placeholder="Enter truck number e.g. UP16AQ8243"
          value={data.truckNumber}
          onChange={(e) => onChange({ ...data, truckNumber: e.target.value.toUpperCase() })}
        />
        <FormErrorMessage>{errors.truckNumber}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired mb={4} isInvalid={!!errors.itemType}>
        <FormLabel>Item Type</FormLabel>
        <Select
          placeholder="Select item type"
          value={data.itemType}
          onChange={(e) => onChange({ ...data, itemType: e.target.value })}
        >
          {itemTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.itemType}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Loading Date</FormLabel>
        <Input
          type="date"
          value={data.loadingDate}
          onChange={(e) => onChange({ ...data, loadingDate: e.target.value })}
          max={new Date().toISOString().slice(0, 10)}
        />
        <FormHelperText>Defaults to today</FormHelperText>
      </FormControl>

      <FormControl isRequired mb={6} isInvalid={!!errors.billNo}>
        <FormLabel>Bill No</FormLabel>
        <HStack>
          <Input
            placeholder="Enter Bill No or generate"
            value={data.billNo}
            onChange={(e) => onChange({ ...data, billNo: e.target.value })}
          />
          <Button onClick={generateBillNo} colorScheme="green">
            Generate
          </Button>
        </HStack>
        <FormErrorMessage>{errors.billNo}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="green" onClick={handleSubmit}>
        Start Loading Process
      </Button>
    </Box>
  );
}