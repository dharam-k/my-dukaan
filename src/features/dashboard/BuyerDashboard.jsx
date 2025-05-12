import React, { useState } from "react";  
import {  
  Box,  
  Heading,  
  Text,  
  SimpleGrid,  
  Stat,  
  StatLabel,  
  StatNumber,  
  Tabs,  
  TabList,  
  TabPanels,  
  Tab,  
  TabPanel,  
  Flex,  
  Spacer,  
  Button,  
  VStack,  
  useBreakpointValue,  
  Table,  
  Thead,  
  Tbody,  
  Tr,  
  Th,  
  Td,  
  Tag,  
} from "@chakra-ui/react";  
import { useNavigate } from "react-router-dom";

const overviewStats = [  
  { label: "Total Purchases", value: 24 },  
  { label: "Completed Payments", value: 21 },  
  { label: "Pending Payments", value: 3 },  
  { label: "Pending Orders", value: 5 },  
];  

const orderAnalyticsStats = [  
  { label: "Pending Orders (₹ Lakhs)", value: 12 },  
  { label: "Completed Orders (₹ Lakhs)", value: 68 },  
];  

const inventoryStats = [  
  { label: "Total Stock in Warehouse", value: 120000 },  
  { label: "Total Warehouses", value: 6 },  
];  

const sellersMillsStats = [  
  { label: "Total Sellers", value: 15 },  
  { label: "Total Mills", value: 4 },  
];  

// Dummy recent orders data  
const recentOrders = [  
  {  
    orderId: "ORD-1001",  
    sellerName: "Seller A",  
    totalWeight: "1500 kg",  
    totalItems: 30,  
    finalPrice: "₹ 1,20,000",  
    paymentStatus: "Completed", 
    purchaseDate: "8th June 2024",  
  },  
  {  
    orderId: "ORD-1002",  
    sellerName: "Seller B",  
    totalWeight: "800 kg",  
    totalItems: 15,  
    finalPrice: "₹ 60,000",  
    paymentStatus: "Completed",  
    purchaseDate: "10th Dec 2024",  
  },  
  {  
    orderId: "ORD-1003",  
    sellerName: "Seller C",  
    totalWeight: "2000 kg",  
    totalItems: 40,  
    finalPrice: "₹ 1,50,000",  
    paymentStatus: "Pending",  
    purchaseDate: "15th Jan 2025",  
  },  
];  

export default function BuyerDashboard() {  
  const [buyerName] = useState("John Doe");  

  const btnSize = useBreakpointValue({ base: "md", md: "lg" });  
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });  
  const welcomeFontSize = useBreakpointValue({ base: "md", md: "xl" });  

  const handleNewOrder = () => {  
    alert("Navigate to New Order page (to be implemented)");  
  };  
  const navigate = useNavigate();  

  const handleLogout = () => {  
    navigate("/login");  
  };  

  const handleViewOrder = (orderId) => {  
    alert(`View details for Order ID: ${orderId} (to be implemented)`);  
  };  

  return (  
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">  
      {/* Header */}  
      <Flex direction={{ base: "column", md: "row" }} align="center" mb={6}>  
        <Heading size={headingSize}>Buyer Dashboard</Heading>  
        <Spacer />  
        <Button  
          colorScheme="green"  
          variant="outline"  
          mt={{ base: 4, md: 0 }}  
          width={{ base: "100%", md: "auto" }}  
          onClick={handleLogout} 
        >  
          Logout  
        </Button>  
      </Flex>  

      {/* Welcome Text */}  
      <Text fontSize={welcomeFontSize} mb={6}>  
        Welcome back, <strong>{buyerName}</strong>!  
      </Text>  

      {/* New Order Button Section */}  
      <VStack mb={8} align="stretch" maxW={{ base: "100%", md: "320px" }}>  
        <Button  
          colorScheme="green"  
          size={btnSize}  
          onClick={handleNewOrder}  
          fontWeight="bold"  
          width="100%"  
        >  
          Create New Order  
        </Button>  
      </VStack>  

      {/* Tabs Section */}  
      <Tabs variant="enclosed" colorScheme="green" isFitted={false} w="100%">  
        <TabList  
          overflowX="auto"  
          whiteSpace="nowrap"  
          mb={4}  
          css={{  
            "&::-webkit-scrollbar": { height: "6px" },  
            "&::-webkit-scrollbar-thumb": {  
              background: "#38A169",  
              borderRadius: "24px",  
            },  
          }}  
        >  
          <Tab minW="120px" flexShrink={0}>  
            Overview  
          </Tab>  
          <Tab minW="140px" flexShrink={0}>  
            Order Analytics  
          </Tab>  
          <Tab minW="180px" flexShrink={0}>  
            Inventory & Warehouses  
          </Tab>  
          <Tab minW="120px" flexShrink={0}>  
            Sellers & Mills  
          </Tab>  
        </TabList>  

        <TabPanels>  
          <TabPanel p={0}>  
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={4}>  
              {overviewStats.map(({ label, value }) => (  
                <Stat  
                  key={label}  
                  p={4}  
                  shadow="sm"  
                  borderWidth="1px"  
                  rounded="md"  
                  bg="green.50"  
                >  
                  <StatLabel fontSize={{ base: "sm", md: "md" }}>  
                    {label}  
                  </StatLabel>  
                  <StatNumber fontSize={{ base: "lg", md: "2xl" }} color="green.700">  
                    {value}  
                  </StatNumber>  
                </Stat>  
              ))}  
            </SimpleGrid>  
          </TabPanel>  

          <TabPanel p={0}>  
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={4}>  
              {orderAnalyticsStats.map(({ label, value }) => (  
                <Stat  
                  key={label}  
                  p={4}  
                  shadow="sm"  
                  borderWidth="1px"  
                  rounded="md"  
                  bg="green.50"  
                >  
                  <StatLabel fontSize={{ base: "sm", md: "md" }}>  
                    {label}  
                  </StatLabel>  
                  <StatNumber fontSize={{ base: "lg", md: "2xl" }} color="green.700">  
                    ₹ {value} Lakhs  
                  </StatNumber>  
                </Stat>  
              ))}  
            </SimpleGrid>  
          </TabPanel>  

          <TabPanel p={0}>  
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={4}>  
              {inventoryStats.map(({ label, value }) => (  
                <Stat  
                  key={label}  
                  p={4}  
                  shadow="sm"  
                  borderWidth="1px"  
                  rounded="md"  
                  bg="green.50"  
                >  
                  <StatLabel fontSize={{ base: "sm", md: "md" }}>  
                    {label}  
                  </StatLabel>  
                  <StatNumber fontSize={{ base: "lg", md: "2xl" }} color="green.700">  
                    {value}  
                  </StatNumber>  
                </Stat>  
              ))}  
            </SimpleGrid>  
          </TabPanel>  

          <TabPanel p={0}>  
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={4}>  
              {sellersMillsStats.map(({ label, value }) => (  
                <Stat  
                  key={label}  
                  p={4}  
                  shadow="sm"  
                  borderWidth="1px"  
                  rounded="md"  
                  bg="green.50"  
                >  
                  <StatLabel fontSize={{ base: "sm", md: "md" }}>  
                    {label}  
                  </StatLabel>  
                  <StatNumber fontSize={{ base: "lg", md: "2xl" }} color="green.700">  
                    {value}  
                  </StatNumber>  
                </Stat>  
              ))}  
            </SimpleGrid>  
          </TabPanel>  
        </TabPanels>  
      </Tabs>  

      {/* Recent Orders Section */}  
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
              {recentOrders.map(  
                ({  
                  orderId,  
                  sellerName,  
                  totalWeight,  
                  totalItems,  
                  finalPrice,  
                  paymentStatus,
                  purchaseDate  
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
                        onClick={() => handleViewOrder(orderId)}  
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
    </Box>  
  );  
}