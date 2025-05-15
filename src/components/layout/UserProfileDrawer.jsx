import React from "react";  
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
} from "@chakra-ui/react";  
import {  
  FaUserCircle,  
  FaEdit,  
  FaShoppingBag,  
  FaStore,  
  FaMoneyBillWave,  
  FaWarehouse,  
  FaIndustry,  
  FaSignOutAlt,  
} from "react-icons/fa";  
import { useNavigate } from "react-router-dom";

export default function UserProfileDrawer({ isOpen, onClose, userName }) {  
    const navigate = useNavigate()
  function handleLogout(){
    localStorage.removeItem("loggedInUser"); // Remove logged-in user info
    navigate("/login"); // Redirect to login page
  }
  return (  
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">  
      <DrawerOverlay />  
      <DrawerContent bg="white">  

        <DrawerCloseButton />  

        <DrawerHeader borderBottomWidth="1px" py={6}>  
          <HStack spacing={4}>  
            <Icon as={FaUserCircle} boxSize={12} color="green.500" />  
            <Box>  
              <Text fontSize="lg" fontWeight="bold" noOfLines={1}>  
                {userName || "User Name"}  
              </Text>  
              <Text fontSize="sm" color="gray.500">  
                Welcome back!  
              </Text>  
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
              onClick={() => console.log("Edit Profile")}  
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
              onClick={() => console.log("Sellers")}  
            >  
              Sellers  
            </Button>  

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
              leftIcon={<FaWarehouse />}  
              size="md"  
              fontWeight="medium"  
              onClick={() => console.log("Warehouses")}  
            >  
              Warehouses  
            </Button>  

            <Button  
              variant="ghost"  
              justifyContent="flex-start"  
              leftIcon={<FaIndustry />}  
              size="md"  
              fontWeight="medium"  
              onClick={() => console.log("Mills")}  
            >  
              Mills  
            </Button>  

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
  );  
}