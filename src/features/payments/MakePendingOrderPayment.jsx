import React, { useEffect, useState } from "react";  
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
import { addPayment } from "../../services/payments/PaymentService";
import getUserById from "../../services/users/getUser";
import { getNextPaymentId } from "../../services/payments/counterPaymentID";

function MakePendingOrderPayment({  
  isOpen,  
  onClose,  
  orderSummary,  
  calculations,  
  onPaymentComplete,  
}) {  
  const [paymentAmount, setPaymentAmount] = useState("");  
  const [paymentType, setPaymentType] = useState("cash");  
  const [isSubmitting, setIsSubmitting] = useState(false);  
   const [buyerName, setBuyerName] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  const toast = useToast();  
  const navigate = useNavigate();  

  if (!orderSummary) return null;  

  const finalPrice = calculations?.finalPrice || 0;  
  const amountNum = paymentAmount || 0;  
  const dueAmount = calculations?.dueAmount;  
  const remainDueAmount = dueAmount - paymentAmount;
  const paymentStatus = remainDueAmount > 0.0 ? "Pending" : "Completed";  

   // Fetch buyer and seller names for display  
  useEffect(() => {  
    async function fetchUserNames() {  
      if (orderSummary.buyerId) {  
        try {  
          const buyer = await getUserById(orderSummary.buyerId);  
          setBuyerName(buyer?.name ?? "N/A");  
        } catch {  
          setBuyerName("N/A");  
        }  
      }  

      if (orderSummary.sellerId) {  
        try {  
          const seller = await getUserById(orderSummary.sellerId);  
          setSellerName(seller?.name ?? "N/A");  
        } catch {  
          setSellerName("N/A");  
        }  
      }  
    }  

    fetchUserNames();  
  }, [orderSummary.buyerId, orderSummary.sellerId]);  

  const handlePaymentSubmit = async () => {
    if (isSubmitting) return;

    const amountNum = Number(paymentAmount) || 0;

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
      await addPayment(
        {
          id: paymentId,
          orderId: orderSummary.orderId,
          buyerId: orderSummary.buyerId,
          sellerId: orderSummary.sellerId,
          finalPrice: finalPrice,
          paidAmount: amountNum,
          dueAmount: remainDueAmount,
          method: paymentType,
          paymentStatus: paymentStatus,
        },
        orderSummary.id // Firestore document ID of order to update
      );

      toast({
        title: "Payment successful!",
        description: "Thank you for your payment.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setPaymentAmount("");
      setPaymentType("cash");
      onClose();

      if (onPaymentComplete) {
        onPaymentComplete();
      }

      setTimeout(() => {
        navigate("/buyer-dashboard");
      }, 3000);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (  
    <ModalFooter flexDirection="column" gap={4} pt={0}>  
      <VStack spacing={3} align="stretch" w="full">  
        <Text><b>Order ID:</b> {orderSummary.orderId}</Text>  
        <Text><b>Buyer:</b> {buyerName}</Text>  
        <Text><b>Seller:</b> {sellerName}</Text>  
        <Text color={"green"}><b>Total Price:</b> ₹{finalPrice}</Text>  
        <Text color={"red"}><b>Total Due:</b> ₹{dueAmount}</Text>  

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
          <Text color={"red"} fontWeight="bold">  
            Remaing Due Amount: ₹{(dueAmount-paymentAmount) >= 0 ? (dueAmount-paymentAmount).toFixed(2) : "0.00"}  
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

export default MakePendingOrderPayment;