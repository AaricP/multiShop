import axios from "axios";
import { useState } from "react";

const useApi = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const api = axios.create({
    baseURL: baseURL,
  });

  const apiRequest = async (method, url, data = null, params = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({
        method,
        url,
        data,
        params,
      });
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const fetchAdmin = async () => {
    try {
      const response = await apiRequest("get", "/admin");
      const discountThreshold = parseInt(response.admin.discount_threshold);
      const discountRate = parseFloat(response.admin.discount_rate);
      return { discountThreshold, discountRate };
    } catch (err) {
      console.error("Error fetching products:", err);
      throw err;
    }
  };

  const updateAdmin = async (setAdminData) => {
    try {
       const response = await apiRequest("get", "/admin" );

      setAdminData(response.admin)
    } catch (error) {
      console.error("Error updating admin data:", error);
      throw error;
    }
  };

  const handleCheckout = async (cartItems, setCartItems) => {
    try {
      for (const item of cartItems) {
        const updatedInventory = item.inventory - item.quantity;
        if (updatedInventory < 0) {
          alert(`Not enough stock for ${item.title}!`);
          return;
        }
        await apiRequest("put", `/products/${item.id}`, {
          product: {
            id: item.id,
            title: item.title,
            description: item.description,
            inventory: updatedInventory,
          },
        });
      }
      setCartItems([]);
      alert("Purchase was successful!");
    } catch (err) {
      console.error("Error during checkout:", err);
      alert(
        "An error occurred while processing your purchase. Please try again."
      );
    }
  };

  const fetchProducts = async (setProducts) => {
    try {
      const response = await apiRequest(
        "get",
        "/products/all?groupBy=product_type"
      );

      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };


  return {
    loading,
    error,
    data,
    apiRequest,
    fetchAdmin,
    handleCheckout,
    fetchProducts,
    updateAdmin
  };
};

export default useApi;
