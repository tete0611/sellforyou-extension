import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Chip, Grid, IconButton, Modal, Paper, Typography } from '@mui/material';
import { Image } from '../Common/UI';

// 주문상세정보 모달 뷰
export const OrderDetailModal = observer(() => {
    // MobX 스토리지 로드
    const { order, product } = React.useContext(AppContext);

    return <Modal open={order.modalInfo.orderDetail} onClose={() => order.toggleOrderDetailModal(false, order.orderInfo.current)}>
        <Paper className='uploadModal' sx={{
            width: 400
        }}>
            {order.orderInfo.orders[order.orderInfo.current] ?
                <>
                    <Typography fontSize={16} sx={{
                        mb: 3
                    }}>
                        상세정보
                    </Typography>

                    {order.orderInfo.orders[order.orderInfo.current].icucResult ?
                        <Paper variant="outlined" sx={{
                            mb: 1
                        }}>
                            <Box sx={{
                                p: 1,
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <Typography fontSize={12}>
                                        통관부호 검증결과
                                    </Typography>

                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].icucResult?.code === 0 ?
                                            <>
                                                <ErrorIcon color="error" sx={{
                                                    mx: 1,
                                                    fontSize: 19,
                                                }} />

                                                <Typography noWrap fontSize={12} sx={{
                                                    color: "#d32f2f",
                                                }}>
                                                    {order.orderInfo.orders[order.orderInfo.current].icucResult?.message}
                                                </Typography>
                                            </>
                                            :
                                            order.orderInfo.orders[order.orderInfo.current].icucResult?.code === 1 ?
                                                <>
                                                    <CheckCircleIcon color="success" sx={{
                                                        mx: 1,
                                                        fontSize: 19,
                                                    }} />

                                                    <Typography noWrap fontSize={12} sx={{
                                                        color: "#2e7d32",
                                                    }}>
                                                        {order.orderInfo.orders[order.orderInfo.current].icucResult?.message}
                                                    </Typography>
                                                </>
                                                :
                                                order.orderInfo.orders[order.orderInfo.current].icucResult?.code === 2 ?
                                                    <>
                                                        <WarningIcon color="warning" sx={{
                                                            mx: 1,
                                                            fontSize: 19,
                                                        }} />

                                                        <Typography noWrap fontSize={12} sx={{
                                                            color: "#ed6c02",
                                                        }}>
                                                            {order.orderInfo.orders[order.orderInfo.current].icucResult?.message}
                                                        </Typography>
                                                    </>
                                                    :
                                                    null
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                        :
                        null
                    }

                    <Paper variant="outlined" sx={{
                        mb: 1
                    }}>
                        <Box sx={{
                            p: 1,
                        }}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: order.orderInfo.orders[order.orderInfo.current].product ? 3 : 0
                            }}>
                                <Typography fontSize={12}>
                                    상품정보
                                </Typography>

                                {order.orderInfo.orders[order.orderInfo.current].product ?
                                    <>
                                        <Chip label={
                                            <Typography fontSize={12}>
                                                {order.orderInfo.orders[order.orderInfo.current].product.productCode}
                                            </Typography>
                                        } size="small" color="info" onClick={() => {
                                            navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].product.productCode).then(function () {
                                                alert("클립보드에 복사되었습니다.");
                                            }, function () {
                                                alert("클립보드에 복사할 수 없습니다.");
                                            });
                                        }} />
                                    </>
                                    :
                                    <>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}>
                                            <ErrorIcon color="error" sx={{
                                                mr: 1,
                                                fontSize: 19,
                                            }} />

                                            <Typography fontSize={12} color="error">
                                                셀포유로 등록한 상품이 아닙니다.
                                            </Typography>
                                        </Box>
                                    </>
                                }
                            </Box>

                            {order.orderInfo.orders[order.orderInfo.current].product ?
                                <Grid container spacing={1}>
                                    <Grid item xs={6} md={3} sx={{
                                        m: "auto"
                                    }}>
                                        <Image src={order.orderInfo.orders[order.orderInfo.current].product.imageThumbnail[0]} width={78} height={78} style={{
                                            // border: "1px solid lightgray",
                                            background: "black",
                                            objectFit: "contain"
                                        }} onClick={(e) => {
                                            product.setImagePopOver({
                                                element: e.target,
                                                data: { src: order.orderInfo.orders[order.orderInfo.current].product.imageThumbnail[0] },
                                                open: true
                                            });
                                        }} />
                                    </Grid>

                                    <Grid item xs={6} md={9} sx={{
                                        m: "auto"
                                    }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6} md={3} sx={{
                                                m: "auto"
                                            }}>
                                                <Typography fontSize={12}>
                                                    상품명
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} md={9} sx={{
                                                m: "auto",
                                                textAlign: "right"
                                            }}>
                                                <Typography noWrap fontSize={12} onClick={() => {
                                                    navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].product.activeTaobaoProduct.name).then(function () {
                                                        alert("클립보드에 복사되었습니다.");
                                                    }, function () {
                                                        alert("클립보드에 복사할 수 없습니다.");
                                                    });
                                                }}>
                                                    {order.orderInfo.orders[order.orderInfo.current].product.activeTaobaoProduct.name}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} md={3} sx={{
                                                m: "auto"
                                            }}>
                                                <Typography fontSize={12}>
                                                    카테고리
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} md={9} sx={{
                                                m: "auto",
                                                textAlign: "right"
                                            }}>
                                                <Typography noWrap fontSize={12} color="#1565c0" onClick={() => {
                                                    navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].product.categoryInfoA077.name).then(function () {
                                                        alert("클립보드에 복사되었습니다.");
                                                    }, function () {
                                                        alert("클립보드에 복사할 수 없습니다.");
                                                    });
                                                }}>
                                                    {order.orderInfo.orders[order.orderInfo.current].product.categoryInfoA077.name}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} md={3} sx={{
                                                m: "auto"
                                            }}>
                                                <Typography fontSize={12}>
                                                    판매채널
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} md={9} sx={{
                                                m: "auto",
                                                textAlign: "right"
                                            }}>
                                                {order.orderInfo.orders[order.orderInfo.current].product.state === 7 ?
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                            justifyContent: "right",
                                                        }}
                                                    >
                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A077' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A077' && v.state === 2) ? "/resources/icon-smartstore.png" : "/resources/icon-smartstore-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            // product.updateCoupangUrl(props.index, common.user);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'B378' && v.state === 2) ? "/resources/icon-coupang.png" : "/resources/icon-coupang-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A112' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A112' && v.state === 2) ? "/resources/icon-street-global.png" : "/resources/icon-street-global-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A113' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A113' && v.state === 2) ? "/resources/icon-street-normal.png" : "/resources/icon-street-normal-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A006' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A006' && v.state === 2) ? "/resources/icon-gmarket.png" : "/resources/icon-gmarket-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A001' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A001' && v.state === 2) ? "/resources/icon-auction.png" : "/resources/icon-auction-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A027' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A027' && v.state === 2) ? "/resources/icon-interpark.png" : "/resources/icon-interpark-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'B719' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'B719' && v.state === 2) ? "/resources/icon-wemakeprice.png" : "/resources/icon-wemakeprice-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A524' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A524' && v.state === 2) ? "/resources/icon-lotteon-global.png" : "/resources/icon-lotteon-global-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A525' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'A525' && v.state === 2) ? "/resources/icon-lotteon-normal.png" : "/resources/icon-lotteon-normal-gray.png"} />
                                                        </IconButton>

                                                        <IconButton size="small" style={{
                                                            padding: 0,
                                                            margin: 1,
                                                        }} onClick={() => {
                                                            const connected = order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'B956' && v.state === 2)

                                                            if (!connected) {
                                                                return;
                                                            }

                                                            window.open(connected.storeUrl);
                                                        }}>
                                                            <img src={order.orderInfo.orders[order.orderInfo.current].product.productStore.find((v: any) => v.siteCode === 'B956' && v.state === 2) ? "/resources/icon-tmon.png" : "/resources/icon-tmon-gray.png"} />
                                                        </IconButton>
                                                    </Box>
                                                    :
                                                    null
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                        </Box>
                    </Paper>

                    <Paper variant="outlined" sx={{
                        mb: 1
                    }}>
                        <Box sx={{
                            p: 1,
                        }}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3
                            }}>
                                <Typography fontSize={12}>
                                    오픈마켓 주문정보
                                </Typography>

                                <Chip label={
                                    <Typography fontSize={12}>
                                        {order.orderInfo.orders[order.orderInfo.current].orderNo}
                                    </Typography>
                                } size="small" color="info" onClick={() => {
                                    navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].orderNo).then(function () {
                                        alert("클립보드에 복사되었습니다.");
                                    }, function () {
                                        alert("클립보드에 복사할 수 없습니다.");
                                    });
                                }} />
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        상품명
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} onClick={() => {
                                        navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].productName).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].productName}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        옵션명
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} color="#1565c0" onClick={() => {
                                        navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].productOptionContents).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].productOptionContents}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        구매자
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} onClick={() => {
                                        navigator.clipboard.writeText(`${order.orderInfo.orders[order.orderInfo.current].orderMemberName} (${order.orderInfo.orders[order.orderInfo.current].orderMemberTelNo})`).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].orderMemberName} ({order.orderInfo.orders[order.orderInfo.current].orderMemberTelNo})
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        수취인
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} onClick={() => {
                                        navigator.clipboard.writeText(`${order.orderInfo.orders[order.orderInfo.current].receiverName} (${order.orderInfo.orders[order.orderInfo.current].receiverTelNo1})`).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].receiverName} ({order.orderInfo.orders[order.orderInfo.current].receiverTelNo1})
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        배송주소
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} onClick={() => {
                                        navigator.clipboard.writeText(`(${order.orderInfo.orders[order.orderInfo.current].receiverZipCode}) ${order.orderInfo.orders[order.orderInfo.current].receiverIntegratedAddress}`).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        ({order.orderInfo.orders[order.orderInfo.current].receiverZipCode}) {order.orderInfo.orders[order.orderInfo.current].receiverIntegratedAddress}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        배송메시지
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} onClick={() => {
                                        navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].productOrderMemo).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].productOrderMemo}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        개인통관고유부호
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} color="#1565c0" onClick={() => {
                                        navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].individualCustomUniqueCode).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].individualCustomUniqueCode}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={12}>
                                        판매자관리코드
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <Typography noWrap fontSize={12} color="#d32f2f" onClick={() => {
                                        navigator.clipboard.writeText(order.orderInfo.orders[order.orderInfo.current].sellerProductManagementCode).then(function () {
                                            alert("클립보드에 복사되었습니다.");
                                        }, function () {
                                            alert("클립보드에 복사할 수 없습니다.");
                                        });
                                    }}>
                                        {order.orderInfo.orders[order.orderInfo.current].sellerProductManagementCode}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </>
                :
                null
            }
        </Paper>
    </Modal>
});