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
  VStack,
  Box,
  Text,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import ItemTypeAddEditModal from "./ItemTypeAddEditModal";

export default function ItemTypeListModal({ isOpen, onClose }) {
  const [itemTypeList, setItemTypeList] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // null means add mode
  const toast = useToast();

  // Load from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem("itemTypes") || "[]");
      setItemTypeList(saved);
    }
  }, [isOpen]);

  // Save to localStorage helper
  const saveList = (list) => {
    setItemTypeList(list);
    localStorage.setItem("itemTypes", JSON.stringify(list));
  };

  // Delete handler
  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this item type?");
    if (!confirmed) return;
    const newList = [...itemTypeList];
    newList.splice(index, 1);
    saveList(newList);
    toast({ title: "Deleted successfully", status: "success", duration: 2000 });
  };

  // Add or edit handler from modal
  const handleAddEdit = (value) => {
    if (editItem !== null) {
      // edit mode
      const newList = [...itemTypeList];
      newList[editItem] = value;
      saveList(newList);
      toast({ title: "Updated successfully", status: "success", duration: 2000 });
    } else {
      // add mode
      saveList([...itemTypeList, value]);
      toast({ title: "Added successfully", status: "success", duration: 2000 });
    }
    setAddEditModalOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Item Types (Total: {itemTypeList.length})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {itemTypeList.length === 0 ? (
              <Text>No item types available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {itemTypeList.map((item, i) => (
                  <Box
                    key={i}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text>{item}</Text>
                    <HStack spacing={1}>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        size="sm"
                        onClick={() => {
                          setEditItem(i);
                          setAddEditModalOpen(true);
                        }}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(i)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              onClick={() => {
                setEditItem(null);
                setAddEditModalOpen(true);
              }}
            >
              Add Item Type
            </Button>
            <Button ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Modal */}
      <ItemTypeAddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditItem(null);
        }}
        onSave={handleAddEdit}
        initialValue={editItem !== null ? itemTypeList[editItem] : ""}
      />
    </>
  );
}