import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function ScrollTabs({ onClick }) {
  const [value, setValue] = React.useState("all");

  const handleChange = ( event, newValue ) => {
    setValue(newValue);
    onClick(newValue)
  };

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      > 
        <Tab value="all" label="All Products" />
        <Tab value="men's clothing" label="Men's Clothing" />
        <Tab value="jewelery" label="Jewelery" />
        <Tab value="electronics" label="Electronics" />
        <Tab value="women's clothing" label="Women's Clothing" />
      </Tabs>
    </Box>
  );
}
