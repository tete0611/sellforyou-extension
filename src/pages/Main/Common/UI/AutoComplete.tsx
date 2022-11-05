import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { Autocomplete, TextField, Paper, Popper } from '@mui/material';

const searchStyles = {
    width: "100%",
};

const inputStyles = {
    background: "white",
    fontSize: 13,
    width: "100%",

    input: {
        padding: "0px !important",
        fontSize: 13,
    }
};

function setHighlight(props: any, option: any, value: any) {
    const matches = match(option.name, value.inputValue);
    const parts = parse(option.name, matches);

    return (
        <li {...props}>
            <div>
                {parts.map((part, index) => (
                    <span
                        key={index}
                        style={{
                            fontWeight: part.highlight ? 700 : 400,
                        }}
                    >
                        {part.text}
                    </span>
                ))}
            </div>
        </li>
    );
}

const Input = (props: any) => {
    return <TextField
        {...props.params}

        variant='outlined'
        sx={inputStyles}
        InputProps={{
            ...props.params.InputProps,

            endAdornment: null,

            readOnly: props.readOnly
        }}
        label={props.label}
    />
};

export const Search = (props: any, isEqual) => {
    return <Autocomplete
        size="small"
        sx={searchStyles}
        disableClearable
        variant='outlined'
        renderOption={setHighlight}
        renderInput={(params) =>
            <Input
                readOnly={props.readOnly}
                label={props.label}
                params={params}
            />
        }

        PaperComponent={({ children }) => (
            <Paper sx={{
                fontSize: 14
            }}>
                {children}
            </Paper>
        )}

        PopperComponent={(props) => (
            <Popper {...props} style={{
                width: 750,
            }} placement="bottom-start" />
        )}

        {...props}
    />
};