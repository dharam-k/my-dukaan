import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  Stack,
  HStack,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import {
  FaUser,
  FaRupeeSign,
  FaWeight,
  FaBoxes,
  FaCalculator,
  FaBalanceScale,
  FaDollarSign,
  FaPercent,
  FaCheckCircle,
} from "react-icons/fa";

export default function Step5_SellerCalculations({
  sellersData,
  ratePerQuintal,
  setSellerCalcData,
  onNext,
  onPrev,
  stockLoadingOption, // NEW prop for deciding flow
}) {
  const [calcData, setCalcData] = useState([]);
  const [totals, setTotals] = useState({
    totalWeight: 0,
    totalItems: 0,
    totalPoldar: 0,
    totalPoldari: 0,
    totalBaadwjan: 0,
    finalWeight: 0,
    totalPrice: 0,
    finalPrice: 0,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonStackDirection = useBreakpointValue({ base: "column", md: "row" });
  const buttonWidth = useBreakpointValue({ base: "100%", md: "auto" });

  // Format numbers with commas and decimals
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  useEffect(() => {
    if (!sellersData.length) {
      setCalcData([]);
      setSellerCalcData([]);
      setTotals({
        totalWeight: 0,
        totalItems: 0,
        totalPoldar: 0,
        totalPoldari: 0,
        totalBaadwjan: 0,
        finalWeight: 0,
        totalPrice: 0,
        finalPrice: 0,
      });
      return;
    }

    const calculations = sellersData.map((seller) => {
      const totalItems = Number(seller.totalItems) || 0;
      const totalPoldar = Number(seller.totalPoldar) || 0;
      const totalWeight = Number(seller.totalWeight) || 0;
      const baadwjanPerQ = Number(seller.baadwjanPerQ) || 0;
      const rate = Number(seller.ratePerQuintal) || Number(ratePerQuintal) || 0;

      const totalPoldari = totalItems * totalPoldar;
      // Note unused perHeadPoldari
      const totalBaadwjan = ((baadwjanPerQ / 100) * totalWeight) / 1000;
      const finalWeight = totalWeight - totalBaadwjan;
      const totalPrice = (finalWeight / 100) * rate;
      const finalPrice = totalPrice - totalPoldari;

      return {
        ...seller,
        totalPoldari,
        totalBaadwjan,
        finalWeight,
        totalPrice,
        finalPrice,
      };
    });

    setCalcData(calculations);
    setSellerCalcData(calculations);

    const totalValues = calculations.reduce(
      (acc, c) => ({
        totalWeight: Number(acc.totalWeight) + (Number(c.totalWeight) || 0),
        totalItems: acc.totalItems + (Number(c.totalItems) || 0),
        totalPoldar: acc.totalPoldar + (Number(c.totalPoldar) || 0),
        totalPoldari: acc.totalPoldari + (c.totalPoldari || 0),
        totalBaadwjan: acc.totalBaadwjan + (c.totalBaadwjan || 0),
        finalWeight: acc.finalWeight + (c.finalWeight || 0),
        totalPrice: acc.totalPrice + (c.totalPrice || 0),
        finalPrice: acc.finalPrice + (c.finalPrice || 0),
      }),
      {
        totalWeight: 0,
        totalItems: 0,
        totalPoldar: 0,
        totalPoldari: 0,
        totalBaadwjan: 0,
        finalWeight: 0,
        totalPrice: 0,
        finalPrice: 0,
      }
    );

    setTotals(totalValues);
  }, [sellersData, ratePerQuintal, setSellerCalcData]);

  // Show Next button if no sellers & warehouse-only mode
  if (!sellersData.length) {
    if (stockLoadingOption === "warehouse") {
      return (
        <Box>
          <Text mb={2}>
            No sellers data available as stock is loaded only by warehouse.
          </Text>
          <Stack spacing={4} direction={buttonStackDirection}>
            <Button onClick={onPrev} width={buttonWidth}>
              Back
            </Button>
            <Button colorScheme="green" onClick={onNext} width={buttonWidth}>
              Next
            </Button>
          </Stack>
        </Box>
      );
    }

    // Otherwise block progress
    return (
      <Box>
        <Text>No sellers data available. Please go back and add sellers.</Text>
        <Button mt={4} onClick={onPrev} width={buttonWidth}>
          Back
        </Button>
      </Box>
    );
  }

  const Item = ({ icon, label, children, color }) => (
    <HStack spacing={2}>
      <Icon as={icon} color={color || "gray.600"} w={4} h={4} />
      <Text fontWeight="semibold" color={color || "gray.700"}>
        {label}:
      </Text>
      <Text>{children}</Text>
    </HStack>
  );

  return (
    <Box>
      <Text fontWeight="bold" mb={4} fontSize={{ base: "md", md: "lg" }}>
        Sellers Payment Calculations
      </Text>

      {isMobile ? (
        <VStack spacing={4} align="stretch">
          {calcData.map((seller, i) => (
            <Box
              key={i}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              bg="white"
            >
              <Item icon={FaUser} label="Seller">
                {seller.name || "-"}
              </Item>
              <Item icon={FaRupeeSign} label="Rate/Quintal">
                ₹{formatNumber(seller.ratePerQuintal, 0)}
              </Item>
              <Item icon={FaWeight} label="Total Weight">
                {formatNumber(seller.totalWeight)} kg
              </Item>
              <Item icon={FaBoxes} label="Total Items">
                {formatNumber(seller.totalItems, 0)}
              </Item>
              <Item icon={FaCalculator} label="Total Poldari" color="red.500">
                ₹{formatNumber(seller.totalPoldari)}
              </Item>
              <Item icon={FaBalanceScale} label="Total Baadwjan" color="red.500">
                {formatNumber(seller.totalBaadwjan)} kg
              </Item>
              <Item icon={FaPercent} label="Final Weight" color="green.600">
                {formatNumber(seller.finalWeight)} kg
              </Item>
              <Item icon={FaDollarSign} label="Total Price">
                ₹{formatNumber(seller.totalPrice)}
              </Item>
              <Item icon={FaCheckCircle} label="Final Price" color="green.600">
                ₹{formatNumber(seller.finalPrice)}
              </Item>
            </Box>
          ))}

          <Box
            p={4}
            borderWidth="2px"
            borderColor="green.300"
            borderRadius="md"
            bg="green.50"
            fontWeight="bold"
          >
            <Text mb={2}>Totals</Text>
            <Item icon={FaWeight} label="Total Weight">
              {formatNumber(totals.totalWeight)} kg
            </Item>
            <Item icon={FaBoxes} label="Total Items">
              {formatNumber(totals.totalItems, 0)}
            </Item>
            <Item icon={FaCalculator} label="Total Poldari" color="red.500">
              ₹{formatNumber(totals.totalPoldari)}
            </Item>
            <Item icon={FaBalanceScale} label="Total Baadwjan" color="red.500">
              {formatNumber(totals.totalBaadwjan)} kg
            </Item>
            <Item icon={FaPercent} label="Final Weight" color="green.600">
              {formatNumber(totals.finalWeight)} kg
            </Item>
            <Item icon={FaDollarSign} label="Total Price">
              ₹{formatNumber(totals.totalPrice)}
            </Item>
            <Item icon={FaCheckCircle} label="Final Price" color="green.600">
              ₹{formatNumber(totals.finalPrice)}
            </Item>
          </Box>
        </VStack>
      ) : (
        <Box overflowX="auto" maxW="100%" mb={4}>
          <Table
            size="sm"
            variant="simple"
            colorScheme="green"
            minW="850px"
            fontSize="sm"
          >
            <Thead>
              <Tr>
                <Th whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaUser} />
                    <Text>Seller Name</Text>
                  </HStack>
                </Th>
                <Th whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaRupeeSign} />
                    <Text>Rate/Quintal</Text>
                  </HStack>
                </Th>
                <Th whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaWeight} />
                    <Text>Total Weight (kg)</Text>
                  </HStack>
                </Th>
                <Th whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaBoxes} />
                    <Text>Total Items</Text>
                  </HStack>
                </Th>
                <Th color={"red"} whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaCalculator} color="red.500" />
                    <Text>Total Poldari (₹)</Text>
                  </HStack>
                </Th>
                <Th color={"red"} whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaBalanceScale} color="red.500" />
                    <Text>Total Baadwjan (kg)</Text>
                  </HStack>
                </Th>
                <Th color={"green"} whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaPercent} color="green.600" />
                    <Text>Final Weight (kg)</Text>
                  </HStack>
                </Th>
                <Th whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaDollarSign} />
                    <Text>Total Price (₹)</Text>
                  </HStack>
                </Th>
                <Th color={"green"} whiteSpace="nowrap">
                  <HStack>
                    <Icon as={FaCheckCircle} color="green.600" />
                    <Text>Final Price (₹)</Text>
                  </HStack>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {calcData.map((seller, i) => (
                <Tr key={i}>
                  <Td whiteSpace="nowrap">{seller.name || "-"}</Td>
                  <Td whiteSpace="nowrap">₹{formatNumber(seller.ratePerQuintal, 0)}</Td>
                  <Td whiteSpace="nowrap">{formatNumber(seller.totalWeight)} kg</Td>
                  <Td whiteSpace="nowrap">{formatNumber(seller.totalItems, 0)}</Td>
                  <Td color={"red"} whiteSpace="nowrap">
                    ₹{formatNumber(seller.totalPoldari)}
                  </Td>
                  <Td color={"red"} whiteSpace="nowrap">
                    {formatNumber(seller.totalBaadwjan)} kg
                  </Td>
                  <Td color={"green"} whiteSpace="nowrap">
                    {formatNumber(seller.finalWeight)} kg
                  </Td>
                  <Td whiteSpace="nowrap">₹{formatNumber(seller.totalPrice)}</Td>
                  <Td color={"green"} whiteSpace="nowrap">
                    ₹{formatNumber(seller.finalPrice)}
                  </Td>
                </Tr>
              ))}

              <Tr
                fontWeight="bold"
                bg="green.50"
                borderTop="2px solid"
                borderColor="green.300"
              >
                <Td whiteSpace="nowrap">Total</Td>
                <Td>-</Td>
                <Td whiteSpace="nowrap">{formatNumber(totals.totalWeight)} kg</Td>
                <Td whiteSpace="nowrap">{formatNumber(totals.totalItems, 0)}</Td>
                <Td color={"red"} whiteSpace="nowrap">
                  ₹{formatNumber(totals.totalPoldari)}
                </Td>
                <Td color={"red"} whiteSpace="nowrap">{formatNumber(totals.totalBaadwjan)} kg</Td>
                <Td color={"green"} whiteSpace="nowrap">
                  {formatNumber(totals.finalWeight)} kg
                </Td>
                <Td whiteSpace="nowrap">₹{formatNumber(totals.totalPrice)}</Td>
                <Td color={"green"} whiteSpace="nowrap">
                  ₹{formatNumber(totals.finalPrice)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      )}

      <VStack spacing={4} mt={4} align="stretch" width="100%">
        <Stack direction={buttonStackDirection} spacing={4} width="100%">
          <Button onClick={onPrev} width={buttonWidth}>
            Back
          </Button>
          <Button colorScheme="green" onClick={onNext} width={buttonWidth}>
            Next
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
}