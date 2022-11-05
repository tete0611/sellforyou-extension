import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';

import { observer } from "mobx-react";
import { AppContext } from "../../../../../containers/AppContext";
import { List, AutoSizer } from "react-virtualized";
import { Box, IconButton, MenuItem, Select, Table, TableHead, TableBody, TableCell, TableRow, Tooltip, Typography, Button, Checkbox, Paper } from "@mui/material";
import { Image, Input } from "../../../Common/UI";
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    defaultBox: {
        background: "#d1e8ff",
    },

    defaultPaper: {
        border: "1px solid #d1e8ff"
    },

    errorBox: {
        background: "#ffd1d1",
    },

    errorPaper: {
        border: "1px solid #ffd1d1"
    }
}));

export const TabPrice = observer((props: any) => {
    const { common, product } = React.useContext(AppContext);

    const classes = useStyles();

    const rowRenderer = (x) => {
        const v = props.item.productOption[x.index];

        return <div key={x.key} style={x.style}>
            <Box>
                <Table>
                    <TableRow hover>
                        <TableCell width={50} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            <Checkbox
                                size="small"
                                color="info"
                                checked={v.isActive}
                                onChange={(e) => {
                                    const isActive = e.target.checked;

                                    product.setProductOption(common, { ...v, isActive }, props.index, x.index, true);
                                    product.updateManyProductOption(props.index, [v.id]);
                                }}
                            />
                        </TableCell>

                        <TableCell width={50} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center",
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            {props.item.productOptionName.map((w: any) => {
                                const matched = w.productOptionValue.find((x: any) => x.image && (
                                    x.id === v.optionValue1Id ||
                                    x.id === v.optionValue2Id ||
                                    x.id === v.optionValue3Id ||
                                    x.id === v.optionValue4Id ||
                                    x.id === v.optionValue5Id
                                ));

                                if (matched) {
                                    return <Image src={matched.image} alt={matched.name} width={30} height={30} style={{
                                        objectFit: "contain"
                                    }} onClick={(e) => {
                                        product.setImagePopOver({
                                            element: e.target,
                                            data: { src: matched.image },
                                            open: true
                                        });
                                    }} />
                                }
                            })}
                        </TableCell>

                        <TableCell style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 5,
                            textAlign: "left",
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            {v.name}
                        </TableCell>

                        <TableCell width={120} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center",
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            {Math.ceil((v.price / props.item.price - 1) * 100) > 300 ?
                                <Tooltip title={`11번가 글로벌 - ${(props.item.price * 4).toLocaleString('ko-KR')}원을 초과할 수 없습니다.`}>
                                    <IconButton size="small" style={{
                                        padding: 0,
                                        margin: 1
                                    }}>
                                        <img src={"/resources/icon-street-global.png"} />
                                    </IconButton>
                                </Tooltip>
                                :
                                null
                            }

                            {Math.ceil((v.price / props.item.price - 1) * 100) > 100 ?
                                <Tooltip title={`11번가 일반 - ${(props.item.price * 2).toLocaleString('ko-KR')}원을 초과할 수 없습니다.`}>
                                    <IconButton size="small" style={{
                                        padding: 0,
                                        margin: 1
                                    }}>
                                        <img src={"/resources/icon-street-normal.png"} />
                                    </IconButton>
                                </Tooltip>
                                :
                                null
                            }

                            {Math.ceil((v.price / props.item.price - 1) * 100) > 50 ?
                                <Tooltip title={`옥션 - ${(props.item.price * 1.5).toLocaleString('ko-KR')}원을 초과할 수 없습니다.`}>
                                    <IconButton size="small" style={{
                                        padding: 0,
                                        margin: 1
                                    }}>
                                        <img src={"/resources/icon-auction.png"} />
                                    </IconButton>
                                </Tooltip>
                                :
                                null
                            }
                        </TableCell>

                        <TableCell width={120} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 5,
                            textAlign: "right",
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            {v.priceCny.toLocaleString('ko-KR')}{props.item.activeTaobaoProduct.shopName === 'express' ? "원" : "¥"}
                        </TableCell>

                        <TableCell width={120} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 5,
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            <Input
                                id={`product_row_detail_defaultShippingFee_${x.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                value={v.defaultShippingFee}
                                onChange={(e: any) => {
                                    const input = e.target.value;

                                    if (!input) {
                                        return;
                                    }

                                    const defaultShippingFee = parseInt(input);

                                    if (isNaN(defaultShippingFee)) {
                                        alert("배대지배송비는 숫자만 입력 가능합니다.");

                                        return;
                                    }

                                    product.setProductOption(common, { ...v, defaultShippingFee }, props.index, x.index, false);
                                }}
                                onBlur={(e: any) => {

                                    product.updateManyProductOption(props.index, [v.id]);
                                }}
                            />
                        </TableCell>

                        <TableCell width={120} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 5,
                            textAlign: "right",
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            {Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '기본판매가' : `${Math.ceil((v.price / props.item.price - 1) * 100)}%`}
                        </TableCell>

                        <TableCell width={120} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            fontSize: 13,
                            padding: 5,
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            <Input
                                id={`product_row_detail_price_${x.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                value={v.price}
                                onChange={(e: any) => {
                                    const input = e.target.value

                                    if (!input) {
                                        return;
                                    }

                                    const price = parseInt(input);

                                    if (isNaN(price)) {
                                        alert("옵션판매가는 숫자만 입력 가능합니다.");

                                        return;
                                    }

                                    product.setProductOption(common, { ...v, price }, props.index, x.index, true);
                                }}
                                onBlur={(e: any) => {
                                    product.updateManyProductOption(props.index, [v.id]);
                                }}
                            />
                        </TableCell>

                        <TableCell width={120} style={{
                            background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? '#ffffcc' : 'unset',
                            color: v.isActive ? 'unset' : 'lightgray',
                            padding: 5,
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                        }}>
                            <Input
                                id={`product_row_detail_stock_${x.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                value={v.stock}
                                onChange={(e: any) => {
                                    const input = e.target.value;

                                    if (!input) {
                                        return;
                                    }

                                    const stock = parseInt(input);

                                    if (isNaN(stock)) {
                                        alert("재고수량은 숫자만 입력 가능합니다.");

                                        return;
                                    }

                                    product.setProductOption(common, { ...v, stock }, props.index, x.index, true);
                                }}
                                onBlur={(e: any) => {
                                    product.updateManyProductOption(props.index, [v.id]);
                                }}
                            />
                        </TableCell>
                    </TableRow>
                </Table>
            </Box>
        </div>;
    };

    return <>
        <Paper variant="outlined" sx={{
            border: "1px solid #d1e8ff",
            mb: 0.5,
        }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            도매가
                        </TableCell>

                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            환율
                        </TableCell>

                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            배대지배송비
                        </TableCell>

                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            마진율
                        </TableCell>

                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            마진율단위
                        </TableCell>

                        <TableCell style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                        </TableCell>

                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            기본판매가
                        </TableCell>

                        <TableCell width={120} style={{
                            background: "#d1e8ff",
                            fontSize: 13,
                            padding: "4.5px",
                            textAlign: "center"
                        }}>
                            유료배송비
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow>
                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            {props.item.activeTaobaoProduct.price.toLocaleString('ko-KR')}{props.item.activeTaobaoProduct.shopName === 'express' ? "원" : "¥"}
                        </TableCell>

                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            <Input
                                id={`product_row_cnyRate_${props.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                disabled={props.item.activeTaobaoProduct.shopName === 'express'}
                                defaultValue={props.item.cnyRate}
                                onBlur={(e: any) => {
                                    product.updateProductOptionPrice(common, {
                                        cnyRate: parseFloat(e.target.value)
                                    }, props.index)
                                }}
                            />
                        </TableCell>

                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            {props.item.activeTaobaoProduct.shopName === 'express' ?
                                <Select sx={{
                                    background: "white",
                                    fontSize: 13,
                                    height: 30,
                                    width: "100%",
                                }} value={props.item.localShippingFee} onChange={(e) => {
                                    product.updateProductOptionPrice(common, {
                                        localShippingFee: parseInt(e.target.value)
                                    }, props.index);
                                }}>
                                    {JSON.parse(props.item.activeTaobaoProduct.originalData).props.map((v: any) => <MenuItem value={v.value}>
                                        ({v.format}) {v.name}
                                    </MenuItem>)}
                                </Select>
                                :
                                <Input
                                    id={`product_row_localShippingFee_${props.index}`}
                                    options={{
                                        textAlign: "right"
                                    }}
                                    defaultValue={props.item.localShippingFee}
                                    onBlur={(e: any) => {
                                        product.updateProductOptionPrice(common, {
                                            localShippingFee: parseInt(e.target.value)
                                        }, props.index)
                                    }}
                                />
                            }
                        </TableCell>

                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            <Input
                                id={`product_row_marginRate_${props.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                defaultValue={props.item.marginRate}
                                onBlur={(e: any) => {
                                    product.updateProductOptionPrice(common, {
                                        marginRate: parseFloat(e.target.value)
                                    }, props.index)
                                }}
                            />
                        </TableCell>

                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            <Select sx={{
                                background: "white",
                                fontSize: 13,
                                height: 30,
                                width: "100%",
                            }}
                                variant='outlined'
                                size='small'
                                defaultValue={`${props.item.marginUnitType}`}
                                onChange={(e) => {
                                    product.updateProductOptionPrice(common, {
                                        marginUnitType: e.target.value
                                    }, props.index)
                                }}
                            >
                                <MenuItem value="PERCENT">
                                    %
                                </MenuItem>

                                <MenuItem value="WON">
                                    원
                                </MenuItem>
                            </Select>
                        </TableCell>

                        <TableCell>

                        </TableCell>

                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            <Input
                                id={`product_row_price_${props.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                disabled={props.item.productOption.length > 0}
                                value={props.item.price}
                                onChange={(e: any) => {
                                    const price = parseInt(e.target.value);

                                    if (isNaN(price)) {
                                        alert("기본판매가는 숫자만 입력 가능합니다.");

                                        return;
                                    }

                                    product.setProductPrice(price, props.index);
                                }}
                                onBlur={(e: any) => {
                                    product.updateProductPrice(props.index);
                                }}
                            />
                        </TableCell>

                        <TableCell style={{
                            fontSize: 13,
                            padding: 5,
                            textAlign: "center"
                        }}>
                            <Input
                                id={`product_row_shippingFee_${props.index}`}
                                options={{
                                    textAlign: "right"
                                }}
                                defaultValue={props.item.shippingFee}
                                onBlur={(e: any) => {
                                    const shippingFee = parseInt(e.target.value);

                                    if (isNaN(shippingFee)) {
                                        alert("유료배송비는 숫자만 입력 가능합니다.");

                                        return;
                                    }

                                    product.updateProductOptionPrice(common, {
                                        shippingFee
                                    }, props.index)
                                }}
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>

        {props.item.productOption.length > 0 ?
            <Paper className={props.item.optionPriceError ? classes.errorPaper : classes.defaultPaper} variant="outlined">
                <Box className={props.item.optionPriceError ? classes.errorBox : classes.defaultBox} sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 13,
                    px: 1,
                    py: 0.5
                }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        옵션세부정보 ({props.item.productOption.filter((v: any) => v.isActive).length})

                        {props.item.optionPriceError ?
                            <>
                                <ErrorIcon color="error" sx={{
                                    fontSize: 18,
                                    mx: 0.5
                                }} />

                                <Box sx={{
                                    position: "relative"
                                }}>
                                    <Paper sx={{
                                        top: 0,
                                        color: "red",

                                        p: 1,
                                        position: "absolute",

                                        left: 0,
                                        textAlign: "left",

                                        width: 200,

                                        zIndex: 100
                                    }}>
                                        기본판매가와 동일한 옵션을 하나 이상 설정해주세요.
                                    </Paper>
                                </Box>
                            </>
                            :
                            null
                        }
                    </Box>

                    <Box sx={{
                        alignItems: "center",
                        justifyContent: "right",
                        display: "flex",
                    }}>
                        <Button disableElevation variant="contained" color="info" sx={{
                            fontSize: 13,
                            height: 26,
                        }} onClick={() => {
                            const input = prompt("기본판매가대비 최대 허용치를 설정해주세요. (%)");
                            const active = input ? parseInt(input) : null;

                            if (!active || isNaN(active)) {
                                return;
                            }

                            product.calcProductOptionPrice(active, 'setActive', props.index, null, null);
                        }}>
                            옵션가 범위설정
                        </Button>

                        <Button disableElevation variant="contained" color="info" sx={{
                            fontSize: 13,
                            height: 26,
                            ml: 0.5
                        }} onClick={(e) => {
                            product.setAddOptionPricePopOver({
                                ...product.popOverInfo.addOptionPrice,

                                index: props.index,
                                element: e.target,
                                open: true
                            });
                        }}>
                            판매가 일괄인상
                        </Button>

                        <Button disableElevation variant="contained" color="info" sx={{
                            fontSize: 13,
                            height: 26,
                            ml: 0.5
                        }} onClick={(e) => {
                            product.setSubtractOptionPricePopOver({
                                ...product.popOverInfo.subtractOptionPrice,

                                index: props.index,
                                element: e.target,
                                open: true
                            });
                        }}>
                            판매가 일괄인하
                        </Button>

                        <Button disableElevation variant="contained" color="info" sx={{
                            fontSize: 13,
                            height: 26,
                            ml: 0.5
                        }} onClick={(e) => {
                            product.setOptionPricePopOver({
                                ...product.popOverInfo.setOptionPrice,

                                index: props.index,
                                element: e.target,
                                open: true
                            });
                        }}>
                            판매가 일괄설정
                        </Button>

                        <Button disableElevation variant="contained" color="info" sx={{
                            fontSize: 13,
                            height: 26,
                            ml: 0.5
                        }} onClick={(e) => {
                            product.setOptionStockPopOver({
                                ...product.popOverInfo.setOptionStock,

                                index: props.index,
                                element: e.target,
                                open: true
                            });
                        }}>
                            재고수량 일괄설정
                        </Button>
                    </Box>
                </Box>

                <Table stickyHeader>
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
                                onChange={(e) => {
                                    product.toggleProductOption(e.target.checked, props.index);
                                }}
                            />
                        </TableCell>

                        <TableCell width={51} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            이미지
                        </TableCell>

                        <TableCell style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            옵션명
                        </TableCell>

                        <TableCell width={131} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            등록불가마켓
                        </TableCell>

                        <TableCell width={131} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            도매가
                        </TableCell>

                        <TableCell width={131} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            배대지배송비
                        </TableCell>

                        <TableCell width={131} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            기본판매가대비
                        </TableCell>

                        <TableCell width={131} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            옵션판매가
                        </TableCell>

                        <TableCell width={131} style={{
                            background: "whitesmoke",
                            fontSize: 13,
                            padding: 0,
                            textAlign: "center"
                        }}>
                            재고수량
                        </TableCell>
                    </TableRow>
                </Table>

                <div style={{
                    height: 268,
                }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={props.item.productOption.length}
                                rowRenderer={rowRenderer}
                                rowHeight={42}
                            />
                        )}
                    </AutoSizer>
                </div>
            </Paper>
            :
            null
        }
    </>
})