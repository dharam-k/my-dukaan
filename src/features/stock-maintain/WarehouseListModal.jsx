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

import {
  fetchWarehouses,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../services/stock-maitain/WarehouseService";

export default function WarehouseListModal({ isOpen, onClose }) {
  const [warehouseList, setWarehouseList] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch warehouses on open
  useEffect(() => {
    if (isOpen) {
      loadWarehouses();
    }
  }, [isOpen]);

  async function loadWarehouses() {
    setLoading(true);
    try {
      const warehouses = await fetchWarehouses();
      setWarehouseList(warehouses);
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
      toast({
        title: "Failed to load warehouses",
        status: "error",
        duration: 3000,
      });
      setWarehouseList([]);
    }
    setLoading(false);
  }

  const handleDelete = async (index) => {
    const warehouse = warehouseList[index];
    const confirmed = window.confirm(
      `Are you sure you want to delete "${warehouse.name}"?`
    );
    if (!confirmed) return;
    try {
      await deleteWarehouse(warehouse.id);
      const newList = warehouseList.filter((_, i) => i !== index);
      setWarehouseList(newList);
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
    if (!value || value.trim().length === 0) {
      toast({
        title: "Warehouse name can't be empty",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    if (editIndex !== null) {
      // Edit existing warehouse
      const warehouseToUpdate = warehouseList[editIndex];
      try {
        await updateWarehouse(warehouseToUpdate.id, { name: value });
        const newList = [...warehouseList];
        newList[editIndex] = { ...warehouseToUpdate, name: value };
        setWarehouseList(newList);
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
      // Add new warehouse
      try {
        const newWarehouse = await addWarehouse({ name: value });
        setWarehouseList([...warehouseList, newWarehouse]);
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
          <ModalHeader>
            Warehouses (Total: {warehouseList.length})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Text>Loading...</Text>
            ) : warehouseList.length === 0 ? (
              <Text>No warehouses available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {warehouseList.map((item, i) => (
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
        initialValue={editIndex !== null ? warehouseList[editIndex].name : ""}
      />
    </>
  );
}