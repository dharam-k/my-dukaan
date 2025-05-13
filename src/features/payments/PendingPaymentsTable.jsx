import React, { useState } from "react";  
import {  
  Table,  
  Thead,  
  Tbody,  
  Tr,  
  Th,  
  Td,  
  Box,  
  Text,  
  Badge,  
  Button,  
  HStack,  
} from "@chakra-ui/react";  
import OrderDetail from "../orders/OrderDetail";  

const PAGE_SIZE = 5;  

export function PendingPaymentsTable({ payments, orders }) {   
  const [currentPage, setCurrentPage] = useState(1);  
  const [selectedOrder, setSelectedOrder] = useState(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [paymentSummary, setPaymentSummary] = useState(null);   

  if (!payments || payments.length === 0)  
    return (  
      <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
        <Text>No pending payments.</Text>  
      </Box>  
    );  

  if (!orders || orders.length === 0)  
    return (  
      <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
        <Text>No recent orders found.</Text>  
      </Box>  
    );  

  // Paginate payments for this table  
  const totalPages = Math.ceil(payments.length / PAGE_SIZE);  
  const startIdx = (currentPage - 1) * PAGE_SIZE;  
  const currentPayments = payments.slice(startIdx, startIdx + PAGE_SIZE);  

  const openModal = (payment) => {   
    const order = orders.find(o => o.orderId === payment.orderId);  

    setSelectedOrder(order || null);  
    setIsModalOpen(true);  
    setPaymentSummary(payment);  
  };   

  const closeModal = () => {  
    setIsModalOpen(false);  
    setSelectedOrder(null);  
    setPaymentSummary(null);  
  };  

  return (  
    <Box mt={8} borderWidth={1} borderRadius="md" overflowX="auto" p={4}>  
      <Text fontSize="xl" mb={4} fontWeight="bold" color="green.600">  
        Pending Payments  
      </Text>  
      <Table variant="striped" colorScheme="green" size="sm">  
        <Thead>  
          <Tr>  
            <Th>Order ID</Th>  
            <Th>Seller</Th>  
            <Th>Buyer</Th>  
            <Th>Total Amount</Th>  
            <Th>Paid Amount</Th>  
            <Th>Due Amount</Th>  
            <Th>Status</Th>  
            <Th>Action</Th>   
          </Tr>  
        </Thead>  
        <Tbody>  
          {currentPayments.map((p, i) => {  
            // Try to find matching order so you can fallback seller/buyer info if missing  
            const order = orders.find(o => o.orderId === p.orderId) || {};  

            return (  
              <Tr key={`${p.orderId}-${i}`}>  
                <Td>{p.orderId}</Td>  
                <Td>{p.sellerName || order.seller?.name || "N/A"}</Td>  
                <Td>{p.buyerName || order.buyer?.name || "N/A"}</Td>  
                <Td>₹{typeof p.finalPrice === "number" ? p.finalPrice.toFixed(2) : "0.00"}</Td>  
                <Td>₹{typeof p.paymentAmount === "number" ? p.paymentAmount.toFixed(2) : "0.00"}</Td>  
                <Td>₹{typeof p.dueAmount === "number" ? p.dueAmount.toFixed(2) : "0.00"}</Td>  
                <Td>  
                  <Badge  
                    colorScheme={p.paymentStatus === "COMPLETED" ? "green" : "orange"}  
                    textTransform="uppercase"  
                  >  
                    {p.paymentStatus}  
                  </Badge>  
                </Td>  
                <Td>  
                  <Button size="sm" colorScheme="green" onClick={() => openModal(p)}>  
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
          paymentSummary={paymentSummary}  
        />  
      )}   
    </Box>  
  );  
}  

export default PendingPaymentsTable;