import React from 'react';

import { Select } from '@mui/material';

// 드롭다운 뷰 설정
export const ComboBox = (props: any) => {
	return (
		<Select
			{...props}
			sx={{
				...props.sx,

				bgcolor: 'background.default',
				fontSize: 13,
				height: 30,
			}}
		>
			{props.children}
		</Select>
	);
};
