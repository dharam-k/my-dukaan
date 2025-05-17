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

import DharmakataAddEditModal from "./DharmakataAddEditModal";

export default function DharmakataListModal({ isOpen, onClose }) {
  const [dharmakataList, setDharmakataList] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem("dharmakatas") || "[]");
      setDharmakataList(saved);
    }
  }, [isOpen]);

  const saveList = (list) => {
    setDharmakataList(list);
    localStorage.setItem("dharmakatas", JSON.stringify(list));
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this dharmakata?");
    if (!confirmed) return;
    const newList = [...dharmakataList];
    newList.splice(index, 1);
    saveList(newList);
    toast({ title: "Deleted successfully", status: "success", duration: 2000 });
  };

  const handleAddEdit = (value) => {
    if (editItem !== null) {
      const newList = [...dharmakataList];
      newList[editItem] = value;
      saveList(newList);
      toast({ title: "Updated successfully", status: "success", duration: 2000 });
    } else {
      saveList([...dharmakataList, value]);
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
            Dharmakatas (Total: {dharmakataList.length})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dharmakataList.length === 0 ? (
              <Text>No dharmakatas available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {dharmakataList.map((item, i) => (
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
              Add Dharmakata
            </Button>
            <Button ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Modal */}
      <DharmakataAddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditItem(null);
        }}
        onSave={handleAddEdit}
        initialValue={editItem !== null ? dharmakataList[editItem] : ""}
      />
    </>
  );
}