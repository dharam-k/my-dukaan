import React, { useState, useEffect } from "react";  
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

import {  
  collection,  
  doc,  
  setDoc,  
  updateDoc,  
  arrayUnion,  
  serverTimestamp,  
  getDoc,
} from "firebase/firestore";  
import { db } from "../../firebase/firebase";

import getUserById from "../../services/users/getUser";
import { getNextPaymentId } from "../../services/payments/counterPaymentID";

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

  const [buyerName, setBuyerName] = useState("");  
  const [sellerName, setSellerName] = useState("");  

  useEffect(() => {
    async function fetchUserNames() {
      if (!orderSummary) return;
      const buyer = await getUserById(orderSummary.buyerId);
      const seller = await getUserById(orderSummary.sellerId);
      setBuyerName(buyer?.name || "N/A");
      setSellerName(seller?.name || "N/A");

      console.log(buyerName)
      console.log(sellerName)
    }
    fetchUserNames();
  }, [orderSummary]);

  if (!orderSummary) return null;  

  const finalPrice = calculations?.finalPrice || 0;  
  const amountNum = Number(paymentAmount) || 0;  
  const dueAmount = finalPrice - amountNum;  
  const paymentStatus = dueAmount > 0.0 ? "PENDING" : "COMPLETED";  

  const handlePaymentSubmit = async () => {
    if (isSubmitting) return;

    if (!orderSummary || !orderSummary.orderId) {
      toast({
        title: "Order data missing",
        description: "Order information is incomplete. Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Log data to debug
    console.log("Submitting payment with orderSummary:", orderSummary);

    const finalPrice = calculations?.finalPrice || 0;
    const amountNum = Number(paymentAmount) || 0;
    const dueAmount = finalPrice - amountNum;
    const paymentStatus = dueAmount > 0.0 ? "PENDING" : "COMPLETED";

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

    try {

      const paymentId = await getNextPaymentId();  

      const paymentRecord = {
        id: paymentId,
        orderId: orderSummary.orderId,    // Make sure this is defined
        buyerId: orderSummary.buyerId || null,
        sellerId: orderSummary.sellerId || null,
        finalPrice,
        paidAmount: amountNum,
        dueAmount,
        method: paymentType,
        paymentStatus,
        createdAt: serverTimestamp(),
      };

      console.log("Saving payment record:", paymentRecord);

      

        // Use paymentId as doc ID for consistency
      const paymentDocRef = doc(db, "payments", paymentId);
      await setDoc(paymentDocRef, paymentRecord);

      const orderDocRef = doc(db, "orders", orderSummary.id);
      await updateDoc(orderDocRef, {
        paymentIds: arrayUnion(paymentId),
      });

      toast({
        title: "Payment successful!",
        description: "Thank you for your payment.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setPaymentAmount("");
      setPaymentType("cash");

      onPaymentComplete(paymentRecord);
      onClose();

      setTimeout(() => {
        navigate("/buyer-dashboard");
      }, 3000);
    } catch (error) {
      console.error("Failed to save payment in Firestore:", error);
      toast({
        title: "Payment failed",
        description: "Unable to process payment. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  }; 

  return (  
    <ModalFooter flexDirection="column" gap={4} pt={0}>  
      <VStack spacing={3} align="stretch" w="full">  
        <Text><b>Order ID:</b> {orderSummary.orderId}</Text>  
        <Text><b>Buyer:</b> {buyerName}</Text>  
        <Text><b>Seller:</b> {sellerName}</Text>  
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