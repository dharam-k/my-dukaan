import React, { useEffect, useState } from "react";  
import {  
  Box,  
  VStack,  
  Text,  
  HStack,  
  SimpleGrid,  
  Divider,  
  Button,  
  useDisclosure,
  useToast,
} from "@chakra-ui/react";  
import { FaWeight, FaBoxes, FaUsers, FaRupeeSign, FaMoneyBillWave, FaBalanceScaleRight} from "react-icons/fa";   
import Navbar from "../../components/layout/Navbar";  
import { DatePicker } from "../../components/ui/DatePicker";  
import RateInput from "./RateInput";  
import WeightInputs from "./WeightInputs";  
import ItemType from "./ItemType";  
import ItemQuality from "./ItemQuality";  
import WarehouseSelect from "./WarehouseSelect"; 
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import OrderSummaryModal from "./OrderSummaryModal";
import UserProfileDrawer from "../../components/layout/UserProfileDrawer";
import BuyerCardDetail from "../../users/buyers/BuyerCardDetail";
import SellerSelector from "../../users/sellers/SellerSelector";
import SellerCardDetail from "../../users/sellers/SellerCardDetail";

import { addOrder } from "../../services/orders/OrderService"; // New OrderService import
import { subscribeCurrentUser } from "../../services/users/UserService";
import { getNextOrderId } from "../../services/orders/counterOrderID";

export default function CreateOrder() {  
  const [selectedSeller, setSelectedSeller] = useState(null);  
  const [ratePerQuantal, setRatePerQuantal] = useState("");  
  const [poldariRate, setPoldariRate] = useState(4);  
  const [totalWeight, setTotalWeight] = useState("");  
  const [totalItem, setTotalItem] = useState("");  
  const [itemType, setItemType] = useState("");  
  const [quality, setQuality] = useState("");  
  const [warehouse, setWarehouse] = useState(""); 
  const [dharmKata, setDharmKata] = useState("");  
  const [totalPoldar, setTotalPoldar] = useState("");
  const [baadWajan, setBaadWajan] = useState(500);
  const [orderDate, setOrderDate] = useState(new Date());  
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  
  const { isOpen, onOpen, onClose } = useDisclosure();  

  const [orderSummary, setOrderSummary] = useState(null); 
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const openUserMenu = () => setIsUserMenuOpen(true);  
  const closeUserMenu = () => setIsUserMenuOpen(false); 

  // Parsing numeric values safely
  const weightNum = parseFloat(totalWeight) || 0;  
  const rateNum = parseFloat(ratePerQuantal) || 0;  
  const itemNum = parseFloat(totalItem) || 0;  
  const poldariNum = parseFloat(poldariRate) || 0;  
  const poldarNum = parseFloat(totalPoldar) || 0;   

  const totalPolidari = itemNum * poldariNum;  
  const perHeadPoldari = poldarNum > 0 ? totalPolidari / poldarNum : 0;  
  const totalbaadWajan =  parseFloat(((baadWajan/100)* weightNum)/1000).toFixed(2);
  const finalWeight = (weightNum - totalbaadWajan);
  const totalPrice = (finalWeight / 100) * rateNum; 
  const finalPrice = totalPrice - totalPolidari; 

  useEffect(() => {
    const unsubscribe = subscribeCurrentUser(userData => {
      console.log(userData)
      setLoggedInUser(userData);
    });
    return () => unsubscribe();
  }, []);

  const handleClose = () => {  
    onClose();
    navigate("/buyer-dashboard");
  };

  const handleSubmit = async () => {
    if (!selectedSeller || !orderDate) {
      toast({
        title: "Missing seller or date",
        description: "Please select a seller and pick a date before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      !ratePerQuantal ||
      !poldariRate ||
      !dharmKata ||
      !baadWajan ||
      weightNum <= 0 ||
      itemNum <= 0 ||
      poldarNum <= 0 ||
      !itemType ||
      !quality ||
      !warehouse
    ) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before submitting the order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const newOrderId = await getNextOrderId();   // Get sequential order ID!

      const newOrder = {
        orderId: newOrderId,  
        buyerId: loggedInUser?.id || "unknown_buyer",
        sellerId: selectedSeller?.id || "unknown_seller",
        orderDate: orderDate.toISOString(),
        inputs: {
          ratePerQuantal: rateNum,
          poldariRate: poldariNum,
          dharmKata,
          baadWajan: parseFloat(baadWajan),
          totalWeight: weightNum,
          totalbaadWajan: parseFloat(totalbaadWajan),
          finalWeight: parseFloat(finalWeight.toFixed(2)),
          totalItem: itemNum,
          totalPoldar: poldarNum,
          itemType,
          quality,
          warehouse,
        },
        paymentIds: [],
      };

      const docId = await addOrder(newOrder);

      toast({
        title: "Order Created",
        description: `Order successfully created - ${newOrderId}.`,
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      setOrderSummary({ ...newOrder, id: docId });
      onOpen();
    } catch (error) {
      toast({
        title: "Order creation failed",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (  
     <>  
      <Box maxW="1200px" minH={575} mx="auto" p={{ base: 4, md: 8 }}>  
        <Navbar onOpenUserMenu={openUserMenu} />  
        <Divider mb={5} />
        <UserProfileDrawer  
          isOpen={isUserMenuOpen}  
          onClose={closeUserMenu}  
          userName={loggedInUser?.name}  
        />  

        <VStack spacing={6} align="stretch">  
          {/* Buyer Details */}  
          <Box>  
            <Text fontSize="xl" fontWeight="bold" mb={2}>  
              Buyer Details  
            </Text>  
            <BuyerCardDetail buyer={loggedInUser} />  
          </Box>  

          {/* Seller Selector */}  
          <Box>  
            <SellerSelector selectedSeller={selectedSeller} setSelectedSeller={setSelectedSeller} />  
          </Box>  

          {/* Seller Details & Date Picker */}  
          {selectedSeller && (  
            <>  
              <Box>  
                <Text fontSize="xl" fontWeight="bold" mb={2}>  
                  Seller Details & Date  
                </Text>  
                <Box p={4} borderWidth="1px" borderRadius="md" bg="blue.50">  
                  <HStack alignItems={"baseline"} spacing={2}>  
                    <SellerCardDetail seller={selectedSeller} />  
                    <DatePicker  
                      value={orderDate}  
                      onChange={(date) => setOrderDate(date)}  
                    />  
                  </HStack>  
                </Box>  
              </Box>  

              <Box alignItems={"baseline"}>  
                <Text fontSize="xl" fontWeight="bold" mb={2}>  
                  Item Type, Quality & Warehouse  
                </Text>  
                <Divider orientation="horizontal" />  
                <SimpleGrid alignItems={"baseline"} columns={{ base: 1, md: 3 }} spacing={4}>  
                  <ItemType itemType={itemType} setItemType={setItemType} />  
                  <ItemQuality quality={quality} setQuality={setQuality} />  
                  <WarehouseSelect warehouse={warehouse} setWarehouse={setWarehouse} />  
                </SimpleGrid>  
              </Box>  

              <Box>  
                <Text fontSize="xl" fontWeight="bold" mb={2}>  
                  Rate Inputs  
                </Text>  
                <Divider orientation="horizontal" />  
                <RateInput  
                  ratePerQuantal={ratePerQuantal}  
                  setRatePerQuantal={setRatePerQuantal}  
                  poldariRate={poldariRate}  
                  setPoldariRate={setPoldariRate}  
                  dharmKata={dharmKata}  
                  setDharmKata={setDharmKata}  
                />  
              </Box>  

              <Box p={4} borderWidth="1px" borderRadius="md" bg="blue.50">  
                <Text fontSize="xl" fontWeight="bold" mb={2}>  
                  Weight Inputs  
                </Text>  
                <Divider orientation="horizontal" />  
                <WeightInputs  
                  totalWeight={totalWeight}  
                  setTotalWeight={setTotalWeight}  
                  totalItem={totalItem}  
                  setTotalItem={setTotalItem}  
                  totalPoldar={totalPoldar}   
                  setTotalPoldar={setTotalPoldar}  
                  baadWajan={baadWajan}   
                  setBaadWajan={setBaadWajan} 
                />  
              </Box>  

              <Box
                p={6}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.100"
                maxW="1000px"
                fontSize="lg"
              >
                <Text borderBottom="1px" fontSize="xl" fontWeight="bold" mb={4}>
                  Calculation Summary
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {/* POLDARI BOX */}
                  <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                    <Text fontWeight="bold" mb={2}>पोल्दारी</Text>
                    <Divider my={2} />
                    <HStack mb={2} spacing={2}>
                      <Box color="purple.500">
                        <FaUsers />
                      </Box>
                      <Text>कुल पोल्डर: {poldarNum}</Text>
                    </HStack>
                    <HStack mb={2} spacing={2}>
                      <Box color="red.500">
                        <FaMoneyBillWave />
                      </Box>
                      <Text>
                        कुल पोल्दारी (Rs): ₹
                        {totalPolidari.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </HStack>
                    <Divider my={2} />
                    <HStack mb={2} spacing={2}>
                      <Box color="green.500">
                        <FaMoneyBillWave />
                      </Box>
                      <Text textColor="green">
                        प्रति व्यक्ति पोल्डारी: ₹
                        {perHeadPoldari.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </HStack>
                  </Box>

                  {/* WEIGHT BOX */}
                  <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                    <Text fontWeight="bold" mb={2}>वजन</Text>
                    <Divider my={2} />
                    <HStack mb={2} spacing={2}>
                      <Box color="orange.500">
                        <FaBoxes />
                      </Box>
                      <Text>कुल बोरा: {itemNum}</Text>
                    </HStack>
                    <HStack mb={2} spacing={2}>
                      <Box color="teal.500">
                        <FaWeight />
                      </Box>
                      <Text>
                        वजन: {weightNum} kg ~ {(weightNum / 100).toFixed(2)} qntl
                      </Text>
                    </HStack>

                    <HStack mb={2} spacing={2}>
                      <Box color="red.500">
                        <FaBalanceScaleRight />
                      </Box>
                      <Text textColor="red">
                        कुल बाद वजन : {totalbaadWajan > 0 ? " - " : ""}
                        {totalbaadWajan} kg
                      </Text>
                    </HStack>
                    <Divider my={2} />
                    <HStack mb={2} spacing={2}>
                      <Box color="teal.500">
                        <FaWeight />
                      </Box>
                      <Text color="green.500">
                        कुल वजन: {finalWeight > 0 ? (finalWeight).toFixed(2) : "0.00"} kg
                      </Text>
                    </HStack>
                  </Box>

                  {/* PRICE SUMMARY BOX */}
                  <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                    <Text fontWeight="bold" mb={2}>कीमत सारांश</Text>
                    <Divider my={2} />
                    <HStack mb={2} spacing={2}>
                      <Box color="blue.500">
                        <FaRupeeSign />
                      </Box>
                      <Text>
                        कुल कीमत : + ₹
                        {totalPrice.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </HStack>
                    <HStack mb={2} spacing={2}>
                      <Box color="red.500">
                        <FaMoneyBillWave />
                      </Box>
                      <Text textColor="red">
                        कुल पोल्दारी: - ₹
                        {totalPolidari.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </HStack>

                    <Divider my={2} />

                    <Text color="green.500" fontWeight="bold" mt={2}>
                      अंतिम कीमत: ₹
                      {finalPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Button mt={6} colorScheme="green" onClick={handleSubmit} isLoading={loading}>
                  Submit Order
                </Button>
              </Box>
            </>  
          )}  
        </VStack>  
      </Box>  
      <Footer  />  

      <OrderSummaryModal  
        isOpen={isOpen}  
        onClose={handleClose}  
        orderSummary={orderSummary}  
      />
    </>   
  );  
}