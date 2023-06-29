import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Chip, Grid, Modal, Paper, Typography } from '@mui/material';

// 발주확인된 주문 상세정보 모달
export const DeliveryDetailModal = observer(() => {
  // MobX 스토리지 로드
  const { common, delivery } = React.useContext(AppContext);

  return (
    <Modal
      open={delivery.modalInfo.delivery}
      onClose={() => delivery.toggleDeliveryDetailModal(false, delivery.orderInfo.current)}
    >
      <Paper
        className="uploadModal"
        sx={{
          width: 400,
        }}
      >
        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current] ? (
          <>
            <Typography
              fontSize={16}
              sx={{
                mb: 3,
              }}
            >
              상세정보
            </Typography>

            {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].error ? (
              <Paper
                variant="outlined"
                sx={{
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ErrorIcon
                      color="error"
                      sx={{
                        mr: 1,
                        fontSize: 19,
                      }}
                    />

                    <Typography fontSize={12} color="error">
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].error}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ) : delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult ? (
              <>
                <Paper
                  variant="outlined"
                  sx={{
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography fontSize={12}>통관부호 검증결과</Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult?.code === 0 ? (
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
                              fontSize={12}
                              sx={{
                                color: '#d32f2f',
                              }}
                            >
                              {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult?.message}
                            </Typography>
                          </>
                        ) : delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult?.code === 1 ? (
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
                              fontSize={12}
                              sx={{
                                color: '#2e7d32',
                              }}
                            >
                              {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult?.message}
                            </Typography>
                          </>
                        ) : delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult?.code === 2 ? (
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
                              fontSize={12}
                              sx={{
                                color: '#ed6c02',
                              }}
                            >
                              {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].icucResult?.message}
                            </Typography>
                          </>
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </>
            ) : null}

            <Paper
              variant="outlined"
              sx={{
                mb: 1,
              }}
            >
              <Box
                sx={{
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography fontSize={12}>구매처 주문정보</Typography>

                  <Chip
                    label={
                      <Typography fontSize={12}>
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].id}
                      </Typography>
                    }
                    size="small"
                    color="info"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].id)
                        .then(
                          function () {
                            alert('클립보드에 복사되었습니다.');
                          },
                          function () {
                            alert('클립보드에 복사할 수 없습니다.');
                          }
                        );
                    }}
                  />
                </Box>

                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: 'auto',
                    }}
                  >
                    <Typography fontSize={12}>상품명</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      m: 'auto',
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      noWrap
                      fontSize={12}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].productName)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    >
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].productName}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: 'auto',
                    }}
                  >
                    <Typography fontSize={12}>옵션명</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      m: 'auto',
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      noWrap
                      fontSize={12}
                      color="#1565c0"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].optionInfo)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    >
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].optionInfo}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: 'auto',
                    }}
                  >
                    <Typography fontSize={12}>트래킹넘버</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      m: 'auto',
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      noWrap
                      fontSize={12}
                      color="#d32f2f"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].trackingNumber)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    >
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].trackingNumber}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: 'auto',
                    }}
                  >
                    <Typography fontSize={12}>배송메시지</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      m: 'auto',
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      noWrap
                      fontSize={12}
                      color="#1565c0"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryMessage)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    >
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryMessage}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: 'auto',
                    }}
                  >
                    <Typography fontSize={12}>주문일</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      m: 'auto',
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      noWrap
                      fontSize={12}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].dateOrdered)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    >
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].dateOrdered}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: 'auto',
                    }}
                  >
                    <Typography fontSize={12}>결제일</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      m: 'auto',
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      noWrap
                      fontSize={12}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].datePaid)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    >
                      {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].datePaid}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected ? (
              <Paper
                variant="outlined"
                sx={{
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography fontSize={12}>오픈마켓 주문정보</Typography>

                    <Chip
                      label={
                        <Typography fontSize={12}>
                          {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.orderNo}
                        </Typography>
                      }
                      size="small"
                      color="info"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.orderNo)
                          .then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                      }}
                    />
                  </Box>

                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>상품명</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.productName
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.productName}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>옵션명</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        color="#1565c0"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected
                                .productOptionContents
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.productOptionContents}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>구매자</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              `${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.orderMemberName
                              } (${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.orderMemberTelNo
                              })`
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.orderMemberName} (
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.orderMemberTelNo})
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>수취인</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              `${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.receiverName
                              } (${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.receiverTelNo1
                              })`
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.receiverName} (
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.receiverTelNo1})
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>배송주소</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              `(${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.receiverZipCode
                              }) ${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected
                                  .receiverIntegratedAddress
                              }`
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        ({delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.receiverZipCode}){' '}
                        {
                          delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected
                            .receiverIntegratedAddress
                        }
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>배송메시지</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.productOrderMemo
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected.productOrderMemo}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>개인통관고유부호</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        color="#1565c0"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected
                                .individualCustomUniqueCode
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        {
                          delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].connected
                            .individualCustomUniqueCode
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ) : null}

            {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryInfo ? (
              <Paper
                variant="outlined"
                sx={{
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography fontSize={12}>배송대행지 설정정보</Typography>
                  </Box>

                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>배대지</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        color="#1565c0"
                        onClick={() => {
                          navigator.clipboard.writeText(common.user.userInfo.orderToDeliveryName).then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                        }}
                      >
                        {common.user.userInfo.orderToDeliveryName}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>배송등급</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard.writeText(common.user.userInfo.orderToDeliveryMembership).then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                        }}
                      >
                        {common.user.userInfo.orderToDeliveryMembership}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>배송지</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        onClick={() => {
                          navigator.clipboard.writeText(common.user.userInfo.orderToDeliveryMethod).then(
                            function () {
                              alert('클립보드에 복사되었습니다.');
                            },
                            function () {
                              alert('클립보드에 복사할 수 없습니다.');
                            }
                          );
                        }}
                      >
                        {common.user.userInfo.orderToDeliveryMethod}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={4}
                      sx={{
                        m: 'auto',
                      }}
                    >
                      <Typography fontSize={12}>품목분류</Typography>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={8}
                      sx={{
                        m: 'auto',
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        noWrap
                        fontSize={12}
                        color="#1565c0"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              `(${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryInfo.category.code
                              }) ${
                                delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryInfo.category.name
                              }`
                            )
                            .then(
                              function () {
                                alert('클립보드에 복사되었습니다.');
                              },
                              function () {
                                alert('클립보드에 복사할 수 없습니다.');
                              }
                            );
                        }}
                      >
                        ({delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryInfo.category.code}){' '}
                        {delivery.orderInfo.ordersFiltered[delivery.orderInfo.current].deliveryInfo.category.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ) : null}
          </>
        ) : null}
      </Paper>
    </Modal>
  );
});
