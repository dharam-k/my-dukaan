import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Box,
  Text,
  HStack,
  IconButton,
  useToast,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaListAlt, FaMoneyBillWave } from "react-icons/fa";
import SellerAddEditModal from "./SellerAddEditModal";

function generateId() {
  return `user_${Date.now()}`;
}

// Payments Modal to show payments for an order
function PaymentsModal({ isOpen, onClose, orderId }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (isOpen && orderId) {
      const savedPayments = JSON.parse(localStorage.getItem("payments") || "[]");
      const filtered = savedPayments.filter((p) => p.orderId === orderId);
      setPayments(filtered);
    }
  }, [isOpen, orderId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payments (Total: {payments.length})</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {payments.length === 0 ? (
            <Text>No payments for this order.</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {payments.map((payment, i) => (
                <Box key={i} borderWidth="1px" borderRadius="md" p={3}>
                  <Text><b>Payment ID:</b> {payment.paymentId || `payment_${i + 1}`}</Text>
                  <Text><b>Total Amount:</b> {payment.finalPrice}</Text>
                  <Text><b>Date:</b> {new Date(payment.date || payment.createdAt).toLocaleDateString()}</Text>
                  <Text><b>Status:</b> {payment.status || "N/A"}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Orders Modal to list orders for a seller, with payments button
function OrdersModal({ isOpen, onClose, sellerId, sellerName }) {
  const [orders, setOrders] = useState([]);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (isOpen && sellerId) {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const filtered = savedOrders.filter((o) => o.sellerId === sellerId);
      setOrders(filtered);
    }
  }, [isOpen, sellerId]);

  const openPaymentsModal = (orderId) => {
    setSelectedOrderId(orderId);
    setPaymentsModalOpen(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Orders for: <strong>{sellerName}</strong> (Total: {orders.length})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {orders.length === 0 ? (
              <Text>No orders found for this seller.</Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {orders.map((order, i) => (
                  <Box key={i} borderWidth="1px" borderRadius="md" p={3}>
                    <HStack justifyContent="space-between" flexWrap="wrap">
                      <Box>
                        <Text><b>Order ID:</b> {order.orderId || order.id || `order_${i+1}`}</Text>
                        <Text><b>Date:</b> {new Date(order.created_at || order.date).toLocaleDateString()}</Text>
                      </Box>
                      <Button
                        size="sm"
                        leftIcon={<FaMoneyBillWave />}
                        colorScheme="purple"
                        onClick={() => openPaymentsModal(order.orderId || order.id)}
                      >
                        View Payments
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <PaymentsModal
        isOpen={paymentsModalOpen}
        onClose={() => {
          setPaymentsModalOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />
    </>
  );
}

export default function SellersListModal({ isOpen, onClose }) {
  const [sellers, setSellers] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem("users") || "[]");
      const sellersOnly = saved.filter((u) => u.userType === "seller");
      setSellers(sellersOnly);
    }
  }, [isOpen]);

  const saveList = (list) => {
    const allUsersRaw = localStorage.getItem("users");
    let allUsers = [];
    if (allUsersRaw) {
      allUsers = JSON.parse(allUsersRaw).filter((u) => u.userType !== "seller");
    }
    const updatedUsers = [...allUsers, ...list];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setSellers(list);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    const newList = [...sellers];
    newList.splice(index, 1);
    saveList(newList);
    toast({ title: "Seller deleted", status: "success", duration: 2000 });
  };

  const handleAddEdit = (sellerData) => {
    const newList = [...sellers];

    if (editIndex !== null) {
      sellerData.createdAt = newList[editIndex].createdAt;
      sellerData.id = newList[editIndex].id;
      newList[editIndex] = sellerData;
      toast({ title: "Seller updated", status: "success", duration: 2000 });
    } else {
      sellerData.id = generateId();
      sellerData.createdAt = new Date().toISOString();
      sellerData.userType = "seller";
      newList.push(sellerData);
      toast({ title: "Seller added", status: "success", duration: 2000 });
    }
    saveList(newList);
    setAddEditModalOpen(false);
    setEditIndex(null);
  };

  const openOrdersModal = (seller) => {
    setSelectedSeller(seller);
    setIsOrdersModalOpen(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sellers List (Total: {sellers.length})</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {sellers.length === 0 ? (
              <Text>No sellers available.</Text>
            ) : (
              <VStack align="start" spacing={2}>
                {sellers.map((seller, i) => (
                  <Box
                    key={seller.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                  >
                    <Box flex="1" minWidth="220px" mr={4}>
                      <Text fontWeight="bold">{seller.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Phone: {seller.phone} | Address: {seller.address}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Created At: {new Date(seller.createdAt).toLocaleString()}
                      </Text>
                    </Box>
                    <HStack spacing={1} flexShrink={0} mt={[2, 0]}>
                      <Button
                        size="sm"
                        leftIcon={<FaListAlt />}
                        colorScheme="blue"
                        onClick={() => openOrdersModal(seller)}
                      >
                        View Orders
                      </Button>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit seller"
                        size="sm"
                        onClick={() => {
                          setEditIndex(i);
                          setAddEditModalOpen(true);
                        }}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete seller"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(i)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              onClick={() => {
                setEditIndex(null);
                setAddEditModalOpen(true);
              }}
            >
              Add Seller
            </Button>
            <Button ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SellerAddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditIndex(null);
        }}
        onSave={handleAddEdit}
        initialData={editIndex !== null ? sellers[editIndex] : null}
      />

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => {
          setIsOrdersModalOpen(false);
          setSelectedSeller(null);
        }}
        sellerId={selectedSeller?.id}
        sellerName={selectedSeller?.name}
      />
    </>
  );
}