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

import { addSeller, updateSeller } from "../../services/users/SellerService";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setEmail(initialData.email || "");
      setPassword("");
    } else {
      setName("");
      setPhone("");
      setAddress("");
      setEmail("");
      setPassword("");
    }
  }, [initialData]);

  const handleGeneratePassword = () => {
    setPassword(generateRandomPassword());
  };

  const handleSave = async () => {
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
    if (!email.trim()) {
      toast({ title: "Email is required", status: "error", duration: 2000 });
      return;
    }

    if (!initialData && !password.trim()) {
      toast({ title: "Password is required", status: "error", duration: 2000 });
      return;
    }

    setLoading(true);
    try {
      const sellerData = { name, phone, address, email };
      if (password.trim()) {
        sellerData.password = password;
      }

      if (initialData && initialData?.id) {
        await updateSeller(initialData.id, sellerData);
        toast({
          title: "Seller updated successfully",
          status: "success",
          duration: 2000,
        });
      } else {
        await addSeller(sellerData);
        toast({
          title: "Seller added successfully",
          status: "success",
          duration: 2000,
        });
      }

      await onSave(sellerData); // Wait for parent to reload list
      // Do NOT call onClose here — parent controls modal visibility.

    } catch (error) {
      console.error("Error saving seller:", error);
      toast({
        title: "Failed to save seller",
        description: error.message || "Please try again later",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? "Edit Seller" : "Add Seller"}</ModalHeader>
        <ModalCloseButton isDisabled={loading} />
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter seller name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              isDisabled={loading}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isDisabled={loading}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={loading}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              isDisabled={loading}
            />
          </FormControl>
          <FormControl mb={3} isRequired={!initialData}>
            <FormLabel>
              Password {initialData ? "(optional - leave empty to keep current)" : ""}
            </FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                isDisabled={loading}
                autoComplete="new-password"
              />
              <InputRightElement width="4.5rem">
                <Button size="sm" onClick={handleGeneratePassword} isDisabled={loading}>
                  Generate
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSave} isLoading={loading}>
            Save
          </Button>
          <Button onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}