import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { styled, Box, Button, Checkbox, CircularProgress, Divider, Grid, MenuItem, Select, Table, TableHead, TableBody, TableRow, TableCell, Toolbar, Typography } from "@mui/material";
import { List, AutoSizer } from "react-virtualized";
import { Input, MyButton } from "../../Common/UI";
import { Summary } from './Summary';
import { Details } from './Details/Details';

import '../../Common/Styles.css';

const StyledTableCell = styled(TableCell)({
  background: "white",
  textAlign: "center",
  padding: 0,
  fontSize: 14,
});

export const ProductTables = observer(() => {
  const { common, product } = React.useContext(AppContext);

  const tableRef = React.useRef();

  const rowRenderer = (props) => {
    const item = product.itemInfo.items[props.index];

    return <div key={props.key} style={props.style}>
      <Box>
        <Table>
          <Summary tableRef={tableRef} item={item} index={props.index} />
          <Details item={item} index={props.index} />
        </Table>
      </Box>
    </div>;
  };

  return (
    <>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell width={50}>
              <Checkbox size="small" checked={product.itemInfo.checkedAll} onChange={(e) => product.toggleItemCheckedAll(e.target.checked)} />
            </StyledTableCell>

            <StyledTableCell colSpan={3}>
              <Toolbar disableGutters style={{
                minHeight: 50
              }}>
                <Grid container spacing={0.5}>
                  <Grid item xs={6} md={5} sx={{
                    margin: "auto"
                  }}>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <Button disableElevation
                        sx={{
                          minWidth: 100,
                          height: 30
                        }}
                        size="small"
                        variant="contained"
                        color="info"
                        startIcon={<FilterAltIcon />}
                        onClick={() => {
                          product.toggleSearchFilterModal(true)
                        }}
                      >
                        검색필터
                      </Button>

                      <Select
                        sx={{
                          background: "white",
                          fontSize: 13,
                          height: 30,
                          minWidth: 100,
                          mx: 0.5,
                        }}
                        defaultValue={product.searchInfo.searchType}
                        onChange={(e: any) => {
                          product.setSearchInfo({
                            ...product.searchInfo,

                            searchType: e.target.value
                          });
                        }}
                      >
                        {/* <MenuItem value="ALL">
                        통합검색
                      </MenuItem> */}

                        <MenuItem value="PCODE">
                          상품코드
                        </MenuItem>

                        <MenuItem value="ONAME">
                          상품명(원문)
                        </MenuItem>

                        <MenuItem value="NAME">
                          상품명(번역)
                        </MenuItem>

                        <MenuItem value="CNAME">
                          카테고리명
                        </MenuItem>

                        <MenuItem value="OID">
                          구매처상품번호
                        </MenuItem>

                        <MenuItem value="MID">
                          판매채널상품번호
                        </MenuItem>
                      </Select>

                      <Input
                        id="product_tables_keyword"
                        onChange={(e: any) => {
                          product.setSearchInfo({
                            ...product.searchInfo,

                            searchKeyword: e.target.value
                          });
                        }}
                        onKeyPress={(e: any) => {
                          if (e.key !== 'Enter') {
                            return;
                          }

                          product.getSearchResult();
                        }}
                      />

                      <MyButton disableElevation variant="contained" color="info" sx={{
                        minWidth: 60,
                        ml: 0.5
                      }} onClick={() => { product.getSearchResult(); }}>
                        검색
                      </MyButton>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={7} sx={{
                    margin: "auto"
                  }}>
                    <Box sx={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "right",
                      mr: 1
                    }}>
                      <Typography fontSize={13}>
                        일괄설정
                      </Typography>

                      <Divider sx={{ height: 28, mr: 1, ml: 1 }} orientation="vertical" />

                      <MyButton disableElevation variant="contained" color="secondary" sx={{
                        minWidth: 60,
                      }} onClick={() => { product.toggleManyPriceModal(true) }}>
                        판매가격
                      </MyButton>

                      <MyButton disableElevation variant="contained" color="secondary" sx={{
                        ml: 0.5,
                        minWidth: 60,
                      }} onClick={() => { product.toggleManyFeeModal(true) }}>
                        수수료
                      </MyButton>

                      <MyButton disableElevation variant="contained" color="secondary" sx={{
                        ml: 0.5,
                        minWidth: 60,
                      }} onClick={() => { product.toggleManyCategoryModal(true) }}>
                        카테고리
                      </MyButton>

                      <MyButton disableElevation variant="contained" color="secondary" sx={{
                        ml: 0.5,
                        minWidth: 60,
                      }} onClick={() => { product.toggleManyNameModal(true) }}>
                        상품명
                      </MyButton>

                      <MyButton disableElevation variant="contained" color="secondary" sx={{
                        ml: 0.5,
                        minWidth: 60,
                      }} onClick={async () => {
                        product.toggleManyTagModal(true);
                      }}>
                        검색태그
                      </MyButton>

                      {product.state === 7 ?
                        <MyButton disableElevation variant="contained" color="secondary" sx={{
                          ml: 0.5,
                          minWidth: 60,
                        }} onClick={() => {
                          common.setEditedUpload(true);

                          product.toggleUploadModal(-1, true)
                        }}>
                          일괄수정
                        </MyButton>
                        :
                        null
                      }

                      <MyButton disableElevation variant="contained" color="secondary" sx={{
                        ml: 0.5,
                        minWidth: 60,
                      }} onClick={() => {
                        common.setEditedUpload(false);

                        product.toggleUploadModal(-1, true)
                      }}>
                        일괄등록
                      </MyButton>

                      {product.state === 7 ?
                        <MyButton disableElevation variant="contained" color="error" sx={{
                          ml: 0.5,
                          minWidth: 60,
                        }} onClick={() => {
                          product.toggleUploadDisabledModal(-1, true, common)
                        }}>
                          일괄해제
                        </MyButton>
                        :
                        <MyButton disableElevation variant="contained" color="error" sx={{
                          ml: 0.5,
                          minWidth: 60,
                        }} onClick={() => {
                          product.deleteProduct(-1);
                        }}>
                          일괄삭제
                        </MyButton>
                      }
                    </Box>
                  </Grid>
                </Grid>
              </Toolbar>
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {product.itemInfo.items.length > 0 ?
            <TableRow>
              <StyledTableCell colSpan={3}>
                <div style={{
                  height: 770,
                }}>
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        width={width}
                        height={height}
                        rowCount={product.itemInfo.items.length}
                        rowRenderer={rowRenderer}
                        rowHeight={({ index }) => product.itemInfo.items[index].collapse ? 577 : 83}
                        ref={tableRef}
                      />
                    )}
                  </AutoSizer>
                </div>
              </StyledTableCell>
            </TableRow>
            :
            <TableRow>
              <StyledTableCell colSpan={3}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3
                }}>
                  {product.itemInfo.loading ?
                    <>
                      <CircularProgress disableShrink size="1.5rem" />

                      <Typography sx={{
                        ml: 1
                      }} fontSize={16}>
                        상품정보를 가져오는 중입니다...
                      </Typography>
                    </>
                    :
                    <Typography fontSize={16}>
                      상품이 존재하지 않습니다.
                    </Typography>
                  }
                </Box>
              </StyledTableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </>
  );
})
export default ProductTables;
