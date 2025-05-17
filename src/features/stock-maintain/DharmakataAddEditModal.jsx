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

export default function DharmakataAddEditModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
}) {
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
        <ModalHeader>{initialValue ? "Edit Dharmakata" : "Add Dharmakata"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Dharmakata Name</FormLabel>
            <Input
              placeholder="Enter dharmakata"
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