import axios from "axios";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import ImageCard from "../components/ImageCard";
import ScrollTabs from "../components/ScrollTabs";
import Cart from "../components/Cart";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [products, setProducts] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productSearched, setProductSearched] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inCart, setInCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/products/published?groupBy=product_type"
        );

        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    setIsSearching(false);
  }, []);

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
        `http://localhost:3000/products/published?search=${searchedProduct}`
      );

      setProductSearched(searchResponse.data.products);
    } catch (error) {
      console.error("Error searching product:", error);
    }
  };

  const handleAddToCart = (item) => {
    setInCart((prevCart) => {
      const duplicateItem = prevCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (duplicateItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {inCart.length > 0 ? (
        <Cart cartItems={inCart} setCartItems={setInCart} />
      ) : null}

      <Button
        variant="contained"
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 10 }}
        onClick={handleLogin}
      >
        LOGIN AS ADMIN
      </Button>

      <div style={{ marginLeft: "150px" }}>
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
                <ImageCard
                  key={product.id}
                  imageURL={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  inventory={product.inventory}
                  onClick={() => {
                    handleAddToCart(product);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        {Object.keys(products).map((category) =>
          (!isSearching && categoryFilter === "all") ||
          category === categoryFilter ? (
            <div key={category}>
              {products[category]?.map((product) => (
                <ImageCard
                  key={product.id}
                  imageURL={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  inventory={product.inventory}
                  onClick={() => {
                    handleAddToCart(product);
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
