import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import { styled, Box, Chip, Grid, IconButton, TableCell, TableRow, Typography, Checkbox } from '@mui/material';
import { Input, MyButton } from '../../Common/UI';
import { getStoreUrl } from '../../../Tools/Common';

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  padding: 0,
  fontSize: 13,
});

export const OrderSummary = observer((props: any) => {
  const { common, order } = React.useContext(AppContext);

  return (
    <>
      <TableRow hover>
        <StyledTableCell width={50}>
          <Checkbox
            size="small"
            checked={props.item.checked}
            onChange={(e) => {
              order.toggleItemChecked(props.index, e.target.checked);
            }}
          />
        </StyledTableCell>

        <StyledTableCell>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 40,
              }}
            >
              <Grid container spacing={0.5}>
                <Grid
                  item
                  xs={6}
                  md={1.8}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        const url = getStoreUrl(common, props.item.marketCode, props.item.productId);

                        window.open(url);
                      }}
                    >
                      {props.item.marketCode === 'A077' ? (
                        <img src="/resources/icon-smartstore.png" />
                      ) : props.item.marketCode === 'B378' ? (
                        <img src="/resources/icon-coupang.png" />
                      ) : props.item.marketCode === 'A112' ? (
                        <img src="/resources/icon-street-global.png" />
                      ) : props.item.marketCode === 'A113' ? (
                        <img src="/resources/icon-street-normal.png" />
                      ) : props.item.marketCode === 'A006' ? (
                        <img src="/resources/icon-gmarket.png" />
                      ) : props.item.marketCode === 'A001' ? (
                        <img src="/resources/icon-auction.png" />
                      ) : props.item.marketCode === 'A027' ? (
                        <img src="/resources/icon-interpark.png" />
                      ) : props.item.marketCode === 'B719' ? (
                        <img src="/resources/icon-wemakeprice.png" />
                      ) : props.item.marketCode === 'A524' ? (
                        <img src="/resources/icon-lotteon-global.png" />
                      ) : props.item.marketCode === 'A525' ? (
                        <img src="/resources/icon-lotteon-normal.png" />
                      ) : props.item.marketCode === 'B956' ? (
                        <img src="/resources/icon-tmon.png" />
                      ) : null}
                    </IconButton>

                    <Typography
                      noWrap
                      fontSize={13}
                      sx={{
                        color: '#1565c0',
                      }}
                    >
                      {props.item.productName}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1.2}
                  sx={{
                    m: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <Input readOnly value={props.item.productOptionContents} />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  {props.item.product ? (
                    <IconButton
                      onClick={() => {
                        window.open(props.item.product.activeTaobaoProduct.url);
                      }}
                    >
                      {props.item.product.activeTaobaoProduct.shopName === 'taobao' ? (
                        <img src="/resources/icon-taobao.png" />
                      ) : props.item.product.activeTaobaoProduct.shopName === 'tmall' ? (
                        <img src="/resources/icon-tmall.png" />
                      ) : props.item.product.activeTaobaoProduct.shopName === 'express' ? (
                        <img src="/resources/icon-express.png" />
                      ) : props.item.product.activeTaobaoProduct.shopName === 'alibaba' ? (
                        <img src="/resources/icon-1688.png" />
                      ) : props.item.product.activeTaobaoProduct.shopName === 'vvic' ? (
                        <img src="/resources/icon-vvic.png" />
                      ) : null}
                    </IconButton>
                  ) : (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                      }}
                    ></Box>
                  )}
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1.8}
                  sx={{
                    margin: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <Grid container spacing={0.5}>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Typography noWrap fontSize={11}>
                        {props.item.orderMemberName}
                      </Typography>

                      <Typography noWrap fontSize={11}>
                        {props.item.orderMemberTelNo}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Typography noWrap fontSize={11}>
                        {props.item.receiverName}
                      </Typography>

                      <Typography noWrap fontSize={11}>
                        {props.item.receiverTelNo1}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={2.4}
                  sx={{
                    margin: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <Grid container spacing={0.5}>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Input readOnly value={props.item.receiverZipCode} />
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Input readOnly value={props.item.receiverIntegratedAddress} />
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={3}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Input readOnly value={props.item.productOrderMemo} />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1.4}
                  sx={{
                    m: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {props.item.icucResult?.code === 0 ? (
                      <>
                        <ErrorIcon
                          color="error"
                          sx={{
                            mx: 1,
                            fontSize: 19,
                          }}
                        />

                        <Typography
                          noWrap
                          fontSize={13}
                          sx={{
                            color: '#d32f2f',
                          }}
                        >
                          {props.item.icucResult?.message}
                        </Typography>
                      </>
                    ) : props.item.icucResult?.code === 1 ? (
                      <>
                        <CheckCircleIcon
                          color="success"
                          sx={{
                            mx: 1,
                            fontSize: 19,
                          }}
                        />

                        <Typography
                          noWrap
                          fontSize={13}
                          sx={{
                            color: '#2e7d32',
                          }}
                        >
                          {props.item.icucResult?.message}
                        </Typography>
                      </>
                    ) : props.item.icucResult?.code === 2 ? (
                      <>
                        <WarningIcon
                          color="warning"
                          sx={{
                            mx: 1,
                            fontSize: 19,
                          }}
                        />

                        <Typography
                          noWrap
                          fontSize={13}
                          sx={{
                            color: '#ed6c02',
                          }}
                        >
                          {props.item.icucResult?.message}
                        </Typography>
                      </>
                    ) : null}
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <Chip
                    label={
                      <Typography
                        sx={{
                          fontSize: 11,
                        }}
                      >
                        X{props.item.orderQuantity}
                      </Typography>
                    }
                    size="small"
                    color={props.item.orderQuantity > 1 ? 'error' : 'default'}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    noWrap
                    fontSize={13}
                    sx={{
                      color: '#1565c0',
                    }}
                  >
                    {parseInt(props.item.productPayAmt).toLocaleString('ko-KR')}원
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    noWrap
                    fontSize={13}
                    sx={{
                      color: '#d32f2f',
                    }}
                  >
                    {isNaN(props.item.deliveryFeeAmt)
                      ? ''
                      : props.item.deliveryFeeAmt === 0
                      ? '무료'
                      : `${props.item.deliveryFeeAmt.toLocaleString('ko-KR')}원`}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'right',
                      mr: 1,
                    }}
                  >
                    <MyButton
                      disableElevation
                      variant="contained"
                      color="info"
                      sx={{
                        minWidth: 60,
                      }}
                      onClick={() => {
                        order.toggleOrderDetailModal(true, props.index);
                      }}
                    >
                      상세정보
                    </MyButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </StyledTableCell>
      </TableRow>
    </>
  );
});
