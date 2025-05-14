import React, { useState } from "react";  
import {  
  Box,  
  VStack,  
  Text,  
  HStack,  
  SimpleGrid,  
  Divider,  
  Button,  
  useDisclosure,
  MenuDivider,
} from "@chakra-ui/react";  
import { FaWeight, FaBoxes, FaUsers, FaRupeeSign, FaMoneyBillWave, FaBalanceScaleRight} from "react-icons/fa";   
import Navbar from "../../components/layout/Navbar";  
import SellerSelector from "../sellers/SellerSelector";  
import SellerCardDetail from "../sellers/SellerCardDetail";  
import BuyerCardDetail from "../buyers/BuyerCardDetail";  
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

const defaultBuyer = {  
  name: "Jai Hanuman Traders",  
  address: "Bankata Bazar, UP",  
  phone: "7011571659",  
};  

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
   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  
  
    const openUserMenu = () => setIsUserMenuOpen(true);  
    const closeUserMenu = () => setIsUserMenuOpen(false);  

  const { isOpen, onOpen, onClose } = useDisclosure();  

  const [orderSummary, setOrderSummary] = useState(null); 

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


  const navigate = useNavigate();  
  const handleClose = () => {  
    onClose();          // Close the modal first  
    navigate("/dashboard"); // Navigate to dashboard page  
  };  
    // Submit handler  
  const handleSubmit = () => { 
    
    console.log(orderDate)
    console.log(selectedSeller)
    if (!selectedSeller || !orderDate) {  
      alert("Please select a seller and pick a date before submitting.");  
      return;  
    }  

    // Retrieve existing orders from localStorage  
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];  

    // Generate new Order ID with zero padded number (e.g., OD-0003)  
    const newOrderId = `OD-${String(existingOrders.length + 1).padStart(4, "0")}`;  

    const order = {  
      orderId: newOrderId, 
      buyer: defaultBuyer,  
      seller: selectedSeller,  
      date: orderDate,  
      inputs: {  
        ratePerQuantal,  
        poldariRate,  
        dharmKata, 
        baadWajan, 
        totalWeight,
        totalbaadWajan,
        finalWeight,
        totalItem,  
        totalPoldar,  
        itemType,  
        quality,  
        warehouse,  
      },  
      calculations: {  
        totalPolidari,  
        perHeadPoldari,  
        totalPrice,  
        finalPrice,  
      },  
    };  



    // Add new order  
    existingOrders.push(order);  

    // Save back to localStorage  
    localStorage.setItem("orders", JSON.stringify(existingOrders));  

    // Show modal with summary  
    setOrderSummary(order);  
    onOpen();  
  };  

  return (  
     <>  
      <Box maxW="1200px" minH={575} mx="auto" p={{ base: 4, md: 8 }}>  
        <Navbar onOpenUserMenu={openUserMenu} />  
        <Divider mb={5} />
        <UserProfileDrawer  
          isOpen={isUserMenuOpen}  
          onClose={closeUserMenu}  
          userName="John Doe" // Pass real user name dynamically here  
        />  

        <VStack spacing={6} align="stretch">  
          {/* Buyer Details */}  
          <Box>  
            <Text fontSize="xl" fontWeight="bold" mb={2}>  
              Buyer Details  
            </Text>  
            <BuyerCardDetail buyer={defaultBuyer} />  
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
                    {/* Bind DatePicker */}  
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
                      <Text >
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

                {/* Submit Button */}
                <Button mt={6} colorScheme="green" onClick={handleSubmit}>
                  Submit Order
                </Button>
              </Box>
            </>  
          )}  
        </VStack>  
      </Box>  
      {/* Footer */}  
      <Footer  />  

    {/* Order Summary Modal */}  
    <OrderSummaryModal  
      isOpen={isOpen}  
      onClose={handleClose}  
      orderSummary={orderSummary}  
    />
    </>   
  );  
}