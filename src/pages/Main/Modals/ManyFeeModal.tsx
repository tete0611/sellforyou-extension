import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, Grid, Modal, Paper, TextField, Typography } from '@mui/material';

export const ManyFeeModal = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Modal open={product.modalInfo.fee} onClose={() => product.toggleManyFeeModal(false)}>
        <Paper className='uploadModal' sx={{
            width: 350
        }}>
            <Typography fontSize={16} sx={{
                mb: 3
            }}>
                오픈마켓 수수료 일괄설정
            </Typography>

            <Paper variant="outlined">
                <Box sx={{
                    p: 1,
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-smartstore.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_naver`}
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
                                defaultValue={product.manyFeeInfo.naverFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        naverFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-coupang.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_coupang`}
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
                                defaultValue={product.manyFeeInfo.coupangFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        coupangFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-street-global.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_street`}
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
                                defaultValue={product.manyFeeInfo.streetFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        streetFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-street-normal.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_streetNormal`}
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
                                defaultValue={product.manyFeeInfo.streetNormalFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        streetNormalFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-gmarket.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_gmarket`}
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
                                defaultValue={product.manyFeeInfo.gmarketFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        gmarketFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-auction.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_auction`}
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
                                defaultValue={product.manyFeeInfo.auctionFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        auctionFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-interpark.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_interpark`}
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
                                defaultValue={product.manyFeeInfo.interparkFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        interparkFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-wemakeprice.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_wemakepriceFee`}
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
                                defaultValue={product.manyFeeInfo.wemakepriceFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        wemakepriceFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-lotteon-global.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_lotteon`}
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
                                defaultValue={product.manyFeeInfo.lotteonFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        lotteonFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-lotteon-normal.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_lotteonNormal`}
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
                                defaultValue={product.manyFeeInfo.lotteonNormalFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        lotteonNormalFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={4} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-tmon.png" />
                        </Grid>

                        <Grid item xs={6} md={8} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_fee_tmon`}
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
                                defaultValue={product.manyFeeInfo.tmonFee}
                                onBlur={(e) => {
                                    product.setManyFeeInfo({
                                        ...product.manyFeeInfo,

                                        tmonFee: parseFloat(e.target.value)
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>
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
                }} onClick={() => {
                    product.updateManyFee(null);
                }}>
                    적용
                </Button>

                <Button disableElevation variant="contained" color="inherit" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={() => { product.toggleManyFeeModal(false) }}>
                    취소
                </Button>
            </Box>
        </Paper>
    </Modal>
});