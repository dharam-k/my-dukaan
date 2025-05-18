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
import { FaPlus, FaEdit, FaTrash, FaListAlt } from "react-icons/fa";

import SellerAddEditModal from "./SellerAddEditModal";
import { fetchSellers, addSeller, updateSeller, deleteSeller } from "../../services/users/SellerService";

export default function SellersListModal({ isOpen, onClose }) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadSellers();
    }
  }, [isOpen]);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const data = await fetchSellers();
      setSellers(data);
    } catch (error) {
      toast({
        title: "Failed to load sellers",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (sellerData) => {
    if (!sellerData) {
      toast({
        title: "Operation failed",
        description: "Seller data is missing.",
        status: "error",
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      if (editIndex !== null) {
        const existing = sellers[editIndex];
        if (!existing?.id) throw new Error("Existing seller ID is missing.");
        await updateSeller(existing.id, sellerData);
        toast({ title: "Seller updated", status: "success", duration: 2000 });
      } else {
        await addSeller(sellerData);
        toast({ title: "Seller added", status: "success", duration: 2000 });
      }

      await loadSellers();         // Reload seller list first
      setAddEditModalOpen(false);  // Then close modal
      setEditIndex(null);
      
    } catch (error) {
      toast({
        title: "Operation failed",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    setLoading(true);
    try {
      await deleteSeller(sellers[index].id);
      toast({ title: "Seller deleted", status: "success", duration: 2000 });
      await loadSellers();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sellers List (Total: {sellers.length})</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Text>Loading sellers...</Text>
            ) : sellers.length === 0 ? (
              <Text>No sellers available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {sellers.map((seller, i) => (
                  <Box
                    key={seller.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                  >
                    <Box flex="1" minWidth="220px" mr={4}>
                      <Text fontWeight="bold">{seller.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Phone: {seller.phone} | Address: {seller.address}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Created At: {seller.createdAt ? seller.createdAt.toDate().toLocaleString() : "N/A"}
                      </Text>
                    </Box>
                    <HStack spacing={1} flexShrink={0} mt={[2, 0]}>
                      <Button
                        size="sm"
                        leftIcon={<FaListAlt />}
                        colorScheme="blue"
                        onClick={() => {
                          // View orders handler here if needed
                        }}
                      >
                        View Orders
                      </Button>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit seller"
                        size="sm"
                        onClick={() => {
                          setEditIndex(i);
                          setAddEditModalOpen(true);
                        }}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete seller"
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
              isLoading={loading}
              loadingText="Processing"
            >
              Add Seller
            </Button>
            <Button ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SellerAddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditIndex(null);
        }}
        onSave={handleAddEdit}               // Pass handleAddEdit for save callback
        initialData={editIndex !== null ? sellers[editIndex] : null}
      />
    </>
  );
}