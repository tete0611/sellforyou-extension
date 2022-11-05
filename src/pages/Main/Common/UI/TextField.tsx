import React from 'react';

import { TextField } from '@mui/material';

const inputStyles = (props: any) => {
    return {
        width: props.width ?? "100%",

        input: {
            ...props.options,

            background: "white",
            fontSize: 13,
            p: "6px",
        },

        textarea: {
            ...props.options,

            background: "white",
            fontSize: 13,
            p: "0.5px",
        }
    }
};

export const Input = (props: any) => {
    return <TextField
        size="small"
        variant='outlined'
        sx={inputStyles(props)}
        InputProps={{
            readOnly: props.readOnly
        }}

        {...props}
    />
};