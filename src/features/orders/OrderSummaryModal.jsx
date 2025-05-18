import React, { useEffect, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import {
  FaClipboardList,
  FaHashtag,
  FaUser,
  FaStore,
  FaCalendarAlt,
  FaCalculator,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MakeNewOrderPayment from "../payments/MakeNewOrderPayment";
import {
  inputUnitsMap,
  calculationIconsMap,
  inputIconsMap,
} from "../../utils/constants";
import getUserById from "../../services/users/getUser";
import { calculateOrderValues } from "../../utils/calculations";

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function OrderSummaryModal({ isOpen, onClose, orderSummary }) {
  const cancelRef = useRef();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);


  useEffect(() => {
    async function fetchUserNames() {
      if (!orderSummary) return;
      const buyerData = await getUserById(orderSummary.buyerId);
      const sellerData = await getUserById(orderSummary.sellerId);
      setBuyer(buyerData || "N/A");
      setSeller(sellerData || "N/A");
    }
    fetchUserNames();
  }, [orderSummary]);

  const calculations = calculateOrderValues(orderSummary?.inputs);

  const hasRecorded = useRef(false); // Prevent duplicate execution

  const paymentsCollection = collection(db, "payments");
  const ordersCollection = collection(db, "orders");

  // Save no payment made record in Firestore
  const recordNoPayment = async () => {
    if (hasRecorded.current || paymentMade || !orderSummary) return;

    const finalPrice = calculations?.finalPrice || 0;

    try {
      const paymentDocRef = doc(paymentsCollection);
      const paymentStatus = finalPrice > 0 ? "PENDING" : "COMPLETED";

      const noPaymentRecord = {
        id: paymentDocRef.id,
        orderId: orderSummary.orderId,
        buyerId: orderSummary.buyerId,
        sellerId: orderSummary.sellerId,
        finalPrice,
        paidAmount: 0,
        dueAmount: finalPrice,
        method: "N/A",
        paymentStatus,
        createdAt: serverTimestamp(),
      };

      await setDoc(paymentDocRef, noPaymentRecord);

      const orderDocRef = doc(db, "orders", orderSummary.orderId);
      await updateDoc(orderDocRef, {
        paymentIds: arrayUnion(paymentDocRef.id),
      });

      hasRecorded.current = true;
    } catch (error) {
      console.error("Failed to record no payment in Firestore", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      recordNoPayment();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [orderSummary, calculations, paymentMade]);

  const handleClose = async () => {
    await recordNoPayment();
    setTimeout(() => {
      navigate("/buyer-dashboard");
    }, 1000);
  };

  const openPayment = () => setIsPaymentOpen(true);
  const closePayment = () => setIsPaymentOpen(false);

  // Save completed payment to Firestore and update order
  const handlePaymentComplete = async (paymentRecord) => {
    try {
      const paymentDocRef = doc(paymentsCollection, paymentRecord.id);
      await setDoc(paymentDocRef, {
        ...paymentRecord,
        createdAt: serverTimestamp(),
      });

      const orderDocRef = doc(ordersCollection, orderSummary.orderId);
      await updateDoc(orderDocRef, {
        paymentIds: arrayUnion(paymentRecord.id),
      });

      setPaymentMade(true);
      closePayment();
      onClose();
    } catch (error) {
      console.error("Failed to save payment in Firestore", error);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isPaymentOpen}
        onClose={handleClose}
        isCentered
        leastDestructiveRef={cancelRef}
        size={{ base: "md", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FaClipboardList} color="green.600" boxSize={6} />
              <Text>Order Confirmation</Text>
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

          <ModalCloseButton />

          <ModalBody>
            {orderSummary && (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                  <Box>
                    <HStack>
                      <Icon as={FaUser} color="green.600" />
                      <Text fontWeight="bold" color="green.600" fontSize="md">
                        Buyer
                      </Text>
                    </HStack>
                    <Text ml={8}>{buyer?.name}</Text>
                    <Text ml={8} fontSize="sm" color="gray.600">
                      {buyer?.address}
                    </Text>
                    <Text ml={8} fontSize="sm" color="gray.600">
                      {buyer?.phone}
                    </Text>
                  </Box>

                  <Box>
                    <HStack>
                      <Icon as={FaStore} color="green.600" />
                      <Text fontWeight="bold" color="green.600" fontSize="md">
                        Seller
                      </Text>
                    </HStack>
                    <Text ml={8}>{seller?.name}</Text>
                    <Text ml={8} fontSize="sm" color="gray.600">
                      {seller?.address}
                    </Text>
                    <Text ml={8} fontSize="sm" color="gray.600">
                      {seller?.phone}
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
                        ? new Date(orderSummary.orderDate).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : "N/A"}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Divider />

                <Box>
                  <Text
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
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                    {Object.entries(orderSummary.inputs).map(([key, val]) => {
                      const IconComp = inputIconsMap[key] || FaClipboardList;
                      const unit = inputUnitsMap[key] || "";

                      return (
                        <HStack key={key} align="center">
                          <Icon as={IconComp} color="green.500" />
                          <Text
                            fontWeight="semibold"
                            textTransform="capitalize"
                            minW="140px"
                          >
                            {key.replace(/([A-Z])/g, " $1")}:
                          </Text>
                          <Text>
                            {val || "N/A"}{" "}
                            {unit && (
                              <span style={{ opacity: 0.7 }}>{unit}</span>
                            )}
                          </Text>
                        </HStack>
                      );
                    })}
                  </SimpleGrid>
                </Box>

                <Box>
                  <Text
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
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                    {[
                      "perHeadPoldari",
                      "totalPrice",
                      "totalPolidari",
                      "finalPrice",
                    ].map((key) => {
                      const val = calculations?.[key];
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
                          <Text
                            fontWeight="bold"
                            textTransform="capitalize"
                            minW="140px"
                            color="green.600"
                          >
                            {key.replace(/([A-Z])/g, " $1")}:
                          </Text>
                          <Text fontWeight="bold" color={valueColor}>
                            {typeof val === "number"
                              ? `${symbol}₹${val.toFixed(2)}`
                              : val}
                          </Text>
                        </>
                      );

                      return (
                        <HStack
                          key={key}
                          align="center"
                          spacing={2}
                          border={isFinalPrice ? "2px solid" : "none"}
                          borderColor={isFinalPrice ? "green.600" : "none"}
                          borderRadius={isFinalPrice ? "md" : "none"}
                          p={isFinalPrice ? 2 : 0}
                          w="full"
                          fontSize={16}
                        >
                          <Icon
                            as={IconComp}
                            color={isFinalPrice ? "green.600" : "green.500"}
                          />
                          {isFinalPrice ? (
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              flex="1"
                            >
                              {content}
                            </Box>
                          ) : (
                            content
                          )}
                        </HStack>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </VStack>
            )}

            <Button mt={6} colorScheme="green" onClick={openPayment} w="full">
              Make Payment
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isPaymentOpen}
        onClose={closePayment}
        isCentered
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalHeader>Make Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {orderSummary && (
              <MakeNewOrderPayment
                isOpen={isPaymentOpen}
                onClose={closePayment}
                orderSummary={orderSummary}
                calculations={calculations}
                onPaymentComplete={handlePaymentComplete}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}