import axios from "axios";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import AdminImageCard from "../components/AdminImageCard";
import ScrollTabs from "../components/ScrollTabs";
import Cart from "../components/Cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import useApi from "../hooks/useApi";

export default function AdminPage() {
  const [products, setProducts] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productSearched, setProductSearched] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inCart, setInCart] = useState([]);
  const [adminData, setAdminData] = useState({});
  const { fetchProducts, updateAdmin } = useApi("http://localhost:3000");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(setProducts);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    updateAdmin(setAdminData);
  }, []);

  const { logout } = useAuth();

  const handleFilter = (category) => {
    setCategoryFilter(category);
    setIsSearching(false);
    setProductSearched([]);
  };

  const handleSearch = async (searchedProduct) => {
    setIsSearching(searchedProduct !== "");
    setCategoryFilter("all");
    if (!searchedProduct) {
      setProductSearched([]);
      return;
    }

    try {
      const searchResponse = await axios.get(
        `http://localhost:3000/products/all?search=${searchedProduct}`
      );

      setProductSearched(searchResponse.data.products);
    } catch (error) {
      console.error("Error searching product:", error);
    }
  };

  const handleEditProduct = (productID) => {
    navigate(`/admin/${productID}`);
  };

  const handleUpdateAdmin = async (field, value) => {
    const updatedAdminData = { ...adminData, [field]: value };

    const updatedAdmin = {
      username: adminData.username,
      password: adminData.password,
      discount_threshold: parseInt(updatedAdminData.discount_threshold),
      discount_rate: parseFloat(updatedAdminData.discount_rate),
    };

    setAdminData(updatedAdminData);
    try {
      await axios.put("http://localhost:3000/admin", {
        admin: updatedAdmin,
      });
    } catch (error) {
      console.error("Error updating admin data:", error);
    }
  };

  return (
    <>
      {inCart.length > 0 ? (
        <Cart cartItems={inCart} setCartItems={setInCart} />
      ) : null}
      <Button
        variant="contained"
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 10 }}
        onClick={() => logout()}
      >
        LOGOUT
      </Button>

      <div style={{ marginLeft: "90px" }}>
        <ScrollTabs onClick={handleFilter} />
      </div>
      {categoryFilter === "all" && (
        <div>
          <TextField
            style={{ marginTop: "10px" }}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search all products"
          />
          {productSearched.length > 0 && (
            <div>
              {productSearched.map((product) => (
                <AdminImageCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  inventory={product.inventory}
                  product_type={product.product_type}
                  published={product.published}
                  onClick={() => {
                    handleEditProduct(product.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ margin: "5px" }}>
        Discount Threshold:{" "}
        <input
          type="number"
          style={{ width: "50px" }}
          value={adminData.discount_threshold || ""}
          min="0"
          onChange={(e) =>
            handleUpdateAdmin("discount_threshold", e.target.value)
          }
        />
      </div>
      <div style={{ margin: "5px" }}>
        Discount Rate:{" "}
        <input
          type="number"
          style={{ width: "40px" }}
          value={adminData.discount_rate || ""}
          min="0"
          max="1"
          step=".1"
          onChange={(e) => handleUpdateAdmin("discount_rate", e.target.value)}
        />
      </div>
      <div>
        {Object.keys(products).map((category) =>
          (!isSearching && categoryFilter === "all") ||
          category === categoryFilter ? (
            <div key={category}>
              {products[category]?.map((product) => (
                <AdminImageCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  inventory={product.inventory}
                  product_type={product.product_type}
                  published={product.published}
                  onClick={() => {
                    handleEditProduct(product.id);
                  }}
                />
              ))}
            </div>
          ) : null
        )}
      </div>
    </>
  );
}
