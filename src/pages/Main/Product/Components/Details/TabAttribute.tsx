import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../../../containers/AppContext";
import { Box, Grid, List, ListItem, ListItemText, MenuItem, Paper, Select, Typography } from "@mui/material";
import { Input } from "../../../Common/UI";

export const TabAttribute = observer((props: any) => {
    const { product } = React.useContext(AppContext);

    return <>
        <Box sx={{
            mb: "6px"
        }}>
            <Paper variant="outlined" sx={{
                border: "1px solid #d1e8ff",
                height: "100%",
            }}>
                <Box sx={{
                    background: "#d1e8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 13,
                    height: 34,
                    px: 1
                }}>
                    상품속성정보
                </Box>

                <Grid container spacing={0.5} sx={{
                    p: 0.5
                }}>
                    <Grid item xs={6} md={9}>
                        <Grid container spacing={0.5}>
                            <Grid item xs={6} md={4}>
                                <Paper variant="outlined">
                                    <Box sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 13,
                                        p: 0.5,
                                    }}>
                                        제조사
                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        p: 0.5,
                                    }}>
                                        <Input
                                            id={`product_row_manufacturer_${props.index}`}
                                            defaultValue={props.item.manuFacturer}
                                            onBlur={(e: any) => {
                                                product.updateProductAttribute(props.index, {
                                                    productId: props.item.id,
                                                    manufacturer: e.target.value
                                                })
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={6} md={4}>
                                <Paper variant="outlined">
                                    <Box sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 13,
                                        p: 0.5,
                                    }}>
                                        브랜드
                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        p: 0.5,
                                    }}>
                                        <Input
                                            id={`product_row_brand_name_${props.index}`}
                                            defaultValue={props.item.brandName}
                                            onBlur={(e: any) => {
                                                product.updateProductAttribute(props.index, {
                                                    productId: props.item.id,
                                                    brandName: e.target.value
                                                })
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={6} md={4}>
                                <Paper variant="outlined">
                                    <Box sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 13,
                                        p: 0.5,
                                    }}>
                                        모델명
                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        p: 0.5,
                                    }}>
                                        <Input
                                            id={`product_row_model_name_${props.index}`}
                                            defaultValue={props.item.modelName}
                                            onBlur={(e: any) => {
                                                product.updateProductAttribute(props.index, {
                                                    productId: props.item.id,
                                                    modelName: e.target.value
                                                })
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={6} md={12}>
                                <Paper variant="outlined">
                                    <Box sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 13,
                                        p: 0.5,
                                    }}>
                                        상품정보제공고시(준비중)
                                    </Box>

                                    <Box sx={{
                                        fontSize: 13,
                                        p: 0.5,
                                        height: 273
                                    }}>
                                        <Paper variant="outlined" sx={{
                                            p: 0.5
                                        }}>
                                            <Grid container spacing={0.5}>
                                                <Grid item xs={6} sx={{
                                                    textAlign: "left",
                                                    margin: "auto"
                                                }}>
                                                    상품군
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <Select disabled
                                                        sx={{
                                                            background: "white",
                                                            fontSize: 13,
                                                            height: 30,
                                                            width: "100%",
                                                        }}
                                                        value="기타재화"
                                                    >
                                                        <MenuItem value="기타재화">
                                                            기타재화
                                                        </MenuItem>
                                                    </Select>
                                                </Grid>

                                                <Grid item xs={3}>
                                                </Grid>

                                                <Grid item xs={6} sx={{
                                                    textAlign: "left",
                                                    margin: "auto"
                                                }}>
                                                    품명
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Input disabled value="상품상세참고" />
                                                </Grid>

                                                <Grid item xs={6} sx={{
                                                    textAlign: "left",
                                                    margin: "auto"
                                                }}>
                                                    모델명
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Input disabled value="상품상세참고" />
                                                </Grid>

                                                <Grid item xs={6} sx={{
                                                    textAlign: "left",
                                                    margin: "auto"
                                                }}>
                                                    법에 의한 인증, 허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항.
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Input disabled value="상품상세참고" />
                                                </Grid>

                                                <Grid item xs={6} sx={{
                                                    textAlign: "left",
                                                    margin: "auto"
                                                }}>
                                                    제조자(사)
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Input disabled value="상품상세참고" />
                                                </Grid>

                                                <Grid item xs={6} sx={{
                                                    textAlign: "left",
                                                    margin: "auto"
                                                }}>
                                                    A/S 책임자 또는 소비자상담 관련 전화번호
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Input disabled value="상품상세참고" />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Paper variant="outlined">
                            <Box sx={{
                                background: "whitesmoke",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: 13,
                                p: 0.5,
                            }}>
                                추가정보
                            </Box>

                            <Box sx={{
                                fontSize: 13,
                                p: 0.5,
                                height: 344,
                                overflowY: "scroll"
                            }}>
                                <List disablePadding sx={{
                                    width: 300
                                }}>
                                    {props.item.attribute.map((v: any) => {
                                        return <ListItem disablePadding>
                                            <ListItemText sx={{
                                                pt: 0.5,
                                                pb: 0.5
                                            }}
                                                primary={
                                                    <Typography fontSize={13}>
                                                        {v}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    })}
                                </List>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    </>
})