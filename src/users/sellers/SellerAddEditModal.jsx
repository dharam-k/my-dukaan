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
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

function generateRandomPassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default function SellerAddEditModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setPassword(initialData.password || "");
    } else {
      setName("");
      setPhone("");
      setAddress("");
      setPassword("");
    }
  }, [initialData, isOpen]);

  const handleGeneratePassword = () => {
    setPassword(generateRandomPassword());
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "Name is required", status: "error", duration: 2000 });
      return;
    }
    if (!phone.trim()) {
      toast({ title: "Phone is required", status: "error", duration: 2000 });
      return;
    }
    if (!address.trim()) {
      toast({ title: "Address is required", status: "error", duration: 2000 });
      return;
    }
    if (!password.trim()) {
      toast({ title: "Password is required", status: "error", duration: 2000 });
      return;
    }

    onSave({ name, phone, address, password });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? "Edit Seller" : "Add Seller"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter seller name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
              />
              <InputRightElement width="4.5rem">
                <Button size="sm" onClick={handleGeneratePassword}>
                  Generate
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}