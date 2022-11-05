import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { styled, Box, Chip, Divider, Grid, IconButton, TableCell, TableRow, Typography, Checkbox, Paper } from "@mui/material";
import { Image, Input, MyButton } from "../../Common/UI";

import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import { order } from '../../../../containers/stores/order';

const StyledTableCell = styled(TableCell)({
    textAlign: "center",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    padding: 0,
    fontSize: 13,
});

export const DeliverySummary = observer((props: any) => {
    const { common, delivery, product } = React.useContext(AppContext);

    return <>
        <TableRow hover>
            <StyledTableCell width={50}>
                <Checkbox size="small" checked={props.item.checked} onChange={(e) => { delivery.toggleItemChecked(props.index, e.target.checked) }} />
            </StyledTableCell>

            <StyledTableCell width={82}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 0,
                        height: "100%",
                        width: "100%"
                    }}
                >
                    <Image src={props.item.imageUrl} width={82} height={82} style={{
                        // border: "1px solid lightgray",
                        background: "black",
                        objectFit: "contain"
                    }} onClick={(e) => {
                        product.setImagePopOver({
                            element: e.target,
                            data: { src: props.item.imageUrl },
                            open: true
                        });
                    }} />
                </Box>
            </StyledTableCell>

            <StyledTableCell>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: 40
                    }}>
                        <Grid container spacing={0.5}>
                            <Grid item xs={6} md={4} sx={{
                                margin: "auto"
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <IconButton
                                        sx={{
                                            ml: 0.5,
                                        }}
                                        onClick={() => {
                                            window.open(props.item.url);
                                        }}
                                    >
                                        <img src="/resources/icon-taobao.png" />
                                    </IconButton>

                                    <Chip label={
                                        <Typography sx={{
                                            fontSize: 11,
                                        }}>
                                            {props.item.id}
                                        </Typography>
                                    } size="small" color="info" sx={{
                                        mx: 0.5,
                                    }} onClick={() => {
                                        navigator.clipboard.writeText(props.item.id).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }} />

                                    <Typography noWrap fontSize={13} sx={{
                                        color: "#1565c0",
                                    }}>
                                        {props.item.productName}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6} md={2} sx={{
                                m: "auto",
                                textAlign: "left"
                            }}>
                                <Input
                                    readOnly
                                    value={props.item.optionInfo}
                                />
                            </Grid>

                            <Grid item xs={6} md={1} sx={{
                                m: "auto",
                                textAlign: "left"
                            }}>
                                <Input
                                    readOnly
                                    value={props.item.trackingNumber}
                                />
                            </Grid>

                            <Grid item xs={6} md={1} sx={{
                                m: "auto",
                                textAlign: "left"
                            }}>
                                <Input
                                    readOnly
                                    value={props.item.deliveryMessage}
                                />
                            </Grid>

                            <Grid item xs={6} md={2} sx={{
                                m: "auto",
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "right"
                                }}>
                                    <Typography noWrap fontSize={13}>
                                        {props.item.unitPrice} X {props.item.quantity}개 =
                                    </Typography>

                                    &nbsp;

                                    <Typography noWrap fontSize={13} sx={{
                                        textDecoration: "line-through"
                                    }}>
                                        {props.item.unitPrice * props.item.quantity}
                                    </Typography>

                                    &nbsp;

                                    <Typography noWrap fontSize={13}>
                                        → {props.item.actualPrice}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6} md={2} sx={{
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
                                        delivery.connectOrderInfo(props.index, common);
                                    }}>
                                        주문연동
                                    </MyButton>

                                    <MyButton disableElevation variant="contained" color="error" sx={{
                                        ml: 0.5,
                                        mr: 1,
                                        minWidth: 60,
                                    }} onClick={() => {
                                        alert("준비 중입니다.");
                                    }}>
                                        주문삭제
                                    </MyButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{

                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: 40
                    }}>
                        {props.item.connected ?
                            <Grid container spacing={0.5}>
                                <Grid item xs={6} md={4} sx={{
                                    margin: "auto"
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        <IconButton
                                            sx={{
                                                ml: 0.5,
                                            }}
                                            onClick={() => {
                                                window.open(props.item.url);
                                            }}
                                        >
                                            <img src="/resources/icon-smartstore.png" />
                                        </IconButton>

                                        <Chip label={
                                            <Typography sx={{
                                                fontSize: 11,
                                            }}>
                                                {props.item.connected.orderNo}
                                            </Typography>
                                        } size="small" color="warning" sx={{
                                            mx: 0.5,
                                        }} onClick={() => {
                                            navigator.clipboard.writeText(props.item.connected.orderNo).then(function () {
                                                alert("클립보드에 복사되었습니다.");
                                            }, function () {
                                                alert("클립보드에 복사할 수 없습니다.");
                                            });
                                        }} />

                                        <Typography noWrap fontSize={13} sx={{
                                            color: "#ed6c02",
                                        }}>
                                            {props.item.connected.productName}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={2} sx={{
                                    m: "auto",
                                    textAlign: "left"
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <Input
                                            readOnly
                                            value={props.item.connected.productOptionContents}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={1} sx={{
                                    m: "auto",
                                    textAlign: "left"
                                }}>

                                </Grid>

                                <Grid item xs={6} md={1} sx={{
                                    m: "auto",
                                    textAlign: "left"
                                }}>

                                </Grid>

                                <Grid item xs={6} md={2} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>

                                </Grid>

                                <Grid item xs={6} md={2} sx={{
                                    margin: "auto"
                                }}>
                                    <Box
                                        sx={{
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "right",
                                        }}
                                    >
                                        <MyButton disableElevation variant="contained" color="warning" sx={{
                                            ml: 0.5,
                                            minWidth: 60,
                                        }} onClick={() => {
                                            alert("준비 중입니다.");
                                        }}>
                                            배송신청
                                        </MyButton>

                                        <MyButton disableElevation variant="contained" color="error" sx={{
                                            ml: 0.5,
                                            mr: 1,
                                            minWidth: 60,
                                        }} onClick={() => {
                                            delivery.disconnectOrderInfo(props.index);
                                        }}>
                                            연동해제
                                        </MyButton>
                                    </Box>
                                </Grid>
                            </Grid>
                            :
                            <Typography noWrap fontSize={13} sx={{
                                ml: 1
                            }}>
                                주문이 연동되지 않았습니다.
                            </Typography>
                        }
                    </Box>
                </Box>
            </StyledTableCell>
        </TableRow>
    </>
})