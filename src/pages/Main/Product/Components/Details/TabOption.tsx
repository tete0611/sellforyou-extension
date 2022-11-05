import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

import { observer } from "mobx-react";
import { AppContext } from "../../../../../containers/AppContext";
import { Box, IconButton, Switch, Table, TableHead, TableBody, TableCell, TableRow, Typography, Button, Checkbox, Paper } from "@mui/material";
import { Image, Input } from "../../../Common/UI";

export const TabOption = observer((props: any) => {
    const { common, product } = React.useContext(AppContext);

    return <>
        <Paper variant="outlined" sx={{
            border: "1px solid #d1e8ff",
        }}>
            <Box sx={{
                background: "#d1e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
                px: 1,
                py: 0.5
            }}>
                옵션목록

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Button disableElevation variant="contained" color="info" sx={{
                        fontSize: 13,
                        height: 26
                    }} onClick={(e) => {
                        product.setAddOptionNamePopOver({
                            ...product.popOverInfo.addOptionName,

                            index: props.index,
                            element: e.target,
                            open: true
                        });
                    }}>
                        옵션명 키워드추가
                    </Button>

                    <Button disableElevation variant="contained" color="info" sx={{
                        ml: 0.5,
                        fontSize: 13,
                        height: 26
                    }} onClick={(e) => {
                        product.setReplaceOptionNamePopOver({
                            ...product.popOverInfo.replaceOptionName,

                            index: props.index,
                            element: e.target,
                            open: true
                        });
                    }}>
                        옵션명 키워드변경
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                width: 1205,
                height: 381,
                alignItems: "center",
                display: "flex",
                overflowX: "auto",
                p: 0.5,
                fontSize: 13,
            }}>
                {props.item.productOptionName.map((v: any, nameIndex: number) => <Paper variant="outlined" sx={{
                    width: 391,
                    height: 362,
                    flex: "0 0 auto",
                    overflowY: "auto",
                    mr: 0.5
                }}>
                    <Table stickyHeader>
                        <TableHead >
                            <TableRow>
                                <TableCell width={50} style={{
                                    background: "whitesmoke",
                                    fontSize: 13,
                                    padding: 0,
                                    textAlign: "center"
                                }}>
                                    <Checkbox
                                        size="small"
                                        color="info"
                                        disabled={!v.isActive}
                                        onChange={(e) => {
                                            product.updateProductOptionValueAll(common, {
                                                id: v.id,
                                                isActive: e.target.checked,
                                                // name: "test"
                                            }, props.index, nameIndex);
                                        }}
                                    />
                                </TableCell>

                                <TableCell style={{
                                    background: "whitesmoke",
                                    fontSize: 13,
                                    padding: 0,
                                }}>
                                    <Box sx={{
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                        <Box sx={{
                                            alignItems: "center",
                                            display: "flex",
                                        }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    let name = prompt("변경할 옵션유형이름을 입력해주세요.", v.name);

                                                    if (!name) {
                                                        return;
                                                    }

                                                    product.updateProductOptionName(common, { ...v, name }, props.index, nameIndex);
                                                }}
                                            >
                                                <EditIcon sx={{
                                                    width: 18,
                                                    height: 18
                                                }} />
                                            </IconButton>

                                            <Typography noWrap fontSize={13} sx={{
                                                width: 75
                                            }}>
                                                {v.name}
                                            </Typography>

                                            <Typography fontSize={13} sx={{
                                                width: 25,
                                                textAlign: "right"
                                            }}>
                                                ({v.productOptionValue.filter((v: any) => v.isActive).length})
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            alignItems: "center",
                                            display: "flex",
                                        }}>
                                            <Button disableElevation size="small" color="info" variant="contained" sx={{
                                                minWidth: 40,
                                                height: 26,
                                                p: 0
                                            }} onClick={() => {
                                                product.setProductOptionValue(v.productOptionValue.map((v: any, index: number) => { return { ...v, name: (index + 10).toString(36).toUpperCase() } }), props.index, nameIndex, null);
                                                product.updateProductOptionValue(common, props.index, nameIndex, v.productOptionValue.map((v: any) => v.id));
                                            }}>
                                                A-Z
                                            </Button>

                                            <Button disableElevation size="small" color="info" variant="contained" sx={{
                                                ml: 0.5,
                                                minWidth: 40,
                                                height: 26,
                                                p: 0
                                            }} onClick={() => {
                                                product.setProductOptionValue(v.productOptionValue.map((v: any, index: number) => { return { ...v, name: `${index + 1}` } }), props.index, nameIndex, null);
                                                product.updateProductOptionValue(common, props.index, nameIndex, v.productOptionValue.map((v: any) => v.id));
                                            }}>
                                                0-9
                                            </Button>

                                            <Button disableElevation size="small" color="error" variant="contained" sx={{
                                                ml: 0.5,
                                                minWidth: 40,
                                                height: 26,
                                                p: 0
                                            }} onClick={() => {
                                                product.setProductOptionValue(v.productOptionValue.map((v: any) => { return { ...v, name: v.originalName } }), props.index, nameIndex, null);
                                                product.updateProductOptionValue(common, props.index, nameIndex, v.productOptionValue.map((v: any) => v.id));
                                            }}>
                                                원본
                                            </Button>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell width={60} style={{
                                    background: "whitesmoke",
                                    fontSize: 13,
                                    padding: 0,
                                    textAlign: "center"
                                }}>
                                    <Switch size="small" checked={v.isActive} onChange={(e) => {
                                        product.updateProductOptionName(common, {
                                            ...v,

                                            isActive: e.target.checked
                                        }, props.index, nameIndex);
                                    }} />
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {v.productOptionValue.map((w: any, valueIndex: number) => <TableRow>
                                <TableCell style={{
                                    fontSize: 13,
                                    padding: 0,
                                    textAlign: "center"
                                }}>
                                    <Checkbox
                                        size="small"
                                        color="info"
                                        checked={w.isActive}
                                        disabled={!v.isActive}
                                        onChange={(e) => {
                                            product.setProductOptionValue({
                                                ...w,

                                                isActive: e.target.checked
                                            }, props.index, nameIndex, valueIndex);

                                            product.updateProductOptionValue(common, props.index, nameIndex, [w.id]);
                                        }}
                                    />
                                </TableCell>

                                <TableCell style={{
                                    fontSize: 13,
                                    padding: 0,
                                    textAlign: "center"
                                }}>
                                    <Input
                                        id={`product_row_optionType_${props.index}_${nameIndex}_${valueIndex}`}
                                        value={w.name}
                                        onChange={(e: any) => {
                                            product.setProductOptionValue({
                                                ...w,

                                                name: e.target.value
                                            }, props.index, nameIndex, valueIndex);
                                        }}
                                        onBlur={(e: any) => {
                                            product.updateProductOptionValue(common, props.index, nameIndex, [w.id]);
                                        }}
                                    />
                                </TableCell>

                                <TableCell style={{
                                    fontSize: 13,
                                    padding: 0,
                                    textAlign: "center"
                                }}>
                                    {w.image ? <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Button sx={{
                                            p: 0
                                        }}
                                            onClick={(e) => {
                                                product.setImagePopOver({
                                                    element: e.target,
                                                    data: { src: w.image },
                                                    open: true
                                                });
                                            }}
                                        >
                                            <Image src={w.image} alt={w.name} width={30} height={30} style={{
                                                objectFit: "contain"
                                            }} />
                                        </Button>
                                    </Box>
                                        :
                                        null}
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </Paper>
                )}
            </Box>

        </Paper>
    </>
})