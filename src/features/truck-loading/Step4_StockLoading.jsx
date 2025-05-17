import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Stack,
  HStack,
  Select,
  Text,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import SellerAddEditModal from "../../users/sellers/SellerAddEditModal";

export default function Step4_StockLoading({
  option,
  setOption,
  warehouseData,
  setWarehouseData,
  sellersData,
  setSellersData,
  onNext,
  onPrev,
}) {
  const [users, setUsers] = useState([]);

  const [dharmakatas, setDharmakatas] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [addingSeller, setAddingSeller] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [sellerForm, setSellerForm] = useState({
    id: "",
    name: "",
    address: "",
    mobile: "",
    ratePerQuintal: "",
    totalWeight: "",
    totalItems: "",
    totalPoldar: "",
    poldariRate: "",
    baadwjanPerQ: "",
    dharmakataOrShop: "",
  });

  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  const [addingNewDharmakata, setAddingNewDharmakata] = useState(false);
  const [newDharmakataName, setNewDharmakataName] = useState("");

  // Load data from localStorage once
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (Array.isArray(storedUsers)) {
      setUsers(storedUsers.filter((u) => u.userType === "seller"));
    }

    const storedDharmakatas = JSON.parse(localStorage.getItem("dharmakatas") || "[]");
    if (Array.isArray(storedDharmakatas)) {
      const dharmakatasNormalized =
        typeof storedDharmakatas[0] === "string"
          ? storedDharmakatas.map((name, idx) => ({ id: String(idx + 1), name }))
          : storedDharmakatas;
      setDharmakatas(dharmakatasNormalized);
    }

    const storedWarehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");
    if (Array.isArray(storedWarehouses)) {
      const warehousesNormalized =
        typeof storedWarehouses[0] === "string"
          ? storedWarehouses.map((name, idx) => ({ id: String(idx + 1), name }))
          : storedWarehouses;
      setWarehouses(warehousesNormalized);
    }
  }, []);

  // Reset form helper
  const resetForm = () => {
    setSellerForm({
      id: "",
      name: "",
      address: "",
      mobile: "",
      ratePerQuintal: "",
      totalWeight: "",
      totalItems: "",
      totalPoldar: "",
      poldariRate: "",
      baadwjanPerQ: "",
      dharmakataOrShop: "",
    });
    setEditingIndex(null);
  };

  // Reset everything related on option change
  useEffect(() => {
    if (option !== "warehouse" && option !== "both") {
      setWarehouseData({
        warehouse: "",
        totalWeight: "",
        totalItems: "",
        totalPoldar: "",
        poldariRate: "",
        dharmakata: "",
      });
    }

    if (option !== "sellers" && option !== "both") {
      setSellersData([]);
      resetForm();
      setAddingSeller(false);
    }

    // Reset local UI states
    resetForm();
    setAddingSeller(false);
    setIsSellerModalOpen(false);
    setAddingNewDharmakata(false);
    setNewDharmakataName("");
  }, [option, setWarehouseData, setSellersData]);

  const handleSellerFormChange = (field, value) => {
    setSellerForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSellerSelect = (selectedName) => {
    if (selectedName === "__addNew") {
      setModalInitialData(null);
      setIsSellerModalOpen(true);
    } else {
      setIsSellerModalOpen(false);
      setAddingNewDharmakata(false);
      const selected = users.find((u) => u.name === selectedName);
      if (selected) {
        setSellerForm({
          id: selected.id,
          name: selected.name,
          address: selected.address || "",
          mobile: selected.mobile || "",
          ratePerQuintal: "",
          totalWeight: "",
          totalItems: "",
          totalPoldar: "",
          poldariRate: "",
          baadwjanPerQ: "",
          dharmakataOrShop: "",
        });
      }
    }
  };

  const saveNewDharmakata = () => {
    if (!newDharmakataName.trim()) return;
    if (
      dharmakatas.find(
        (d) => d.name.toLowerCase() === newDharmakataName.trim().toLowerCase()
      )
    )
      return alert("This Dharmakata/Seller Shop already exists.");

    const newDharmakatas = [
      ...dharmakatas,
      { id: Date.now().toString(), name: newDharmakataName.trim() },
    ];
    setDharmakatas(newDharmakatas);
    localStorage.setItem("dharmakatas", JSON.stringify(newDharmakatas));
    setSellerForm((prev) => ({
      ...prev,
      dharmakataOrShop: newDharmakataName.trim(),
    }));
    setAddingNewDharmakata(false);
    setNewDharmakataName("");
  };

  const addSeller = () => {
    if (
      !sellerForm.name ||
      !sellerForm.ratePerQuintal ||
      !sellerForm.totalWeight ||
      !sellerForm.totalItems ||
      !sellerForm.totalPoldar ||
      !sellerForm.poldariRate ||
      !sellerForm.baadwjanPerQ ||
      !sellerForm.dharmakataOrShop
    ) {
      alert("Please fill all seller fields");
      return;
    }
    setSellersData([...sellersData, sellerForm]);
    resetForm();
    setAddingSeller(false);
  };

  const updateSeller = () => {
    if (editingIndex === null) return;
    if (
      !sellerForm.name ||
      !sellerForm.ratePerQuintal ||
      !sellerForm.totalWeight ||
      !sellerForm.totalItems ||
      !sellerForm.totalPoldar ||
      !sellerForm.poldariRate ||
      !sellerForm.baadwjanPerQ ||
      !sellerForm.dharmakataOrShop
    ) {
      alert("Please fill all seller fields");
      return;
    }
    const updatedSellers = [...sellersData];
    updatedSellers[editingIndex] = sellerForm;
    setSellersData(updatedSellers);
    resetForm();
    setAddingSeller(false);
  };

  const onEditSeller = (index) => {
    setSellerForm(sellersData[index]);
    setEditingIndex(index);
    setAddingSeller(true);
    setAddingNewDharmakata(false);
    setIsSellerModalOpen(false);
  };

  const onDeleteSeller = (index) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      const updatedSellers = sellersData.filter((_, i) => i !== index);
      setSellersData(updatedSellers);
      if (editingIndex === index) {
        resetForm();
        setAddingSeller(false);
      }
    }
  };

  const handleModalSave = (newSeller) => {
    const sellerObject = {
      id: Date.now().toString(),
      userType: "seller",
      name: newSeller.name,
      address: newSeller.address,
      mobile: newSeller.phone,
      password: newSeller.password,
    };

    // Append to users and update localStorage
    const updatedUsers = [...users, sellerObject];
    setUsers(updatedUsers);
    // To prevent overriding non-seller users, combine with existing non-seller users from localStorage
    try {
      const allUsersRaw = JSON.parse(localStorage.getItem("users")) || [];
      const nonSellers = allUsersRaw.filter((u) => u.userType !== "seller");
      localStorage.setItem(
        "users",
        JSON.stringify([...nonSellers, ...updatedUsers])
      );
    } catch {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    setSellerForm({
      id: sellerObject.id,
      name: sellerObject.name,
      address: sellerObject.address,
      mobile: sellerObject.mobile,
      ratePerQuintal: "",
      totalWeight: "",
      totalItems: "",
      totalPoldar: "",
      poldariRate: "",
      baadwjanPerQ: "",
      dharmakataOrShop: "",
    });

    setIsSellerModalOpen(false);
    setAddingSeller(true);
  };

  return (
    <Box>
      {/* Stock loading options radio */}
      <FormControl as="fieldset" mb={6}>
        <FormLabel as="legend" fontWeight="bold">
          Stock Loading Options
        </FormLabel>
        <RadioGroup onChange={setOption} value={option}>
          <Stack direction="column">
            <Radio value="warehouse">By Warehouse (Godam)</Radio>
            <Radio value="sellers">By Sellers (single or multiple)</Radio>
            <Radio value="both">By Warehouse & Sellers</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Warehouse details section */}
      {(option === "warehouse" || option === "both") && (
        <Box borderWidth="1px" borderRadius="md" p={4} mb={6}>
          <Text fontWeight="semibold" mb={3}>
            Warehouse Loading Details
          </Text>

          <FormControl mb={3}>
            <FormLabel>Select Warehouse</FormLabel>
            <Select
              placeholder="Select Warehouse"
              value={warehouseData.warehouse}
              onChange={(e) =>
                setWarehouseData({ ...warehouseData, warehouse: e.target.value })
              }
            >
              {warehouses.length > 0 ? (
                warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))
              ) : (
                <option disabled>No warehouses found</option>
              )}
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total Weight (kg)</FormLabel>
            <Input
              type="number"
              value={warehouseData.totalWeight}
              onChange={(e) =>
                setWarehouseData({ ...warehouseData, totalWeight: e.target.value })
              }
              min={0}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total Items</FormLabel>
            <Input
              type="number"
              value={warehouseData.totalItems}
              onChange={(e) =>
                setWarehouseData({ ...warehouseData, totalItems: e.target.value })
              }
              min={0}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total Poldar</FormLabel>
            <Input
              type="number"
              value={warehouseData.totalPoldar}
              onChange={(e) =>
                setWarehouseData({ ...warehouseData, totalPoldar: e.target.value })
              }
              min={0}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Poldari Rate</FormLabel>
            <Input
              type="number"
              value={warehouseData.poldariRate}
              onChange={(e) =>
                setWarehouseData({ ...warehouseData, poldariRate: e.target.value })
              }
              min={0}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Dharmakata</FormLabel>
            <Select
              placeholder="Select Dharmakata"
              value={warehouseData.dharmakata}
              onChange={(e) =>
                setWarehouseData({ ...warehouseData, dharmakata: e.target.value })
              }
            >
              {dharmakatas.length > 0 ? (
                dharmakatas.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))
              ) : (
                <option disabled>No dharmakatas found</option>
              )}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Sellers section */}
      {(option === "sellers" || option === "both") && (
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="semibold" mb={3}>
            Sellers Loading Details
          </Text>

          {/* Current sellers list */}
          {sellersData.length > 0 && (
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Current Sellers
              </Text>
              {sellersData.map((seller, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  mb={2}
                  fontSize="sm"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Text>
                      <strong>Name:</strong> {seller.name} | <strong>Mobile:</strong>{" "}
                      {seller.mobile || "N/A"}
                    </Text>
                    <Text>
                      Rate/Q: ₹{seller.ratePerQuintal} | Weight: {seller.totalWeight} kg | Items:{" "}
                      {seller.totalItems}
                    </Text>
                    <Text>
                      Poldar: {seller.totalPoldar} | Poldari Rate: ₹{seller.poldariRate} | Baadwjan/Q:{" "}
                      {seller.baadwjanPerQ} g
                    </Text>
                    <Text>
                      <strong>Dharmakata/Seller Shop:</strong> {seller.dharmakataOrShop}
                    </Text>
                  </Box>

                  <HStack spacing={2}>
                    <IconButton
                      icon={<FaEdit />}
                      size="sm"
                      aria-label="Edit seller"
                      onClick={() => onEditSeller(index)}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      aria-label="Delete seller"
                      onClick={() => onDeleteSeller(index)}
                    />
                  </HStack>
                </Box>
              ))}
            </Box>
          )}

          {/* Add/Edit seller form */}
          {addingSeller && (
            <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
              <FormControl mb={2} isRequired>
                <FormLabel>Select Seller</FormLabel>
                <Select
                  placeholder="Select or Add Seller"
                  value={sellerForm.name}
                  onChange={(e) => onSellerSelect(e.target.value)}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.mobile})
                    </option>
                  ))}
                  <option value="__addNew">+ Add New Seller</option>
                </Select>
              </FormControl>

              {/* Seller details card */}
              {sellerForm.name && (
                <Box borderWidth="1px" borderRadius="md" p={3} mb={4} bg="gray.50">
                  <Text fontWeight="bold" mb={1}>
                    Seller Details:
                  </Text>
                  <Text>
                    <strong>Name:</strong> {sellerForm.name}
                  </Text>
                  <Text>
                    <strong>Mobile:</strong> {sellerForm.mobile || "N/A"}
                  </Text>
                  <Text>
                    <strong>Address:</strong> {sellerForm.address || "N/A"}
                  </Text>
                </Box>
              )}

              <FormControl mb={2} isRequired>
                <FormLabel>Rate Per Quintal (₹)</FormLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="Rate per quintal"
                  value={sellerForm.ratePerQuintal}
                  onChange={(e) => handleSellerFormChange("ratePerQuintal", e.target.value)}
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Total Weight (kg)</FormLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="Total weight"
                  value={sellerForm.totalWeight}
                  onChange={(e) => handleSellerFormChange("totalWeight", e.target.value)}
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Total Items</FormLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="Total items"
                  value={sellerForm.totalItems}
                  onChange={(e) => handleSellerFormChange("totalItems", e.target.value)}
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Total Poldar</FormLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="Total poldar"
                  value={sellerForm.totalPoldar}
                  onChange={(e) => handleSellerFormChange("totalPoldar", e.target.value)}
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Poldari Rate (₹)</FormLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="Poldari rate"
                  value={sellerForm.poldariRate}
                  onChange={(e) => handleSellerFormChange("poldariRate", e.target.value)}
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Baadwjan per Quintal (g)</FormLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="Baadwjan per quintal"
                  value={sellerForm.baadwjanPerQ}
                  onChange={(e) => handleSellerFormChange("baadwjanPerQ", e.target.value)}
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Dharmakata or Seller Shop</FormLabel>
                {!addingNewDharmakata ? (
                  <>
                    <Select
                      placeholder="Select Dharmakata or Seller Shop"
                      value={sellerForm.dharmakataOrShop}
                      onChange={(e) => {
                        if (e.target.value === "__addNew") {
                          setAddingNewDharmakata(true);
                          setSellerForm((prev) => ({
                            ...prev,
                            dharmakataOrShop: "",
                          }));
                        } else {
                          handleSellerFormChange("dharmakataOrShop", e.target.value);
                        }
                      }}
                    >
                      {dharmakatas.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                      <option value="__addNew">+ Add New...</option>
                    </Select>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Enter new Dharmakata or Seller Shop"
                      value={newDharmakataName}
                      onChange={(e) => setNewDharmakataName(e.target.value)}
                    />
                    <Button
                      mt={2}
                      size="sm"
                      colorScheme="green"
                      onClick={() => {
                        if (!newDharmakataName.trim()) return alert("Enter a name");
                        saveNewDharmakata();
                      }}
                    >
                      Save New
                    </Button>
                    <Button
                      mt={2}
                      ml={2}
                      size="sm"
                      onClick={() => {
                        setAddingNewDharmakata(false);
                        setNewDharmakataName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </FormControl>

              <HStack spacing={4} mt={2}>
                {editingIndex !== null ? (
                  <Button size="sm" colorScheme="green" onClick={updateSeller}>
                    Update Seller
                  </Button>
                ) : (
                  <Button size="sm" colorScheme="green" onClick={addSeller}>
                    Add Seller
                  </Button>
                )}
                <Button size="sm" onClick={() => { resetForm(); setAddingSeller(false); }}>
                  Cancel
                </Button>
              </HStack>
            </Box>
          )}

          {!addingSeller && (
            <Button
              leftIcon={<FaPlus />}
              size="sm"
              mb={4}
              onClick={() => setAddingSeller(true)}
            >
              Add Seller
            </Button>
          )}
        </Box>
      )}

      {/* Navigation buttons */}
      <HStack spacing={4} mt={6}>
        <Button onClick={onPrev}>Back</Button>
        <Button colorScheme="green" onClick={onNext} disabled={!option}>
          Next
        </Button>
      </HStack>

      {/* Seller Add/Edit Modal */}
      <SellerAddEditModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onSave={handleModalSave}
        initialData={modalInitialData}
      />
    </Box>
  );
}