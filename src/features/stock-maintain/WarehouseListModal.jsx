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
import WarehouseAddEditModal from "./WarehouseAddEditModal";

export default function WarehouseListModal({ isOpen, onClose }) {
  const [warehouseList, setWarehouseList] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem("warehouses") || "[]");
      setWarehouseList(saved);
    }
  }, [isOpen]);

  const saveList = (list) => {
    setWarehouseList(list);
    localStorage.setItem("warehouses", JSON.stringify(list));
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this warehouse?");
    if (!confirmed) return;
    const newList = [...warehouseList];
    newList.splice(index, 1);
    saveList(newList);
    toast({
      title: "Deleted successfully",
      status: "success",
      duration: 2000,
    });
  };

  const handleAddEdit = (value) => {
    if (editIndex !== null) {
      // edit mode
      const newList = [...warehouseList];
      newList[editIndex] = value;
      saveList(newList);
      toast({
        title: "Updated successfully",
        status: "success",
        duration: 2000,
      });
    } else {
      // add mode
      saveList([...warehouseList, value]);
      toast({
        title: "Added successfully",
        status: "success",
        duration: 2000,
      });
    }
    setAddEditModalOpen(false);
    setEditIndex(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warehouses (Total: {warehouseList.length})</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {warehouseList.length === 0 ? (
              <Text>No warehouses available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {warehouseList.map((item, i) => (
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
              Add Warehouse
            </Button>
            <Button ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Modal */}
      <WarehouseAddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditIndex(null);
        }}
        onSave={handleAddEdit}
        initialValue={editIndex !== null ? warehouseList[editIndex] : ""}
      />
    </>
  );
}