import  { useRef } from "react";  
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
  Button, Collapse, IconButton
} from "@chakra-ui/react";  
import {  
  FaClipboardList,  
  FaHashtag,  
  FaUser,  
  FaStore,  
  FaCalendarAlt,
  FaMoneyBillWave, 
  FaCalculator,  FaChevronDown, FaChevronUp, FaMoneyCheckAlt
} from "react-icons/fa";  
import { useDisclosure } from "@chakra-ui/react";


export default function PaymentDetail({ isOpen, onClose, orderSummary,paymentSummary  }) {  
  const cancelRef = useRef();  
  const { isOpen: isOpenHistory, onToggle: toggleHistory } = useDisclosure();


  // Optional: Calculate due amount safely  
  const dueAmount =  
    paymentSummary && paymentSummary.finalPrice != null && paymentSummary.paymentAmount != null  
      ? paymentSummary.finalPrice - paymentSummary.paymentAmount  
      : 0;  

  function handleClose() {  
      onClose();
  };

  return (  <>
    <Modal  
      isOpen={isOpen}  
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

        <ModalCloseButton />  

        <ModalBody>  
         {paymentSummary && orderSummary && (
            <Box>
              {/* ORDER INFO SECTION */}
              <Box mb={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
   
                  <HStack>
                    <Text fontWeight="semibold" minW="140px">Seller:</Text>
                    <Text>{orderSummary.seller.name || "N/A"}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" minW="140px">Order Date:</Text>
                    <Text>{orderSummary.date ? new Date(orderSummary.date).toLocaleDateString() : "N/A"}</Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              {/* PAYMENT SUMMARY SECTION */}
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
                    <Text fontWeight="semibold" minW="140px">Total Amount:</Text>
                    <Text>₹{Math.round(paymentSummary.finalPrice).toLocaleString("en-IN")}</Text>
                  </HStack>

                  {/* PAYMENT HISTORY SECTION */}
                  <Box mt={6}>
                    <HStack justifyContent="space-between">
                      <HStack spacing={2}>
                        <Icon as={FaMoneyCheckAlt} color="blue.600" />
                        <Text fontWeight="bold" color="blue.600">Payment History</Text>
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
                      <VStack mt={3} align="stretch" spacing={3} border="1px" borderColor="gray.200" p={3} borderRadius="md">
                        <Box  borderBottom="1px dashed #ccc" pb={2}>
                          <Text fontSize="sm">
                            <strong>Date:</strong> {new Date(paymentSummary.paymentDate).toLocaleDateString()} <br />
                            <strong>Amount:</strong> ₹{Math.round(paymentSummary.paymentAmount).toLocaleString("en-IN")} <br />
                            <strong>Mode:</strong> {paymentSummary.paymentType}
                          </Text>
                        </Box>
                        {/* {paymentSummary && paymentSummary.length > 0 ? (
                          paymentSummary.map((entry, idx) => (
                            <Box key={idx} borderBottom="1px dashed #ccc" pb={2}>
                              <Text fontSize="sm">
                                <strong>Date:</strong> {new Date(entry.paymentDate).toLocaleDateString()} <br />
                                <strong>Amount:</strong> ₹{Math.round(entry.paymentAmount).toLocaleString("en-IN")} <br />
                                <strong>Mode:</strong> {entry.paymentType}
                              </Text>
                            </Box>
                          )) */}
                        {/* ) : (
                          <Text fontSize="sm" color="gray.500">No past payments available.</Text>
                        )} */}
                      </VStack>
                    </Collapse>
                  </Box>


                  <HStack
                    border="2px solid"
                    borderColor="red.600"
                    borderRadius="md"
                    p={2}
                  >
                    <Text fontWeight="semibold" minW="140px">Due Amount:</Text>
                    <Text color={dueAmount > 0 ? "red.600" : "green.600"}>
                      ₹{Math.round(dueAmount).toLocaleString("en-IN")}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="semibold" minW="140px">Status:</Text>
                    <Text
                      fontWeight="bold"
                      color={
                        paymentSummary.paymentStatus === "Paid"
                          ? "green.600"
                          : paymentSummary.paymentStatus === "Pending"
                          ? "orange.600"
                          : "red.600"
                      }
                    >
                      {paymentSummary.paymentStatus}
                    </Text>
                  </HStack>

                  {/* Pay Due Now Button */}
                  {dueAmount > 0 && (
                    <Button
                      colorScheme="red"
                      alignSelf="flex-start"
                      mt={2}
                      onClick={() => {
                        console.log("Open payment modal for due");
                      }}
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
      </>
  );  
}