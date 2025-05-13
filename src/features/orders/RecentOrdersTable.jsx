import React, { useState } from "react";  
import {  
  Table, Thead, Tbody, Tr, Th, Td, Button,  
  Box, Text, HStack  
} from "@chakra-ui/react";  
import OrderDetail from "./OrderDetail";  

const PAGE_SIZE = 5;  

export function RecentOrdersTable({ orders }) {  
  const [currentPage, setCurrentPage] = useState(1);  
  const [selectedOrder, setSelectedOrder] = useState(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [paymentSummary, setPaymentSummary] = useState(null); // new state for payment info  

  if (!orders || orders.length === 0)  
    return (  
      <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
        <Text>No recent orders found.</Text>  
      </Box>  
    );  

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));  
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);  
  const startIdx = (currentPage - 1) * PAGE_SIZE;  
  const currentOrders = sortedOrders.slice(startIdx, startIdx + PAGE_SIZE);  

  const openModal = (order) => {   
    setSelectedOrder(order);  
    setIsModalOpen(true);  

    try {  
      const storedPayment = localStorage.getItem(`payments`);  
      if (storedPayment) {  
        const paymentData = JSON.parse(storedPayment);  
        // Find payment object matching current order.orderId  
        const paymentFiltered = paymentData.find(p => p.orderId === order.orderId);  
        
        setPaymentSummary(paymentFiltered || null);  
        console.log(paymentFiltered);  
      } else {  
        setPaymentSummary(null); // no payment data stored  
      }  
    } catch (error) {  
      console.error("Failed to parse payment data from localStorage", error);  
      setPaymentSummary(null);  
    } 
  };  

  const closeModal = () => {  
    setIsModalOpen(false);  
    setSelectedOrder(null);  
    setPaymentSummary(null);  
  };  

  return (  
    <Box mt={8} borderWidth={1} borderRadius="md" overflowX="auto" p={4}>  
      <Text fontSize="xl" mb={4} fontWeight="bold" color="green.600">  
        Recent Orders  
      </Text>  

      <Table variant="striped" colorScheme="green" size="sm">  
        <Thead>  
          <Tr>  
            <Th>Order ID</Th>  
            <Th>Seller</Th>  
            <Th>Buyer</Th>  
            <Th>Date</Th>  
            <Th>Total Weight</Th>  
            <Th>Total Item</Th>  
            <Th>Final Price</Th>  
            <Th>Action</Th>  
          </Tr>  
        </Thead>  
        <Tbody>  
          {currentOrders.map((order) => {  
            const weight = order.inputs?.totalWeight;  
            const itemCount = order.inputs?.totalItem;  
            const finalPrice = order.calculations?.finalPrice;  

            return (  
              <Tr key={order.orderId}>  
                <Td>{order.orderId}</Td>  
                <Td>{order.seller?.name || "N/A"}</Td>  
                <Td>{order.buyer?.name || "N/A"}</Td>  
                <Td>{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</Td>  
                <Td>{weight != null ? `${weight} kg` : "N/A"}</Td>  
                <Td>{itemCount != null ? `${itemCount} pcs` : "N/A"}</Td>  
                <Td>{typeof finalPrice === "number" ? `₹${finalPrice.toFixed(2)}` : "N/A"}</Td>  
                <Td>  
                  <Button size="sm" colorScheme="green" onClick={() => openModal(order)}>  
                    View  
                  </Button>  
                </Td>  
              </Tr>  
            );  
          })}  
        </Tbody>  
      </Table>  

      <HStack mt={4} justify="flex-end" spacing={2}>  
        <Button size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>  
          Previous  
        </Button>  
        <Text>  
          Page {currentPage} of {totalPages}  
        </Text>  
        <Button size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>  
          Next  
        </Button>  
      </HStack>  

      {selectedOrder && (  
        <OrderDetail   
          isOpen={isModalOpen}  
          onClose={closeModal}  
          orderSummary={selectedOrder}  
          paymentSummary={paymentSummary}  // pass payment info here  
        />  
      )}  
    </Box>  
  );  
}  

export default RecentOrdersTable;