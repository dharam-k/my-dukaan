import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  Box,
  HStack,
  Tag,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { FaEye, FaIndustry } from "react-icons/fa";

import { fetchMills } from "../../services/mills/MillService";

export default function MillsListModal({ isOpen, onClose }) {
  const [mills, setMills] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadMills();
    }
  }, [isOpen]);

  async function loadMills() {
    setLoading(true);
    try {
      const millsData = await fetchMills();
      setMills(millsData);
    } catch (error) {
      console.error("Failed to load mills", error);
      toast({
        title: "Failed to load mills",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setMills([]);
    }
    setLoading(false);
  }

  const handleViewDetails = (mill) => {
    alert(
      `Mill details:\n\nName: ${mill.millName}\nAddress: ${mill.address}\nMobile: ${mill.mobile}\nGSTN: ${mill.gstn || "N/A"}`
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "xl", lg: "4xl" }}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="md"
        boxShadow="2xl"
        bg="white"
        maxW={{ base: "100%", md: "90vw", lg: "1200px" }}
      >
        <ModalHeader px={{ base: 3, md: 8 }} pb={4} mt={7}>
          <Flex align="center" w="100%">
            <HStack spacing={3} color="green.600" fontSize={{ base: "lg", md: "2xl" }}>
              <FaIndustry />
              <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }}>
                Manage Mills
              </Text>
            </HStack>
            <Spacer />
            <Tag
              size="md"
              colorScheme="green"
              variant="subtle"
              fontWeight="bold"
              fontSize={{ base: "sm", md: "md" }}
              px={3}
            >
              Total: {mills.length}
            </Tag>
          </Flex>
        </ModalHeader>

        <ModalCloseButton size="lg" />

        <ModalBody px={{ base: 3, md: 8 }} pb={8}>
          {loading ? (
            <Text>Loading mills...</Text>
          ) : mills.length === 0 ? (
            <Box
              p={6}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              color="gray.600"
            >
              No mills found. Please add a mill first.
            </Box>
          ) : (
            <Box
              overflowX="auto"
              rounded="md"
              shadow="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Table
                variant="simple"
                size="sm"
                colorScheme="green"
                minW="600px"
                whiteSpace="normal"
              >
                <Thead bg="green.50" borderBottom="3px solid" borderColor="green.200">
                  <Tr>
                    <Th fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 6 }}>
                      Mill
                    </Th>
                    <Th fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 6 }}>
                      Address
                    </Th>
                    <Th fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 6 }}>
                      Mobile
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md" }}
                      px={{ base: 2, md: 6 }}
                      textAlign="center"
                    >
                      GSTN
                    </Th>
                    <Th fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 6 }} textAlign="center">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mills.map((mill) => (
                    <Tr
                      key={mill.id}
                      _hover={{ bg: "green.100", cursor: "pointer" }}
                      onClick={() => handleViewDetails(mill)}
                      transition="background-color 0.2s"
                      fontSize={{ base: "xs", md: "md" }}
                      textAlign="left"
                    >
                      <Td py={{ base: 2, md: 4 }} px={{ base: 2, md: 6 }}>
                        {mill.millName}
                      </Td>
                      <Td py={{ base: 2, md: 4 }} px={{ base: 2, md: 6 }} maxW="300px" whiteSpace="normal">
                        {mill.address}
                      </Td>
                      <Td py={{ base: 2, md: 4 }} px={{ base: 2, md: 6 }}>
                        {mill.mobile}
                      </Td>
                      <Td py={{ base: 2, md: 4 }} px={{ base: 2, md: 6 }} textAlign="center">
                        {mill.gstn ? (
                          <Tag
                            size="sm"
                            colorScheme="green"
                            variant="subtle"
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {mill.gstn}
                          </Tag>
                        ) : (
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400" fontStyle="italic" >
                            N/A
                          </Text>
                        )}
                      </Td>
                      <Td
                        py={{ base: 2, md: 4 }}
                        px={{ base: 2, md: 6 }}
                        textAlign="center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          aria-label="View Details"
                          icon={<FaEye />}
                          colorScheme="green"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(mill)}
                          _hover={{ bg: "green.200" }}
                          rounded="md"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}