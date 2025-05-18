import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  Divider,
  Spacer,
  Collapse,
} from "@chakra-ui/react";
import {
  FaUserCircle,
  FaEdit,
  FaShoppingBag,
  FaStore,
  FaMoneyBillWave,
  FaIndustry,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import MillsListModal from "../../features/mills/MillsListModal";
import MillProfileFormModal from "../../features/mills/MillProfileFormModal";
import ItemTypeListModal from "../../features/stock-maintain/ItemTypeListModal";
import DharmakataListModal from "../../features/stock-maintain/DharmakataListModal";
import WarehouseListModal from "../../features/stock-maintain/WarehouseListModal";
import SellersListModal from "../../users/sellers/SellersListModal";

import { subscribeCurrentUser, logout } from "../../services/users/UserService";
import EditProfileModal from "../../users/buyers/EditProfileModal";

export default function UserProfileDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);

  // Mills submenu & modals
  const [millsSubMenuOpen, setMillsSubMenuOpen] = useState(false);
  const [isMillsListOpen, setIsMillsListOpen] = useState(false);
  const [isMillModalOpen, setIsMillModalOpen] = useState(false);

  // StockMaintain submenu and modals
  const [stockMaintainSubMenuOpen, setStockMaintainSubMenuOpen] = useState(false);
  const [isItemTypeListOpen, setIsItemTypeListOpen] = useState(false);
  const [isDharmakataListOpen, setIsDharmakataListOpen] = useState(false);
  const [isWarehouseListOpen, setIsWarehouseListOpen] = useState(false);

  // Sellers List modal
  const [isSellersListOpen, setIsSellersListOpen] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeCurrentUser(setUserDetails);

    return () => unsubscribe();
  }, [isOpen]);

  const handleOpenMillModal = () => {
    setIsMillModalOpen(true);
    onClose();
  };

  const handleOpenMillsList = () => {
    setIsMillsListOpen(true);
    onClose();
  };

  const toggleStockMaintainSubMenu = () =>
    setStockMaintainSubMenuOpen((v) => !v);

  const toggleMillsSubMenu = () =>
    setMillsSubMenuOpen((v) => !v);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optional: show toast or alert
    }
  }

  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" py={6}>
            <HStack spacing={4}>
              <Icon as={FaUserCircle} boxSize={12} color="green.500" />
              <Box>
                <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                  {userDetails?.name || "User Name"}
                </Text>
                <Text fontSize="sm" color="gray.500">Welcome back!</Text>
              </Box>
            </HStack>
          </DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" p={4}>
            <VStack spacing={4} align="stretch" flex="1">
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaEdit />}
                size="md"
                fontWeight="medium"
                onClick={() => navigate("/buyer-dashboard")}
              >
                Dashboard
              </Button>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaEdit />}
                size="md"
                fontWeight="medium"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaShoppingBag />}
                size="md"
                fontWeight="medium"
                onClick={() => console.log("Orders")}
              >
                Orders
              </Button>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaStore />}
                size="md"
                fontWeight="medium"
                onClick={() => setIsSellersListOpen(true)}
              >
                Sellers
              </Button>
              <SellersListModal
                isOpen={isSellersListOpen}
                onClose={() => setIsSellersListOpen(false)}
              />

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaMoneyBillWave />}
                size="md"
                fontWeight="medium"
                onClick={() => console.log("Payments")}
              >
                Payments
              </Button>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaMoneyBillWave />}
                size="md"
                fontWeight="medium"
                onClick={toggleStockMaintainSubMenu}
                rightIcon={
                  stockMaintainSubMenuOpen ? <FaChevronUp /> : <FaChevronDown />
                }
              >
                Stock Maintain
              </Button>

              <Collapse in={stockMaintainSubMenuOpen} animateOpacity>
                <VStack pl={8} align="start" spacing={1} mb={2}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsItemTypeListOpen(true);
                      onClose();
                    }}
                  >
                    Item Types
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsDharmakataListOpen(true);
                      onClose();
                    }}
                  >
                    Dharmakata
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsWarehouseListOpen(true);
                      onClose();
                    }}
                  >
                    Warehouses
                  </Button>
                </VStack>
              </Collapse>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaIndustry />}
                size="md"
                fontWeight="medium"
                onClick={toggleMillsSubMenu}
                rightIcon={millsSubMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
              >
                Mills
              </Button>

              <Collapse in={millsSubMenuOpen} animateOpacity>
                <VStack pl={8} align="start">
                  <Button variant="ghost" size="sm" onClick={handleOpenMillModal}>
                    Create Mill
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleOpenMillsList}>
                    List of Mills
                  </Button>
                </VStack>
              </Collapse>
            </VStack>

            <Spacer />

            <Divider mt={4} mb={4} />

            <Button
              colorScheme="red"
              variant="solid"
              leftIcon={<FaSignOutAlt />}
              size="md"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Modals */}
      <MillProfileFormModal
        isOpen={isMillModalOpen}
        onClose={() => setIsMillModalOpen(false)}
      />
      <MillsListModal
        isOpen={isMillsListOpen}
        onClose={() => setIsMillsListOpen(false)}
      />
      <ItemTypeListModal
        isOpen={isItemTypeListOpen}
        onClose={() => setIsItemTypeListOpen(false)}
      />
      <DharmakataListModal
        isOpen={isDharmakataListOpen}
        onClose={() => setIsDharmakataListOpen(false)}
      />
      <WarehouseListModal
        isOpen={isWarehouseListOpen}
        onClose={() => setIsWarehouseListOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
}