import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Popover, Paper } from '@mui/material';

export const ImagePopOver = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Popover
        open={product.popOverInfo.image.open}
        anchorEl={product.popOverInfo.image.element}
        onClose={() => {
            product.setImagePopOver({
                ...product.popOverInfo.image,

                element: null,
                open: false
            });
        }}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
    >
        <Paper>
            <Box sx={{
                p: 1,
            }}>
                <img src={product.popOverInfo.image.data.src} width={600} height={600} style={{
                    objectFit: "contain"
                }} />
            </Box>
        </Paper>
    </Popover>
});