import React from 'react';

import { TextField, TextFieldProps } from '@mui/material';

// 입력창 스타일
const inputStyles = (props: any) => {
	return {
		width: props.width ?? '100%',

		input: {
			...props.options,

			bgcolor: 'background.default',
			fontSize: 13,
			p: '6px',
		},

		textarea: {
			...props.options,

			bgcolor: 'background.default',
			fontSize: 13,
			p: '0.5px',
		},
	};
};

// 입력창 뷰
export const Input = (props: Partial<TextFieldProps> & { options?: any; readOnly?: any; width?: number }) => {
	return (
		<TextField
			size='small'
			variant='outlined'
			sx={inputStyles(props)}
			InputProps={{
				readOnly: props.readOnly,
			}}
			{...props}
		/>
	);
};
