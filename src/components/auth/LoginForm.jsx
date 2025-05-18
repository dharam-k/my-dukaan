import React, { useState } from "react";
import { useToast, Spinner, Icon, Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";
import { loginUser } from "../../firebase/authService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      toast({
        title: "Login failed",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const user = await loginUser(email, password);
      setLoading(false);
      toast({
        title: "Login successful",
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      setTimeout(() => {
        if (user.userType === "seller") {
          window.location.href = "/seller-dashboard";
        } else if (user.userType === "buyer") {
          window.location.href = "/buyer-dashboard";
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, green.100, white, green.50)" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box bg="white" p={8} rounded="2xl" shadow="lg" w="full" maxW="sm" as="form" onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <Box bg="green.400" p={2.5} rounded="full" mb={1}>
            <Icon as={MdLogin} color="white" boxSize={8} />
          </Box>
          <Heading as="h1" size="lg" color="green.700" textAlign="center" lineHeight="short">
            Welcome to Agri Shop Management
          </Heading>
          <Text color="gray.500" fontSize="sm" textAlign="center">
            Please login to access your dashboard.
          </Text>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Button colorScheme="green" type="submit" width="full" fontWeight="bold" leftIcon={loading ? <Spinner size="sm" /> : <MdLogin />} mt={2} isLoading={loading} loadingText="Logging in...">
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