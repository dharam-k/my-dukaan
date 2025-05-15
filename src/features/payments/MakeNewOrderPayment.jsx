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
import { useNavigate } from "react-router-dom";
import getUserById from "../../services/users/getUser";

function MakeNewOrderPayment({  
  isOpen,  
  onClose,  
  orderSummary,  
  calculations,  
  onPaymentComplete,  
}) {  
  const [paymentAmount, setPaymentAmount] = useState("");  
  const [paymentType, setPaymentType] = useState("cash");  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const toast = useToast();  
  const navigate = useNavigate();  

  if (!orderSummary) return null;  

  const finalPrice = calculations?.finalPrice || 0;  
  const amountNum = paymentAmount || 0;  
  const dueAmount = finalPrice - amountNum;  
  const paymentStatus = dueAmount > 0.0 ? "PENDING" : "COMPLETED";  

  const handlePaymentSubmit = () => {  
    if (isSubmitting) return; // Prevent double submits  

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

    setIsSubmitting(true);  

    // Load existing payments  
    const existingPayments = JSON.parse(localStorage.getItem("payments")) || [];  
    const paymentId = `payment_${String(existingPayments.length + 1).padStart(4, "0")}`;   

    const paymentRecord = {  
      id: paymentId,  
      orderId: orderSummary.orderId,  
      buyerId: orderSummary.buyerId,  
      sellerId: orderSummary.sellerId,  
      finalPrice : finalPrice,  
      paidAmount: amountNum,  
      dueAmount : dueAmount,  
      method: paymentType,  
      paymentStatus,  
      createdAt: new Date().toISOString()
    };  

    existingPayments.push(paymentRecord);  
    localStorage.setItem("payments", JSON.stringify(existingPayments)); 
    
    // Update orders to include new payment ID  
    const orders = JSON.parse(localStorage.getItem("orders")) || [];  
    const updatedOrders = orders.map((order) => {  
      if (order.orderId === paymentRecord.orderId) {  
        const existingIds = order.paymentIds || [];
        return {  
          ...order,  
          paymentIds: [...existingIds, paymentRecord.id],  
        };  
      }  
      return order;  
    });  

    localStorage.setItem("orders", JSON.stringify(updatedOrders));  

    toast({  
      title: "Payment successful!",  
      description: "Thank you for your payment.",  
      status: "success",  
      duration: 3000,  
      isClosable: true,  
    });  

    // Reset fields  
    setPaymentAmount("");  
    setPaymentType("cash");  
    setIsSubmitting(false);  
    // Close the modal after successful payment  
    onClose();

    setTimeout(() => {  
      navigate("/buyer-dashboard");  
    }, 3000);    
  };  

  return (  
    <ModalFooter flexDirection="column" gap={4} pt={0}>  
      <VStack spacing={3} align="stretch" w="full">  
        <Text><b>Order ID:</b> {orderSummary.orderId}</Text>  
        <Text><b>Buyer:</b> {getUserById(orderSummary.buyerId).name}</Text>  
        <Text><b>Seller:</b> {getUserById(orderSummary.sellerId).name}</Text>  
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

        <Button   
          colorScheme="green"   
          onClick={handlePaymentSubmit}   
          isLoading={isSubmitting}   
          loadingText="Submitting..."  
        >  
          Submit Payment  
        </Button>  
      </VStack>  
    </ModalFooter>  
  );  
}  

export default MakeNewOrderPayment;