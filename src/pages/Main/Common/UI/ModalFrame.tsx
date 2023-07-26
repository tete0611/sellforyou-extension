import React from 'react';

import { Paper } from '@mui/material';

// 모달 뷰
export const ModalFrame = (props: any) => {
	return (
		<Paper
			{...props}
			sx={{
				...props.sx,

				left: '50%',
				maxHeight: '90vh',
				overflowY: 'auto',
				position: 'absolute',
				top: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		>
			{props.children}
		</Paper>
	);
};
