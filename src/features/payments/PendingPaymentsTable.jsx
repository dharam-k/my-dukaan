
import {  
  Box,  
  Heading,  
  Button,  
  Table,  
  Thead,  
  Tbody,  
  Tr,  
  Th,  
  Td,  
  Tag,     
} from "@chakra-ui/react"; 
export function PendingPaymentsTable({ payments }) {  
  return (  
    <Box mt={10}>  
      <Heading size="md" mb={4}>  
        Pending Payments  
      </Heading>  
      <Box overflowX="auto">  
        <Table variant="simple" size="sm" minW="700px">  
          <Thead bg="green.100">  
            <Tr>   
              <Th>Order ID</Th>  
              <Th>Seller Name</Th>  
              <Th>Total Amount</Th>  
              <Th>Paid Amount</Th>  
              <Th>Amount Due</Th>  
              <Th>Last Payment Date</Th>  
            </Tr>  
          </Thead>  
          <Tbody>  
            {payments.map(  
              ({ paymentId, orderId, sellerName,totalAmount, paidAmount, amountDue, lastPaymentDate }) => (  
                <Tr key={paymentId}>  
                  <Td>{orderId}</Td>  
                  <Td>{sellerName}</Td>  
                  <Td>{totalAmount}</Td>  
                  <Td>{paidAmount}</Td> 
                  <Td>
                      <Tag  
                      colorScheme={"red"}  
                      variant="solid"  
                    >  
                      {amountDue}  
                    </Tag></Td>  
                  <Td>{lastPaymentDate}</Td>   
                </Tr>  
              )  
            )}  
          </Tbody>  
        </Table>  
      </Box>  
    </Box>  
  );  
}