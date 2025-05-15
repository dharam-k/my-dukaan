import React, { useState, useMemo } from "react";  
import {  
  Table, Thead, Tbody, Tr, Th, Td, Box, Text, Badge, Button, HStack, Input, Select  
} from "@chakra-ui/react";  
import PaymentDetail from "./PaymentDetail";
import getUserById from "../../services/users/getUser";

const PAGE_SIZE = 5;  

export function PaymentsTable({ payments = [], orders = [] }) {   
  // All hooks first, no conditional returns before these  
  const [currentPage, setCurrentPage] = useState(1);  
  const [selectedOrder, setSelectedOrder] = useState(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [paymentSummary, setPaymentSummary] = useState(null);   

  const [searchTerm, setSearchTerm] = useState("");  
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");  
  const [sortBy, setSortBy] = useState({ key: "orderId", order: "asc" });  

  // Use safe default arrays to avoid undefined errors  
  const safePayments = payments || [];  
  const safeOrders = orders || [];  
  console.log(orders)
  console.log(payments)

  // Prepare filtered payments based on search and filterPaymentStatus  
  const filteredPayments = useMemo(() => { 
      // Sort payments by createdAt descending (newest first)  
    const sortedPayments = [...safePayments].sort((a, b) => {  
      const dateA = new Date(a.createdAt);  
      const dateB = new Date(b.createdAt);  
      return dateB - dateA; // descending order  
    });   
    return sortedPayments.filter(p => {  
      if (searchTerm) {  
        const lowerSearch = searchTerm.toLowerCase();  
        const matchesOrderId = p.orderId.toLowerCase().includes(lowerSearch);  
        const matchesSeller = (getUserById(p.sellerId).name || "").toLowerCase().includes(lowerSearch);  
        const matchesBuyer = (getUserById(p.buyerId).name || "").toLowerCase().includes(lowerSearch);  
        if (!matchesOrderId && !matchesSeller && !matchesBuyer) return false;  
      }  
      if (filterPaymentStatus && p.paymentStatus !== filterPaymentStatus) return false;  
      return true;  
    });  
  }, [safePayments, searchTerm, filterPaymentStatus]);  

  // Sort the filtered payments  
  const sortedPayments = useMemo(() => {  
    const { key, order } = sortBy;  

    return filteredPayments.slice().sort((a, b) => {  
      let aVal = a[key];  
      let bVal = b[key];  

      if (aVal == null) return 1;  
      if (bVal == null) return -1;  

      if (["finalPrice", "paidAmount", "dueAmount"].includes(key)) {  
        aVal = Number(aVal);  
        bVal = Number(bVal);  
      } else {  
        aVal = String(aVal).toLowerCase();  
        bVal = String(bVal).toLowerCase();  
      }  

      if (aVal < bVal) return order === "desc" ? -1 : 1;  
      if (aVal > bVal) return order === "desc" ? 1 : -1;  
      return 0;  
    });  
  }, [filteredPayments, sortBy]);  

  // Pagination logic  
  const totalPages = Math.max(1, Math.ceil(sortedPayments.length / PAGE_SIZE));  
  const startIdx = (currentPage - 1) * PAGE_SIZE;  
  const currentPayments = sortedPayments.slice(startIdx, startIdx + PAGE_SIZE);  

  // Helpers to toggle sorting order on column headers  
  const toggleSort = (key) => {  
    setSortBy(prev => {  
      if (prev.key === key) {  
        return { key, order: prev.order === "asc" ? "desc" : "asc" };  
      }  
      return { key, order: "asc" };  
    });  
  };  

  // Modal open handler  
  const openModal = (payment) => {   
    const order = safeOrders.find(o => o.orderId === payment.orderId) || null;  
    setSelectedOrder(order);  
    setIsModalOpen(true);  
    setPaymentSummary(payment);  
  };   

  const closeModal = () => {  
    setIsModalOpen(false);  
    setSelectedOrder(null);  
    setPaymentSummary(null);  
  };  

  return (  
    <Box mt={8} borderWidth={1} borderRadius="md" overflowX="auto" p={4}>  
      {safePayments.length === 0 ? (  
        <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
          <Text>No pending payments.</Text>  
        </Box>  
      ) : safeOrders.length === 0 ? (  
        <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">  
          <Text>No recent orders found.</Text>  
        </Box>  
      ) : (  
        <>  
          <Text fontSize="xl" mb={4} fontWeight="bold" color="green.600">  
            Total Payments  
          </Text>  

          <HStack spacing={4} mb={4} flexWrap="wrap">  
            <Input  
              placeholder="Search by Order ID, Seller or Buyer"  
              value={searchTerm}  
              onChange={e => {  
                setSearchTerm(e.target.value);  
                setCurrentPage(1);  
              }}  
              width="300px"  
            />  

            <Select  
              placeholder="Filter by Payment Status"  
              value={filterPaymentStatus}  
              onChange={e => {  
                setFilterPaymentStatus(e.target.value);  
                setCurrentPage(1);  
              }}  
              width="180px"  
            >  
              <option value="PENDING">PENDING</option>  
              <option value="COMPLETED">COMPLETED</option>  
              <option value="FAILED">FAILED</option>  
            </Select>  
          </HStack>  

          <Table variant="striped" colorScheme="green" size="sm">  
            <Thead>  
              <Tr>  
                <Th cursor="pointer" onClick={() => toggleSort("orderId")}>  
                  Order ID {sortBy.key === "orderId" ? (sortBy.order === "asc" ? "▲" : "▼") : ""}  
                </Th>  
                <Th>Seller</Th>  
                <Th cursor="pointer" onClick={() => toggleSort("finalPrice")}>  
                  Total Amount {sortBy.key === "finalPrice" ? (sortBy.order === "asc" ? "▲" : "▼") : ""}  
                </Th>  
                <Th cursor="pointer" onClick={() => toggleSort("paidAmount")}>  
                  Paid Amount {sortBy.key === "paidAmount" ? (sortBy.order === "asc" ? "▲" : "▼") : ""}  
                </Th>  
                <Th cursor="pointer" onClick={() => toggleSort("dueAmount")}>  
                  Due Amount {sortBy.key === "dueAmount" ? (sortBy.order === "asc" ? "▲" : "▼") : ""}  
                </Th>  
                <Th cursor="pointer" onClick={() => toggleSort("paymentStatus")}>  
                  Status {sortBy.key === "paymentStatus" ? (sortBy.order === "asc" ? "▲" : "▼") : ""}  
                </Th>  
                <Th>Action</Th>  
              </Tr>  
            </Thead>  
            <Tbody>  
              {currentPayments.map((p, i) => {  
                const order = safeOrders.find(o => o.orderId === p.orderId) || {};  
                return (  
                  <Tr key={`${p.orderId}-${i}`}>  
                    <Td>{p.orderId}</Td>  
                    <Td>{p.sellerName || getUserById(order.sellerId)?.name || "N/A"}</Td>  
                    <Td>₹{p.finalPrice}</Td>  
                    <Td>₹{ p.paidAmount}</Td>  
                    <Td>₹{p.dueAmount}</Td>  
                    <Td>  
                      <Badge  
                        colorScheme={p.paymentStatus === "COMPLETED" ? "green" : "orange"}  
                        textTransform="uppercase"  
                      >  
                        {p.paymentStatus}  
                      </Badge>  
                    </Td>  
                    <Td>  
                      <Button size="sm" colorScheme="green" onClick={() => openModal(p)}>  
                        View  
                      </Button>  
                    </Td>  
                  </Tr>  
                );  
              })}  
            </Tbody>  
          </Table>  

          <HStack mt={4} justify="flex-end" spacing={2}>  
            <Button size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>  
              Previous  
            </Button>  
            <Text>  
              Page {currentPage} of {totalPages}  
            </Text>  
            <Button size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>  
              Next  
            </Button>  
          </HStack>  

          {selectedOrder && (  
            <PaymentDetail  
              isOpen={isModalOpen}  
              onClose={closeModal}  
              orderSummary={selectedOrder}  
              paymentSummary={paymentSummary}  
            />  
          )}  
        </>  
      )}  
    </Box>  
  );  
}  
