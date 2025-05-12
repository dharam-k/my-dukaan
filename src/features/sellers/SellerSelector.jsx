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
 

const LOCAL_STORAGE_SELLERS = "dharmkata_sellers";  

export default function SellerSelector({ selectedSeller, setSelectedSeller }) {  
  const [sellers, setSellers] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const [filteredSellers, setFilteredSellers] = useState([]);  
  const [creatingSeller, setCreatingSeller] = useState(false);  
  const [newSeller, setNewSeller] = useState({ name: "", address: "", phone: "" });  
  const toast = useToast();  

  useEffect(() => {  
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELLERS));  
    if (stored?.length) {  
      setSellers(stored);  
      setFilteredSellers(stored);  
    } else {  
      const dummy = [  
        { name: "Seller One", address: "Addr 1", phone: "111-1111" },  
        { name: "Seller Two", address: "Addr 2", phone: "222-2222" },  
      ];  
      setSellers(dummy);  
      setFilteredSellers(dummy);  
      localStorage.setItem(LOCAL_STORAGE_SELLERS, JSON.stringify(dummy));  
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
    const updatedSellers = [...sellers, newSeller];  
    setSellers(updatedSellers);  
    localStorage.setItem(LOCAL_STORAGE_SELLERS, JSON.stringify(updatedSellers));  
    toast({  
      title: "Seller created",  
      status: "success",  
      duration: 2000,  
      isClosable: true,  
    });  
    setSelectedSeller(newSeller);  
    setCreatingSeller(false);  
    setNewSeller({ name: "", address: "", phone: "" });  
    setSearchTerm("");  
  };  

  return (  
    <Box>  
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
            colorScheme="green"  
            onClick={handleCreateSellerToggle}  
            isFullWidth  
          >  
            Create New Seller  
          </Button>  
        </VStack>  
      ) : null}  

      {!searchTerm && !creatingSeller && (  
        <Button  
          size="sm"  
          mt={2}  
          colorScheme="green"  
          onClick={handleCreateSellerToggle}  
          isFullWidth  
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