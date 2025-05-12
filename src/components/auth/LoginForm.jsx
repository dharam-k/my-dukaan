import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
  useToast,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";
// import { erpnextLogin } from "../../services/erpnextApi";

export default function LoginForm() {
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {  
    e.preventDefault();  
    setLoading(true);  

    if (!mobileOrEmail || !password) {  
      setLoading(false);  
      toast({  
        position: "top",  
        title: "Login failed",  
        description: "Please fill in all fields.",  
        status: "error",  
        duration: 2000,  
        isClosable: true,  
      });  
      return;  
    }  

    // Simulate API delay  
    setTimeout(() => {  
      const users = JSON.parse(localStorage.getItem("dummyUsers")) || [];  
      const userFound = users.find(  
        (user) =>  
          (user.mobileOrEmail === mobileOrEmail || user.mobileOrEmail === mobileOrEmail.toLowerCase()) &&  
          user.password === password  
      );  

      if (userFound) {  
        setLoading(false);  
        toast({  
          position: "top",  
          title: "Login successful",  
          description: "Welcome back!",  
          status: "success",  
          duration: 1500,  
          isClosable: true,  
        });  

        setTimeout(() => {  
          window.location.href = "/dashboard";  
        }, 1200);  
      } else {  
        setLoading(false);  
        toast({  
          position: "top",  
          title: "Login failed",  
          description: "Incorrect username or password",  
          status: "error",  
          duration: 2500,  
          isClosable: true,  
        });  
      }  
    }, 800);  
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, green.100, white, green.50)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="2xl"
        shadow="lg"
        w="full"
        maxW="sm"
        as="form"
        onSubmit={handleSubmit}
      >
        <VStack spacing={5}>
          <Box bg="green.400" p={2.5} rounded="full" mb={1}>
            <Icon as={MdLogin} color="white" boxSize={8} />
          </Box>
          <Heading
            as="h1"
            size="lg"
            color="green.700"
            textAlign="center"
            lineHeight="short"
          >
            Welcome to Agri Shop Management
          </Heading>
          <Text color="gray.500" fontSize="sm" textAlign="center">
            Please login to access your dashboard.
          </Text>

          <FormControl isRequired>
            <FormLabel>Mobile/Email</FormLabel>
            <Input
              placeholder="Enter mobile or email"
              value={mobileOrEmail}
              onChange={(e) => setMobileOrEmail(e.target.value)}
              size="md"
              autoFocus
              bg="gray.50"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="md"
              bg="gray.50"
            />
          </FormControl>

          <Button
            colorScheme="green"
            type="submit"
            width="full"
            fontWeight="bold"
            leftIcon={loading ? <Spinner size="sm" /> : <MdLogin />}
            mt={2}
            isLoading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </VStack>
        <Text mt={6} fontSize="xs" color="gray.400" textAlign="center">
          &copy; {new Date().getFullYear()} Agri Shop Management
        </Text>
      </Box>
    </Box>
  );
}
