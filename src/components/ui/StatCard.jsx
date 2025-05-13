import { Button, StatLabel, StatNumber } from "@chakra-ui/react";  

// Reusable component for a single stat card button  
export function StatCard({ label, value, onClick, isCurrency, suffix, unit }) {  
  return (  
    <Button  
      p={4}  
      shadow="sm"  
      borderWidth="1px"  
      rounded="md"  
      bg="green.50"  
      _hover={{ bg: "green.100" }}  
      onClick={onClick}  
      height="auto"  
      flexDirection="column"  
      justifyContent="center"  
      textAlign="center"  
      width="100%"  
    >  
      <StatLabel fontSize={{ base: "sm", md: "md" }} mb={2}>  
        {label}  
      </StatLabel>  
      <StatNumber fontSize={{ base: "lg", md: "2xl" }} color="green.700">  
        {isCurrency  
          ? `₹ ${value}${suffix ?? ""}`  
          : `${value}${suffix ?? ""}`}{" "}  
        {unit && <span style={{ fontSize: "0.75em", marginLeft: 2 }}>{unit}</span>}  
      </StatNumber>  
    </Button>  
  );  
}