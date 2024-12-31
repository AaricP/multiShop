import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import { useState } from "react";
import useApi from "../hooks/useApi";

const drawerWidth = 240;

export default function Cart({ cartItems, setCartItems }) {
  const { fetchAdmin, handleCheckout, loading, error } = useApi(
    "http://localhost:3000"
  );
  const [threshold, setThreshold] = useState("");
  const [rate, setRate] = useState("");
  const handleQuantityChange = (id, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity));
    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
  };

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const { discountThreshold, discountRate } = await fetchAdmin();
        setThreshold(discountThreshold);
        setRate(discountRate);
      } catch (err) {
        console.error(err);
      }
    };

    getAdminData();
  }, []);

  const totalCost = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleDelete = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
  };

  const discountedCost =
    totalCost > threshold ? totalCost * (1 - rate) : totalCost;

  const finalCost = discountedCost.toFixed(2);

  const handleCheckoutClick = async () => {
    await handleCheckout(cartItems, setCartItems);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Typography
          textAlign="center"
          marginTop="10px"
          gutterBottom
          variant="h6"
          component="div"
        >
          Shopping Cart
        </Typography>
        <Divider />
        <List>
          {cartItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "30px", height: "30px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div>
                        <p>{item.title}</p>{" "}
                        <div>
                          {" "}
                          <p style={{ color: "red" }}>
                            ${item.price.toFixed(2)}
                          </p>
                          Quantity:{" "}
                          <input
                            type="number"
                            style={{ width: "40px" }}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            max={item.inventory}
                          />
                        </div>
                        <DeleteIcon
                          sx={{
                            cursor: "pointer",
                            transition: "color 0.2s",
                            "&:hover": { color: "red" },
                          }}
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < cartItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {totalCost > threshold ? (
            <div>
              <Typography
                textAlign="left"
                marginY="10px"
                marginLeft="5px"
                gutterBottom
                fontWeight="bold"
              >
                Before Discount:{" "}
                <span style={{ color: "red", textDecoration: "line-through" }}>
                  ${totalCost.toFixed(2)}
                </span>
              </Typography>
              <Typography
                textAlign="left"
                marginLeft="20px"
                gutterBottom
                fontWeight="bold"
                color="blue"
              >
                {rate * 100}% Discount Applied!
              </Typography>
            </div>
          ) : null}
          <Typography
            textAlign="left"
            marginY="10px"
            marginLeft="5px"
            gutterBottom
            fontWeight="bold"
          >
            Total Cost: <span style={{ fontSize: "20px" }}>${finalCost}</span>
          </Typography>
          <div></div>
          <Button variant="contained" onClick={handleCheckoutClick}>
            Checkout
          </Button>
        </div>
      </Drawer>
    </Box>
  );
}
