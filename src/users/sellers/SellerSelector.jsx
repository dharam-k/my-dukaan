// src/components/Sellers/SellerSelector.jsx  
import React, { useState, useEffect } from "react";  
import {  
  Box,  
  VStack,  
  Input,  
  Button,  
  Text,  
  FormLabel,  
  useToast,  
} from "@chakra-ui/react";  
import AddSeller from "./AddSeller";

export default function SellerSelector({ selectedSeller, setSelectedSeller }) {  
  const [sellers, setSellers] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const [filteredSellers, setFilteredSellers] = useState([]);  
  const [creatingSeller, setCreatingSeller] = useState(false);  
  const [newSeller, setNewSeller] = useState({  
    id: "",  
    name: "",  
    address: "",  
    phone: "",  
    password: "1234",  
    userType: "seller",  
    isActive: true,  
    loginActive: false,  
    createdAt: new Date().toISOString(),  
  });  

  const toast = useToast();  

  useEffect(() => {  
    const stored = JSON.parse(localStorage.getItem("users"));  
    if (stored?.length) {  
      const filteredSellers = stored.filter((u) => u.userType === "seller");  
      setSellers(filteredSellers);  
      setFilteredSellers(filteredSellers);  
    }  
  }, []);  

  useEffect(() => {  
    if (!searchTerm) {  
      setFilteredSellers([]);  
      return;  
    }  
    const filtered = sellers.filter((s) =>  
      s.name.toLowerCase().includes(searchTerm.toLowerCase())  
    );  
    setFilteredSellers(filtered);  
  }, [searchTerm, sellers]);  

  const handleSelectSeller = (seller) => {  
    setSelectedSeller(seller);  
    setCreatingSeller(false);  
    setSearchTerm("");  
  };  

  const handleCreateSellerToggle = () => {  
    setCreatingSeller(true);  
    setSelectedSeller(null);  
  };  

  const handleSaveNewSeller = () => {  
    if (!newSeller.name.trim()) {  
      toast({  
        title: "Name is required",  
        status: "error",  
        duration: 2000,  
        isClosable: true,  
      });  
      return;  
    }  

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];  
    const sellerWithId = {  
      ...newSeller,  
      id: `seller-${Date.now()}`,  
    };  
    const updatedUsers = [...allUsers, sellerWithId];  
    const updatedSellers = updatedUsers.filter((u) => u.userType === "seller");  

    localStorage.setItem("users", JSON.stringify(updatedUsers));  
    setSellers(updatedSellers);  
    setFilteredSellers(updatedSellers);  

    toast({  
      title: "Seller created",  
      status: "success",  
      duration: 2000,  
      isClosable: true,  
    });  

    setSelectedSeller(sellerWithId);  
    setCreatingSeller(false);  
    setNewSeller({  
      id: "",  
      name: "",  
      address: "",  
      phone: "",  
      password: "",  
      userType: "seller",  
      isActive: true,  
      loginActive: false,  
      createdAt: new Date().toISOString(),  
    });  
    setSearchTerm("");  
  };  

  return (  
    <Box display={"flex"} flexDirection={"column"} p={0}>  
      <FormLabel>Search Seller by Name</FormLabel>  
      <Input  
        placeholder="Type seller name..."  
        value={searchTerm}  
        onChange={(e) => setSearchTerm(e.target.value)}  
      />  

      {searchTerm ? (  
        <VStack  
          mt={2}  
          spacing={1}  
          align="stretch"  
          maxH="150px"  
          overflowY="auto"  
          borderWidth="1px"  
          borderRadius="md"  
          p={2}  
        >  
          {filteredSellers.length > 0 ? (  
            filteredSellers.map((seller, i) => (  
              <Button  
                variant={selectedSeller?.name === seller.name ? "solid" : "ghost"}  
                colorScheme="blue"  
                key={i}  
                size="sm"  
                justifyContent="flex-start"  
                p={3}  
                onClick={() => handleSelectSeller(seller)}  
              >  
                {seller.name}  
              </Button>  
            ))  
          ) : (  
            <Text color="red.500" fontSize="sm" textAlign="center">  
              No sellers found.  
            </Text>  
          )}  
          <Button  
            size="sm"  
            mt={2}  
            p={3}  
            colorScheme="green"  
            onClick={handleCreateSellerToggle}  
          >  
            Create New Seller  
          </Button>  
        </VStack>  
      ) : null}  

      {!searchTerm && !creatingSeller && (  
        <Button  
          size="sm"  
          mt={2}  
          p={5}  
          colorScheme="green"  
          onClick={handleCreateSellerToggle}  
        >  
          Create New Seller  
        </Button>  
      )}  

      {creatingSeller && (  
        <AddSeller  
          newSeller={newSeller}  
          setNewSeller={setNewSeller}  
          onSave={handleSaveNewSeller}  
          onCancel={() => setCreatingSeller(false)}  
        />  
      )}  
    </Box>  
  );  
}
