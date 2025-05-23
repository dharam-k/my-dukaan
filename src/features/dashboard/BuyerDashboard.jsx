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

import { PaymentsTable } from "../payments/PaymentsTable";
import { OrderOptions } from "../orders/OrderOptions";
import Navbar from "../../components/layout/Navbar";
import UserProfileDrawer from "../../components/layout/UserProfileDrawer";
import Footer from "../../components/layout/Footer";
import { OrdersTable } from "../orders/OrdersTable";
import { subscribeCurrentUser, subscribeUsers } from "../../services/users/UserService";
import { subscribeOrders } from "../../services/orders/OrderService";
import { subscribePayments } from "../../services/payments/PaymentService";

export default function BuyerDashboard() {  
  const [totalOrders, setTotalOrders] = useState([]);  
  const [totalPayments, setTotalPayments] = useState([]);  
  const [overviewStats, setOverviewStats] = useState([]);  
  const [orderAnalyticsStats, setOrderAnalyticsStats] = useState([]);  
  const [inventoryStats, setInventoryStats] = useState([]);  
  const [sellersMillsStats, setSellersMillsStats] = useState([]);  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  
  const [loggedInUser, setLoggedInUser] = useState(null);

    // Data from Firebase
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeCurrentUser(userData => {
      setLoggedInUser(userData);
    });
    return () => unsubscribe();
  }, []);


  const openUserMenu = () => setIsUserMenuOpen(true);  
  const closeUserMenu = () => setIsUserMenuOpen(false); 

  // Subscribe to logged-in user data
  useEffect(() => {
    const unsubscribe = subscribeCurrentUser(setLoggedInUser);
    return () => unsubscribe();
  }, []);

    // Subscribe to users collection
  useEffect(() => {
    const unsubscribe = subscribeUsers(
      (data) => setUsers(data),
      (err) => console.error("Error fetching users:", err)
    );
    return () => unsubscribe();
  }, []);

    // Subscribe to orders collection
  useEffect(() => {
    const unsubscribe = subscribeOrders(
      (data) => setOrders(data),
      (err) => console.error("Error fetching orders:", err)
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to payments collection
  useEffect(() => {
    const unsubscribe = subscribePayments(
      (data) => setPayments(data),
      (err) => console.error("Error fetching payments:", err)
    );
    return () => unsubscribe();
  }, []);

  // Compute all stats on fresh data change
  useEffect(() => {
    try {
      // Total Orders count
      const totalOrdersCount = orders.length;

      // Total Sellers count based on fetched users with userType 'seller'
      const totalSellersCount = users.filter(u => u.userType === "seller").length;

      // Pending payments count
      const pendingPaymentsCount = payments.filter(p => p.paymentStatus === "PENDING").length;

      setOverviewStats([
        { label: "Total Orders", value: totalOrdersCount },
        { label: "Total Sellers", value: totalSellersCount },
        { label: "Pending Payments", value: pendingPaymentsCount, isCurrency: true },
      ]);

      // Completed/Pending orders counts based on payments
      const completedPaymentsOrderIds = new Set(
        payments.filter(p => p.paymentStatus === "COMPLETED").map(p => p.orderId)
      );
      const completedOrdersCount = orders.filter(o => completedPaymentsOrderIds.has(o.orderId)).length;
      const pendingOrdersCount = totalOrdersCount - completedOrdersCount;

      setOrderAnalyticsStats([
        { label: "Completed Orders", value: completedOrdersCount },
        { label: "Pending Orders", value: pendingOrdersCount },
      ]);

      // Inventory stats
      const warehouses = new Set(orders.map(o => o.inputs?.warehouse).filter(Boolean));
      const totalItems = orders.reduce((acc, o) => acc + (Number(o.inputs?.totalItem) || 0), 0);
      const totalWeightSum = orders.reduce((acc, o) => acc + (Number(o.inputs?.totalWeight) || 0), 0);

      setInventoryStats([
        { label: "Total Warehouses", value: warehouses.size },
        { label: "Total Items", value: totalItems },
        { label: "Total Weights", value: (totalWeightSum / 100).toFixed(2), unit: "quantal" },
      ]);

      setSellersMillsStats([
        { label: "Total Sellers", value: totalSellersCount },
        { label: "Total Mills", value: 0 }, // Replace or extend with mills data if you have
      ]);
    } catch (err) {
      console.error("Error computing stats:", err);
    }
  }, [users, orders, payments]);

  useEffect(() => { 
    
    try {  
      const totalUser = JSON.parse(localStorage.getItem("users")) || []
      const totalSellersList = totalUser.filter((u)=> u.userType === 'seller');
      const orders = JSON.parse(localStorage.getItem("orders")) || [];  
      const payments = JSON.parse(localStorage.getItem("payments")) || [];  

      // --- Overview Stats ---  
      const totalOrders = orders.length;  
      const totalSellers = totalSellersList.length;  
      const totalPaymentsCount = payments.filter(p => p.paymentStatus == "Pending").length;  

      const overview = [  
        { label: "Total Orders", value: totalOrders },  
        { label: "Total Sellers", value: totalSellers },  
        { label: "Pending Payments", value: totalPaymentsCount, isCurrency: true },  
      ];  
      setOverviewStats(overview);  

      // --- Order Analytics ---  
      // Orders with completed payment or not (for example)  
      const completedPaymentsOrderIds = new Set(  
        payments.filter(p => p.paymentStatus === "Completed").map(p => p.orderId)  
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
        setTotalOrders(JSON.parse(storedOrders));  
      } catch (e) {  
        console.error("Failed to parse totalOrders from localStorage", e);  
      }  
    }  

    // Load payments and filter to pending  
    const storedPayments = localStorage.getItem("payments");  
    if (storedPayments) {  
      try {  
        const allPayments = JSON.parse(storedPayments);  
        // const pending = allPayments.filter(  
        //   (p) => p.paymentStatus === "PENDING"  
        // );  
        setTotalPayments(allPayments);  
      } catch (e) {  
        console.error("Failed to parse payments from localStorage", e);  
      }  
    }  
  }, []);  


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
          userName={loggedInUser?.name} 
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
            खरीदारी का नया सफर  
          </Text>  
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="280px">  
            विश्वसनीय विक्रेताओं से सीधे आपके लिए 
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
      <OrdersTable orders={totalOrders} />  
      {/* Pending Payments Table */}  
      <PaymentsTable /> 
        {/* Footer */}  
        <Footer />  
    </Box>  
    
  );  
}  