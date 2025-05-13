import { SimpleGrid, Stat, useBreakpointValue } from "@chakra-ui/react";
import { StatCard } from "./StatCard";

// Reusable component for the grid of stats  
export function StatsGrid({ stats, onStatClick }) {  
  // Determine columns based on count or fixed  
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 4 });  

  return (  
    <SimpleGrid columns={columns} spacing={4} mb={4}>  
      {stats.map(({ label, value, unit, isCurrency = false, suffix = "" }, idx) => ( 
        <Stat key={idx}>  
          <StatCard  
            label={label}  
            value={value}  
            unit={unit}  
            isCurrency={isCurrency}  
            suffix={suffix} 
            onClick={() => onStatClick(label)}  
            isCurrency={false}  
          />  
        </Stat>  
      ))}  
    </SimpleGrid>  
  );  
}