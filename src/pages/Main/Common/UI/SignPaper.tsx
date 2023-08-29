import React from 'react';

import { Paper } from '@mui/material';

// 로그인, 회원가입, 아이디찾기 공통 폼
export const SignPaper = (props: any) => {
	return (
		<Paper
			variant='outlined'
			{...props}
			sx={{
				...props.sx,

				border: '1px solid info.main',
				p: 4,
				textAlign: 'center',
			}}
		>
			{props.children}
		</Paper>
	);
};
