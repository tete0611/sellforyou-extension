import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import {
  styled,
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { List, AutoSizer } from 'react-virtualized';
import { MyButton } from '../../Common/UI';
import { DeliverySummary } from './DeliverySummary';

import '../../Common/Styles.css';

const StyledTableCell = styled(TableCell)({
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  textAlign: 'center',
  padding: 0,
  fontSize: 14,
});

export const DeliveryTable = observer(() => {
  const { common, delivery } = React.useContext(AppContext);

  const tableRef = React.useRef();

  const rowRenderer = (props) => {
    const item = delivery.orderInfo.ordersFiltered[props.index];

    return (
      <div key={props.key} style={props.style}>
        <Box>
          <Table>
            <DeliverySummary item={item} index={props.index} />
          </Table>
        </Box>
      </div>
    );
  };

  return (
    <>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell width={50}>
              <Checkbox
                size="small"
                checked={delivery.orderInfo.checkedAll}
                onChange={(e) => delivery.toggleItemCheckedAll(e.target.checked)}
              />
            </StyledTableCell>

            <StyledTableCell colSpan={2}>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 1,
                  minHeight: 50,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'left',
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
                      if (common.user.purchaseInfo2.level < 4) {
                        alert('[프리미엄] 등급부터 사용 가능한 기능입니다.');

                        return;
                      }

                      delivery.getExternalOrders();
                    }}
                  >
                    주문조회
                  </MyButton>

                  <MyButton
                    disableElevation
                    variant="contained"
                    color="info"
                    sx={{
                      ml: 0.5,
                      minWidth: 60,
                    }}
                    onClick={() => {
                      if (common.user.purchaseInfo2.level < 4) {
                        alert('[프리미엄] 등급부터 사용 가능한 기능입니다.');

                        return;
                      }

                      delivery.connectOrderInfo(-1, common);
                    }}
                  >
                    주문연동
                  </MyButton>

                  <MyButton
                    disableElevation
                    variant="contained"
                    color="info"
                    sx={{
                      ml: 0.5,
                      minWidth: 60,
                    }}
                    onClick={() => {
                      if (common.user.purchaseInfo2.level < 4) {
                        alert('[프리미엄] 등급부터 사용 가능한 기능입니다.');

                        return;
                      }

                      delivery.downloadOrderToDeliveryExcel(common);
                    }}
                  >
                    배송출력
                  </MyButton>
                </Box>

                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'right',
                  }}
                >
                  <Typography fontSize={13}>일괄설정</Typography>

                  <Divider sx={{ height: 28, mr: 1, ml: 1 }} orientation="vertical" />

                  {delivery.orderInfo.searchType === 'ORDER_CONNECTED' ||
                  delivery.orderInfo.searchType === 'ORDER_COMPLETED' ? (
                    <MyButton
                      disableElevation
                      variant="contained"
                      color="secondary"
                      sx={{
                        minWidth: 60,
                      }}
                      onClick={() => {
                        if (common.user.purchaseInfo2.level < 4) {
                          alert('[프리미엄] 등급부터 사용 가능한 기능입니다.');

                          return;
                        }

                        delivery.toggleManyDeliveryInfoModal(true);
                      }}
                    >
                      품목분류
                    </MyButton>
                  ) : null}

                  <MyButton
                    disableElevation
                    variant="contained"
                    color="error"
                    sx={{
                      ml: 0.5,
                      minWidth: 60,
                    }}
                    onClick={() => {
                      if (common.user.purchaseInfo2.level < 4) {
                        alert('[프리미엄] 등급부터 사용 가능한 기능입니다.');

                        return;
                      }

                      const accept = confirm('목록을 삭제하시겠습니까?');

                      if (!accept) {
                        return;
                      }

                      delivery.deleteOrder(-1);
                    }}
                  >
                    전체삭제
                  </MyButton>
                </Box>
              </Box>
            </StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell width={50}></StyledTableCell>

            <StyledTableCell width={41}>
              <Box
                sx={{
                  fontSize: 11,
                }}
              >
                이미지
              </Box>
            </StyledTableCell>

            <StyledTableCell>
              <Grid container spacing={0.5}>
                <Grid
                  item
                  xs={6}
                  md={3}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                    }}
                  >
                    구매처 주문정보(상품명/옵션명)
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={3}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                    }}
                  >
                    오픈마켓 주문정보(상품명/옵션명)
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1.6}
                  sx={{
                    margin: 'auto',
                  }}
                ></Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                    }}
                  >
                    단가
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                    }}
                  >
                    수량
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={0.6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                    }}
                  >
                    합계
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1.6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                    }}
                  >
                    품목분류
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={1}
                  sx={{
                    margin: 'auto',
                  }}
                ></Grid>
              </Grid>
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <StyledTableCell colSpan={3}>
              <div
                style={{
                  height: common.innerSize.height - 192,
                }}
              >
                {delivery.orderInfo.initializing ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                      }}
                    >
                      <CircularProgress disableShrink size="1.5rem" />

                      <Typography
                        sx={{
                          ml: 1,
                        }}
                        fontSize={16}
                      >
                        주문정보를 동기화하는 중입니다...
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {delivery.orderInfo.loading ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                          }}
                        >
                          <CircularProgress disableShrink size="1.5rem" />

                          <Typography
                            sx={{
                              ml: 1,
                            }}
                            fontSize={16}
                          >
                            주문정보를 가져오는 중입니다...
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        {delivery.orderInfo.ordersFiltered.length > 0 ? (
                          <AutoSizer>
                            {({ height, width }) => (
                              <List
                                width={width}
                                height={height}
                                rowCount={delivery.orderInfo.ordersFiltered.length}
                                rowRenderer={rowRenderer}
                                rowHeight={42}
                                ref={tableRef}
                              />
                            )}
                          </AutoSizer>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              p: 3,
                            }}
                          >
                            <Typography fontSize={16}>주문이 존재하지 않습니다.</Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
});

export default DeliveryTable;
