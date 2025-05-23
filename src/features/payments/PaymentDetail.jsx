import React, { useState, useRef, useEffect } from "react";
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
  Button,
  Collapse,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaClipboardList,
  FaHashtag,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import getUserById from "../../services/users/getUser";
import { subscribePaymentsByOrderId } from "../../services/payments/PaymentService"; // <- import subscribe
import MakePendingOrderPayment from "./MakePendingOrderPayment";

export default function PaymentDetail({ isOpen, onClose, paymentSummary, orderSummary }) {
  const cancelRef = useRef();
  const { isOpen: isOpenHistory, onToggle: toggleHistory } = useDisclosure();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [payments, setPayments] = useState([]);
  const [paymentError, setPaymentError] = useState(null);

  // Fetch seller info (assuming getUserById returns a Promise)
  const [seller, setSeller] = React.useState(null);
  useEffect(() => {
    if (!orderSummary?.sellerId) {
      setSeller(null);
      return;
    }
    getUserById(orderSummary.sellerId).then(setSeller).catch(() => setSeller(null));
  }, [orderSummary?.sellerId]);

  // Subscribe to payments for this orderId once component mounts or order changes
  useEffect(() => {
    if (!orderSummary?.orderId) {
      setPayments([]);
      return;
    }

    const unsubscribe = subscribePaymentsByOrderId(
      orderSummary.orderId,
      (paymentsData) => {
        setPayments(paymentsData);
        setPaymentError(null);
      },
      (error) => {
        setPaymentError(error);
      }
    );

    return () => unsubscribe();
  }, [orderSummary?.orderId]);

  console.log(payments)

  const finalPrice = payments.length ? payments[payments.length - 1].finalPrice || 0 : 0;
  const totalPaidAmount = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  console.log(totalPaidAmount)
  const dueAmount = payments.length ? (finalPrice -  totalPaidAmount) || 0 : 0;
  const paymentStatus = dueAmount > 0 ? "Pending" : "Completed";

  function handleClose() {
    onClose();
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
        leastDestructiveRef={cancelRef}
        size={{ base: "md", md: "lg" }}
      >
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
            height={{ base: "150px", md: "200px" }}
            width={{ base: "150px", md: "200px" }}
            fontSize={{ base: "2xl", md: "5xl" }}
            fontWeight="bold"
            color={dueAmount === 0 ? "green.300" : "orange.300"}
            opacity={0.15}
          >
            {dueAmount === 0 ? "PAID" : "PENDING"}
          </Box>

          <ModalHeader zIndex={1}>
            <HStack spacing={3}>
              <Icon as={FaClipboardList} color="green.600" boxSize={6} />
              <Text>Order Detail</Text>
            </HStack>
            <Divider mt={2} />
            {orderSummary?.orderId && (
              <Text
                fontSize="sm"
                color="gray.500"
                position="absolute"
                top="12px"
                right="50%"
                fontWeight="bold"
              >
                <Icon as={FaHashtag} mb="2px" /> {orderSummary.orderId}
              </Text>
            )}
          </ModalHeader>

          <ModalCloseButton zIndex={1} />

          <ModalBody zIndex={1}>
            {orderSummary && (
              <Box>
                {/* Order Info */}
                <Box mb={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    <HStack>
                      <Text fontWeight="semibold" minW="140px">
                        Seller:
                      </Text>
                      <Text>{seller?.name || "N/A"}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="semibold" minW="140px">
                        Order Date:
                      </Text>
                      <Text>
                        {orderSummary.orderDate
                          ? new Date(orderSummary.orderDate).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </HStack>
                  </SimpleGrid>
                </Box>

                {/* Payment Summary */}
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
                      <Icon as={FaMoneyBillWave} />
                      <Text>Payment Summary</Text>
                    </HStack>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                    <HStack>
                      <Text fontWeight="semibold" minW="140px">
                        Total Amount:
                      </Text>
                      <Text>₹{finalPrice.toLocaleString("en-IN")}</Text>
                    </HStack>

                    {/* Payment History */}
                    <Box mt={6}>
                      <HStack justifyContent="space-between">
                        <HStack spacing={2}>
                          <Icon as={FaMoneyCheckAlt} color="blue.600" />
                          <Text fontWeight="bold" color="blue.600">
                            Payment History
                          </Text>
                        </HStack>
                        <IconButton
                          icon={isOpenHistory ? <FaChevronUp /> : <FaChevronDown />}
                          onClick={toggleHistory}
                          size="sm"
                          variant="ghost"
                          aria-label="Toggle Payment History"
                        />
                      </HStack>

                      <Collapse in={!isOpenHistory} animateOpacity>
                        <VStack
                          mt={3}
                          align="stretch"
                          spacing={3}
                          border="1px"
                          borderColor="gray.200"
                          p={3}
                          borderRadius="md"
                        >
                        {payments.length > 0 ? (
                          payments.map((payment) => {
                            let createdAtDate;
                            if (payment.createdAt?.toDate) {
                              // Firestore Timestamp object
                              createdAtDate = payment.createdAt.toDate();
                            } else if (payment.createdAt) {
                              // Already Date or ISO string
                              createdAtDate = new Date(payment.createdAt);
                            } else {
                              createdAtDate = null;
                            }

                            return (
                              <Box key={payment.id} borderBottom="1px dashed #ccc" pb={2}>
                                <Text fontSize="sm">
                                  <strong>Payment ID:</strong> {payment.id} <br />
                                  <strong>Date:</strong>{" "}
                                  {createdAtDate ? createdAtDate.toLocaleDateString() : "N/A"} <br />
                                  <strong>Amount:</strong> ₹
                                  {payment.paidAmount?.toLocaleString("en-IN") || "N/A"} <br />
                                  <strong>Method:</strong> {payment.method || "N/A"}
                                </Text>
                              </Box>
                            );
                          })
                        ) : (
                          <Text fontSize="sm" color="gray.500">
                            No past payments available.
                          </Text>
                        )}
                        </VStack>
                      </Collapse>
                    </Box>

                    {/* Due Amount */}
                    <HStack
                      border="2px solid"
                      borderColor={dueAmount > 0 ? "red.600" : "green.600"}
                      borderRadius="md"
                      p={2}
                    >
                      <Text fontWeight="semibold" minW="140px">
                        Due Amount:
                      </Text>
                      <Text color={dueAmount > 0 ? "red.600" : "green.600"}>
                        ₹{dueAmount.toLocaleString("en-IN")}
                      </Text>
                    </HStack>

                    {/* Payment Status */}
                    <HStack>
                      <Text fontWeight="semibold" minW="140px">
                        Status:
                      </Text>
                      <Text
                        fontWeight="bold"
                        color={
                          paymentStatus === "Completed"
                            ? "green.600"
                            : paymentStatus === "Pending"
                            ? "orange.600"
                            : "red.600"
                        }
                      >
                        {paymentStatus}
                      </Text>
                    </HStack>

                    {/* Pay Due Now Button */}
                    {dueAmount > 0 && (
                      <Button
                        colorScheme="red"
                        alignSelf="flex-start"
                        mt={2}
                        onClick={() => setShowPaymentModal(true)}
                      >
                        Pay Due Now
                      </Button>
                    )}
                  </SimpleGrid>
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Nested payment modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        isCentered
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalHeader>Make Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MakePendingOrderPayment
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              orderSummary={orderSummary}
              calculations={{ finalPrice, dueAmount, totalPaid: totalPaidAmount }}
              onPaymentComplete={() => {
                // Close payment modal and payment detail modal
                setShowPaymentModal(false);
                onClose();            // THIS closes PaymentDetail modal
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}