import React from "react";  
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
} from "@chakra-ui/react";  

export function PendingPaymentsTable({ payments }) {  
  if (!payments || payments.length === 0)  
    return (  
      <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
        <Text>No pending payments.</Text>  
      </Box>  
    );  

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
          </Tr>  
        </Thead>  
        <Tbody>  
          {payments.map((p, i) => (  
            <Tr key={`${p.orderId}-${i}`}>  
              <Td>{p.orderId}</Td>  
              <Td>{p.sellerName || "N/A"}</Td>  
              <Td>{p.buyerName || "N/A"}</Td>  
              <Td>₹{p.finalPrice?.toFixed(2) || "0.00"}</Td>  
              <Td>₹{p.paymentAmount?.toFixed(2) || "0.00"}</Td>  
              <Td>₹{p.dueAmount?.toFixed(2) || "0.00"}</Td>  
              <Td>  
                <Badge  
                  colorScheme={p.paymentStatus === "COMPLETED" ? "green" : "orange"}  
                  textTransform="uppercase"  
                >  
                  {p.paymentStatus}  
                </Badge>  
              </Td>  
            </Tr>  
          ))}  
        </Tbody>  
      </Table>  
    </Box>  
  );  
}  

export default PendingPaymentsTable;