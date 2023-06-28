import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { observer } from "mobx-react";
import { AppContext } from "../../../../../containers/AppContext";
import { List, AutoSizer } from "react-virtualized";
import { Box, IconButton, MenuItem, Select, Table, TableHead, TableBody, TableCell, TableRow, Tooltip, Button, Checkbox, Paper } from "@mui/material";
import { ComboBox, Image, Input, Title } from "../../../Common/UI";
import { makeStyles } from "@material-ui/core/styles";

// MUI Box 사용자 지정 스타일
const useStyles = makeStyles((theme) => ({
  defaultBox: {
    background: "#d1e8ff",
  },

  errorBox: {
    background: "#ffd1d1",
  },
}));

// 가격 탭 하위 컴포넌트
export const TabPrice = observer((props: any) => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  // 가격 수정 또는 변경사항 발생 시
  const loading = (
    <div className="inform">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="loading" />
        &nbsp; 가격정보를 저장하는 중입니다...
      </div>
    </div>
  );

  // 가상화 렌더링 요소
  const rowRenderer = (x) => {
    const v = props.item.productOption[x.index];

    return (
      <div key={x.key} style={x.style}>
        <Box>
          <Table>
            <TableRow hover>
              <TableCell
                width={50}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
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

              <TableCell
                width={50}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                {props.item.productOptionName.map((w: any) => {
                  const matched = w.productOptionValue.find(
                    (x: any) =>
                      x.image &&
                      (x.id === v.optionValue1Id ||
                        x.id === v.optionValue2Id ||
                        x.id === v.optionValue3Id ||
                        x.id === v.optionValue4Id ||
                        x.id === v.optionValue5Id)
                  );

                  if (matched) {
                    return (
                      <Image
                        src={matched.image}
                        alt={matched.name}
                        width={30}
                        height={30}
                        style={{
                          objectFit: "contain",
                        }}
                        onClick={(e) => {
                          product.setImagePopOver({
                            element: e.target,
                            data: { src: matched.image },
                            open: true,
                          });
                        }}
                      />
                    );
                  }
                })}
              </TableCell>

              <TableCell
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "left",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                {v.name}
              </TableCell>

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "center",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                {Math.ceil((v.price / props.item.price - 1) * 100) > 300 ? (
                  <Tooltip title={`11번가 글로벌 - [${(props.item.price * 4).toLocaleString("ko-KR")}]원을 초과할 수 없습니다.`}>
                    <IconButton
                      size="small"
                      style={{
                        padding: 0,
                        margin: 1,
                      }}
                    >
                      <img src={"/resources/icon-street-global.png"} />
                    </IconButton>
                  </Tooltip>
                ) : null}

                {Math.ceil((v.price / props.item.price - 1) * 100) > 100 ? (
                  <Tooltip title={`11번가 일반 - [${(props.item.price * 2).toLocaleString("ko-KR")}]원을 초과할 수 없습니다.`}>
                    <IconButton
                      size="small"
                      style={{
                        padding: 0,
                        margin: 1,
                      }}
                    >
                      <img src={"/resources/icon-street-normal.png"} />
                    </IconButton>
                  </Tooltip>
                ) : null}

                {Math.ceil((v.price / props.item.price - 1) * 100) > 50 ? (
                  <Tooltip title={`옥션 - [${(props.item.price * 1.5).toLocaleString("ko-KR")}]원을 초과할 수 없습니다.`}>
                    <IconButton
                      size="small"
                      style={{
                        padding: 0,
                        margin: 1,
                      }}
                    >
                      <img src={"/resources/icon-auction.png"} />
                    </IconButton>
                  </Tooltip>
                ) : null}

                {Math.ceil((v.price / props.item.price - 1) * 100) > 50 ? (
                  <Tooltip title={`지마켓 - [${(props.item.price * 1.5).toLocaleString("ko-KR")}]원을 초과할 수 없습니다.`}>
                    <IconButton
                      size="small"
                      style={{
                        padding: 0,
                        margin: 1,
                      }}
                    >
                      <img src={"/resources/icon-gmarket.png"} />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </TableCell>

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                {v.priceCny.toLocaleString("ko-KR")}
                {props.item.activeTaobaoProduct.shopName === "express"
                  ? "원"
                  : props.item.activeTaobaoProduct.shopName === "amazon-us"
                  ? "$"
                  : props.item.activeTaobaoProduct.shopName === "amazon-de"
                  ? "€"
                  : "¥"}
              </TableCell>

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_detail_defaultShippingFee_${x.index}`}
                  options={{
                    textAlign: "right",
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

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                {Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? "기본판매가" : `${Math.ceil((v.price / props.item.price - 1) * 100)}%`}
              </TableCell>

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_detail_price_${x.index}`}
                  options={{
                    textAlign: "right",
                  }}
                  value={v.price}
                  onChange={(e: any) => {
                    const input = e.target.value;

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

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive ? "unset" : common.darkTheme ? "gray" : "lightgray",
                  padding: "5px",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_detail_stock_${x.index}`}
                  options={{
                    textAlign: "right",
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

              <TableCell
                width={120}
                sx={{
                  background: Math.ceil((v.price / props.item.price - 1) * 100) === 0 ? (common.darkTheme ? "#8d8d8d" : "#ffffcc") : "unset",
                  color: v.isActive
                    ? Math.round(
                        ((v.price - v.priceCny * props.item.cnyRate - v.defaultShippingFee) / (v.priceCny * props.item.cnyRate + v.defaultShippingFee)) * 100
                      ) >= 0
                      ? "info.main"
                      : "error.main"
                    : common.darkTheme
                    ? "gray"
                    : "lightgray",
                  fontSize: 13,
                  padding: "5px",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  textAlign: "right",
                }}
              >
                {Math.floor(v.price - v.priceCny * props.item.cnyRate - v.defaultShippingFee).toLocaleString("ko-KR")}원 (
                {Math.round(
                  ((v.price - v.priceCny * props.item.cnyRate - v.defaultShippingFee) / (v.priceCny * props.item.cnyRate + v.defaultShippingFee)) * 100
                )}
                %)
              </TableCell>
            </TableRow>
          </Table>
        </Box>
      </div>
    );
  };

  return (
    <>
      {props.item.edited.option === 2 || props.item.edited.price === 2 ? loading : null}

      <Paper
        variant="outlined"
        sx={{
          mb: 0.5,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                width={120}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: "4.5px",
                  textAlign: "center",
                }}
              >
                도매가
              </TableCell>

              <TableCell
                width={120}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: "4.5px",
                  textAlign: "center",
                }}
              >
                환율
              </TableCell>

              <TableCell
                width={120}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: "4.5px",
                  textAlign: "center",
                }}
              >
                배대지배송비
              </TableCell>

              <TableCell width={120} style={{ background: common.darkTheme ? "#303030" : "#ebebeb", fontSize: 13, padding: "4.5px", textAlign: "center" }}>
                마진율
              </TableCell>

              <TableCell width={120} style={{ background: common.darkTheme ? "#303030" : "#ebebeb", fontSize: 13, padding: "4.5px", textAlign: "center" }}>
                마진율단위
              </TableCell>

              <TableCell style={{ background: common.darkTheme ? "#303030" : "#ebebeb", fontSize: 13, padding: "4.5px", textAlign: "center" }}></TableCell>

              <TableCell width={120} style={{ background: common.darkTheme ? "#303030" : "#ebebeb", fontSize: 13, padding: "4.5px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  기본판매가 &nbsp;
                  <Tooltip title="판매가 = {(도매가 * 환율) + 배대지배송비} * 마진율">
                    <HelpOutlineIcon
                      color="info"
                      sx={{
                        fontSize: 14,
                      }}
                    />
                  </Tooltip>
                </Box>
              </TableCell>

              <TableCell
                width={120}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: "4.5px",
                  textAlign: "center",
                }}
              >
                유료배송비
              </TableCell>

              <TableCell width={120} style={{ background: common.darkTheme ? "#303030" : "#ebebeb", fontSize: 13, padding: "4.5px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  예상순이익 &nbsp;
                  <Tooltip title="오픈마켓 수수료는 예상순이익 계산에 포함되어 있지 않습니다.">
                    <HelpOutlineIcon
                      color="info"
                      sx={{
                        fontSize: 14,
                      }}
                    />
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  color: common.darkTheme ? "error.light" : "error.dark",
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                {props.item.activeTaobaoProduct.price.toLocaleString("ko-KR")}
                {props.item.activeTaobaoProduct.shopName === "express"
                  ? "원"
                  : props.item.activeTaobaoProduct.shopName === "amazon-us"
                  ? "$"
                  : props.item.activeTaobaoProduct.shopName === "amazon-de"
                  ? "€"
                  : "¥"}
              </TableCell>

              <TableCell
                sx={{
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_cnyRate_${props.index}`}
                  options={{
                    textAlign: "right",
                  }}
                  disabled={props.item.activeTaobaoProduct.shopName === "express"}
                  value={props.item.cnyRate}
                  onChange={(e: any) => {
                    product.setProductOptionPrice(
                      {
                        cnyRate: parseFloat(e.target.value),
                      },
                      props.index
                    );
                  }}
                  onBlur={(e: any) => {
                    product.updateProductOptionPrice(
                      common,
                      {
                        cnyRate: parseFloat(e.target.value),
                      },
                      props.index
                    );
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                {props.item.activeTaobaoProduct.shopName === "express" ? (
                  <ComboBox
                    sx={{
                      width: "100%",
                    }}
                    value={props.item.localShippingFee}
                    onChange={(e) => {
                      product.setProductOptionPrice(
                        {
                          localShippingFee: parseFloat(e.target.value),
                        },
                        props.index
                      );

                      product.updateProductOptionPrice(
                        common,
                        {
                          localShippingFee: parseInt(e.target.value),
                        },
                        props.index
                      );
                    }}
                  >
                    {JSON.parse(props.item.activeTaobaoProduct.originalData).props.map((v: any) => (
                      <MenuItem value={v.value}>
                        ({v.format}) {v.name}
                      </MenuItem>
                    ))}
                  </ComboBox>
                ) : (
                  <Input
                    color={props.item.edited.option ? "warning" : "info"}
                    id={`product_row_localShippingFee_${props.index}`}
                    options={{
                      textAlign: "right",
                    }}
                    value={props.item.localShippingFee}
                    onChange={(e: any) => {
                      product.setProductOptionPrice(
                        {
                          localShippingFee: parseFloat(e.target.value),
                        },
                        props.index
                      );
                    }}
                    onBlur={(e: any) => {
                      product.updateProductOptionPrice(
                        common,
                        {
                          localShippingFee: parseInt(e.target.value),
                        },
                        props.index
                      );
                    }}
                  />
                )}
              </TableCell>

              <TableCell
                sx={{
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_marginRate_${props.index}`}
                  options={{
                    textAlign: "right",
                  }}
                  value={props.item.marginRate}
                  onChange={(e: any) => {
                    product.setProductOptionPrice(
                      {
                        marginRate: parseFloat(e.target.value),
                      },
                      props.index
                    );
                  }}
                  onBlur={(e: any) => {
                    product.updateProductOptionPrice(
                      common,
                      {
                        marginRate: parseFloat(e.target.value),
                      },
                      props.index
                    );
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                <ComboBox
                  sx={{
                    width: "100%",
                  }}
                  defaultValue={`${props.item.marginUnitType}`}
                  onChange={(e) => {
                    product.setProductOptionPrice(
                      {
                        marginUnitType: parseFloat(e.target.value),
                      },
                      props.index
                    );

                    product.updateProductOptionPrice(
                      common,
                      {
                        marginUnitType: e.target.value,
                      },
                      props.index
                    );
                  }}
                >
                  <MenuItem value="PERCENT">%</MenuItem>
                  <MenuItem value="WON">원</MenuItem>
                </ComboBox>
              </TableCell>

              <TableCell sx={{ fontSize: 13, padding: "5px", textAlign: "right" }}></TableCell>

              <TableCell sx={{ fontSize: 13, padding: "5px", textAlign: "right" }}>
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_price_${props.index}`}
                  options={{
                    textAlign: "right",
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

              <TableCell sx={{ fontSize: 13, padding: "5px", textAlign: "right" }}>
                <Input
                  color={props.item.edited.option ? "warning" : "info"}
                  id={`product_row_shippingFee_${props.index}`}
                  options={{
                    textAlign: "right",
                  }}
                  value={props.item.shippingFee}
                  onChange={(e: any) => {
                    product.setProductOptionPrice(
                      {
                        shippingFee: parseInt(e.target.value),
                      },
                      props.index
                    );
                  }}
                  onBlur={(e: any) => {
                    const shippingFee = parseInt(e.target.value);

                    if (isNaN(shippingFee)) {
                      alert("유료배송비는 숫자만 입력 가능합니다.");

                      return;
                    }

                    product.updateProductOptionPrice(
                      common,
                      {
                        shippingFee,
                      },
                      props.index
                    );
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  color:
                    Math.round(
                      ((props.item.price - props.item.activeTaobaoProduct.price * props.item.cnyRate - props.item.localShippingFee) /
                        (props.item.activeTaobaoProduct.price * props.item.cnyRate + props.item.localShippingFee)) *
                        100
                    ) >= 0
                      ? "info.main"
                      : "error.main",
                  fontSize: 13,
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                {Math.floor(props.item.price - props.item.activeTaobaoProduct.price * props.item.cnyRate - props.item.localShippingFee).toLocaleString("ko-KR")}
                원 (
                {Math.round(
                  ((props.item.price - props.item.activeTaobaoProduct.price * props.item.cnyRate - props.item.localShippingFee) /
                    (props.item.activeTaobaoProduct.price * props.item.cnyRate + props.item.localShippingFee)) *
                    100
                )}
                %)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {props.item.productOption.length > 0 ? (
        <Paper variant="outlined">
          <Title subTitle dark={common.darkTheme} error={props.item.optionPriceError}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              옵션세부정보 ({props.item.productOption.filter((v: any) => v.isActive).length}) &nbsp;
              {props.item.optionPriceError ? (
                <>
                  <Paper
                    sx={{
                      color: common.darkTheme ? "error.light" : "error.main",

                      display: "flex",
                      alignItems: "center",

                      p: 0.5,

                      textAlign: "left",
                    }}
                  >
                    <ErrorIcon
                      color="error"
                      sx={{
                        fontSize: 18,
                        mx: 0.5,
                      }}
                    />
                    &nbsp; 기본판매가와 옵션최저가가 다릅니다.
                  </Paper>
                </>
              ) : null}
            </Box>

            <Box
              sx={{
                alignItems: "center",
                justifyContent: "right",
                display: "flex",
              }}
            >
              <Button
                disableElevation
                variant="contained"
                color="info"
                sx={{
                  fontSize: 13,
                  height: 26,
                }}
                onClick={() => {
                  const input = prompt("기본판매가대비 최대 허용치를 설정해주세요. (%)");
                  const active = input ? parseInt(input) : null;

                  if (!active || isNaN(active)) {
                    return;
                  }

                  product.calcProductOptionPrice(active, "setActive", props.index, null, null);
                }}
              >
                옵션가 범위설정
              </Button>

              <Button
                disableElevation
                variant="contained"
                color="info"
                sx={{
                  fontSize: 13,
                  height: 26,
                  ml: 0.5,
                }}
                onClick={(e) => {
                  product.setAddOptionPricePopOver({
                    ...product.popOverInfo.addOptionPrice,

                    index: props.index,
                    element: e.target,
                    open: true,
                  });
                }}
              >
                판매가 일괄인상
              </Button>

              <Button
                disableElevation
                variant="contained"
                color="info"
                sx={{
                  fontSize: 13,
                  height: 26,
                  ml: 0.5,
                }}
                onClick={(e) => {
                  product.setSubtractOptionPricePopOver({
                    ...product.popOverInfo.subtractOptionPrice,

                    index: props.index,
                    element: e.target,
                    open: true,
                  });
                }}
              >
                판매가 일괄인하
              </Button>

              <Button
                disableElevation
                variant="contained"
                color="info"
                sx={{
                  fontSize: 13,
                  height: 26,
                  ml: 0.5,
                }}
                onClick={(e) => {
                  product.setOptionPricePopOver({
                    ...product.popOverInfo.setOptionPrice,

                    index: props.index,
                    element: e.target,
                    open: true,
                  });
                }}
              >
                판매가 일괄설정
              </Button>

              <Button
                disableElevation
                variant="contained"
                color="info"
                sx={{
                  fontSize: 13,
                  height: 26,
                  ml: 0.5,
                }}
                onClick={(e) => {
                  product.setOptionStockPopOver({
                    ...product.popOverInfo.setOptionStock,

                    index: props.index,
                    element: e.target,
                    open: true,
                  });
                }}
              >
                재고수량 일괄설정
              </Button>
            </Box>
          </Title>

          <Table stickyHeader>
            <TableRow>
              <TableCell
                width={50}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                <Checkbox
                  size="small"
                  color="info"
                  checked={props.item.productOption.every((v) => v.isActive)}
                  onChange={(e) => {
                    product.toggleProductOption(e.target.checked, props.index);
                  }}
                />
              </TableCell>

              <TableCell
                width={51}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                이미지
              </TableCell>

              <TableCell
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                옵션명
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                등록불가마켓
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                도매가
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                배대지배송비
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                기본판매가대비
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                옵션판매가
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                재고수량
              </TableCell>

              <TableCell
                width={131}
                style={{
                  background: common.darkTheme ? "#303030" : "#ebebeb",
                  fontSize: 13,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  예상순이익
                </Box>
              </TableCell>
            </TableRow>
          </Table>

          <div
            style={{
              height: 275,
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List width={width} height={height} rowCount={props.item.productOption.length} rowRenderer={rowRenderer} rowHeight={42} />
              )}
            </AutoSizer>
          </div>
        </Paper>
      ) : null}
    </>
  );
});
