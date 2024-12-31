import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

export default function ImageCard({
  imageURL,
  title,
  description,
  price,
  inventory,
  onClick,
}) {
  return (
    <Card sx={{ maxWidth: 345, marginTop: 2 }}>
      <CardMedia component="img" height="140" image={imageURL} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
          <div style={{ color: "red" }}>${price}</div>
          <p style={{margin: "0px", marginLeft: "200px", fontSize: "15px"}}>In Stock: <span style={{fontWeight: "bold"}}>{inventory}</span></p>
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
        <Button sx={{marginTop: "5px"}} onClick={onClick} variant="outlined">
          ADD TO CART
        </Button>
      </CardContent>
    </Card>
  );
}
