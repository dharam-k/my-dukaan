import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  SimpleGrid,
  Divider,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";
import {
  FaClipboardList,
  FaHashtag,
  FaUser,
  FaStore,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCalculator,
} from "react-icons/fa";

import { calculationIconsMap, inputIconsMap, inputUnitsMap } from "../../utils/constants";
import getUserById from "../../services/users/getUser";
import { calculateOrderValues } from "../../utils/calculations";

export default function OrderDetail({ isOpen, onClose, orderSummary, paymentSummary }) {
  const cancelRef = useRef();

  // States for user data
  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);

  const calculations = calculateOrderValues(orderSummary?.inputs);

  // Fetch buyer and seller info async on open or orderSummary change
  useEffect(() => {
    if (!orderSummary) return;

    let isMounted = true;

    (async () => {
      const [b, s] = await Promise.all([
        getUserById(orderSummary.buyerId),
        getUserById(orderSummary.sellerId),
      ]);
      if (isMounted) {
        setBuyer(b);
        setSeller(s);
      }
    })();

    return () => {
      isMounted = false;
      setBuyer(null);
      setSeller(null);
    };
  }, [orderSummary]);

  // Extract final price from any (assuming it's same across payments)
  const finalPrice = paymentSummary.find(p => typeof p.finalPrice === "number")?.finalPrice || 0;

  // Sum all paid amounts (0 if missing)
  const totalPaidAmount = paymentSummary.reduce(
    (sum, p) => sum + (p.paidAmount || 0),
    0
  );
  // Calculate due amount
  const dueAmount = finalPrice - totalPaidAmount;

  function handleClose() {
    onClose();
  }

  // Show spinner if order or user info not loaded yet
  if (isOpen && (!orderSummary || !buyer || !seller)) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size={{ base: "md", md: "lg" }}>
        <ModalOverlay />
        <ModalContent p={4} textAlign="center" py={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading order details...</Text>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size={{ base: "md", md: "lg" }} leastDestructiveRef={cancelRef}>
      <ModalOverlay />
      <ModalContent p={4} position="relative" overflow="hidden">
        {/* Watermark */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%) rotate(-25deg)"
          zIndex={0}
          pointerEvents="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor={dueAmount === 0 ? "green.300" : "orange.300"}
          borderRadius="full"
          height={{ base: "300px", md: "400px" }}
          width={{ base: "300px", md: "400px" }}
          fontSize={{ base: "5xl", md: "8xl" }}
          fontWeight="bold"
          color={dueAmount === 0 ? "green.300" : "orange.300"}
          opacity={0.15}
        >
          {dueAmount === 0 ? "PAID" : "PENDING"}
        </Box>

        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FaClipboardList} color="green.600" boxSize={6} />
            <Text>Order Detail</Text>
          </HStack>
          <Divider mt={2} />
          {orderSummary?.orderId && (
            <Text fontSize="sm" color="gray.500" position="absolute" top="12px" right="50%" fontWeight="bold">
              <Icon as={FaHashtag} mb="2px" /> {orderSummary.orderId}
            </Text>
          )}
        </ModalHeader>

        <ModalCloseButton zIndex={1} />

        <ModalBody zIndex={1}>
          <VStack spacing={6} align="stretch">
            {/* Buyer, Seller, Date */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
              <Box>
                <HStack>
                  <Icon as={FaUser} color="green.600" />
                  <Text fontWeight="bold" color="green.600" fontSize="md">
                    Buyer
                  </Text>
                </HStack>
                <Text ml={8}>{buyer?.name || "N/A"}</Text>
                <Text ml={8} fontSize="sm" color="gray.600">
                  {buyer?.address || "N/A"}
                </Text>
                <Text ml={8} fontSize="sm" color="gray.600">
                  {buyer?.phone || "N/A"}
                </Text>
              </Box>

              <Box>
                <HStack>
                  <Icon as={FaStore} color="green.600" />
                  <Text fontWeight="bold" color="green.600" fontSize="md">
                    Seller
                  </Text>
                </HStack>
                <Text ml={8}>{seller?.name || "N/A"}</Text>
                <Text ml={8} fontSize="sm" color="gray.600">
                  {seller?.address || "N/A"}
                </Text>
                <Text ml={8} fontSize="sm" color="gray.600">
                  {seller?.phone || "N/A"}
                </Text>
              </Box>

              <Box>
                <HStack>
                  <Icon as={FaCalendarAlt} color="green.600" />
                  <Text fontWeight="bold" color="green.600" fontSize="md">
                    Date
                  </Text>
                </HStack>
                <Text ml={8}>
                  {orderSummary.orderDate
                    ? new Date(orderSummary.orderDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </Text>
              </Box>
            </SimpleGrid>

            {/* Inputs Section */}
            <Box>
              <Box
                fontWeight="bold"
                color="green.600"
                mb={2}
                fontSize="lg"
                borderBottom="2px solid"
                borderColor="green.300"
                pb={1}
              >
                <HStack spacing={2}>
                  <Icon as={FaClipboardList} />
                  <Text>Order Details</Text>
                </HStack>
              </Box>
              <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                {orderSummary.inputs &&
                  Object.entries(orderSummary.inputs).map(([key, val]) => {
                    const IconComp = inputIconsMap[key] || FaClipboardList;
                    const unit = inputUnitsMap[key] || "";

                    return (
                      <HStack key={key} align="center">
                        <Icon as={IconComp} color="green.500" />
                        <Text fontWeight="semibold" textTransform="capitalize" minW="140px">
                          {key.replace(/([A-Z])/g, " $1")}:
                        </Text>
                        <Text>
                          {val || "N/A"} {unit && <span style={{ opacity: 0.7 }}>{unit}</span>}
                        </Text>
                      </HStack>
                    );
                  })}
              </SimpleGrid>
            </Box>

            {/* Calculations Section */}
            <Box>
              <Box
                fontWeight="bold"
                color="green.600"
                mb={2}
                fontSize="lg"
                borderBottom="2px solid"
                borderColor="green.300"
                pb={1}
              >
                <HStack spacing={2}>
                  <Icon as={FaCalculator} />
                  <Text>Price Summary</Text>
                </HStack>
              </Box>
              <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                {[
                  "perHeadPoldari",
                  "totalPrice",
                  "totalPolidari",
                  "finalPrice",
                ].map((key) => {
                  const val = calculations[key];
                  if (val == null) return null;

                  const IconComp = calculationIconsMap[key] || FaCalculator;
                  const isFinalPrice = key === "finalPrice";

                  let symbol = "";
                  let valueColor = "green.600";
                  if (key === "totalPrice" || key === "finalPrice") {
                    symbol = "+ ";
                  } else if (key === "totalPolidari") {
                    symbol = "- ";
                    valueColor = "red.600";
                  }

                  const content = (
                    <>
                      <Text fontWeight="bold" textTransform="capitalize" minW="140px" color="green.600">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </Text>
                      <Text fontWeight="bold" color={valueColor}>
                        {typeof val === "number" ? `${symbol}₹${val.toFixed(2)}` : val}
                      </Text>
                    </>
                  );

                  return (
                    <HStack
                      key={key}
                      align="center"
                      spacing={4}
                      border={isFinalPrice ? "2px solid" : "none"}
                      borderColor={isFinalPrice ? "green.600" : "none"}
                      borderRadius={isFinalPrice ? "md" : "none"}
                      p={isFinalPrice ? 2 : 0}
                      w="full"
                    >
                      <Icon as={IconComp} color={isFinalPrice ? "green.600" : "green.500"} />
                      {isFinalPrice ? <Box flex="1">{content}</Box> : content}
                    </HStack>
                  );
                })}
              </SimpleGrid>
            </Box>

            {/* Payment Summary Section */}
            {paymentSummary && (
              <Box>
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                  <HStack>
                    <Text fontWeight="semibold" minW="140px">Total Amount:</Text>
                    <Text>₹{finalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="semibold" minW="140px">Paid Amount:</Text>
                    <Text>₹{totalPaidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  </HStack>

                  <HStack border={"2px solid"} borderColor={dueAmount > 0 ? "red.600" : "green.600"} borderRadius={"md"} p={2}>
                    <Text fontWeight="semibold" minW="140px">Due Amount:</Text>
                    <Text color={dueAmount > 0 ? "red.600" : "green.600"}>
                      ₹{dueAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="semibold" minW="140px">Status:</Text>
                    <Text
                      fontWeight="bold"
                      color={
                        dueAmount === 0
                          ? "green.600"
                          : dueAmount > 0
                          ? "orange.600"
                          : "red.600"
                      }
                    >
                      {dueAmount === 0 ? "Paid" : dueAmount > 0 ? "Pending" : "Overpaid"}
                    </Text>
                  </HStack>
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}