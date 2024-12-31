import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products/all");
        const foundProduct = response.data.products.find(
          (p) => p.id === parseInt(id)
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error("Product not found");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/products/${id}`, {
        product: {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price),
          inventory: parseInt(product.inventory),
          product_type: product.product_type,
          published: product.published,
        },
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={product.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          value={product.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          step="0.01"
        />
        <TextField
          label="Inventory"
          name="inventory"
          value={product.inventory}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Product Type</InputLabel>
          <Select
            label="Product Type"
            name="product_type"
            value={product.product_type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="men's clothing">Men's Clothing</MenuItem>
            <MenuItem value="jewelery">Jewelery</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="women's clothing">Women's Clothing</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Published</InputLabel>
          <Select
            label="Published"
            name="published"
            value={product.published}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value={true}>True</MenuItem>
            <MenuItem value={false}>False</MenuItem>
          </Select>
        </FormControl>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
