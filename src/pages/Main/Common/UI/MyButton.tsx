import React from "react";

import { Button } from "@mui/material";

// 버튼 뷰
export const MyButton = (props: any) => {
  return (
    <Button
      disableElevation
      variant="contained"
      {...props}
      sx={{
        ...props.sx,

        fontSize: 13,
        height: 30,
        px: 0.5,
        py: 0,
      }}
    >
      {props.children}
    </Button>
  );
};
