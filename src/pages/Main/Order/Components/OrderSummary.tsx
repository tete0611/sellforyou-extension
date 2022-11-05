import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { styled, Box, Chip, Grid, IconButton, TableCell, TableRow, Typography, Checkbox, Paper } from "@mui/material";
import { Input, MyButton } from "../../Common/UI";

import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';

const StyledTableCell = styled(TableCell)({
    textAlign: "center",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    padding: 0,
    fontSize: 13,
});

export const OrderSummary = observer((props: any) => {
    const { common, order } = React.useContext(AppContext);

    return <>
        <TableRow hover>
            <StyledTableCell width={50}>
                <Checkbox size="small" checked={props.item.checked} onChange={(e) => { order.toggleItemChecked(props.index, e.target.checked) }} />
            </StyledTableCell>

            <StyledTableCell>
                <Grid container spacing={0.5}>
                    <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                    }}>
                        <Paper variant="outlined" sx={{
                            my: 0.5,
                            p: 0.5
                        }}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <IconButton onClick={() => {
                                    if (!props.item.product) {
                                        alert("셀포유에 등록된 상품이 아닙니다.");

                                        return;
                                    }

                                    const matched = props.item.product.activeProductStore.find((v: any) => v.siteCode === props.item.marketCode);

                                    if (!matched) {
                                        return;
                                    }

                                    window.open(matched.storeUrl);
                                }}>
                                    {props.item.marketCode === 'A077' ?
                                        <img src="/resources/icon-smartstore.png" />
                                        :
                                        props.item.marketCode === 'B378' ?
                                            <img src="/resources/icon-coupang.png" />
                                            :
                                            props.item.marketCode === 'A112' ?
                                                <img src="/resources/icon-street-global.png" />
                                                :
                                                props.item.marketCode === 'A113' ?
                                                    <img src="/resources/icon-street-normal.png" />
                                                    :
                                                    props.item.marketCode === 'A006' ?
                                                        <img src="/resources/icon-gmarket.png" />
                                                        :
                                                        props.item.marketCode === 'A001' ?
                                                            <img src="/resources/icon-auction.png" />
                                                            :
                                                            props.item.marketCode === 'A027' ?
                                                                <img src="/resources/icon-interpark.png" />
                                                                :
                                                                props.item.marketCode === 'B719' ?
                                                                    <img src="/resources/icon-wemakeprice.png" />
                                                                    :
                                                                    props.item.marketCode === 'A524' ?
                                                                        <img src="/resources/icon-lotteon-global.png" />
                                                                        :
                                                                        props.item.marketCode === 'A525' ?
                                                                            <img src="/resources/icon-lotteon-normal.png" />
                                                                            :
                                                                            props.item.marketCode === 'B956' ?
                                                                                <img src="/resources/icon-tmon.png" />
                                                                                :
                                                                                null
                                    }
                                </IconButton>

                                <Chip label={
                                    <Typography sx={{
                                        fontSize: 11,
                                    }}>
                                        {props.item.orderNo}
                                    </Typography>
                                } size="small" color="info" sx={{
                                    mr: 1,
                                }} onClick={() => {
                                    navigator.clipboard.writeText(props.item.orderNo).then(function () {
                                        alert("클립보드에 복사되었습니다.");
                                    }, function () {
                                        alert("클립보드에 복사할 수 없습니다.");
                                    });
                                }} />

                                <Typography noWrap fontSize={13} sx={{
                                    color: "#1565c0",
                                    maxWidth: 275
                                }}>
                                    {props.item.productName}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 0,
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                {props.item.product ?
                                    <IconButton
                                        onClick={() => {
                                            window.open(props.item.product.activeTaobaoProduct.url);
                                        }}
                                    >
                                        {props.item.product.activeTaobaoProduct.shopName === 'taobao' ?
                                            <img src="/resources/icon-taobao.png" />
                                            :
                                            props.item.product.activeTaobaoProduct.shopName === 'tmall' ?
                                                <img src="/resources/icon-tmall.png" />
                                                :
                                                props.item.product.activeTaobaoProduct.shopName === 'express' ?
                                                    <img src="/resources/icon-express.png" />
                                                    :
                                                    props.item.product.activeTaobaoProduct.shopName === 'alibaba' ?
                                                        <img src="/resources/icon-1688.png" />
                                                        :
                                                        props.item.product.activeTaobaoProduct.shopName === 'vvic' ?
                                                            <img src="/resources/icon-vvic.png" />
                                                            :
                                                            null
                                        }
                                    </IconButton>
                                    :
                                    <Box sx={{
                                        width: 32,
                                        height: 32
                                    }}>
                                    </Box>
                                }

                                <Input
                                    readOnly
                                    value={props.item.productOptionContents}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={6} md={2} sx={{
                        margin: "auto"
                    }}>
                        <Paper variant="outlined" sx={{
                            my: 0.5,
                            p: 0.5
                        }}>
                            <Grid container spacing={0.5}>
                                <Grid item xs={6} md={12} sx={{
                                    margin: "auto"
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        px: 0.5,
                                        py: 0.8
                                    }}>
                                        <Typography noWrap fontSize={11}>
                                            {props.item.orderMemberName}
                                        </Typography>

                                        <Typography noWrap fontSize={11}>
                                            {props.item.orderMemberTelNo}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={2} sx={{
                                    margin: "auto"
                                }}>
                                    <Input options={{
                                        textAlign: "right"
                                    }}
                                        readOnly
                                        value={`${props.item.orderQuantity}개`}
                                    />
                                </Grid>

                                <Grid item xs={6} md={5} sx={{
                                    margin: "auto"
                                }}>
                                    <Input options={{
                                        textAlign: "right"
                                    }}
                                        readOnly
                                        value={`${parseInt(props.item.productPayAmt).toLocaleString('ko-KR')}원`}
                                    />
                                </Grid>

                                <Grid item xs={6} md={5} sx={{
                                    margin: "auto"
                                }}>
                                    <Input options={{
                                        textAlign: "right"
                                    }}
                                        readOnly
                                        value={isNaN(props.item.deliveryFeeAmt) ? "" : props.item.deliveryFeeAmt === "0" ? "무료" : `${parseInt(props.item.deliveryFeeAmt).toLocaleString('ko-KR')}원`}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{
                        margin: "auto"
                    }}>
                        <Paper variant="outlined" sx={{
                            my: 0.5,
                            p: 0.5
                        }}>
                            <Grid container spacing={0.5}>
                                <Grid item xs={6} md={12} sx={{
                                    margin: "auto"
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        px: 0.5,
                                        py: 0.8
                                    }}>
                                        <Typography noWrap fontSize={11}>
                                            {props.item.receiverName}
                                        </Typography>

                                        <Typography noWrap fontSize={11}>
                                            {props.item.receiverTelNo1}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={2} sx={{
                                    margin: "auto"
                                }}>
                                    <Input
                                        readOnly
                                        value={props.item.receiverZipCode}
                                    />
                                </Grid>

                                <Grid item xs={6} md={6} sx={{
                                    margin: "auto"
                                }}>
                                    <Input
                                        readOnly
                                        value={props.item.receiverIntegratedAddress}
                                    />
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    margin: "auto"
                                }}>
                                    <Input
                                        readOnly
                                        value={props.item.productOrderMemo}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={6} md={1.5} sx={{
                        margin: "auto"
                    }}>
                        <Paper variant="outlined" sx={{
                            my: 0.5,
                            p: 0.5
                        }}>
                            <Grid container spacing={0.5}>
                                <Grid item xs={6} md={12} sx={{
                                    margin: "auto"
                                }}>
                                    <Box sx={{
                                        py: 0.3
                                    }}>
                                        {props.item.icucResult?.code === 0 ?
                                            <Chip icon={<ErrorIcon />} label={
                                                <Typography noWrap fontSize={11}>
                                                    {props.item.icucResult?.message}
                                                </Typography>
                                            } color="error" size="small" sx={{ width: "100%", borderRadius: "4px" }} />
                                            : props.item.icucResult?.code === 1 ?
                                                <Chip icon={<DoneIcon />} label={
                                                    <Typography noWrap fontSize={11}>
                                                        {props.item.icucResult?.message}
                                                    </Typography>
                                                } color="success" size="small" sx={{ width: "100%", borderRadius: "4px" }} />
                                                : props.item.icucResult?.code === 2 ?
                                                    <Chip icon={<ErrorIcon />} label={
                                                        <Typography noWrap fontSize={11}>
                                                            {props.item.icucResult?.message}
                                                        </Typography>} color="warning" size="small" sx={{ width: "100%", borderRadius: "4px" }} />
                                                    :
                                                    <Chip icon={<ErrorIcon />} label={
                                                        <Typography noWrap fontSize={11}>
                                                            통관부호미사용
                                                        </Typography>
                                                    } size="small" sx={{ width: "100%" }} />
                                        }
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={6} sx={{
                                    margin: "auto"
                                }}>
                                    <Input
                                        readOnly
                                        value={props.item.individualCustomUniqueCode}
                                    />
                                </Grid>

                                <Grid item xs={6} md={6} sx={{
                                    margin: "auto"
                                }}>
                                    <Input
                                        readOnly
                                        value={props.item.sellerProductManagementCode}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={6} md={1.5} sx={{
                        margin: "auto"
                    }}>
                        <Grid container spacing={0.5}>
                            <Grid item xs={6} md={12} sx={{
                                margin: "auto",
                                textAlign: "right"
                            }}>
                                <Box
                                    sx={{
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "right",
                                        minHeight: 25,
                                        py: 0.3
                                    }}
                                ></Box>
                            </Grid>

                            <Grid item xs={6} md={12} sx={{
                                margin: "auto"
                            }}>
                                <Box
                                    sx={{
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "right",
                                    }}
                                >
                                    <MyButton disableElevation variant="contained" color="info" sx={{
                                        ml: 0.5,
                                        minWidth: 60,
                                    }} onClick={() => {
                                        alert("준비 중입니다.");

                                        // order.productPrepared(common, props);
                                    }}>
                                        발주확인
                                    </MyButton>

                                    <MyButton disableElevation variant="contained" color="error" sx={{
                                        ml: 0.5,
                                        mr: 1,
                                        minWidth: 60,
                                    }} onClick={() => {
                                        order.deleteOrder(props.index);
                                    }}>
                                        주문삭제
                                    </MyButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StyledTableCell>
        </TableRow>
    </>
})