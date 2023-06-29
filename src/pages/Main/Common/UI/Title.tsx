import React from 'react';

import { Box } from '@mui/material';

// 페이지 타이틀 뷰 (수집상품목록, 등록상품목록 등)
export const Title = (props: any) => {
  return (
    <Box
      {...props}
      sx={{
        ...props.sx,

        bgcolor: props.error ? 'error.light' : props.dark ? '#303030' : '#ebebeb',
        color: props.error ? 'white' : props.dark ? 'white' : 'black',
        alignItems: 'center',
        display: 'flex',
        fontSize: props.subTitle ? 13 : 16,
        justifyContent: 'space-between',
        px: 1,
        height: props.subTitle ? 34 : 40,
      }}
    >
      {props.children}
    </Box>
  );
};
