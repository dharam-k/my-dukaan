import React, { useRef, useState } from "react";  
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
  ModalFooter, 
} from "@chakra-ui/react";  
import {  
  FaClipboardList,  
  FaHashtag,  
  FaUser,  
  FaStore,  
  FaCalendarAlt,  
  FaTag,  
  FaMoneyBillWave,  
  FaRupeeSign,  
  FaCalculator,  
  FaWarehouse,  
} from "react-icons/fa";  
import { useNavigate } from "react-router-dom";
import OrderPaymentModal from "../payments/OrderPaymentModal";

const inputIconsMap = {  
  ratePerQuantal: FaRupeeSign,  
  poldariRate: FaMoneyBillWave,  
  dharmKata: FaTag,  
  totalWeight: FaTag,  
  totalItem: FaTag,  
  totalPoldar: FaTag,  
  itemType: FaTag,  
  quality: FaTag,  
  warehouse: FaWarehouse,  
};  

const calculationIconsMap = {  
  totalPolidari: FaMoneyBillWave,  
  perHeadPoldari: FaMoneyBillWave,  
  totalPrice: FaRupeeSign,  
  finalPrice: FaRupeeSign,  
};  

const inputUnitsMap = {  
  ratePerQuantal: "₹/quantal",  
  poldariRate: "₹",  
  dharmKata: "",  
  totalWeight: "kg",  
  totalItem: "pcs",  
  totalPoldar: "persons",  
  itemType: "",  
  quality: "",  
  warehouse: "",  
};  

export default function OrderDetail({ isOpen, onClose, orderSummary }) {  
  const cancelRef = useRef();  
  
  console.log(orderSummary)

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
              {/* Buyer, Seller, Date */}  
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>  
                <Box>  
                  <HStack>  
                    <Icon as={FaUser} color="green.600" />  
                    <Text fontWeight="bold" color="green.600" fontSize="md">  
                      Buyer  
                    </Text>  
                  </HStack>  
                  <Text ml={8}>{orderSummary.buyer.name}</Text>  
                  <Text ml={8} fontSize="sm" color="gray.600">  
                    {orderSummary.buyer.address}  
                  </Text>  
                  <Text ml={8} fontSize="sm" color="gray.600">  
                    {orderSummary.buyer.phone}  
                  </Text>  
                </Box>  

                <Box>  
                  <HStack>  
                    <Icon as={FaStore} color="green.600" />  
                    <Text fontWeight="bold" color="green.600" fontSize="md">  
                      Seller  
                    </Text>  
                  </HStack>  
                  <Text ml={8}>  
                    {orderSummary.seller.name ||  
                      JSON.stringify(orderSummary.seller)}  
                  </Text>  
                  <Text ml={8} fontSize="sm" color="gray.600">  
                    {orderSummary.seller.address}  
                  </Text>  
                  <Text ml={8} fontSize="sm" color="gray.600">  
                    {orderSummary.seller.phone}  
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
                    {orderSummary.date  
                      ? new Date(orderSummary.date).toLocaleDateString(  
                          undefined,  
                          {  
                            year: "numeric",  
                            month: "short",  
                            day: "numeric",  
                          }  
                        )  
                      : "N/A"}  
                  </Text>  
                </Box>  
              </SimpleGrid>  

              <Divider />  

              {/* Inputs Section */}  
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
                          {unit && <span style={{ opacity: 0.7 }}>{unit}</span>}  
                        </Text>  
                      </HStack>  
                    );  
                  })}  
                </SimpleGrid>  
              </Box>  

              {/* Calculations Section */}  
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
                    const val = orderSummary.calculations[key];  
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
                        spacing={4}  
                        border={isFinalPrice ? "2px solid" : "none"}  
                        borderColor={isFinalPrice ? "green.600" : "none"}  
                        borderRadius={isFinalPrice ? "md" : "none"}  
                        p={isFinalPrice ? 2 : 0}  
                        w="full"  
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
        </ModalBody>  
      </ModalContent>  
    </Modal>   
      </>
  );  
}