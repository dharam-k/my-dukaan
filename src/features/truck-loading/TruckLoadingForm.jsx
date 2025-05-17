import React, { useState } from "react";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import Navbar from "../../components/layout/Navbar";
import UserProfileDrawer from "../../components/layout/UserProfileDrawer";
import Footer from "../../components/layout/Footer";

import Step1_TruckEntry from "./Step1_TruckEntry";
import Step2_TruckDetails from "./Step2_TruckDetails";
import Step3_MillDetails from "./Step3_MillDetails";
import Step4_StockLoading from "./Step4_StockLoading";
import Step5_SellerCalculations from "./Step5_SellerCalculations";
import Step6_ReviewSubmit from "./Step6_ReviewSubmit";

export default function TruckLoadingForm() {
  const [step, setStep] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  // Shared form state
  const [truckEntry, setTruckEntry] = useState({
    truckNumber: "",
    itemType: "",
    loadingDate: new Date().toISOString().slice(0, 10),
    billNo: "",
  });
  const [truckDetails, setTruckDetails] = useState({
    driverName: "",
    mobile: "",
    address: "",
  });
  const [millDetails, setMillDetails] = useState({
    id: "",
    name: "",
    mobile: "",
    address: "",
    gstn: "",
    ratePerQuintal: "",
  });
  const [stockLoadingOption, setStockLoadingOption] = useState("");
  const [warehouseData, setWarehouseData] = useState({
    totalWeight: "",
    totalItems: "",
    totalPoldar: "",
    poldariRate: "",
    dharmakata: "",
    warehouse: "",
  });
  const [sellersData, setSellersData] = useState([]);
  const [sellerCalcData, setSellerCalcData] = useState([]);

  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const accordionButtonProps = {
    _expanded: { bg: "green.100" },
    borderRadius: "md",
    px: { base: 3, md: 4 },
    py: { base: 2, md: 3 },
  };

  const accordionBoxProps = {
    flex: "1",
    textAlign: "left",
    fontWeight: "semibold",
    fontSize: { base: "sm", md: "lg" },
    color: "green.800",
  };

  const accordionPanelProps = {
    px: { base: 0, md: 4 },
    py: 4,
  };

  return (
    <>
      {/* Navbar and User Profile Drawer */}
      <Navbar onOpenUserMenu={onOpen} />
      <UserProfileDrawer
        isOpen={isOpen}
        onClose={onClose}
        userName={loggedInUser.name}
      />

      {/* Top Tagline Banner */}
      <Box
        bg="green.50"
        py={{ base: 4, md: 6 }}
        px={{ base: 4, md: 8 }}
        textAlign="center"
        borderBottomWidth="1px"
        borderColor="green.200"
        maxW={{ base: "95%", md: "900px" }}
        w="100%"
        mx="auto"
        mt={{ base: 4, md: 8 }}
        mb={{ base: 8, md: 12 }}
      >
        <VStack spacing={2} mx="auto" px={{ base: 2 }}>
          <Heading
            size={{ base: "md", md: "lg" }}
            color="green.700"
            noOfLines={2}
          >
            ट्रक पर माल लोड करने की प्रक्रिया शुरू करें
          </Heading>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="green.600"
            maxW="500px"
            lineHeight="short"
          >
            विश्वसनीय विक्रेताओं से सीधे माल का लोडिंग करें और लेन-देन सुरक्षित
            और पारदर्शी बनाएं।
          </Text>
        </VStack>
      </Box>

      {/* Main Form Container */}
      <Box
        maxW={{ base: "95%", md: "900px" }}
        w="100%"
        mx="auto"
        mt={{ base: 4, md: 8 }}
        mb={{ base: 8, md: 12 }}
        bg="white"
        p={{ base: 4, md: 8 }}
        borderRadius="lg"
        boxShadow="md"
      >
        <Accordion allowToggle index={step - 1} reduceMotion>
          {/* Step 1 */}
          <AccordionItem border="none">
            <h2>
              <AccordionButton {...accordionButtonProps}>
                <Box {...accordionBoxProps}>
                  Step 1: Enter Truck & Item Info
                </Box>
                <AccordionIcon color="green.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel {...accordionPanelProps}>
              <Step1_TruckEntry
                data={truckEntry}
                onChange={setTruckEntry}
                onNext={goNext}
              />
            </AccordionPanel>
          </AccordionItem>

          {/* Step 2 */}
          <AccordionItem border="none" isDisabled={step < 2}>
            <h2>
              <AccordionButton {...accordionButtonProps}>
                <Box {...accordionBoxProps}>
                  Step 2: Truck Details
                </Box>
                <AccordionIcon color="green.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel {...accordionPanelProps}>
              <Step2_TruckDetails
                data={truckDetails}
                onChange={setTruckDetails}
                onNext={goNext}
                onPrev={goPrev}
              />
            </AccordionPanel>
          </AccordionItem>

          {/* Step 3 */}
          <AccordionItem border="none" isDisabled={step < 3}>
            <h2>
              <AccordionButton {...accordionButtonProps}>
                <Box {...accordionBoxProps}>
                  Step 3: Mill Details & Rate
                </Box>
                <AccordionIcon color="green.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel {...accordionPanelProps}>
              <Step3_MillDetails
                data={millDetails}
                onChange={setMillDetails}
                onNext={goNext}
                onPrev={goPrev}
              />
            </AccordionPanel>
          </AccordionItem>

          {/* Step 4 */}
          <AccordionItem border="none" isDisabled={step < 4}>
            <h2>
              <AccordionButton {...accordionButtonProps}>
                <Box {...accordionBoxProps}>
                  Step 4: Stock (Mall) Loading
                </Box>
                <AccordionIcon color="green.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel {...accordionPanelProps}>
              <Step4_StockLoading
                option={stockLoadingOption}
                setOption={setStockLoadingOption}
                warehouseData={warehouseData}
                setWarehouseData={setWarehouseData}
                sellersData={sellersData}
                setSellersData={setSellersData}
                onNext={goNext}
                onPrev={goPrev}
              />
            </AccordionPanel>
          </AccordionItem>

          {/* Step 5 */}
          <AccordionItem border="none"  isDisabled={step < 5}>
            <h2>
              <AccordionButton {...accordionButtonProps}>
                <Box {...accordionBoxProps}>
                  Step 5: Sellers Calculations
                </Box>
                <AccordionIcon color="green.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel {...accordionPanelProps}>
              <Step5_SellerCalculations
                sellersData={sellersData}
                ratePerQuintal={millDetails.ratePerQuintal}
                setSellerCalcData={setSellerCalcData}
                stockLoadingOption={stockLoadingOption}
                onNext={goNext}
                onPrev={goPrev}
              />
            </AccordionPanel>
          </AccordionItem>

          {/* Step 6 */}
          <AccordionItem border="none" isDisabled={step < 6}>
            <h2>
              <AccordionButton {...accordionButtonProps}>
                <Box {...accordionBoxProps}>
                  Step 6: Review & Submit
                </Box>
                <AccordionIcon color="green.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel {...accordionPanelProps}>
              <Step6_ReviewSubmit
                truckEntry={truckEntry}
                truckDetails={truckDetails}
                millDetails={millDetails}
                stockLoadingOption={stockLoadingOption}
                warehouseData={warehouseData}
                sellersData={sellersData}
                sellerCalcData={sellerCalcData}
                onPrev={goPrev}
                onSubmit={() => {
                  console.log({
                    truckEntry,
                    truckDetails,
                    millDetails,
                    stockLoadingOption,
                    warehouseData,
                    sellersData,
                    sellerCalcData,
                  });
                  alert("Data saved! Check console.");
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Footer />
    </>
  );
}