import React, { useState } from "react";  
import {  
  ModalFooter,  
  Button,  
  FormControl,  
  FormLabel,  
  Input,  
  Select,  
  Text,  
  VStack,  
  Box,  
  useToast,  
} from "@chakra-ui/react";  

function OrderPaymentModal({  
  isOpen,  
  onClose,  
  orderSummary,  
  onPaymentComplete,  
}) {  
  const [paymentAmount, setPaymentAmount] = useState("");  
  const [paymentType, setPaymentType] = useState("cash");  
  const toast = useToast();  
  

  if (!orderSummary) return null;  

  const finalPrice = orderSummary.calculations.finalPrice || 0;  
  const amountNum = parseFloat(paymentAmount) || 0;  
  const dueAmount = finalPrice - amountNum; 
  const paymentStatus = dueAmount > 0.00 ? "PENDING" : "COMPLETED";  

  const handlePaymentSubmit = () => {  
    if (!paymentAmount || amountNum <= 0) {  
      toast({  
        title: "Invalid payment amount",  
        status: "error",  
        duration: 3000,  
        isClosable: true,  
      });  
      return;  
    }  
    if (amountNum > finalPrice) {  
      toast({  
        title: "Payment amount cannot be greater than final price",  
        status: "error",  
        duration: 3000,  
        isClosable: true,  
      });  
      return;  
    }  

    // Prepare payment record  
    const paymentRecord = {  
      orderId: orderSummary.orderId,  
      buyerName: orderSummary.buyer.name,  
      sellerName: orderSummary.seller.name,  
      finalPrice,  
      paymentAmount: amountNum,  
      paymentType,  
      paymentDate: new Date().toISOString(),  
      dueAmount,  
      paymentStatus, 
    };  

    // Save to localStorage payments array  
    const payments = JSON.parse(localStorage.getItem("payments")) || [];  
    payments.push(paymentRecord);  
    localStorage.setItem("payments", JSON.stringify(payments));  

    toast({  
      title: "Payment successful!",  
      description: "Thank you for your payment.",  
      status: "success",  
      duration: 3000,  
      isClosable: true,  
    });  

    // Reset fields and callback  
    setPaymentAmount("");  
    setPaymentType("cash");  
    onPaymentComplete();  
  };  

  return (  
    <>  
      <ModalFooter flexDirection="column" gap={4} pt={0}>  
        <VStack spacing={3} align="stretch" w="full">  
          <Text><b>Order ID:</b> {orderSummary.orderId}</Text>  
          <Text><b>Buyer:</b> {orderSummary.buyer.name}</Text>  
          <Text><b>Seller:</b> {orderSummary.seller.name}</Text>  
          <Text><b>Final Price:</b> ₹{finalPrice.toFixed(2)}</Text>  

          <FormControl isRequired>  
            <FormLabel>Payment Amount</FormLabel>  
            <Input  
              type="number"  
              min="0"  
              max={finalPrice}  
              value={paymentAmount}  
              onChange={(e) => setPaymentAmount(e.target.value)}  
              placeholder="Enter payment amount"  
            />  
          </FormControl>  

          <FormControl>  
            <FormLabel>Payment Type</FormLabel>  
            <Select  
              value={paymentType}  
              onChange={(e) => setPaymentType(e.target.value)}  
            >  
              <option value="cash">Cash</option>  
              <option value="bank">Bank</option>  
            </Select>  
          </FormControl>  

          <Box>  
            <Text fontWeight="bold">  
              Due Amount: ₹{dueAmount >= 0 ? dueAmount.toFixed(2) : "0.00"}  
            </Text>  
          </Box>  

          <Button colorScheme="green" onClick={handlePaymentSubmit}>  
            Submit Payment  
          </Button>  
        </VStack>  
      </ModalFooter>  
    </>  
  );  
}  

export default OrderPaymentModal;