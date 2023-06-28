import React from "react";

import { Box } from "@mui/material";

// 프레임(바탕) 뷰
export const Frame = (props: any) => {
  return (
    <Box
      {...props}
      sx={{
        ...props.sx,

        bgcolor: props.dark ? "#242424" : "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // padding: "10px 0px",

        // width: "100vw",
        minHeight: "100vh",
      }}
    >
      {props.children}
    </Box>
  );
};
