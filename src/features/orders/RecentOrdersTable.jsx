import React from "react";  
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
  HStack,  
  Text,  
  Icon,  
} from "@chakra-ui/react";  
import {  
  FaUserCircle,  
  FaWeight,  
  FaBoxes,  
  FaRupeeSign,  
  FaDollarSign,  
  FaCalendarAlt,  
} from "react-icons/fa";  

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
              <Th>  
                <HStack spacing={1}>  
                  <Icon as={FaUserCircle} color="green.600" />  
                  <Text>Seller Name</Text>  
                </HStack>  
              </Th>  
              <Th>  
                <HStack spacing={1}>  
                  <Icon as={FaWeight} color="green.600" />  
                  <Text>Total Weight</Text>  
                </HStack>  
              </Th>  
              <Th>  
                <HStack spacing={1}>  
                  <Icon as={FaBoxes} color="green.600" />  
                  <Text>Total Items</Text>  
                </HStack>  
              </Th>  
              <Th>  
                <HStack spacing={1}>  
                  <Icon as={FaRupeeSign} color="green.600" />  
                  <Text>Final Price</Text>  
                </HStack>  
              </Th>  
              <Th>  
                <HStack spacing={1}>  
                  <Icon as={FaDollarSign} color="green.600" />  
                  <Text>Payment Status</Text>  
                </HStack>  
              </Th>  
              <Th>  
                <HStack spacing={1}>  
                  <Icon as={FaCalendarAlt} color="green.600" />  
                  <Text>Date</Text>  
                </HStack>  
              </Th>  
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
                  <Td>₹{finalPrice}</Td>  
                  <Td>  
                    <Tag  
                      colorScheme={  
                        paymentStatus.toLowerCase() === "pending" ? "yellow" : "green"  
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