import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';

import { observer } from "mobx-react";
import { Header } from "../../Common/Header";
import { ProductTables } from "../Components/ProductTables";
import { UploadModal } from '../../Modals/UploadModal';
import { UploadFailedModal } from '../../Modals/UploadFailedModal';
import { AppContext } from "../../../../containers/AppContext";
import { ManyCategoryModal } from '../../Modals/ManyCategoryModal';
import { ManyNameModal } from '../../Modals/ManyNameModal';
import { ManyPriceModal } from '../../Modals/ManyPriceModal';
import { ManyTagModal } from '../../Modals/ManyTagModal';
import { SearchFilterModal } from '../../Modals/SearchFilterModal';
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, CircularProgress, Container, IconButton, MenuItem, Pagination, Paper, Select, Typography } from '@mui/material';
import { DescriptionModal } from '../../Modals/DescriptionModal';
import { ImagePopOver } from '../../PopOver/ImagePopOver';
import { AddOptionNamePopOver } from '../../PopOver/AddOptionNamePopOver';
import { ReplaceOptionNamePopOver } from '../../PopOver/ReplaceOptionNamePopOver';
import { UploadDisabledModal } from '../../Modals/UploadDisabledModal';
import { AddOptionPricePopOver } from '../../PopOver/AddOptionPricePopOver';
import { SubtractOptionPricePopOver } from '../../PopOver/SubtractOptionPricePopOver';
import { SetOptionPricePopOver } from '../../PopOver/SetOptionPricePopOver';
import { SetOptionStockPopOver } from '../../PopOver/SetOptionStockPopOver';
import { ManyFeeModal } from '../../Modals/ManyFeeModal';
import { Input } from '../../Common/UI';

const title = {
  alignItems: "center",
  background: "#d1e8ff",
  display: "flex",
  fontSize: 16,
  justifyContent: "space-between",
  px: 1,
  height: 40
};

export const Registered = observer(() => {
  const { common, product } = React.useContext(AppContext);

  React.useEffect(() => {
    product.getTagDict();

    product.setState(7);
    product.setSearchWhereAndInput([{ state: { equals: product.state } }]);

    product.refreshProduct();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case "refresh": {
          product.refreshProduct();
          sendResponse(true);

          break;
        }

        case "trangers": {
          product.updateImageTranslatedData(request.source);
          sendResponse(true);

          break;
        }

        default: break;
      }
    });
  }, []);

  return (
    <>
      <Header />

      <Container maxWidth={'xl'}>
        {product.registeredInfo.wait.length > 0 ?
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
                <CircularProgress size="1.5rem" />

                <Typography sx={{
                  ml: 1
                }}>
                  등록중 ({product.registeredInfo.wait.length})
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {product.registeredInfo.wait.map((v: any) => <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 0
              }}>
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 0
                }}>
                  <IconButton sx={{
                    mr: 1
                  }}
                    size="small"
                  >
                    {v.site_code === 'A077' ?
                      <img src="/resources/icon-smartstore.png" />
                      :
                      v.site_code === 'B378' ?
                        <img src="/resources/icon-coupang.png" />
                        :
                        v.site_code === 'A112' ?
                          <img src="/resources/icon-street-global.png" />
                          :
                          v.site_code === 'A113' ?
                            <img src="/resources/icon-street-normal.png" />
                            :
                            v.site_code === 'A006' ?
                              <img src="/resources/icon-gmarket.png" />
                              :
                              v.site_code === 'A001' ?
                                <img src="/resources/icon-auction.png" />
                                :
                                v.site_code === 'A027' ?
                                  <img src="/resources/icon-interpark.png" />
                                  :
                                  v.site_code === 'B719' ?
                                    <img src="/resources/icon-wemakeprice.png" />
                                    :
                                    v.site_code === 'A524' ?
                                      <img src="/resources/icon-lotteon-global.png" />
                                      :
                                      v.site_code === 'A525' ?
                                        <img src="/resources/icon-lotteon-normal.png" />
                                        :
                                        v.site_code === 'B956' ?
                                          <img src="/resources/icon-tmon.png" />
                                          :
                                          null
                    }
                  </IconButton>

                  <img src={v.img1} width={24} height={24} onClick={() => {
                    window.open(v.img1);
                  }} />

                  <Typography noWrap sx={{
                    ml: 1,
                    width: 600,
                    fontSize: 14
                  }}>
                    {v.name3}
                  </Typography>
                </Box>
              </Box>)}
            </AccordionDetails>
          </Accordion>
          :
          null
        }

        {product.registeredInfo.success.length > 0 ?
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center"
              }}>
                <img src={chrome.runtime.getURL('/resources/icon-success.png')} width={24} height={24} />

                <Typography sx={{
                  ml: 1
                }}>
                  등록완료 ({product.registeredInfo.success.length})
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {product.registeredInfo.success.map((v: any) => <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 0
              }}>
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 0
                }}>
                  <IconButton sx={{
                    mr: 1
                  }}
                    size="small"
                    onClick={() => {
                      switch (v.site_code) {
                        case "A077": {
                          window.open(`${common.user.userInfo.naverStoreUrl}/products/${v.error}`);

                          break;
                        }

                        case "B378": {
                          break;
                        }

                        case "A112": {
                          window.open(`https://www.11st.co.kr/products/${v.error}`);

                          break;
                        }

                        case "A113": {
                          window.open(`https://www.11st.co.kr/products/${v.error}`);

                          break;
                        }

                        case "A006": {
                          window.open(`http://item.gmarket.co.kr/Item?goodscode=${v.error}`);

                          break;
                        }

                        case "A001": {
                          window.open(`http://itempage3.auction.co.kr/DetailView.aspx?ItemNo=${v.error}&frm3=V2`);

                          break;
                        }

                        case "A027": {
                          window.open(`https://shopping.interpark.com/product/productInfo.do?prdNo=${v.error}`);

                          break;
                        }

                        case "B719": {
                          window.open(`https://front.wemakeprice.com/product/${v.error}`);

                          break;
                        }

                        case "A524": {
                          window.open(`https://www.lotteon.com/p/product/${v.error}`);

                          break;
                        }

                        case "A525": {
                          window.open(`https://www.lotteon.com/p/product/${v.error}`);

                          break;
                        }

                        case "B956": {
                          window.open(`https://www.tmon.co.kr/deal/${v.error}`);

                          break;
                        }

                        default: break;
                      }
                    }}
                  >
                    {v.site_code === 'A077' ?
                      <img src="/resources/icon-smartstore.png" />
                      :
                      v.site_code === 'B378' ?
                        <img src="/resources/icon-coupang.png" />
                        :
                        v.site_code === 'A112' ?
                          <img src="/resources/icon-street-global.png" />
                          :
                          v.site_code === 'A113' ?
                            <img src="/resources/icon-street-normal.png" />
                            :
                            v.site_code === 'A006' ?
                              <img src="/resources/icon-gmarket.png" />
                              :
                              v.site_code === 'A001' ?
                                <img src="/resources/icon-auction.png" />
                                :
                                v.site_code === 'A027' ?
                                  <img src="/resources/icon-interpark.png" />
                                  :
                                  v.site_code === 'B719' ?
                                    <img src="/resources/icon-wemakeprice.png" />
                                    :
                                    v.site_code === 'A524' ?
                                      <img src="/resources/icon-lotteon-global.png" />
                                      :
                                      v.site_code === 'A525' ?
                                        <img src="/resources/icon-lotteon-normal.png" />
                                        :
                                        v.site_code === 'B956' ?
                                          <img src="/resources/icon-tmon.png" />
                                          :
                                          null
                    }
                  </IconButton>

                  <img src={v.img1} width={24} height={24} onClick={() => {
                    window.open(v.img1);
                  }} />

                  <Typography noWrap sx={{
                    ml: 1,
                    width: 600,
                    fontSize: 14
                  }}>
                    {v.name3}
                  </Typography>
                </Box>

                <Typography noWrap sx={{
                  ml: 1,
                  width: 600,
                  textAlign: "right",
                  fontSize: 14
                }}>
                  상품이 등록되었습니다. ({v.code})
                </Typography>
              </Box>)}
            </AccordionDetails>
          </Accordion>
          :
          null
        }

        {product.registeredInfo.failed.length > 0 ?
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
                <img src={chrome.runtime.getURL('/resources/icon-failed.png')} width={24} height={24} />

                <Typography sx={{
                  ml: 1
                }}>
                  등록실패 ({product.registeredInfo.failed.length})
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {product.registeredInfo.failed.map((v: any) => <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 0
              }}>
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 0
                }}>
                  <IconButton sx={{
                    mr: 1
                  }}
                    size="small"
                  >
                    {v.site_code === 'A077' ?
                      <img src="/resources/icon-smartstore.png" />
                      :
                      v.site_code === 'B378' ?
                        <img src="/resources/icon-coupang.png" />
                        :
                        v.site_code === 'A112' ?
                          <img src="/resources/icon-street-global.png" />
                          :
                          v.site_code === 'A113' ?
                            <img src="/resources/icon-street-normal.png" />
                            :
                            v.site_code === 'A006' ?
                              <img src="/resources/icon-gmarket.png" />
                              :
                              v.site_code === 'A001' ?
                                <img src="/resources/icon-auction.png" />
                                :
                                v.site_code === 'A027' ?
                                  <img src="/resources/icon-interpark.png" />
                                  :
                                  v.site_code === 'B719' ?
                                    <img src="/resources/icon-wemakeprice.png" />
                                    :
                                    v.site_code === 'A524' ?
                                      <img src="/resources/icon-lotteon-global.png" />
                                      :
                                      v.site_code === 'A525' ?
                                        <img src="/resources/icon-lotteon-normal.png" />
                                        :
                                        v.site_code === 'B956' ?
                                          <img src="/resources/icon-tmon.png" />
                                          :
                                          null
                    }
                  </IconButton>

                  <img src={v.img1} width={24} height={24} onClick={() => {
                    window.open(v.img1);
                  }} />

                  <Typography noWrap sx={{
                    ml: 1,
                    width: 600,
                    fontSize: 14
                  }}>
                    {v.name3}
                  </Typography>
                </Box>

                <Typography noWrap sx={{
                  ml: 1,
                  width: 600,
                  textAlign: "right",
                  fontSize: 14
                }}>
                  {v.error}
                </Typography>
              </Box>)}
            </AccordionDetails>
          </Accordion>
          :
          null
        }

        <Paper variant="outlined" sx={{
          border: "1px solid #d1e8ff",
          mt: 1
        }}>
          <Box sx={title}>
            등록상품목록 ({product.count})

            <Box sx={{
              alignItems: "center",
              display: "flex"
            }}>
              <Button disableElevation color="info" variant="contained" sx={{
                fontSize: 13,
                width: 110,
                height: 30,
                p: 0
              }} onClick={() => {
                product.itemToExcel();
              }}>
                상품정보저장
              </Button>

              <Select sx={{
                background: "white",
                fontSize: 13,
                width: 110,
                height: 30,
                ml: 0.5,
              }} value={product.etcPageSize ? 0 : product.pageSize} onChange={async (e: any) => {
                let pageSize = 10;

                if (e.target.value === 0) {
                  const input = prompt("페이지 당 조회할 상품 수를 입력해주세요. (최대 1000개까지 입력 가능)");

                  if (!input) {
                    alert("조회할 상품 수 입력이 잘못되었습니다.");

                    return;
                  }

                  pageSize = parseInt(input);

                  if (isNaN(pageSize)) {
                    alert("조회할 상품 수는 숫자만 입력 가능합니다.");

                    return;
                  }

                  if (pageSize < 1) {
                    alert("조회할 상품 수는 1개 이상으로 입력해주세요.");

                    return;
                  }

                  if (pageSize > 1000) {
                    alert("조회할 상품 수는 1000개 이하로 입력해주세요.");

                    return;
                  }

                  product.toggleETCPageSize(true);
                } else {
                  pageSize = e.target.value;

                  product.toggleETCPageSize(false);
                }

                await product.setPageSize(pageSize);
                await product.getProduct(1);
              }}>
                <MenuItem value={10}>
                  10개 보기
                </MenuItem>

                <MenuItem value={20}>
                  20개 보기
                </MenuItem>

                <MenuItem value={50}>
                  50개 보기
                </MenuItem>

                <MenuItem value={100}>
                  100개 보기
                </MenuItem>

                <MenuItem value={200}>
                  200개 보기
                </MenuItem>

                <MenuItem value={500}>
                  500개 보기
                </MenuItem>

                <MenuItem value={1000}>
                  1000개 보기
                </MenuItem>

                <MenuItem>
                  -----------
                </MenuItem>

                {product.etcPageSize ?
                  <MenuItem value={0}>
                    {product.pageSize}개 보기
                  </MenuItem>
                  :
                  <MenuItem value={0}>
                    직접 입력
                  </MenuItem>
                }
              </Select>

              <IconButton
                sx={{
                  ml: 0.5
                }}

                size="small"
                onClick={() => { product.refreshProduct() }}
              >
                <SyncIcon />
              </IconButton>

              <Input
                id="product_page"
                type="number"
                width={50}
                value={product.pageTemp}
                onChange={(e: any) => {
                  product.setPageTemp(e.target.value);
                }}
                onBlur={(e: any) => {
                  const page = parseInt(e.target.value);

                  if (!page || isNaN(page)) {
                    return;
                  }

                  product.setPageTemp(page);
                }}
                onKeyPress={(e: any) => {
                  if (e.key !== 'Enter') {
                    return;
                  }

                  const page = parseInt(e.target.value);

                  if (!page || isNaN(page)) {
                    return;
                  }

                  product.setPageTemp(page);
                  product.getProduct(product.pageTemp);
                }}
              />

              <IconButton sx={{
                ml: 0.5
              }} size="small" onClick={() => {
                product.getProduct(product.pageTemp);
              }}>
                <SearchIcon />
              </IconButton>

              <Pagination size="small" count={product.pages} page={product.page} color="primary" shape="rounded" onChange={(e, p) => {
                product.setPageTemp(p);
                product.getProduct(p);
              }} />
            </Box>
          </Box>

          <ProductTables />
        </Paper>
      </Container >

      <AddOptionNamePopOver />
      <AddOptionPricePopOver />

      <ImagePopOver />

      <ReplaceOptionNamePopOver />

      <SubtractOptionPricePopOver />
      <SetOptionPricePopOver />
      <SetOptionStockPopOver />

      <DescriptionModal />

      <ManyPriceModal />
      <ManyFeeModal />
      <ManyCategoryModal />
      <ManyNameModal />
      <ManyTagModal />

      <SearchFilterModal />

      <UploadModal />
      <UploadDisabledModal />
      <UploadFailedModal />
    </>
  )
})

