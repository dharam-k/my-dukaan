import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import CreatableSelect from "react-select/creatable";
import { FaIdBadge } from "react-icons/fa";
import { fetchDharmakatas, addDharmakata } from "../../services/stock-maitain/DharmakataService";

const ADD_NEW_OPTION = { label: "➕ नया धर्म कांटा जोड़ें", value: "__add_new__" };

export default function DharmKataName({ dharmKata, setDharmKata }) {
  const [options, setOptions] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDharmKata, setNewDharmKata] = useState("");

  useEffect(() => {
    async function loadDharmakatas() {
      try {
        const dharmakatasFromDb = await fetchDharmakatas();
        const opts = dharmakatasFromDb.map(({ name }) => ({ value: name, label: name }));
        setOptions([...opts, ADD_NEW_OPTION]);
      } catch (error) {
        console.error("Failed to fetch dharmakatas from Firestore:", error);
        setOptions([ADD_NEW_OPTION]);
      }
    }
    loadDharmakatas();
  }, []);

  const handleAddNew = async () => {
    const trimmedValue = newDharmKata.trim();
    if (!trimmedValue) return;

    // Avoid duplicates
    if (options.find((opt) => opt.value === trimmedValue)) {
      alert("यह धर्म कांटा पहले से मौजूद है।");
      return;
    }

    try {
      await addDharmakata({ name: trimmedValue });
      const newOption = { value: trimmedValue, label: trimmedValue };
      setOptions((prev) => [newOption, ...prev.filter(opt => opt.value !== "__add_new__"), ADD_NEW_OPTION]);
      setDharmKata(trimmedValue);
      setNewDharmKata("");
      onClose();
    } catch (error) {
      console.error("Failed to add dharmakata:", error);
      alert("धर्म कांटा जोड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    }
  };

  const handleChange = (selectedOption) => {
    if (!selectedOption) {
      setDharmKata("");
      return;
    }
    if (selectedOption.value === "__add_new__") {
      // Open modal to add new dharmakata
      onOpen();
    } else {
      setDharmKata(selectedOption.value);
    }
  };

  const filteredOptions = options;

  const selected = dharmKata ? { value: dharmKata, label: dharmKata } : null;

  return (
    <>
      <Box>
        <FormControl>
          <FormLabel>
            <HStack spacing={2}>
              <Box color="teal.600">
                <FaIdBadge />
              </Box>
              <Box>धर्म कांटा</Box>
            </HStack>
          </FormLabel>
          <CreatableSelect
            isClearable
            options={filteredOptions}
            onChange={handleChange}
            value={selected}
            placeholder="धर्म कांटा चुनें या बनाएँ..."
            // Disable creatable option to avoid confusion with modal add
            isValidNewOption={() => false}
          />
        </FormControl>
      </Box>

      {/* Modal for adding new DharmKata */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>नया धर्म कांटा जोड़ें</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="नया धर्म कांटा नाम"
              value={newDharmKata}
              onChange={(e) => setNewDharmKata(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddNew();
                }
              }}
              autoFocus
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              बंद करें
            </Button>
            <Button colorScheme="teal" onClick={handleAddNew}>
              जोड़ें
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}