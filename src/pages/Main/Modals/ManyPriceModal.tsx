import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, Grid, MenuItem, Modal, Paper, Select, TextField, Typography } from '@mui/material';

export const ManyPriceModal = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Modal open={product.modalInfo.price} onClose={() => product.toggleManyPriceModal(false)}>
        <Paper className='uploadModal' sx={{
            width: 350
        }}>
            <Typography fontSize={16} sx={{
                mb: 3
            }}>
                판매가격 일괄설정
            </Typography>

            <Paper variant="outlined">
                <Box sx={{
                    p: 1,
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <Typography fontSize={14}>
                                환율
                            </Typography>
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_price_cnyRate`}
                                variant='outlined'
                                sx={{
                                    width: "100%",
                                }}
                                inputProps={{
                                    style: {
                                        fontSize: 14,
                                        padding: 5,
                                        textAlign: "right"
                                    }
                                }}
                                defaultValue={product.manyPriceInfo.cnyRate}
                                onBlur={(e) => {
                                    product.setManyPriceInfo({
                                        ...product.manyPriceInfo,

                                        cnyRate: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <Typography fontSize={14}>
                                마진율
                            </Typography>
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_price_marginRate`}
                                variant='outlined'
                                sx={{
                                    width: "100%",
                                }}
                                inputProps={{
                                    style: {
                                        fontSize: 14,
                                        padding: 5,
                                        textAlign: "right"
                                    }
                                }}
                                defaultValue={product.manyPriceInfo.marginRate}
                                onBlur={(e) => {
                                    product.setManyPriceInfo({
                                        ...product.manyPriceInfo,

                                        marginRate: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Select sx={{
                                width: "100%",
                                height: 30,
                                fontSize: 14
                            }}
                                value={product.manyPriceInfo.marginUnitType}
                                onChange={(e) => {
                                    product.setManyPriceInfo({
                                        ...product.manyPriceInfo,

                                        marginUnitType: e.target.value
                                    })
                                }}>
                                <MenuItem value={"PERCENT"}>%</MenuItem>
                                <MenuItem value={"WON"}>원</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <Typography fontSize={14}>
                                해외배송비
                            </Typography>
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_price_localShippingFee`}
                                variant='outlined'
                                sx={{
                                    width: "100%",
                                }}
                                inputProps={{
                                    style: {
                                        fontSize: 14,
                                        padding: 5,
                                        textAlign: "right"
                                    }
                                }}
                                defaultValue={product.manyPriceInfo.localShippingFee}
                                onBlur={(e) => {
                                    product.setManyPriceInfo({
                                        ...product.manyPriceInfo,

                                        localShippingFee: parseInt(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <Typography fontSize={14}>
                                유료배송비
                            </Typography>
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_price_shippingFee`}
                                variant='outlined'
                                sx={{
                                    width: "100%",
                                }}
                                inputProps={{
                                    style: {
                                        fontSize: 14,
                                        padding: 5,
                                        textAlign: "right"
                                    }
                                }}
                                defaultValue={product.manyPriceInfo.shippingFee}
                                onBlur={(e) => {
                                    product.setManyPriceInfo({
                                        ...product.manyPriceInfo,

                                        shippingFee: parseInt(e.target.value)
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                }}>
                    <Typography color="error" fontSize={12}>
                        알리익스프레스의 경우 환율과 해외배송비 설정이 무시됩니다.
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3
            }}>
                <Button disableElevation variant="contained" color="info" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={async () => {
                    product.updateManyPrice();
                }}>
                    적용
                </Button>

                <Button disableElevation variant="contained" color="inherit" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={() => { product.toggleManyPriceModal(false) }}>
                    취소
                </Button>
            </Box>
        </Paper>
    </Modal>
});