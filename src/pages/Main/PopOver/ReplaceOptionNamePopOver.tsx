import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, Grid, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';

export const ReplaceOptionNamePopOver = observer(() => {
    const { common, product } = React.useContext(AppContext);

    const onClose = () => {
        product.setReplaceOptionNamePopOver({
            ...product.popOverInfo.replaceOptionName,

            index: -1,
            element: null,
            open: false,

            data: {
                index: -1,
                find: "",
                replace: ""
            }
        });
    }

    return <Popover
        open={product.popOverInfo.replaceOptionName.open}
        anchorEl={product.popOverInfo.replaceOptionName.element}
        onClose={onClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
    >
        <Box sx={{
            p: 3,
            width: 300
        }}>
            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={6} md={6} sx={{
                        m: "auto"
                    }}>
                        <Typography fontSize={14}>
                            적용할 옵션명
                        </Typography>
                    </Grid>

                    <Grid item xs={6} md={6} sx={{
                        m: "auto",
                    }}>
                        <Select sx={{
                            background: "white",
                            fontSize: 13,
                            height: 30,
                            width: "100%",
                        }}
                            variant='outlined'
                            size='small'
                            value={product.popOverInfo.replaceOptionName.data.index}
                            onChange={(e) => {
                                product.setReplaceOptionNamePopOver({
                                    ...product.popOverInfo.replaceOptionName,

                                    data: {
                                        ...product.popOverInfo.replaceOptionName.data,

                                        index: e.target.value
                                    }
                                });
                            }}
                        >
                            <MenuItem value={-1}>
                                {"<모든 옵션명>"}
                            </MenuItem>

                            {product.popOverInfo.replaceOptionName.index > -1 ? product.itemInfo.items[product.popOverInfo.replaceOptionName.index].productOptionName.map((v: any, i: number) => (
                                <MenuItem value={i}>
                                    {v.name}
                                </MenuItem>
                            )) : null}
                        </Select>
                    </Grid>

                    <Grid item xs={6} md={6} sx={{
                        m: "auto"
                    }}>
                        <Typography fontSize={14}>
                            검색할 키워드
                        </Typography>
                    </Grid>

                    <Grid item xs={6} md={6} sx={{
                        m: "auto",
                    }}>
                        <TextField
                            id={"replace_option_name_find"}
                            variant='outlined'
                            sx={{
                                width: "100%",
                            }}
                            inputProps={{
                                style: {
                                    fontSize: 14,
                                    padding: 5,
                                }
                            }}
                            defaultValue={product.manyPriceInfo.cnyRate}
                            onBlur={(e) => {
                                product.setReplaceOptionNamePopOver({
                                    ...product.popOverInfo.replaceOptionName,

                                    data: {
                                        ...product.popOverInfo.replaceOptionName.data,

                                        find: e.target.value
                                    }
                                });
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} md={6} sx={{
                        m: "auto"
                    }}>
                        <Typography fontSize={14}>
                            변경할 키워드
                        </Typography>
                    </Grid>

                    <Grid item xs={6} md={6} sx={{
                        m: "auto",
                    }}>
                        <TextField
                            id={"replace_option_name_replace"}
                            variant='outlined'
                            sx={{
                                width: "100%",
                            }}
                            inputProps={{
                                style: {
                                    fontSize: 14,
                                    padding: 5,
                                }
                            }}
                            defaultValue={product.manyPriceInfo.cnyRate}
                            onBlur={(e) => {
                                product.setReplaceOptionNamePopOver({
                                    ...product.popOverInfo.replaceOptionName,

                                    data: {
                                        ...product.popOverInfo.replaceOptionName.data,

                                        replace: e.target.value
                                    }
                                });
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3
            }}>
                <Button disableElevation size="small" variant="contained" color="info" sx={{
                    width: 100,
                    height: 30,
                    mx: 0.5
                }} onClick={async () => {
                    const index = product.popOverInfo.replaceOptionName.index;
                    const find = product.popOverInfo.replaceOptionName.data.find;
                    const replace = product.popOverInfo.replaceOptionName.data.replace ? product.popOverInfo.replaceOptionName.data.replace : '';

                    if (!find) {
                        alert("검색할 키워드를 입력해주세요.");

                        return;
                    }

                    const productOptionName = product.itemInfo.items[index].productOptionName;

                    for (let i = 0; i < productOptionName.length; i++) {
                        if (product.popOverInfo.replaceOptionName.data.index !== -1 && product.popOverInfo.replaceOptionName.data.index !== i) {
                            continue;
                        }

                        await product.setProductOptionValue(productOptionName[i].productOptionValue.map((v: any) => {
                            return {
                                ...v,
                                name: v.name.replaceAll(find, replace)
                            }
                        }), index, i, null);

                        await product.updateProductOptionValue(common, index, i, productOptionName[i].productOptionValue.map((v: any) => v.id));
                    }

                    onClose();
                }}>
                    적용
                </Button>

                <Button disableElevation size="small" variant="contained" color="inherit" sx={{
                    width: 100,
                    height: 30,
                    mx: 0.5
                }} onClick={onClose}>
                    취소
                </Button>
            </Box>
        </Box>
    </Popover >
});