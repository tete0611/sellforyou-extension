import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';

import { format } from "date-fns";
import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { styled, Box, Chip, Grid, IconButton, TableCell, TableRow, Typography, Button, Checkbox, Paper, CircularProgress } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Image, Input, Search } from "../../Common/UI";

const StyledTableCell = styled(TableCell)({
    textAlign: "center",
    padding: 0,
    border: "none",
    fontSize: 14,
});

export const Summary = observer((props: any) => {
    const { common, product } = React.useContext(AppContext);

    return <>
        <TableRow hover>
            <StyledTableCell width={50}>
                <Checkbox size="small" checked={props.item.checked} onChange={(e) => { product.toggleItemChecked(props.index, e.target.checked) }} />

                <IconButton
                    size="small"
                    onClick={() => {
                        product.toggleItemCollapse(props.index);

                        props.tableRef.current.recomputeRowHeights();
                    }}
                >
                    {props.item.collapse ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </StyledTableCell>

            <StyledTableCell width={90}>
                <Chip size="small" color="info" sx={{ fontSize: 12, width: 85, mb: 1 }} label={props.item.productCode} onClick={() => {
                    navigator.clipboard.writeText(props.item.productCode).then(function () {
                        alert("클립보드에 복사되었습니다.");
                    }, function () {
                        alert("클립보드에 복사할 수 없습니다.");
                    });
                }} />

                {props.item.state === 6 ?
                    <Chip size="small" sx={{ fontSize: 13, width: 85 }} label={`${format(new Date(props.item.createdAt), "yy-MM-dd")}`} />
                    :
                    <Chip size="small" sx={{ fontSize: 13, width: 85 }} label={`${format(new Date(props.item.stockUpdatedAt), "yy-MM-dd")}`} />
                }
            </StyledTableCell>

            <StyledTableCell width={100}>
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
                    <Image src={props.item.imageThumbnail[0]} width={82} height={82} style={{
                        // border: "1px solid lightgray",
                        background: "black",
                        objectFit: "contain"
                    }} onClick={(e) => {
                        product.setImagePopOver({
                            element: e.target,
                            data: { src: props.item.imageThumbnail[0] },
                            open: true
                        });
                    }} />
                </Box>
            </StyledTableCell>

            <StyledTableCell>
                <Grid container spacing={0.5}>
                    <Grid item xs={6} md={4.5}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 0,
                                height: "100%",
                                width: "100%"
                            }}
                        >
                            <Input
                                error={!props.item.name}
                                id={`product_row_title_${props.index}`}
                                value={props.item.name}
                                onChange={(e: any) => {
                                    const name = e.target.value;

                                    product.setProductName(name, props.index);
                                }}
                                onBlur={(e: any) => {
                                    product.updateProductName(props.index);
                                }}
                            />

                            <Typography sx={{
                                color: "black",
                                fontSize: 12,
                                ml: 0.5
                            }}>
                                ({props.item.name.length})
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={3.5} sx={{
                        margin: "auto"
                    }}>
                        <Grid container spacing={0.5}>
                            <Grid item xs={6} md={6} sx={{
                                margin: "auto"
                            }}>
                                <Paper variant="outlined" sx={{
                                    border: "1px solid #c9c9c9",
                                    p: "4.5px"
                                }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} md={5} sx={{
                                            margin: "auto"
                                        }}>
                                            <Typography fontSize={13} sx={{
                                                textAlign: "left"
                                            }}>
                                                도매가
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} md={7} sx={{
                                            margin: "auto"
                                        }}>
                                            <Typography fontSize={13} sx={{
                                                color: "#d32f2f",
                                                textAlign: "right"
                                            }}>
                                                {props.item.activeTaobaoProduct.price.toLocaleString('ko-KR')}{`${props.item.activeTaobaoProduct.shopName === 'express' ? '원' : '¥'}`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item xs={6} md={6} sx={{
                                margin: "auto"
                            }}>
                                <Paper variant="outlined" sx={{
                                    border: "1px solid #c9c9c9",
                                    p: "4.5px"
                                }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} md={5} sx={{
                                            margin: "auto"
                                        }}>
                                            <Typography fontSize={13} sx={{
                                                textAlign: "left"
                                            }}>
                                                판매가
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} md={7} sx={{
                                            margin: "auto"
                                        }}>
                                            <Typography fontSize={13} sx={{
                                                color: "#1565c0",
                                                textAlign: "right"
                                            }}>
                                                {props.item.price.toLocaleString('ko-KR')}원
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6} md={4}>
                        <Box sx={{
                            mr: 1
                        }}>
                            <Search
                                value={props.item.categoryInfoA077}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A077').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A077').data : [props.item.categoryInfoA077]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onChange={(e: any, value: any) => {
                                    product.updateCategoryAuto(value, props.index);
                                }}
                                onInputChange={(e: any, value: any, reason: any) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A077", value);
                                }}
                                onOpen={async () => { product.getCategoryList("A077") }}
                                onClose={() => { product.setCategoryInput("A077", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A077').loading}
                            // label={<Box sx={{
                            //     display: "flex",
                            //     alignItems: "center"
                            // }}>
                            //     <img src="/resources/icon-smartstore.png" />

                            //     &nbsp;

                            //     카테고리
                            // </Box>}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={4.5}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 0,
                                height: "100%",
                                width: "100%"
                            }}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        window.open(props.item.activeTaobaoProduct.url);
                                    }}
                                >
                                    {props.item.activeTaobaoProduct.shopName === 'taobao' ?
                                        <img src="/resources/icon-taobao.png" />
                                        :
                                        props.item.activeTaobaoProduct.shopName === 'tmall' ?
                                            <img src="/resources/icon-tmall.png" />
                                            :
                                            props.item.activeTaobaoProduct.shopName === 'express' ?
                                                <img src="/resources/icon-express.png" />
                                                :
                                                props.item.activeTaobaoProduct.shopName === 'alibaba' ?
                                                    <img src="/resources/icon-1688.png" />
                                                    :
                                                    props.item.activeTaobaoProduct.shopName === 'vvic' ?
                                                        <img src="/resources/icon-vvic.png" />
                                                        :
                                                        null
                                    }
                                </IconButton>

                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        const videoUrl = props.item.activeTaobaoProduct.videoUrl;

                                        if (!videoUrl) {
                                            return;
                                        }

                                        window.open(videoUrl);
                                    }}
                                >
                                    {props.item.activeTaobaoProduct.videoUrl ?
                                        <img src="/resources/icon-video.png" />
                                        :
                                        <img src="/resources/icon-video-gray.png" />
                                    }
                                </IconButton>
                            </Box>

                            <Typography noWrap sx={{
                                color: "#1565c0",
                                fontSize: 13,
                                maxWidth: 500
                            }}>
                                {props.item.activeTaobaoProduct.name}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={3.5} sx={{
                        margin: "auto",
                    }}>
                        {props.item.state === 7 ?
                            <Paper variant="outlined" sx={{
                                border: "1px solid #c9c9c9",
                                p: "4.5px"
                            }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} md={3} sx={{
                                        margin: "auto"
                                    }}>
                                        <Typography fontSize={13} sx={{
                                            textAlign: "left"
                                        }}>
                                            등록마켓
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} md={9} sx={{
                                        margin: "auto"
                                    }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                                justifyContent: "right",
                                                height: "100%",
                                                width: "100%"
                                            }}
                                        >
                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A077' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A077' && v.state === 2) ? "/resources/icon-smartstore.png" : "/resources/icon-smartstore-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={async () => {
                                                product.updateCoupangUrl(props.index, common.user);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'B378' && v.state === 2) ? "/resources/icon-coupang.png" : "/resources/icon-coupang-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A112' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A112' && v.state === 2) ? "/resources/icon-street-global.png" : "/resources/icon-street-global-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A113' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A113' && v.state === 2) ? "/resources/icon-street-normal.png" : "/resources/icon-street-normal-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A006' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A006' && v.state === 2) ? "/resources/icon-gmarket.png" : "/resources/icon-gmarket-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A001' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A001' && v.state === 2) ? "/resources/icon-auction.png" : "/resources/icon-auction-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A027' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A027' && v.state === 2) ? "/resources/icon-interpark.png" : "/resources/icon-interpark-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'B719' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'B719' && v.state === 2) ? "/resources/icon-wemakeprice.png" : "/resources/icon-wemakeprice-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A524' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A524' && v.state === 2) ? "/resources/icon-lotteon-global.png" : "/resources/icon-lotteon-global-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'A525' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'A525' && v.state === 2) ? "/resources/icon-lotteon-normal.png" : "/resources/icon-lotteon-normal-gray.png"} />
                                            </IconButton>

                                            <IconButton size="small" style={{
                                                padding: 0,
                                                margin: 1,
                                            }} onClick={() => {
                                                const connected = props.item.productStore.find((v: any) => v.siteCode === 'B956' && v.state === 2)

                                                if (!connected) {
                                                    return;
                                                }

                                                window.open(connected.storeUrl);
                                            }}>
                                                <img src={props.item.productStore.find((v: any) => v.siteCode === 'B956' && v.state === 2) ? "/resources/icon-tmon.png" : "/resources/icon-tmon-gray.png"} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            :
                            null
                        }
                    </Grid>

                    <Grid item xs={6} md={4}>
                        <Box sx={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "right"
                        }}>
                            {props.item.productStore.filter((v: any) => v.productStoreLog.length > 0).length > 0 ?
                                <IconButton sx={{
                                    mr: 0.5
                                }} size="small" color="error" onClick={() => { product.toggleUploadFailedModal(props.index, true) }}>
                                    <ErrorIcon />
                                </IconButton>
                                :
                                null
                            }

                            <Button disabled={props.item.error} disableElevation variant="contained" color="warning" sx={{
                                mr: 0.5,
                                fontSize: 13,
                                minWidth: 60,
                                height: 30,
                                p: 0
                            }} onClick={async () => {
                                await product.checkErrorExist(props.index);

                                props.tableRef.current.recomputeRowHeights();
                            }}>
                                {props.item.error ? <>
                                    <CircularProgress size="1rem" />
                                </> : "에러체크"}
                            </Button>

                            {props.item.state === 7 ? <Button disableElevation variant='contained' color="info" sx={{
                                mr: 0.5,
                                fontSize: 13,
                                minWidth: 60,
                                height: 30,
                                p: 0
                            }} onClick={() => {
                                common.setEditedUpload(true);

                                product.toggleUploadModal(props.index, true)
                            }}>
                                상품수정
                            </Button> : null}

                            <Button disableElevation variant="contained" color="info" sx={{
                                mr: 0.5,
                                fontSize: 13,
                                minWidth: 60,
                                height: 30,
                                p: 0
                            }} onClick={() => {
                                common.setEditedUpload(false);

                                product.toggleUploadModal(props.index, true)
                            }}>
                                상품등록
                            </Button>

                            {props.item.state === 7 ? <Button disabled={props.item.delete} disableElevation variant="contained" color="error" sx={{
                                mr: 1,
                                fontSize: 13,
                                minWidth: 60,
                                height: 30,
                                p: 0
                            }} onClick={() => {
                                product.toggleUploadDisabledModal(props.index, true, common)
                            }}>
                                {props.item.delete ? <>
                                    <CircularProgress size="1rem" />
                                </> : "등록해제"}
                            </Button> : <Button disabled={props.item.delete} disableElevation variant="contained" color="error" sx={{
                                mr: 1,
                                fontSize: 13,
                                minWidth: 60,
                                height: 30,
                                p: 0
                            }} onClick={() => { product.deleteProduct(props.item.id) }}>
                                {props.item.delete ? <>
                                    <CircularProgress size="1rem" />
                                </> : "상품삭제"}
                            </Button>}
                        </Box>
                    </Grid>
                </Grid>
            </StyledTableCell>
        </TableRow>
    </>
})