import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  Input,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import PaymentDetail from "./PaymentDetail";
import getUserById from "../../services/users/getUser"; // async fetch user by ID
import { subscribePayments } from "../../services/payments/PaymentService";
import { getOrderById } from "../../services/orders/OrderService";

const PAGE_SIZE = 5;

export function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [usersCache, setUsersCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState({ key: "orderId", order: "asc" });

  const toast = useToast();

  // Subscribe to payments data
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribePayments(
      (data) => {
        setPayments(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        toast({
          title: "Failed to load payments",
          description: err.message || "Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    );
    return () => unsubscribe();
  }, [toast]);

  // Memo: keep only latest payment per orderId
  const lastPaymentsByOrder = useMemo(() => {
    const map = new Map();

    payments.forEach((payment) => {
      const orderId = payment.orderId;
      if (!orderId) return;

      const currentLatest = map.get(orderId);

      let createdAtTime = 0;
      if (payment.createdAt) {
        if (payment.createdAt.toDate) {
          createdAtTime = payment.createdAt.toDate().getTime();
        } else {
          createdAtTime = new Date(payment.createdAt).getTime();
        }
      }

      let currentLatestTime = 0;
      if (currentLatest?.createdAt) {
        if (currentLatest.createdAt.toDate) {
          currentLatestTime = currentLatest.createdAt.toDate().getTime();
        } else {
          currentLatestTime = new Date(currentLatest.createdAt).getTime();
        }
      }

      if (!currentLatest || createdAtTime > currentLatestTime) {
        map.set(orderId, payment);
      }
    });

    return Array.from(map.values());
  }, [payments]);

  // Fetch users for unique sellerId and buyerId not cached
  useEffect(() => {
    async function fetchUsers() {
      const userIds = new Set();
      lastPaymentsByOrder.forEach(({ sellerId, buyerId }) => {
        if (sellerId && !usersCache[sellerId]) userIds.add(sellerId);
        if (buyerId && !usersCache[buyerId]) userIds.add(buyerId);
      });
      if (userIds.size === 0) return;

      const newUsers = {};
      await Promise.all(
        Array.from(userIds).map(async (id) => {
          try {
            const user = await getUserById(id);
            if (user) newUsers[id] = user;
          } catch {
            // ignore errors
          }
        })
      );

      if (Object.keys(newUsers).length > 0) {
        setUsersCache((prev) => ({ ...prev, ...newUsers }));
      }
    }
    fetchUsers();
  }, [lastPaymentsByOrder, usersCache]);

  // Filter payments by search and status
  const filtered = useMemo(() => {
    return lastPaymentsByOrder
      .filter((p) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const sellerName = usersCache[p.sellerId]?.name?.toLowerCase() || "";
          const buyerName = usersCache[p.buyerId]?.name?.toLowerCase() || "";
          return (
            p.orderId.toLowerCase().includes(term) ||
            sellerName.includes(term) ||
            buyerName.includes(term)
          );
        }
        return true;
      })
      .filter((p) => {
        if (filterStatus) {
          return p.paymentStatus === filterStatus;
        }
        return true;
      });
  }, [lastPaymentsByOrder, searchTerm, filterStatus, usersCache]);

  // Sort filtered payments
  const sorted = useMemo(() => {
    const { key, order } = sortBy;
    return [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (["finalPrice", "paidAmount", "dueAmount"].includes(key)) {
        return order === "desc" ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      if (aVal < bVal) return order === "desc" ? -1 : 1;
      if (aVal > bVal) return order === "desc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentPagePayments = sorted.slice(start, start + PAGE_SIZE);

  const toggleSort = (key) => {
    setSortBy((prev) =>
      prev.key === key
        ? { key, order: prev.order === "asc" ? "desc" : "asc" }
        : { key, order: "asc" }
    );
  };

  const openModal = async (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);

    try {
      const order = await getOrderById(payment.orderId);
      setSelectedOrder(order);
    } catch (err) {
      console.error("Failed to fetch order data", err);
      setSelectedOrder(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
    setSelectedOrder(null);
  };

  if (loading)
    return (
      <Box py={10} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading payments...</Text>
      </Box>
    );

  if (error)
    return (
      <Box p={4} borderRadius="md" bg="red.50" textAlign="center" my={6}>
        <Text color="red.700" fontWeight="bold">
          Error loading payments.
        </Text>
        <Text>{error.message}</Text>
      </Box>
    );

  if (lastPaymentsByOrder.length === 0)
    return (
      <Box p={4} borderRadius="md" bg="gray.50" textAlign="center" my={6}>
        <Text>No payments found.</Text>
      </Box>
    );

  return (
    <Box mt={8} p={4} borderWidth={1} borderRadius="md" overflowX="auto">
      <Text fontSize="xl" mb={4} fontWeight="bold" color="green.600">
        Payments
      </Text>

      <HStack spacing={4} mb={4} flexWrap="wrap">
        <Input
          placeholder="Search by Order ID, Seller, or Buyer"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          width={{ base: "100%", md: "300px" }}
        />
        <Select
          placeholder="Filter by Payment Status"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          width={{ base: "100%", md: "180px" }}
        >
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="FAILED">FAILED</option>
        </Select>
      </HStack>

      <Table variant="striped" colorScheme="green" size="sm">
        <Thead>
          <Tr>
            {[
              { label: "Order ID", key: "orderId" },
              { label: "Seller" },
              { label: "Total Amount", key: "finalPrice" },
              { label: "Paid Amount", key: "paidAmount" },
              { label: "Due Amount", key: "dueAmount" },
              { label: "Status", key: "paymentStatus" },
              { label: "Action" },
            ].map(({ label, key }) => (
              <Th
                key={label}
                cursor={key ? "pointer" : "default"}
                onClick={key ? () => toggleSort(key) : undefined}
                userSelect="none"
              >
                {label}{" "}
                {sortBy.key === key ? (sortBy.order === "asc" ? "▲" : "▼") : ""}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {currentPagePayments.map((p) => {
            const sellerName = usersCache[p.sellerId]?.name || "N/A";
            const buyerName = usersCache[p.buyerId]?.name || "N/A";

            return (
              <Tr key={p.id}>
                <Td>{p.orderId}</Td>
                <Td>{sellerName}</Td>
                <Td>₹{p.finalPrice ?? "-"}</Td>
                <Td>₹{p.paidAmount ?? "-"}</Td>
                <Td>₹{p.dueAmount ?? "-"}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      p.paymentStatus === "COMPLETED"
                        ? "green"
                        : p.paymentStatus === "FAILED"
                        ? "red"
                        : "orange"
                    }
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

      <HStack mt={4} justify="flex-end" spacing={2} flexWrap="wrap">
        <Button
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text alignSelf="center" minWidth="80px" textAlign="center">
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </HStack>

      {selectedPayment && selectedOrder && (
        <PaymentDetail
          isOpen={isModalOpen}
          onClose={closeModal}
          orderSummary={selectedOrder} // pass fetched order here
          paymentSummary={selectedPayment}
        />
      )}
    </Box>
  );
}