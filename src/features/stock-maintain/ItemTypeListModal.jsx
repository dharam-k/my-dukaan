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

import {
  fetchItemTypes,
  addItemType,
  updateItemType,
  deleteItemType,
} from "../../services/stock-maitain/ItemTypeService";

export default function ItemTypeListModal({ isOpen, onClose }) {
  const [itemTypeList, setItemTypeList] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) loadItemTypes();
  }, [isOpen]);

  async function loadItemTypes() {
    setLoading(true);
    try {
      const itemTypes = await fetchItemTypes();
      setItemTypeList(itemTypes);
    } catch (error) {
      console.error("Failed to load item types:", error);
      toast({
        title: "Failed to load item types",
        status: "error",
        duration: 3000,
      });
      setItemTypeList([]);
    }
    setLoading(false);
  }

  const handleDelete = async (index) => {
    const item = itemTypeList[index];
    const confirmed = window.confirm(`Are you sure you want to delete "${item.name}"?`);
    if (!confirmed) return;

    try {
      await deleteItemType(item.id);
      const newList = itemTypeList.filter((_, i) => i !== index);
      setItemTypeList(newList);
      toast({
        title: "Deleted successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Delete failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleAddEdit = async (value) => {
    if (!value || value.trim() === "") {
      toast({
        title: "Name cannot be empty",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    if (editIndex !== null) {
      // Edit mode
      const itemToUpdate = itemTypeList[editIndex];
      try {
        await updateItemType(itemToUpdate.id, { name: value });
        const newList = [...itemTypeList];
        newList[editIndex] = { ...itemToUpdate, name: value };
        setItemTypeList(newList);
        toast({
          title: "Updated successfully",
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Update failed:", error);
        toast({
          title: "Update failed",
          status: "error",
          duration: 3000,
        });
      }
    } else {
      // Add mode
      try {
        const newItem = await addItemType({ name: value });
        setItemTypeList([...itemTypeList, newItem]);
        toast({
          title: "Added successfully",
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Add failed:", error);
        toast({
          title: "Add failed",
          status: "error",
          duration: 3000,
        });
      }
    }

    setAddEditModalOpen(false);
    setEditIndex(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Item Types (Total: {itemTypeList.length})</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Text>Loading...</Text>
            ) : itemTypeList.length === 0 ? (
              <Text>No item types available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {itemTypeList.map((item, i) => (
                  <Box
                    key={item.id}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text>{item.name}</Text>
                    <HStack spacing={1}>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        size="sm"
                        onClick={() => {
                          setEditIndex(i);
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
                setEditIndex(null);
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

      <ItemTypeAddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditIndex(null);
        }}
        onSave={handleAddEdit}
        initialValue={editIndex !== null ? itemTypeList[editIndex].name : ""}
      />
    </>
  );
}