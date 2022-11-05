import React from 'react';

import { format } from "date-fns";
import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Header } from "../Common/Header";
import { NoticeModal } from '../Modals/NoticeModal';
import { Box, Button, CircularProgress, Container, Grid, Paper, Typography } from '@mui/material';

export const Dashboard = observer(() => {
  const { common, dashboard } = React.useContext(AppContext);

  React.useEffect(() => {
    dashboard.getProductCount();
    dashboard.loadNotices();
  }, []);

  React.useEffect(() => {
    if (!common.loaded) {
      return;
    }

    dashboard.getOrderCount(common);
  }, [common.loaded]);

  return (
    <>
      <Header />

      <Container maxWidth={'xl'}>
        <Grid container spacing={1}>
          <Grid item xs={6} md={9}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={4}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 280
                }}>
                  <Box sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <Grid container spacing={2} sx={{
                      p: 2,
                    }}>
                      <Grid item xs={6} md={8}>
                        <Typography noWrap sx={{
                          fontSize: 18,
                          fontWeight: "bold"
                        }}>
                          관리상품
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4} sx={{
                        textAlign: "right"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          fontSize: 18,
                          fontWeight: "bold"
                        }}>
                          {common.user.productCount}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{
                      p: 2,
                    }}>
                      <Grid item xs={6} md={8}>
                        <Typography noWrap sx={{
                          fontSize: 18,
                          fontWeight: "bold"
                        }}>
                          수집상품
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4} sx={{
                        textAlign: "right"
                      }}>
                        {dashboard.countInfo.product.collected === "-" ?
                          <CircularProgress disableShrink size="1.5rem" />
                          :
                          <Typography noWrap sx={{
                            color: "#1565c0",
                            cursor: "pointer",
                            fontSize: 18,
                            fontWeight: "bold",
                          }} onClick={() => {
                            window.location.href = "/product/collected.html";
                          }}>
                            {dashboard.countInfo.product.collected}
                          </Typography>
                        }
                      </Grid>

                      <Grid item xs={6} md={8}>
                        <Typography noWrap sx={{
                          fontSize: 18,
                          fontWeight: "bold"
                        }}>
                          등록상품
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4} sx={{
                        textAlign: "right"
                      }}>
                        {dashboard.countInfo.product.registered === "-" ?
                          <CircularProgress disableShrink size="1.5rem" />
                          :
                          <Typography noWrap sx={{
                            color: "#1565c0",
                            cursor: "pointer",
                            fontSize: 18,
                            fontWeight: "bold",
                          }} onClick={() => {
                            window.location.href = "/product/registered.html";
                          }}>
                            {dashboard.countInfo.product.registered}
                          </Typography>
                        }
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 280
                }}>
                  <Box sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <Grid container spacing={2} sx={{
                      p: 2,
                    }}>
                      <Grid item xs={6} md={8}>
                        <Typography noWrap sx={{
                          fontSize: 18,
                          fontWeight: "bold"
                        }}>
                          신규주문
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4} sx={{
                        textAlign: "right"
                      }}>
                        {dashboard.countInfo.order.countAll === "-" ?
                          <CircularProgress disableShrink size="1.5rem" />
                          :
                          <Typography noWrap sx={{
                            color: "#1565c0",
                            cursor: "pointer",
                            fontSize: 18,
                            fontWeight: "bold",
                          }} onClick={() => {
                            window.location.href = "/order.html";
                          }}>
                            {dashboard.countInfo.order.countAll}
                          </Typography>
                        }
                      </Grid>
                    </Grid>

                    <Grid container spacing={0.5} sx={{
                      p: 2
                    }}>
                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A077" && v.connected) ? <img src="/resources/icon-smartstore.png" /> : <img src="/resources/icon-smartstore-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA077}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "B378" && v.connected) ? <img src="/resources/icon-coupang.png" /> : <img src="/resources/icon-coupang-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countB378}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A112" && v.connected) ? <img src="/resources/icon-street-global.png" /> : <img src="/resources/icon-street-global-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA112}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A113" && v.connected) ? <img src="/resources/icon-street-normal.png" /> : <img src="/resources/icon-street-normal-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA113}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A006" && v.connected) ? <img src="/resources/icon-gmarket.png" /> : <img src="/resources/icon-gmarket-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA006}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A001" && v.connected) ? <img src="/resources/icon-auction.png" /> : <img src="/resources/icon-auction-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA001}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A027" && v.connected) ? <img src="/resources/icon-interpark.png" /> : <img src="/resources/icon-interpark-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA027}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "B719" && v.connected) ? <img src="/resources/icon-wemakeprice.png" /> : <img src="/resources/icon-wemakeprice-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countB719}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A524" && v.connected) ? <img src="/resources/icon-lotteon-global.png" /> : <img src="/resources/icon-lotteon-global-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA524}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "A525" && v.connected) ? <img src="/resources/icon-lotteon-normal.png" /> : <img src="/resources/icon-lotteon-normal-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countA525}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        {common.uploadInfo.markets.find((v: any) => v.code === "B956" && v.connected) ? <img src="/resources/icon-tmon.png" /> : <img src="/resources/icon-tmon-gray.png" />}
                      </Grid>

                      <Grid item xs={6} md={2} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          color: "#1565c0",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: "bold",
                        }} onClick={() => {
                          window.location.href = "/order.html";
                        }}>
                          {dashboard.countInfo.order.countB956}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4} sx={{
                        m: "auto",
                        textAlign: "center"
                      }}>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 280
                }}>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 240
                }}>
                  <Box sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Grid container spacing={2} sx={{
                      p: 2,
                    }}>
                      <Grid item xs={6} md={12} sx={{
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          fontSize: 16,
                          fontWeight: "bold"
                        }}>
                          특정 키워드를 금지하거나 치환할 수 있나요?
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={12} sx={{
                        textAlign: "center"
                      }}>
                        <Button disableElevation variant="contained" color="info" sx={{
                          width: "100%"
                        }} onClick={() => {
                          window.location.href = "/banwords.html";
                        }}>
                          금지어/치환어설정 바로가기
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 240
                }}>
                  <Box sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Grid container spacing={2} sx={{
                      p: 2,
                    }}>
                      <Grid item xs={6} md={12} sx={{
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          fontSize: 16,
                          fontWeight: "bold"
                        }}>
                          어떤 키워드를 선택해야할 지 궁금하신가요?
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={12} sx={{
                        textAlign: "center"
                      }}>
                        <Button disableElevation variant="contained" color="info" sx={{
                          width: "100%"
                        }} onClick={() => {
                          window.location.href = "/keyword/analysis.html";
                        }}>
                          키워드분석 바로가기
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 240
                }}>
                  <Box sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Grid container spacing={2} sx={{
                      p: 2,
                    }}>
                      <Grid item xs={6} md={12} sx={{
                        textAlign: "center"
                      }}>
                        <Typography noWrap sx={{
                          fontSize: 16,
                          fontWeight: "bold"
                        }}>
                          판매중인 다른 상품들의 정보가 궁금하신가요?
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={12} sx={{
                        textAlign: "center"
                      }}>
                        <Button disableElevation variant="contained" color="info" sx={{
                          width: "100%"
                        }} onClick={() => {
                          window.location.href = "/sourcing.html";
                        }}>
                          소싱기 바로가기
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6} md={6}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 320
                }}>
                  <Box>
                    <iframe width="100%" height="320" src="https://www.youtube.com/embed/wa13Rdu6iME" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6} md={6}>
                <Paper variant="outlined" sx={{
                  border: "1px solid #d1e8ff",
                  height: 320
                }}>
                  <Box>
                    <iframe width="100%" height="320" src="https://www.youtube.com/embed/ID210e1-X70" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper variant="outlined" sx={{
              border: "1px solid #d1e8ff",
              height: 860
            }}>
              <Grid container spacing={2.3} sx={{
                p: 2,
              }}>
                {dashboard.notices.map((v: any) =>
                  <>
                    <Grid item xs={6} md={7}>
                      <Typography noWrap sx={{
                        cursor: "pointer",
                        fontSize: 16,
                        fontWeight: "bold"
                      }} onClick={() => {
                        dashboard.setCurrentNotice(v);
                        dashboard.toggleNoticeModal(true);
                      }}>
                        {v.title}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={5} sx={{
                      textAlign: "right"
                    }}>
                      <Typography noWrap sx={{
                        fontSize: 16,
                        fontWeight: "bold"
                      }}>
                        {format(new Date(v.createdAt), "yyyy-MM-dd")}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container >

      <NoticeModal />
    </>
  )
})

