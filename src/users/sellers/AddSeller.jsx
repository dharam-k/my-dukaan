import React, { useState } from "react";  
import {  
  Box,  
  VStack,  
  FormControl,  
  FormLabel,  
  Input,  
  Button,  
  useToast,
} from "@chakra-ui/react";  
import { addSeller, fetchSellerById } from "../../services/users/SellerService"; 

export default function AddSeller({  
  newSeller,  
  setNewSeller,  
  onCancel,
  onCreated,  // callback to notify parent of new seller
}) {  
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (field, value) => {  
    setNewSeller((prev) => ({ ...prev, [field]: value }));  
  };  

  const handleSave = async () => {
    if (!newSeller.name.trim()) {
      toast({ title: "Name is required", status: "error", duration: 2000, isClosable: true });
      return;
    }
    if (!newSeller.email?.trim()) {
      toast({ title: "Email is required", status: "error", duration: 2000, isClosable: true });
      return;
    }
    if (!newSeller.password?.trim()) {
      toast({ title: "Password is required", status: "error", duration: 2000, isClosable: true });
      return;
    }

    setLoading(true);
    try {
      const createdSellerUid = await addSeller({
        name: newSeller.name,
        address: newSeller.address || "",
        phone: newSeller.phone || "",
        email: newSeller.email,
        password: newSeller.password,
      });

      console.log(createdSellerUid)

      // Step 2: fetch full seller data by ID
      const createdSellerData = await fetchSellerById(createdSellerUid);

      if (!createdSellerData) {
        throw new Error("Failed to fetch the newly created seller data.");
      }

      toast({
        title: "Seller created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewSeller({
        name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
      });

      if (onCreated) onCreated(createdSellerData);

      onCancel();

    } catch (error) {
      toast({
        title: "Failed to create seller",
        description: error.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (  
    <Box p={4} borderWidth="1px" borderRadius="md" bg="yellow.50" mt={4}>  
      <VStack spacing={3} align="stretch">  
        <FormControl isRequired>  
          <FormLabel>Name</FormLabel>  
          <Input  
            value={newSeller.name}  
            onChange={(e) => handleChange("name", e.target.value)}  
            isDisabled={loading}
          />  
        </FormControl>  

        <FormControl isRequired>  
          <FormLabel>Email</FormLabel>  
          <Input  
            type="email"
            value={newSeller.email}  
            onChange={(e) => handleChange("email", e.target.value)}  
            isDisabled={loading}
          />  
        </FormControl>  

        <FormControl isRequired>  
          <FormLabel>Password</FormLabel>  
          <Input  
            type="password"
            value={newSeller.password}  
            onChange={(e) => handleChange("password", e.target.value)}  
            isDisabled={loading}
          />  
        </FormControl>  

        <FormControl>  
          <FormLabel>Address</FormLabel>  
          <Input  
            value={newSeller.address}  
            onChange={(e) => handleChange("address", e.target.value)}  
            isDisabled={loading}
          />  
        </FormControl>  

        <FormControl>  
          <FormLabel>Phone</FormLabel>  
          <Input  
            value={newSeller.phone}  
            onChange={(e) => handleChange("phone", e.target.value)}  
            isDisabled={loading}
          />  
        </FormControl>  

        <Button colorScheme="green" onClick={handleSave} isLoading={loading}>  
          Save Seller  
        </Button>  
        <Button variant="ghost" onClick={onCancel} isDisabled={loading}>  
          Cancel  
        </Button>  
      </VStack>  
    </Box>  
  );  
}