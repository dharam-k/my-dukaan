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
import { fetchSellers } from "../../services/users/SellerService";

export default function SellerSelector({ selectedSeller, setSelectedSeller }) {  
  const [sellers, setSellers] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const [filteredSellers, setFilteredSellers] = useState([]);  
  const [creatingSeller, setCreatingSeller] = useState(false);  
  const [loadingSellers, setLoadingSellers] = useState(false);
  
  const [newSeller, setNewSeller] = useState({  
    name: "",  
    address: "",  
    phone: "",  
    email: "",
    password: "",
  });  

  const toast = useToast();

  // Load sellers from Firestore on mount
  useEffect(() => {  
    async function loadSellers() {
      setLoadingSellers(true);
      try {
        const data = await fetchSellers();
        setSellers(data);
        setFilteredSellers(data);
      } catch (error) {
        toast({
          title: "Failed to load sellers",
          description: error.message || "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingSellers(false);
      }
    }
    loadSellers();
  }, [toast]);

  // Filter sellers safely based on search term
  useEffect(() => {  
    if (!searchTerm) {  
      setFilteredSellers(sellers);  
      return;  
    }  
    const filtered = sellers.filter((s) =>  
      s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())  
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

  const handleNewSellerCreated = (createdSeller) => {
    // Normalize createdSeller fields, add fallback name/id if missing
    console.log(createdSeller.id)
    const sellerToAdd = {
      id: createdSeller.id || createdSeller.uid || new Date().getTime().toString(),
      name: createdSeller.name || createdSeller.name || "Unnamed Seller",
      address: createdSeller.address || "",
      phone: createdSeller.phone || "",
      email: createdSeller.email || "",
    };

    const updatedSellers = [...sellers, sellerToAdd];
    setSellers(updatedSellers);
    setFilteredSellers(updatedSellers);
    setSelectedSeller(sellerToAdd);
    setCreatingSeller(false);
    setSearchTerm("");
    setNewSeller({ name: "", address: "", phone: "", email: "", password: "" });
  };

  return (  
    <Box display={"flex"} flexDirection={"column"} p={0}>  
      <FormLabel>Search Seller by Name</FormLabel>  
      <Input  
        placeholder="Type seller name..."  
        value={searchTerm}  
        onChange={(e) => setSearchTerm(e.target.value)}  
        isDisabled={loadingSellers}
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
            filteredSellers.map((seller) => (  
              <Button  
                variant={selectedSeller?.id === seller.id ? "solid" : "ghost"}  
                colorScheme="blue"  
                key={seller.id}  
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
          isDisabled={loadingSellers}
        >  
          Create New Seller  
        </Button>  
      )}  

      {creatingSeller && (
        <AddSeller  
          newSeller={newSeller}  
          setNewSeller={setNewSeller}  
          onCancel={() => setCreatingSeller(false)}  
          onCreated={handleNewSellerCreated} 
        />  
      )}  
    </Box>  
  );  
}