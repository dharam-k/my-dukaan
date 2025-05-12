
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

// Recent orders table with clickable "View Order" buttons  
export function RecentOrdersTable({ orders, onViewOrder }) {  
  return (  
    <Box mt={10}>  
      <Heading size="md" mb={4}>  
        Recent Purchase Orders  
      </Heading>  
      <Box overflowX="auto">  
        <Table variant="simple" size="sm" minW="700px">  
          <Thead bg="green.100">  
            <Tr>  
              <Th>Seller Name</Th>  
              <Th>Total Weight</Th>  
              <Th>Total Items</Th>  
              <Th>Final Price</Th>  
              <Th>Payment Status</Th>  
              <Th>Date</Th>  
              <Th></Th>  
            </Tr>  
          </Thead>  
          <Tbody>  
            {orders.map(  
              ({  
                orderId,  
                sellerName,  
                totalWeight,  
                totalItems,  
                finalPrice,  
                paymentStatus,  
                purchaseDate,  
              }) => (  
                <Tr key={orderId}>  
                  <Td>{sellerName}</Td>  
                  <Td>{totalWeight}</Td>  
                  <Td>{totalItems}</Td>  
                  <Td>{finalPrice}</Td>  
                  <Td>  
                    <Tag  
                      colorScheme={  
                        paymentStatus.toLowerCase() === "pending"  
                          ? "yellow"  
                          : "green"  
                      }  
                      variant="solid"  
                    >  
                      {paymentStatus}  
                    </Tag>  
                  </Td>  
                  <Td>{purchaseDate}</Td>  
                  <Td>  
                    <Button  
                      size="sm"  
                      colorScheme="green"  
                      onClick={() => onViewOrder(orderId)}  
                    >  
                      View Order  
                    </Button>  
                  </Td>  
                </Tr>  
              )  
            )}  
          </Tbody>  
        </Table>  
      </Box>  
    </Box>  
  );  
}  