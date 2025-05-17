import React from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Stack,
  HStack,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import {
  FaTruck,
  FaUserTie,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaMoneyBillWave,
  FaBoxes,
  FaCalculator,
  FaDollarSign,
  FaWeight,
  FaPercent,   
  FaBalanceScale,
} from "react-icons/fa";

export default function Step6_ReviewSubmit({
  truckEntry,
  truckDetails,
  millDetails,
  stockLoadingOption,
  warehouseData,
  sellersData,
  sellerCalcData,
  onPrev,
  onSubmit,
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonStackDirection = useBreakpointValue({ base: "column", md: "row" });
  const buttonWidth = useBreakpointValue({ base: "100%", md: "auto" });

  // Format numbers with Indian commas and fixed decimals
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <Box maxH="70vh" overflowY="auto" px={{ base: 2, md: 6 }} py={4}>
      <Heading size={{ base: "md", md: "lg" }} mb={4}>
        Review Details Before Submit
      </Heading>

      <VStack spacing={6} align="stretch" fontSize={{ base: "sm", md: "md" }}>
        {/* Truck Entry */}
        <Box>
          <Text fontWeight="bold" mb={2} fontSize={{ base: "md", md: "lg" }}>
            Truck Entry:
          </Text>
          <HStack>
            <Icon as={FaTruck} />
            <Text fontWeight="semibold">Truck Number:</Text>
            <Text>{truckEntry.truckNumber || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaBoxes} />
            <Text fontWeight="semibold">Item Type:</Text>
            <Text>{truckEntry.itemType || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaCalculator} />
            <Text fontWeight="semibold">Loading Date:</Text>
            <Text>{truckEntry.loadingDate || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaDollarSign} />
            <Text fontWeight="semibold">Bill No:</Text>
            <Text>{truckEntry.billNo || "-"}</Text>
          </HStack>
        </Box>

        <Divider />

        {/* Truck Details */}
        <Box>
          <Text fontWeight="bold" mb={2} fontSize={{ base: "md", md: "lg" }}>
            Truck Details:
          </Text>
          <HStack>
            <Icon as={FaUserTie} />
            <Text fontWeight="semibold">Driver Name:</Text>
            <Text>{truckDetails.driverName || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaPhone} />
            <Text fontWeight="semibold">Mobile:</Text>
            <Text>{truckDetails.mobile || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaMapMarkerAlt} />
            <Text fontWeight="semibold">Address:</Text>
            <Text>{truckDetails.address || "-"}</Text>
          </HStack>
        </Box>

        <Divider />

        {/* Mill Details */}
        <Box>
          <Text fontWeight="bold" mb={2} fontSize={{ base: "md", md: "lg" }}>
            Mill Details:
          </Text>
          <HStack>
            <Icon as={FaBuilding} />
            <Text fontWeight="semibold">Name:</Text>
            <Text>{millDetails.name || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaPhone} />
            <Text fontWeight="semibold">Mobile:</Text>
            <Text>{millDetails.mobile || "-"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaMapMarkerAlt} />
            <Text fontWeight="semibold">Address:</Text>
            <Text>{millDetails.address || "-"}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="semibold">GSTN:</Text>
            <Text>{millDetails.gstn || "N/A"}</Text>
          </HStack>
          <HStack>
            <Icon as={FaMoneyBillWave} />
            <Text fontWeight="semibold">Rate per Quintal:</Text>
            <Text>₹{millDetails.ratePerQuintal || "-"}</Text>
          </HStack>
        </Box>

        <Divider />

        {/* Stock Loading Option */}
        <Box>
          <Text fontWeight="bold" mb={2} fontSize={{ base: "md", md: "lg" }}>
            Stock Loading Option: {stockLoadingOption || "-"}
          </Text>

          {(stockLoadingOption === "warehouse" || stockLoadingOption === "both") && (
            <Box pl={4} mb={4}>
              <Text fontWeight="semibold" mb={2}>
                Warehouse Loading Data:
              </Text>
              <HStack>
                <FaWeight />
                <Text>Total Weight:</Text>
                <Text>{warehouseData.totalWeight ? `${formatNumber(warehouseData.totalWeight)} kg` : "-"}</Text>
              </HStack>
              <HStack>
                <FaBoxes />
                <Text>Total Items:</Text>
                <Text>{warehouseData.totalItems || "-"}</Text>
              </HStack>
              <HStack>
                <FaCalculator />
                <Text>Total Poldar:</Text>
                <Text>{warehouseData.totalPoldar || "-"}</Text>
              </HStack>
              <HStack>
                <FaDollarSign />
                <Text>Poldari Rate:</Text>
                <Text>{warehouseData.poldariRate || "-"}</Text>
              </HStack>
              <HStack>
                <FaBalanceScale />
                <Text>Dharmakata:</Text>
                <Text>{warehouseData.dharmakata || "-"}</Text>
              </HStack>
              <HStack>
                <FaBuilding />
                <Text>Warehouse:</Text>
                <Text>{warehouseData.warehouse || "-"}</Text>
              </HStack>
            </Box>
          )}

          {(stockLoadingOption === "sellers" || stockLoadingOption === "both") && (
            <>
              <Text fontWeight="semibold" mb={2}>
                Sellers Loading Data:
              </Text>
              {isMobile ? (
                <VStack spacing={4} align="stretch" mb={4}>
                  {sellersData.map((s, i) => (
                    <Box
                      key={i}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="sm"
                      bg="gray.50"
                    >
                      <Text fontWeight="bold" mb={2}>
                        {s.name || "-"}
                      </Text>
                      <HStack>
                        <FaPhone />
                        <Text>Mobile: {s.mobile || "N/A"}</Text>
                      </HStack>
                      <HStack>
                        <FaMoneyBillWave />
                        <Text>Rate per Quintal: ₹{s.ratePerQuintal || "-"}</Text>
                      </HStack>
                      <HStack>
                        <FaWeight />
                        <Text>Total Weight: {s.totalWeight || "-"} kg</Text>
                      </HStack>
                      <HStack>
                        <FaBoxes />
                        <Text>Total Items: {s.totalItems || "-"}</Text>
                      </HStack>
                      <HStack>
                        <FaCalculator />
                        <Text>Total Poldar: {s.totalPoldar || "-"}</Text>
                      </HStack>
                      <HStack>
                        <FaDollarSign />
                        <Text>Poldari Rate: ₹{s.poldariRate || "-"}</Text>
                      </HStack>
                      <HStack>
                        <FaBalanceScale />
                        <Text>Baadwjan per Quintal: {s.baadwjanPerQ || "-"} g</Text>
                      </HStack>
                      <HStack>
                        <FaBuilding />
                        <Text>Dharmakata / Seller Shop: {s.dharmakataOrShop || "-"}</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch" mb={4}>
                  {sellersData.map((s, i) => (
                    <Box
                      key={i}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                      whiteSpace="nowrap"
                    >
                      <Text><b>Seller Name:</b> {s.name || "-"}</Text>
                      <Text><b>Mobile:</b> {s.mobile || "N/A"}</Text>
                      <Text><b>Rate per Quintal:</b> ₹{s.ratePerQuintal || "-"}</Text>
                      <Text><b>Total Weight:</b> {s.totalWeight || "-"} kg</Text>
                      <Text><b>Total Items:</b> {s.totalItems || "-"}</Text>
                      <Text><b>Total Poldar:</b> {s.totalPoldar || "-"}</Text>
                      <Text><b>Poldari Rate:</b> ₹{s.poldariRate || "-"}</Text>
                      <Text><b>Baadwjan per Quintal:</b> {s.baadwjanPerQ || "-"} g</Text>
                      <Text><b>Dharmakata / Seller Shop:</b> {s.dharmakataOrShop || "-"}</Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </>
          )}

          {sellerCalcData.length > 0 && (
            <>
              <Divider mt={4} mb={4} />
              <Text fontWeight="bold" mb={2} fontSize={{ base: "md", md: "lg" }}>
                Seller Calculations Summary:
              </Text>
              {isMobile ? (
                <VStack spacing={4} align="stretch" mb={4}>
                  {sellerCalcData.map((s, i) => (
                    <Box
                      key={i}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                      boxShadow="sm"
                      bg="green.50"
                    >
                      <Text fontWeight="bold" mb={2}>
                        {s.name || "-"}
                      </Text>
                      <HStack>
                        <FaCalculator />
                        <Text>Total Poldari: ₹{(s.totalPoldari || 0).toFixed(2)}</Text>
                      </HStack>
                      <HStack>
                        <FaBalanceScale />
                        <Text>Total Baadwjan: {(s.totalBaadwjan || 0).toFixed(3)} kg</Text>
                      </HStack>
                      <HStack>
                        <FaPercent />
                        <Text>Final Weight: {(s.finalWeight || 0).toFixed(3)} kg</Text>
                      </HStack>
                      <HStack>
                        <FaDollarSign />
                        <Text>Total Price: ₹{(s.totalPrice || 0).toFixed(2)}</Text>
                      </HStack>
                      <HStack>
                        <FaMoneyBillWave />
                        <Text>Final Price: ₹{(s.finalPrice || 0).toFixed(2)}</Text>
                      </HStack>
                    </Box>
                  ))}
                  {/* Totals card */}
                  <Box
                    p={4}
                    borderWidth="2px"
                    borderColor="green.300"
                    borderRadius="md"
                    bg="green.100"
                    fontWeight="bold"
                  >
                    <Text>Totals</Text>
                    <Text>Total Poldari: {sellerCalcData.reduce((a, c) => a + (c.totalPoldari || 0), 0).toFixed(2)}</Text>
                    <Text>Total Baadwjan: {sellerCalcData.reduce((a, c) => a + (c.totalBaadwjan || 0), 0).toFixed(3)} kg</Text>
                    <Text>Final Weight: {sellerCalcData.reduce((a, c) => a + (c.finalWeight || 0), 0).toFixed(3)} kg</Text>
                    <Text>Total Price: {sellerCalcData.reduce((a, c) => a + (c.totalPrice || 0), 0).toFixed(2)}</Text>
                    <Text>Final Price: {sellerCalcData.reduce((a, c) => a + (c.finalPrice || 0), 0).toFixed(2)}</Text>
                  </Box>
                </VStack>
              ) : (
                <Box overflowX="auto" minW="700px" mb={4}>
                  <Table size="sm" variant="simple" colorScheme="green" minW="700px">
                    <Thead>
                      <Tr>
                        <Th whiteSpace="nowrap">Seller</Th>
                        <Th whiteSpace="nowrap">Total Poldari</Th>
                        <Th whiteSpace="nowrap">Total Baadwjan</Th>
                        <Th whiteSpace="nowrap">Final Weight</Th>
                        <Th whiteSpace="nowrap">Total Price</Th>
                        <Th whiteSpace="nowrap">Final Price</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sellerCalcData.map((s, i) => (
                        <Tr key={i}>
                          <Td whiteSpace="nowrap">{s.name || "-"}</Td>
                          <Td whiteSpace="nowrap">₹{(s.totalPoldari || 0).toFixed(2)}</Td>
                          <Td whiteSpace="nowrap">{(s.totalBaadwjan || 0).toFixed(3)} kg</Td>
                          <Td whiteSpace="nowrap">{(s.finalWeight || 0).toFixed(3)} kg</Td>
                          <Td whiteSpace="nowrap">₹{(s.totalPrice || 0).toFixed(2)}</Td>
                          <Td whiteSpace="nowrap">₹{(s.finalPrice || 0).toFixed(2)}</Td>
                        </Tr>
                      ))}

                      <Tr
                        fontWeight="bold"
                        bg="green.50"
                        borderTop="2px solid"
                        borderColor="green.300"
                      >
                        <Td whiteSpace="nowrap">Total</Td>
                        <Td whiteSpace="nowrap">
                          ₹{sellerCalcData.reduce((a, c) => a + (c.totalPoldari || 0), 0).toFixed(2)}
                        </Td>
                        <Td whiteSpace="nowrap">
                          {sellerCalcData.reduce((a, c) => a + (c.totalBaadwjan || 0), 0).toFixed(3)} kg
                        </Td>
                        <Td whiteSpace="nowrap">
                          {sellerCalcData.reduce((a, c) => a + (c.finalWeight || 0), 0).toFixed(3)} kg
                        </Td>
                        <Td whiteSpace="nowrap">
                          ₹{sellerCalcData.reduce((a, c) => a + (c.totalPrice || 0), 0).toFixed(2)}
                        </Td>
                        <Td whiteSpace="nowrap">
                          ₹{sellerCalcData.reduce((a, c) => a + (c.finalPrice || 0), 0).toFixed(2)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              )}
            </>
          )}
        </Box>
      </VStack>

      {/* Buttons */}
      <Stack direction={buttonStackDirection} spacing={4} mt={4} width="100%">
        <Button onClick={onPrev} width={buttonWidth}>
          Back
        </Button>
        <Button colorScheme="green" onClick={onSubmit} width={buttonWidth}>
          Submit All Data
        </Button>
      </Stack>
    </Box>
  );
}