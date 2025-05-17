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
  useToast,
} from "@chakra-ui/react";

export default function ItemTypeAddEditModal({ isOpen, onClose, onSave, initialValue }) {
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  useEffect(() => {
    setInputValue(initialValue || "");
  }, [initialValue, isOpen]);

  const handleSave = () => {
    const val = inputValue.trim();
    if (!val) {
      toast({ title: "Input cannot be empty", status: "error", duration: 2000 });
      return;
    }
    onSave(val);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialValue ? "Edit Item Type" : "Add Item Type"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Item Type Name</FormLabel>
            <Input
              placeholder="Enter item type"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={handleSave} mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}