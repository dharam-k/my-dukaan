import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";

export default function MillProfileFormModal({ isOpen, onClose }) {
  const [millName, setMillName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [gstn, setGstn] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) {
      setMillName("");
      setAddress("");
      setMobile("");
      setGstn("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!millName.trim() || !address.trim() || !mobile.trim()) {
      toast({
        title: "Please fill all required fields",
        status: "error",
        duration: 2000,
        position:"top-right",
        isClosable: true,
      });
      return;
    }

    const mills = JSON.parse(localStorage.getItem("mills")) || [];
    mills.push({
      id: Date.now(),
      millName: millName.trim(),
      address: address.trim(),
      mobile: mobile.trim(),
      gstn: gstn.trim() || null,
    });
    localStorage.setItem("mills", JSON.stringify(mills));

    toast({
      title: "Mill profile saved!",
      status: "success",
      duration: 2000,
      position:"top-right",
      isClosable: true,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Mill</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Mill Name</FormLabel>
              <Input
                value={millName}
                onChange={(e) => setMillName(e.target.value)}
                placeholder="Mill Name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>GSTN (Optional)</FormLabel>
              <Input
                value={gstn}
                onChange={(e) => setGstn(e.target.value)}
                placeholder="GSTN"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}