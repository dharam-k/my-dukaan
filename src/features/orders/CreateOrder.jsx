import React, { useState } from "react";  
import {  
  Box,  
  VStack,  
  Text,  
  HStack,  
  SimpleGrid,  
  Divider,  
} from "@chakra-ui/react";  
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

const defaultBuyer = {  
  name: "John Doe",  
  address: "123 Buyer St, City",  
  phone: "555-1234",  
};  

export default function CreateOrder() {  
  const [selectedSeller, setSelectedSeller] = useState(null);  
  const [ratePerQuantal, setRatePerQuantal] = useState("");  
  const [poldariRate, setPoldariRate] = useState("");  
  const [totalWeight, setTotalWeight] = useState("");  
  const [totalItem, setTotalItem] = useState("");  
  const [itemType, setItemType] = useState("");  
  const [quality, setQuality] = useState("");  
  const [warehouse, setWarehouse] = useState(""); 
  const [dharmKata, setDharmKata] = useState("");  
  const [totalPoldar, setTotalPoldar] = useState("");

  const weightNum = parseFloat(totalWeight) || 0;  
  const rateNum = parseFloat(ratePerQuantal) || 0;  
  const itemNum = parseFloat(totalItem) || 0;  
  const poldariNum = parseFloat(poldariRate) || 0;  

  const poldarNum = parseFloat(totalPoldar) || 0;   

  const totalPolidari = itemNum * poldariNum;  
  const perHeadPoldari = poldarNum > 0 ? totalPolidari / poldarNum : 0;  

  const totalPrice = (weightNum / 100) * rateNum; 
  const finalPrice = totalPrice - totalPolidari;  

  return (  
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
          <Text fontSize="xl" fontWeight="bold" mb={2}>  
            Select Seller  
          </Text>  
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
                  <DatePicker />  
                </HStack>  
              </Box>  
            </Box>  

            <Box alignItems={"baseline"}>  
              <Text fontSize="xl" fontWeight="bold" mb={2}>  
                Item Type, Quality & Warehouse  
              </Text>  
              <Divider orientation='horizontal' />
              <SimpleGrid alignItems={"baseline"}  columns={{ base: 1, md: 3 }} spacing={4}>  
                <ItemType itemType={itemType} setItemType={setItemType} />  
                <ItemQuality quality={quality} setQuality={setQuality} />  
                <WarehouseSelect warehouse={warehouse} setWarehouse={setWarehouse} />  
              </SimpleGrid>  
            </Box> 

            <Box>  
              <Text fontSize="xl" fontWeight="bold" mb={2}>  
                Rate Inputs  
              </Text>  
              <Divider orientation='horizontal' />
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
              <Divider orientation='horizontal' />
              <WeightInputs  
                totalWeight={totalWeight}  
                setTotalWeight={setTotalWeight}  
                totalItem={totalItem}  
                setTotalItem={setTotalItem}  
                totalPoldar={totalPoldar}             // new prop  
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

              <Text>Total Weight: {weightNum} kg ~ {weightNum / 100} quantal</Text>  
              <Text>Total Item: {itemNum}</Text>  
              <Text>Total Poldar: {poldarNum}</Text>  

              <Text mt={4}>Total Price (Rs): ₹{totalPrice.toFixed(2)}</Text>  
              <Text>Total Poldari (Rs): ₹{totalPolidari.toFixed(2)}</Text>  
              <Text>Per Head Poldari: ₹{perHeadPoldari.toFixed(2)}</Text>  

              <Text fontWeight="bold" mt={2}>  
                Final Price: ₹{finalPrice.toFixed(2)}  
              </Text>  
            </Box>  
          </>  
        )}  
      </VStack>  
    </Box>  
  );  
}