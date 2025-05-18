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

import { addMill } from "../../services/mills/MillService";  // adjust path if needed

export default function MillProfileFormModal({ isOpen, onClose }) {
  const [millName, setMillName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [gstn, setGstn] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) {
      setMillName("");
      setAddress("");
      setMobile("");
      setGstn("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!millName.trim() || !address.trim() || !mobile.trim()) {
      toast({
        title: "Please fill all required fields",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await addMill({
        millName: millName.trim(),
        address: address.trim(),
        mobile: mobile.trim(),
        gstn: gstn.trim() || null,
      });

      toast({
        title: "Mill profile saved!",
        status: "success",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Failed to save mill", error);
      toast({
        title: "Failed to save mill. Please try again.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
                isDisabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                isDisabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
                isDisabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>GSTN (Optional)</FormLabel>
              <Input
                value={gstn}
                onChange={(e) => setGstn(e.target.value)}
                placeholder="GSTN"
                isDisabled={loading}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Saving"
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}