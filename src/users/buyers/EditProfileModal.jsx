import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  SimpleGrid,
  Spinner,
  IconButton,
  Checkbox,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { auth } from "../../firebase/firebase";
import { getUserById, updateUser } from "../../services/users/UserService";

function EditProfileModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;

    async function loadUserData() {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("Missing user id");

        const userData = await getUserById(userId);
        setFormData(userData || {});
      } catch (err) {
        toast({
          title: "Failed to load profile data",
          status: "error",
          description: err.message,
          isClosable: true,
        });
        onClose();
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [isOpen, onClose, toast]);

  const handleChange = (field) => (e) => {
    setFormData((fd) => ({ ...fd, [field]: e.target.value }));
  };

  const handleToggle = (field) => {
    setFormData((fd) => ({ ...fd, [field]: !fd[field] }));
  };

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      if (!formData.id) throw new Error("User ID missing");

      const { id, ...dataToSave } = formData;
      await updateUser(formData.id, dataToSave);

      toast({
        title: "Profile updated successfully",
        status: "success",
        isClosable: true,
      });

      onClose();
    } catch (err) {
      toast({
        title: "Update failed",
        status: "error",
        description: err.message || "Please try again.",
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // size={{ base: "full", md: "lg" }}
      isCentered
      scrollBehavior="inside"
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      z-index={1000}
    >
      <ModalOverlay />
      <ModalContent overflowY="auto" maxH="80vh" display="flex" flexDirection="column">
        <ModalHeader>
          <Flex align="center">
            Edit Profile
            <Spacer />
            <IconButton
              aria-label="Close"
              icon={<CloseIcon />}
              onClick={onClose}
              size="sm"
              variant="ghost"
            />
          </Flex>
        </ModalHeader>

        <ModalBody
          overflowY="auto"
          flex="1"
          pb={4}
          pr={{ base: 2, md: 6 }}
          pl={{ base: 2, md: 6 }}
        >
          {loading ? (
            <Spinner size="xl" display="block" m="auto" mt={12} />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
              {(() => {
                const preferredOrder = ["name", "email", "mobile", "isActive", "loginActive"];
                const entries = Object.entries(formData).filter(
                  ([key]) => key !== "id" && key !== "password"
                );

                entries.sort((a, b) => {
                  const aIndex = preferredOrder.indexOf(a[0]);
                  const bIndex = preferredOrder.indexOf(b[0]);

                  if (aIndex === -1 && bIndex === -1) return 0;
                  if (aIndex === -1) return 1;
                  if (bIndex === -1) return -1;
                  return aIndex - bIndex;
                });

                return entries.map(([key, value]) => {
                  const isBoolean = typeof value === "boolean";
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());

                  if (isBoolean) {
                    return (
                      <FormControl key={key} display="flex" alignItems="center">
                        <Checkbox
                          isChecked={value}
                          onChange={() => handleToggle(key)}
                          colorScheme="green"
                        >
                          {label}
                        </Checkbox>
                      </FormControl>
                    );
                  }

                  let type = "text";
                  if (key.toLowerCase().includes("email")) type = "email";
                  if (key.toLowerCase().includes("phone") || key.toLowerCase().includes("mobile"))
                    type = "tel";

                  return (
                    <FormControl key={key} w="100%">
                      <FormLabel>{label}</FormLabel>
                      <Input
                        type={type}
                        value={value || ""}
                        onChange={handleChange(key)}
                        placeholder={`Enter your ${label}`}
                        focusBorderColor="green.500"
                        borderColor="gray.300"
                        borderRadius="md"
                        _placeholder={{ opacity: 0.6 }}
                      />
                    </FormControl>
                  );
                });
              })()}
            </SimpleGrid>
          )}
        </ModalBody>

        <ModalFooter justifyContent="flex-end" borderTop="1px solid" borderColor="gray.100" pt={4}>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSave}
            isLoading={saving}
            loadingText="Saving..."
            isDisabled={loading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfileModal;