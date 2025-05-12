import React, { useState, useRef } from "react";  
import {  
  Box,  
  VStack,  
  Text,  
  HStack,  
  SimpleGrid,  
  Divider,  
  Button,  
  Modal,  
  ModalOverlay,  
  ModalContent,  
  ModalHeader,  
  ModalCloseButton,  
  ModalBody,  
  ModalFooter,  
  useDisclosure,
  Icon, 
} from "@chakra-ui/react";  
import { FaWeight, FaBoxes, FaUsers, FaRupeeSign, FaMoneyBillWave ,  
  FaStore,  
  FaCalendarAlt,  
  FaClipboardList,  
  FaCalculator,  
  FaHashtag,
  FaUser,
  FaTag,
  FaWarehouse,  
  FaIndustry, } from "react-icons/fa";   
import Navbar from "../../components/layout/Navbar";  
import SellerSelector from "../sellers/SellerSelector";  
import SellerCardDetail from "../sellers/SellerCardDetail";  
import BuyerCardDetail from "../buyers/BuyerCardDetail";  
import { DatePicker } from "../../components/ui/DatePicker";  
import RateInput from "./RateInput";  
import WeightInputs from "./WeightInputs";  
import ItemType from "./ItemType";  
import ItemQuality from "./ItemQuality";  
import WarehouseSelect from "./WarehouseSelect"; // <-- Import new warehouse component  
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const defaultBuyer = {  
  name: "John Doe",  
  address: "123 Buyer St, City",  
  phone: "555-1234",  
};  

export default function CreateOrder() {  
  const [selectedSeller, setSelectedSeller] = useState(null);  
  const [ratePerQuantal, setRatePerQuantal] = useState("");  
  const [poldariRate, setPoldariRate] = useState(5);  
  const [totalWeight, setTotalWeight] = useState("");  
  const [totalItem, setTotalItem] = useState("");  
  const [itemType, setItemType] = useState("");  
  const [quality, setQuality] = useState("");  
  const [warehouse, setWarehouse] = useState(""); 
  const [dharmKata, setDharmKata] = useState("");  
  const [totalPoldar, setTotalPoldar] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());  

  const { isOpen, onOpen, onClose } = useDisclosure();  
  const cancelRef = useRef();  

  const [orderSummary, setOrderSummary] = useState(null); 

  const weightNum = parseFloat(totalWeight) || 0;  
  const rateNum = parseFloat(ratePerQuantal) || 0;  
  const itemNum = parseFloat(totalItem) || 0;  
  const poldariNum = parseFloat(poldariRate) || 0;  
  const poldarNum = parseFloat(totalPoldar) || 0;   
  const totalPolidari = itemNum * poldariNum;  
  const perHeadPoldari = poldarNum > 0 ? totalPolidari / poldarNum : 0;  
  const totalPrice = (weightNum / 100) * rateNum; 
  const finalPrice = totalPrice - totalPolidari;  


  const navigate = useNavigate();  
  const handleClose = () => {  
    onClose();          // Close the modal first  
    navigate("/dashboard"); // Navigate to dashboard page  
  }; 

  const inputIconsMap = {  
    ratePerQuantal: FaRupeeSign,  
    poldariRate: FaMoneyBillWave,  
    dharmKata: FaTag,  
    totalWeight: FaWeight,  
    totalItem: FaBoxes,  
    totalPoldar: FaUsers,  
    itemType: FaTag,  
    quality: FaTag,  
    warehouse: FaWarehouse,  
  };  

  const calculationIconsMap = {  
    totalPolidari: FaMoneyBillWave,  
    perHeadPoldari: FaMoneyBillWave,  
    totalPrice: FaRupeeSign,  
    finalPrice: FaRupeeSign,  
  }; 

  const inputUnitsMap = {  
    ratePerQuantal: "₹/quantal",  
    poldariRate: "₹",  
    dharmKata: "kg",  
    totalWeight: "kg",  
    totalItem: "pcs",  
    totalPoldar: "persons",  
    itemType: "",          // no unit  
    quality: "",           // no unit  
    warehouse: "",         // no unit  
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
        totalWeight,  
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
      <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>  
        <Box mx="auto">  
          <Navbar />  
        </Box>  

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
                  <HStack spacing={2}>  
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
                  totalPoldar={totalPoldar} // new prop  
                  setTotalPoldar={setTotalPoldar}  
                />  
              </Box>  

              <Box  
                p={6}  
                borderWidth="1px"  
                borderRadius="md"  
                bg="gray.100"  
                maxW="400px"  
                fontSize="lg"  
              >  
                <Text borderBottom="1px" fontSize="xl" fontWeight="bold" mb={4}>  
                  Calculation  
                </Text>  

                <HStack mb={2} spacing={2}>  
                  <Box color="teal.500">  
                    <FaWeight />  
                  </Box>  
                  <Text>  
                    Total Weight: {weightNum} kg ~ {(weightNum / 100).toFixed(2)} qntl  
                  </Text>  
                </HStack>  

                <HStack mb={2} spacing={2}>  
                  <Box color="orange.500">  
                    <FaBoxes />  
                  </Box>  
                  <Text>Total Item: {itemNum}</Text>  
                </HStack>  

                <HStack mb={2} spacing={2}>  
                  <Box color="purple.500">  
                    <FaUsers />  
                  </Box>  
                  <Text>Total Poldar: {poldarNum}</Text>  
                </HStack>  

                <Divider my={4} />  

                <HStack mb={2} spacing={2}>  
                  <Box color="green.500">  
                    <FaMoneyBillWave />  
                  </Box>  
                  <Text>Per Head Poldari: ₹{perHeadPoldari.toFixed(2)}</Text>  
                </HStack>  

                <HStack mb={2} spacing={2}>  
                  <Box color="blue.500">  
                    <FaRupeeSign />  
                  </Box>  
                  <Text>Total Price (Rs): + ₹{totalPrice.toFixed(2)}</Text>  
                </HStack>  

                <HStack mb={2} spacing={2}>  
                  <Box color="red.500">  
                    <FaMoneyBillWave />  
                  </Box>  
                  <Text textColor={"red"}>Total Poldari (Rs): - ₹{totalPolidari.toFixed(2)}</Text>  
                </HStack>  



                <Text fontWeight="bold" mt={4}>  
                  Final Price: ₹{finalPrice.toFixed(2)}  
                </Text>  

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
      <Footer />  

    {/* Order Summary Modal */}  
    <Modal  
      isOpen={isOpen}   
      onClose={handleClose} 
      isCentered  
      leastDestructiveRef={cancelRef}  
      size={{ base: "md", md: "lg" }}  
    >  
      <ModalOverlay />  
        <ModalContent p={4}>  
          <ModalHeader>  
            <HStack spacing={3}>  
              <Icon as={FaClipboardList} color="green.600" boxSize={6} />  
              <Text>Order Confirmation</Text>  
            </HStack>  
            <Divider mt={2} />  
            {/* Order ID at top right inside header */}  
            {orderSummary?.orderId && (  
              <Text  
                fontSize="sm"  
                color="gray.500"  
                position="absolute"  
                top="12px"  
                right="50%"  
                fontWeight="bold"  
              >  
                <Icon as={FaHashtag} mb="2px" /> {orderSummary.orderId}  
              </Text>  
            )}  
          </ModalHeader>  
          <ModalCloseButton />  
          <ModalBody>  
            {orderSummary && (  
              <VStack spacing={6} align="stretch">  
                {/* Buyer, Seller, Date */}  
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>  
                  <Box>  
                    <HStack>  
                      <Icon as={FaUser} color="green.600" />  
                      <Text fontWeight="bold" color="green.600" fontSize="md">  
                        Buyer  
                      </Text>  
                    </HStack>  
                    <Text ml={8}>{orderSummary.buyer.name}</Text>  
                    <Text ml={8} fontSize="sm" color="gray.600">  
                      {orderSummary.buyer.address}  
                    </Text> 
                    <Text ml={8} fontSize="sm" color="gray.600">  
                      {orderSummary.buyer.phone}  
                    </Text>  
                  </Box>  

                  <Box>  
                    <HStack>  
                      <Icon as={FaStore} color="green.600" />  
                      <Text fontWeight="bold" color="green.600" fontSize="md">  
                        Seller  
                      </Text>  
                    </HStack>  
                    <Text ml={8}>{orderSummary.seller.name || JSON.stringify(orderSummary.seller)}</Text>
                    <Text ml={8} fontSize="sm" color="gray.600">  
                      {orderSummary.seller.address}  
                    </Text>   
                    <Text ml={8} fontSize="sm" color="gray.600">  
                      {orderSummary.seller.phone}  
                    </Text> 
                  </Box>  

                  <Box>  
                    <HStack>  
                      <Icon as={FaCalendarAlt} color="green.600" />  
                      <Text fontWeight="bold" color="green.600" fontSize="md">  
                        Date  
                      </Text>  
                    </HStack>  
                    <Text ml={8}>  
                      {orderSummary.date  
                        ? new Date(orderSummary.date).toLocaleDateString(undefined, {  
                            year: "numeric",  
                            month: "short",  
                            day: "numeric",  
                          })  
                        : "N/A"}  
                    </Text>  
                  </Box>  
                </SimpleGrid>  

                <Divider />  

                {/* Inputs Section */}  
                <Box>  
                  <Text  
                    fontWeight="bold"  
                    color="green.600"  
                    mb={2}  
                    fontSize="lg"  
                    borderBottom="2px solid"  
                    borderColor="green.300"  
                    pb={1}  
                  >  
                    <HStack spacing={2}>  
                      <Icon as={FaClipboardList} />  
                      <Text>Order Details</Text>  
                    </HStack>  
                  </Text>  
                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>  
                    {Object.entries(orderSummary.inputs).map(([key, val]) => {  
                      const IconComp = inputIconsMap[key] || FaClipboardList;  
                      const unit = inputUnitsMap[key] || "";  

                      return (  
                        <HStack key={key} align="center">  
                          <Icon as={IconComp} color="green.500" />  
                          <Text fontWeight="semibold" textTransform="capitalize" minW="140px">  
                            {key.replace(/([A-Z])/g, " $1")}:  
                          </Text>  
                          <Text>  
                            {val || "N/A"} {unit && <span style={{ opacity: 0.7 }}>{unit}</span>}  
                          </Text>  
                        </HStack>  
                      );  
                    })}  
                  </SimpleGrid>  
                </Box>   
 
              {/* Calculations Section */}  
              <Box>  
                <Text  
                  fontWeight="bold"  
                  color="green.600"  
                  mb={2}  
                  fontSize="lg"  
                  borderBottom="2px solid"  
                  borderColor="green.300"  
                  pb={1}  
                >  
                  <HStack spacing={2}>  
                    <Icon as={FaCalculator} />  
                    <Text>Price Summary</Text>  
                  </HStack>  
                </Text>  
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>  
                  {[  
                    "perHeadPoldari",  
                    "totalPrice",  
                    "totalPolidari",  
                    "finalPrice",  
                  ].map((key) => {  
                    const val = orderSummary.calculations[key];  
                    if (val == null) return null;  

                    const IconComp = calculationIconsMap[key] || FaCalculator;  
                    const isFinalPrice = key === "finalPrice";  

                    // Set symbol and color according to key  
                    let symbol = "";  
                    let valueColor = "green.600"; // default green  
                    if (key === "totalPrice" || key === "finalPrice") {  
                      symbol = "+ ";  
                    } else if (key === "totalPolidari") {  
                      symbol = "- ";  
                      valueColor = "red.600"; // red for negatives  
                    }  
                    // perHeadPoldari has no sign, keep green   

                    const content = (  
                      <>  
                        <Text  
                          fontWeight="bold"  
                          textTransform="capitalize"  
                          minW="140px"  
                          color="green.600"  
                        >  
                          {key.replace(/([A-Z])/g, " $1")}:  
                        </Text>  
                        <Text fontWeight="bold" color={valueColor}>  
                          {typeof val === "number"  
                            ? `${symbol}₹${val.toFixed(2)}`  
                            : val}  
                        </Text>  
                      </>  
                    );  

                    return (  
                      <HStack  
                        key={key}  
                        align="center"  
                        spacing={4}  
                        border={isFinalPrice ? "2px solid" : "none"}  
                        borderColor={isFinalPrice ? "green.600" : "none"}  
                        borderRadius={isFinalPrice ? "md" : "none"}  
                        p={isFinalPrice ? 2 : 0}  
                        w="full"  
                      >  
                        <Icon as={IconComp} color={isFinalPrice ? "green.600" : "green.500"} />  
                        {isFinalPrice ? (  
                          <Box display="flex" justifyContent="space-between" flex="1">  
                            {content}  
                          </Box>  
                        ) : (  
                          content  
                        )}  
                      </HStack>  
                    );  
                  })}  
                </SimpleGrid>
              </Box>
              </VStack>  
            )}  
          </ModalBody>    
        </ModalContent>  
      </Modal>  
    </>   
  );  
}