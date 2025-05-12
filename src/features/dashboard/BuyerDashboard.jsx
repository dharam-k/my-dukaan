import React from "react";  
import {  
  Box,  
  Heading,  
  Text,  
  Tabs,  
  TabList,  
  TabPanels,  
  Tab,  
  TabPanel,  
  Flex,  
  Spacer,  
  Button,  
  VStack,  
  Center,  
  HStack,  
  Icon,  
} from "@chakra-ui/react";  
import { StatsGrid } from "../../components/ui/StatsGrid";  
import { RecentOrdersTable } from "../orders/RecentOrdersTable";  
import {  
  overviewStats,  
  orderAnalyticsStats,  
  inventoryStats,  
  sellersMillsStats,  
  recentOrders,  
  pendingPayments,  
} from "./dashboardData";  
import { PendingPaymentsTable } from "../payments/PendingPaymentsTable";  
import { OrderOptions } from "../orders/OrderOptions";  
import Navbar from "../../components/layout/Navbar";  

import {  
  FaHome,  
  FaChartLine,  
  FaWarehouse,  
  FaUsers,  
  FaShoppingCart,  
} from "react-icons/fa";  
import Footer from "../../components/layout/Footer";

export default function BuyerDashboard() {  
  const handleViewOrder = (orderId) => {  
    alert(`View details for Order ID: ${orderId} (to be implemented)`);  
  };  

  const handleStatClick = (label) => {  
    alert(`View details for: ${label}`);  
  };  

  return (  <>
    <Box  
      p={{ base: 4, md: 8 }}  
      maxW="1200px"  
      maxWidth={{ base: 300, md: 800, xl: 1000 }}  
      mx="auto"  
    >  
      {/* Header */}  
      <Navbar />  

      {/* New Order Button */}  
      <Center minH="200px" mb={8} px={4}>  
        <VStack  
          spacing={6}  
          w="100%"  
          align="center"  
          textAlign="center"  
          p={6}  
          boxShadow="md"  
          borderRadius="md"  
          bg="gray.50"  
        >  
          <HStack spacing={3}>  
            <Icon as={FaShoppingCart} boxSize={8} color="green.600" />  
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" color="green.600">  
              Start Your New Order  
            </Text>  
          </HStack>  

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="280px">  
            Choose how you want to place your order.  
          </Text>  
          <Box w="100%">  
            <Center>  
              <OrderOptions />  
            </Center>  
          </Box>  
        </VStack>  
      </Center>  

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
            <HStack spacing={2} justify="center">  
              <Icon as={FaHome} color="green.600" />  
              <Text>Overview</Text>  
            </HStack>  
          </Tab>  
          <Tab minW="140px" flexShrink={0}>  
            <HStack spacing={2} justify="center">  
              <Icon as={FaChartLine} color="green.600" />  
              <Text>Order Analytics</Text>  
            </HStack>  
          </Tab>  
          <Tab minW="180px" flexShrink={0}>  
            <HStack spacing={2} justify="center">  
              <Icon as={FaWarehouse} color="green.600" />  
              <Text>Inventory & Warehouses</Text>  
            </HStack>  
          </Tab>  
          <Tab minW="120px" flexShrink={0}>  
            <HStack spacing={2} justify="center">  
              <Icon as={FaUsers} color="green.600" />  
              <Text>Sellers & Mills</Text>  
            </HStack>  
          </Tab>  
        </TabList>  

        <TabPanels>  
          <TabPanel p={0}>  
            <StatsGrid stats={overviewStats} onStatClick={handleStatClick} />  
          </TabPanel>  
          <TabPanel p={0}>  
            <StatsGrid stats={orderAnalyticsStats} onStatClick={handleStatClick} />  
          </TabPanel>  
          <TabPanel p={0}>  
            <StatsGrid stats={inventoryStats} onStatClick={handleStatClick} />  
          </TabPanel>  
          <TabPanel p={0}>  
            <StatsGrid stats={sellersMillsStats} onStatClick={handleStatClick} />  
          </TabPanel>  
        </TabPanels>  
      </Tabs>  

      {/* Recent Orders Table */}  
      <RecentOrdersTable orders={recentOrders} onViewOrder={handleViewOrder} />  
      {/* Pending Payments Table */}  
      <PendingPaymentsTable payments={pendingPayments} />  
    </Box>  
      {/* Footer */}  
    <Footer />
    </>
  );  
}