import React, { useEffect, useState } from "react";  
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
  Divider,    
} from "@chakra-ui/react";  
import { StatsGrid } from "../../components/ui/StatsGrid";
import { RecentOrdersTable } from "../orders/RecentOrdersTable";

import { PendingPaymentsTable } from "../payments/PendingPaymentsTable";
import { OrderOptions } from "../orders/OrderOptions";
import Navbar from "../../components/layout/Navbar";
import UserProfileDrawer from "../../components/layout/UserProfileDrawer";
import Footer from "../../components/layout/Footer";

export default function BuyerDashboard() {  
  const [recentOrders, setRecentOrders] = useState([]);  
  const [pendingPayments, setPendingPayments] = useState([]);  
  const [overviewStats, setOverviewStats] = useState([]);  
  const [orderAnalyticsStats, setOrderAnalyticsStats] = useState([]);  
  const [inventoryStats, setInventoryStats] = useState([]);  
  const [sellersMillsStats, setSellersMillsStats] = useState([]);  
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  

  const openUserMenu = () => setIsUserMenuOpen(true);  
  const closeUserMenu = () => setIsUserMenuOpen(false);  

  useEffect(() => { 
    
    try {  
      // Parse raw data arrays from localStorage  
      const sellers = JSON.parse(localStorage.getItem("dharmkata_sellers")) || [];  
      const orders = JSON.parse(localStorage.getItem("orders")) || [];  
      const payments = JSON.parse(localStorage.getItem("payments")) || [];  

      // --- Overview Stats ---  
      const totalOrders = orders.length;  
      const totalSellers = sellers.length;  
      const pendingPaymentsCount = payments.filter(p => p.paymentStatus == "PENDING").length;  

      const overview = [  
        { label: "Total Orders", value: totalOrders },  
        { label: "Total Sellers", value: totalSellers },  
        { label: "Pending Payments", value: pendingPaymentsCount, isCurrency: true },  
      ];  
      setOverviewStats(overview);  

      // --- Order Analytics ---  
      // Orders with completed payment or not (for example)  
      const completedPaymentsOrderIds = new Set(  
        payments.filter(p => p.paymentStatus === "COMPLETED").map(p => p.orderId)  
      );  
      const completedOrdersCount = orders.filter(o => completedPaymentsOrderIds.has(o.orderId)).length;  
      const pendingOrdersCount = totalOrders - completedOrdersCount;  

      const orderAnalytics = [  
        { label: "Completed Orders", value: completedOrdersCount },  
        { label: "Pending Orders", value: pendingOrdersCount },  
      ];  
      setOrderAnalyticsStats(orderAnalytics);  

      // --- Inventory & Warehouses ---  
      // Unique warehouses in orders  
      const warehouseSet = new Set(orders.map(o => o.inputs?.warehouse).filter(Boolean));  
      // Total items sum up  
      const totalItems = orders.reduce(  
        (acc, o) => acc + (Number(o.inputs?.totalItem) || 0),  
        0  
      ); 
            // Total items sum up  
      const totalItemsWeight = orders.reduce(  
        (acc, o) => acc + (Number(o.inputs?.totalWeight) || 0),  
        0  
      ); 

      const inventory = [  
        { label: "Total Warehouses", value: warehouseSet.size },  
        { label: "Total Items", value: totalItems },  
        { label: "Total Weights", value: (totalItemsWeight/100) , unit: "quantal" },  
      ];  
      setInventoryStats(inventory);  

      // --- Sellers & Mills ---  
      // You may include seller count again or data from sellers if you have more fields  
      const sellersMills = [  
        { label: "Total Sellers", value: totalSellers },  
        { label: "Total Mills", value: 0 },  
        // add custom mills related data here if applicable  
      ];  
      setSellersMillsStats(sellersMills);  
    } catch (err) {  
      console.error("Error building stats from localStorage data", err);  
    }   
    // Load recent orders from localStorage  
    const storedOrders = localStorage.getItem("orders");  
    if (storedOrders) {  
      try {  
        setRecentOrders(JSON.parse(storedOrders));  
      } catch (e) {  
        console.error("Failed to parse recentOrders from localStorage", e);  
      }  
    }  

    // Load payments and filter to pending  
    const storedPayments = localStorage.getItem("payments");  
    if (storedPayments) {  
      try {  
        const allPayments = JSON.parse(storedPayments);  
        const pending = allPayments.filter(  
          (p) => p.paymentStatus === "PENDING"  
        );  
        setPendingPayments(pending);  
      } catch (e) {  
        console.error("Failed to parse payments from localStorage", e);  
      }  
    }  
  }, []);  



  const handleViewOrder = (orderId) => {  
    alert(`View details for Order ID: ${orderId} (to be implemented)`);  
  };  

  const handleStatClick = (label) => {  
    alert(`View details for: ${label}`);  
  };  

  return (  
    <Box p={{ base: 0, md: 8 }} maxW="1200px" maxWidth={{ base: 355, md: 800, "xl": 1000 }} mx="auto">  
      {/* Header */}  
        <Navbar onOpenUserMenu={openUserMenu} />  
        <Divider mb={5} />
        <UserProfileDrawer  
          isOpen={isUserMenuOpen}  
          onClose={closeUserMenu}  
          userName="John Doe" // Pass real user name dynamically here  
        /> 

      {/* New Order Button */}  
      <Center minH="200px" minWidth={{base: 300, md: 600}}  px={4}>  
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
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" color="green.600">  
            Start Your New Order  
          </Text>  
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
    <Tabs  
      variant="enclosed"  
      colorScheme="green"  
      isFitted={false}  
      w="100%"  
      pt={5}
    >  
      <TabList  
        overflowX="auto"  
        whiteSpace="nowrap"  
        mb={4}  
        css={{  
          "&::-webkit-scrollbar": { height: "6px" },  
          "&::-webkit-scrollbar-thumb": { background: "#38A169", borderRadius: "24px" },  
        }}  
      >  
        <Tab minW="120px" flexShrink={0}>Overview</Tab>  
        <Tab minW="140px" flexShrink={0}>Order Analytics</Tab>  
        <Tab minW="180px" flexShrink={0}>Inventory & Warehouses</Tab>  
        <Tab minW="120px" flexShrink={0}>Sellers & Mills</Tab>  
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
  
        {/* Footer */}  
        <Footer />  
    </Box>  
    
  );  
}  