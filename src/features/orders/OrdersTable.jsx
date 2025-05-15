import React, { useState, useMemo } from "react";  
import {  
  Box,  
  VStack,  
  Text,  
  HStack,  
  Input,  
  Select,  
  Divider,  
  Button,  
  Table,  
  Thead,  
  Tbody,  
  Tr,  
  Th,  
  Td,  
} from "@chakra-ui/react";  
import OrderDetail from "./OrderDetail";  
import getUserById from "../../services/users/getUser";

const PAGE_SIZE = 5;  

export function OrdersTable({ orders }) {  
  // State hooks  
  const [currentPage, setCurrentPage] = useState(1);  
  const [selectedOrder, setSelectedOrder] = useState(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [paymentSummary, setPaymentSummary] = useState(null);  
  const [showFilter, setShowFilter] = useState(false);  

  const [searchTerm, setSearchTerm] = useState("");  
  const [sortBy, setSortBy] = useState({ key: "created_at", order: "desc" });  
  const [filters, setFilters] = useState({  
    seller: "",  
    dateFrom: "",  
    dateTo: "",  
    itemType: "",  
    quality: "",  
    dharmakata: "",  
    warehouse: "",  
    paymentStatus: "",  
  });  

  console.log(orders)

  const safeOrders = orders || [];  

  // 1. Get unique seller IDs  
  const uniqueSellerIds = useMemo(() => {  
    const sellerIds = safeOrders.map((o) => o.sellerId).filter(Boolean);  
    return Array.from(new Set(sellerIds)).sort();  
  }, [safeOrders]);  

  // 2. Map to user objects & sort by name  
  const uniqueSellers = useMemo(() => {  
    return uniqueSellerIds  
      .map((id) => getUserById(id))  
      .filter(Boolean)  
      .sort((a, b) => a.name.localeCompare(b.name));  
  }, [uniqueSellerIds]);  

  const uniqueItemTypes = useMemo(() => {  
    return Array.from(  
      new Set(safeOrders.map((o) => o.inputs?.itemType).filter(Boolean))  
    ).sort();  
  }, [safeOrders]);  

  const uniqueQualities = useMemo(() => {  
    return Array.from(  
      new Set(safeOrders.map((o) => o.inputs?.quality).filter(Boolean))  
    ).sort();  
  }, [safeOrders]);  

  const uniqueDharmakatas = useMemo(() => {  
    return Array.from(  
      new Set(safeOrders.map((o) => o.inputs?.dharmKata).filter(Boolean))  
    ).sort();  
  }, [safeOrders]);  

  const uniqueWarehouses = useMemo(() => {  
    return Array.from(  
      new Set(safeOrders.map((o) => o.inputs?.warehouse).filter(Boolean))  
    ).sort();  
  }, [safeOrders]);  

  if (!orders || orders.length === 0)  
    return (  
      <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
        <Text>No recent orders found.</Text>  
      </Box>  
    );  

  // Filter orders  
  let processedOrders = [...orders];  

  processedOrders = processedOrders.filter((order) => {  
    const sellerName = getUserById(order.sellerId).name;
    if (filters.seller && sellerName !== filters.seller) return false;  

    const orderDate = new Date(order.created_at);  
    if (filters.dateFrom && orderDate < new Date(filters.dateFrom)) return false;  
    if (filters.dateTo && orderDate > new Date(filters.dateTo)) return false;  

    if (filters.itemType && order.inputs?.itemType !== filters.itemType)  
      return false;  
    if (filters.quality && order.inputs?.quality !== filters.quality)  
      return false;  
    if (filters.dharmakata && order.inputs?.dharmKata !== filters.dharmakata)  
      return false;  
    if (filters.warehouse && order.inputs?.warehouse !== filters.warehouse)  
      return false;  

    if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus)  
      return false;  

    if (searchTerm) {  
      const lowerSearch = searchTerm.toLowerCase();  
      const inOrderId = order.orderId?.toLowerCase().includes(lowerSearch);  
      const inSeller = sellerName?.toLowerCase().includes(lowerSearch);  
      const inBuyer = order.buyer?.name?.toLowerCase().includes(lowerSearch);  
      if (!inOrderId && !inSeller && !inBuyer) return false;  
    }  

    return true;  
  });  

  // Sort orders  
  processedOrders.sort((a, b) => {  
    const { key, order } = sortBy;  

    const getNestedValue = (obj, key) =>  
      key.split(".").reduce((o, k) => (o ? o[k] : null), obj);  

    let aVal = getNestedValue(a, key);  
    let bVal = getNestedValue(b, key);  

    if (key === "created_at") {  
      aVal = new Date(aVal);  
      bVal = new Date(bVal);  
    }  

    if (aVal == null) return 1;  
    if (bVal == null) return -1;  

    if (typeof aVal === "string") aVal = aVal.toLowerCase();  
    if (typeof bVal === "string") bVal = bVal.toLowerCase();  

    if (aVal < bVal) return order === "asc" ? -1 : 1;  
    if (aVal > bVal) return order === "asc" ? 1 : -1;  
    return 0;  
  });  

  // Pagination  
  const totalPages = Math.ceil(processedOrders.length / PAGE_SIZE);  
  const startIdx = (currentPage - 1) * PAGE_SIZE;  
  const currentOrders = processedOrders.slice(startIdx, startIdx + PAGE_SIZE);  

  // Totals calculation  
  const totals = processedOrders.reduce(  
    (acc, order) => {  
      acc.totalWeight += Number(order.inputs?.totalWeight) || 0;  
      acc.totalItems += Number(order.inputs?.totalItem) || 0;  
      acc.totalFinalPrice += Number((order.inputs?.finalWeight)/100 * order.inputs?.ratePerQuantal) || 0;  
      return acc;  
    },  
    { totalWeight: 0, totalItems: 0, totalFinalPrice: 0 }  
  );  

  // Event handlers  
  const toggleSort = (key) => {  
    setSortBy((prev) => {  
      if (prev.key === key) {  
        return { key, order: prev.order === "asc" ? "desc" : "asc" };  
      }  
      return { key, order: "asc" };  
    });  
  };  

  const openModal = (order) => {  
    setSelectedOrder(order);  
    setIsModalOpen(true);  

    try {  
      const storedPayment = localStorage.getItem(`payments`);  
      if (storedPayment) {  
        const paymentData = JSON.parse(storedPayment);  
        const paymentFiltered = paymentData.filter(  
          (p) => p.orderId === order.orderId  
        );  
        setPaymentSummary(paymentFiltered || null);  
      } else {  
        setPaymentSummary(null);  
      }  
    } catch (error) {  
      console.error("Failed to parse payment data from localStorage", error);  
      setPaymentSummary(null);  
    }  
  };  

  const closeModal = () => {  
    setIsModalOpen(false);  
    setSelectedOrder(null);  
    setPaymentSummary(null);  
  };  

  const clearFilters = () => {  
    setSearchTerm("");  
    setFilters({  
      seller: "",  
      dateFrom: "",  
      dateTo: "",  
      itemType: "",  
      quality: "",  
      dharmakata: "",  
      warehouse: "",  
      paymentStatus: "",  
    });  
  };  

  const toggleFilterVisibility = () => {  
    setShowFilter(!showFilter);  
  };  

  return (  
    <Box mt={8} borderWidth={1} borderRadius="md" overflowX="auto" p={4}>  
      <Box  
        display={"flex"}  
        flexDirection={"row"}  
        justifyContent={"space-between"}  
        alignItems="center"  
        mb={2}  
      >  
        <Text fontSize="xl" fontWeight="bold" color="green.600">  
          Recent Orders  
        </Text>  
        <Button onClick={toggleFilterVisibility} colorScheme="green" size="sm">  
          Filters {showFilter ? "-" : "+"}  
        </Button>  
      </Box>  

      {/* Filters */}  
      <Box  
        mb={4}  
        display={showFilter ? "flex" : "none"}  
        flexWrap="wrap"  
        gap={4}  
        alignItems="center"  
      >  
        <Input  
          placeholder="Search by Order ID / Buyer / Seller"  
          value={searchTerm}  
          onChange={(e) => {  
            setSearchTerm(e.target.value);  
            setCurrentPage(1);  
          }}  
          width="250px"  
        />  

        <Select  
          placeholder="Filter by Seller"  
          value={filters.seller}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, seller: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="180px"  
        >  
          {uniqueSellers.map((seller) => (  
            <option key={seller.id} value={seller.name}>  
              {seller.name}  
            </option>  
          ))}  
        </Select>   

        <Select  
          placeholder="Filter by Item Type"  
          value={filters.itemType}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, itemType: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="180px"  
        >  
          {uniqueItemTypes.map((type) => (  
            <option key={type} value={type}>  
              {type}  
            </option>  
          ))}  
        </Select>  

        <Select  
          placeholder="Filter by Quality"  
          value={filters.quality}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, quality: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="150px"  
        >  
          {uniqueQualities.map((q) => (  
            <option key={q} value={q}>  
              {q}  
            </option>  
          ))}  
        </Select>  

        <Select  
          placeholder="Filter by Dharmakata"  
          value={filters.dharmakata}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, dharmakata: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="150px"  
        >  
          {uniqueDharmakatas.map((d) => (  
            <option key={d} value={d}>  
              {d}  
            </option>  
          ))}  
        </Select>  

        <Select  
          placeholder="Filter by Warehouse"  
          value={filters.warehouse}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, warehouse: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="150px"  
        >  
          {uniqueWarehouses.map((w) => (  
            <option key={w} value={w}>  
              {w}  
            </option>  
          ))}  
        </Select>  

        <Input  
          type="date"  
          value={filters.dateFrom}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, dateFrom: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="140px"  
          placeholder="From Date"  
        />  

        <Input  
          type="date"  
          value={filters.dateTo}  
          onChange={(e) => {  
            setFilters((f) => ({ ...f, dateTo: e.target.value }));  
            setCurrentPage(1);  
          }}  
          width="140px"  
          placeholder="To Date"  
        />  

        <Button onClick={clearFilters} colorScheme="red" size="sm">  
          Clear Filters  
        </Button>  
      </Box>  

      <Divider mb={4} />  

      {/* Totals Summary */}  
      <Box  
        mt={6}  
        p={4}  
        borderWidth="1px"  
        borderRadius="lg"  
        boxShadow="md"  
        bg="gray.50"  
      >  
        {(searchTerm || Object.values(filters).some((v) => v)) && (  
          <Box fontSize="sm" color="gray.700" mb={2}>  
            <Text fontWeight="bold" mb={1}>  
              Filters Applied:  
            </Text>  
            <HStack wrap="wrap" spacing={3}>  
              {searchTerm && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  🔍 Search: <strong>{searchTerm}</strong>  
                </Box>  
              )}  
              {filters.seller && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  Seller: <strong>{filters.seller}</strong>  
                </Box>  
              )}  
              {filters.itemType && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  Item Type: <strong>{filters.itemType}</strong>  
                </Box>  
              )}  
              {filters.quality && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  Quality: <strong>{filters.quality}</strong>  
                </Box>  
              )}  
              {filters.dharmakata && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  Dharmakata: <strong>{filters.dharmakata}</strong>  
                </Box>  
              )}  
              {filters.warehouse && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  Warehouse: <strong>{filters.warehouse}</strong>  
                </Box>  
              )}  
              {filters.dateFrom && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  From: <strong>{filters.dateFrom}</strong>  
                </Box>  
              )}  
              {filters.dateTo && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  To: <strong>{filters.dateTo}</strong>  
                </Box>  
              )}  
              {filters.paymentStatus && (  
                <Box bg="green.100" px={2} py={1} borderRadius="md">  
                  Payment: <strong>{filters.paymentStatus}</strong>  
                </Box>  
              )}  
            </HStack>  
          </Box>  
        )}  

        <Table variant="simple" size="md">  
          <Thead bg="green.100">  
            <Tr>  
              <Th fontSize="md" textAlign="center">  
                कुल बोरा  
              </Th>  
              <Th fontSize="md" textAlign="center">  
                कुल वजन  
              </Th>  
              <Th fontSize="md" textAlign="center">  
                कुल कीमत  
              </Th>  
            </Tr>  
          </Thead>  
          <Tbody>  
            <Tr>  
              <Td fontWeight="bold" textAlign="center">  
                {totals.totalItems}  
              </Td>  
              <Td fontWeight="bold" textAlign="center">  
                {(totals.totalWeight / 100).toFixed(2)} क्वांटल  
              </Td>  
              <Td fontWeight="bold" textAlign="center">  
                ₹  
                {totals.totalFinalPrice.toLocaleString("en-IN", {  
                  minimumFractionDigits: 2,  
                  maximumFractionDigits: 2,  
                })}  
              </Td>  
            </Tr>  
          </Tbody>  
        </Table>  
      </Box>  

      {/* Orders Table */}  
      <Table variant="striped" colorScheme="green" mt={5} size="sm">  
        <Thead>  
          <Tr>  
            <Th cursor="pointer" onClick={() => toggleSort("orderId")}>  
              Order ID{" "}  
              {sortBy.key === "orderId"  
                ? sortBy.order === "asc"  
                  ? "▲"  
                  : "▼"  
                : ""}  
            </Th>  
            <Th>Seller</Th>  
            <Th cursor="pointer" onClick={() => toggleSort("created_at")}>  
              Date{" "}  
              {sortBy.key === "created_at"  
                ? sortBy.order === "asc"  
                  ? "▲"  
                  : "▼"  
                : ""}  
            </Th>  
            <Th>Item Type</Th>  
            <Th>Total Weight</Th>  
            <Th>Total Item</Th>  
            <Th  
              cursor="pointer"  
              onClick={() => toggleSort("calculations.finalPrice")}  
            >  
              Final Price{" "}  
              {sortBy.key === "calculations.finalPrice"  
                ? sortBy.order === "asc"  
                  ? "▲"  
                  : "▼"  
                : ""}  
            </Th>  
            <Th>Action</Th>  
          </Tr>  
        </Thead>  
        <Tbody>  
          {currentOrders.map((order) => {  
            const weight = order.inputs?.totalWeight;  
            const itemCount = order.inputs?.totalItem;  
            const finalPrice = Number((order.inputs?.finalWeight)/100 * order.inputs?.ratePerQuantal) - Number((order.inputs?.totalItem) * order.inputs?.poldariRate);  
            const sellerName = getUserById(order.sellerId).name
            return (  
              <Tr key={order.orderId}>  
                <Td>{order.orderId}</Td>  
                <Td>{sellerName || "N/A"}</Td>  
                <Td>  
                  {order.created_at  
                    ? new Date(order.created_at).toLocaleDateString()  
                    : "N/A"}  
                </Td>  
                <Td>{order.inputs.itemType}</Td>  
                <Td>{weight != null ? `${weight} kg` : "N/A"}</Td>  
                <Td>{itemCount != null ? `${itemCount} pcs` : "N/A"}</Td>  
                <Td>  
                  {typeof finalPrice === "number"  
                    ? `₹${finalPrice.toFixed(2)}`  
                    : "N/A"}  
                </Td>  
                <Td>  
                  <Button  
                    size="sm"  
                    colorScheme="green"  
                    onClick={() => openModal(order)}  
                  >  
                    View  
                  </Button>  
                </Td>  
              </Tr>  
            );  
          })}  
        </Tbody>  
      </Table>  

      {/* Pagination Controls */}  
      <HStack mt={4} justify="flex-end" spacing={2}>  
        <Button  
          size="sm"  
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}  
          disabled={currentPage === 1}  
        >  
          Previous  
        </Button>  
        <Text>  
          Page {currentPage} of {totalPages}  
        </Text>  
        <Button  
          size="sm"  
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}  
          disabled={currentPage === totalPages}  
        >  
          Next  
        </Button>  
      </HStack>  

      {/* Order Detail Modal */}  
      {selectedOrder && (  
        <OrderDetail  
          isOpen={isModalOpen}  
          onClose={closeModal}  
          orderSummary={selectedOrder}  
          paymentSummary={paymentSummary}  
        />  
      )}  
    </Box>  
  );  
}  
