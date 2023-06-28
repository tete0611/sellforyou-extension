import React from "react";
import Chart from "react-apexcharts";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Header } from "../Common/Header";
import { NoticeModal } from "../Modals/NoticeModal";
import {
  styled,
  Box,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Frame, Input, MyButton } from "../Common/UI";
import { List, AutoSizer } from "react-virtualized";

import { ComboBox } from "../Common/UI";
import { Summary } from "./Components/Summary";
import { ImagePopOver } from "../PopOver/ImagePopOver";

// 커스텀 테이블 컬럼 스타일 설정
const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  padding: 0,
  fontSize: 14,
});

// 유입수분석 뷰
export const Inflow = observer(() => {
  // MobX 스토리지 로드
  const { common, inflow } = React.useContext(AppContext);

  // 사용자 정보를 불러온 뒤 실행
  React.useEffect(() => {
    if (!common.loaded) {
      return;
    }

    // 프리미엄 등급 외 사용 불가
    if (common.user.purchaseInfo2.level < 3) {
      alert("[프로] 등급부터 사용 가능한 기능입니다.");

      window.location.href = "/dashboard.html";

      return;
    }

    // 통계, 차트 로드
    inflow.getInflowCounts(inflow.searchInfo.timeStart, inflow.searchInfo.timeEnd);
    inflow.getInflowInfos(inflow.searchInfo.timeStart, inflow.searchInfo.timeEnd);
  }, [common.loaded]);

  // 가상화 뷰 렌더링 영역
  const rowRenderer = (props) => {
    const item = inflow.dataGroup[props.index][1];

    console.log(item);

    return (
      <div key={props.key} style={props.style}>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Table>
            <Summary item={item} index={props.index} />
          </Table>
        </Box>
      </div>
    );
  };

  // 다크모드 지원 설정
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: common.darkTheme ? "dark" : "light",
        },
      }),
    [common.darkTheme]
  );

  return (
    <ThemeProvider theme={theme}>
      <Frame dark={common.darkTheme}>
        <Header />

        <Container
          maxWidth={"xl"}
          sx={{
            py: "10px",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6} md={3}>
              <Paper
                variant="outlined"
                sx={{
                  height: 312,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      p: 2,
                    }}
                  >
                    {/* <Grid
                      item
                      xs={6}
                      md={3}
                      sx={{
                        m: "auto",
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        조회기간
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Input
                        width={"100%"}
                        type="date"
                        onChange={(e) => {
                          inflow.setChartOption({
                            ...inflow.chartOption,

                            xaxis: {
                              ...inflow.chartOption.xaxis,

                              min: new Date(`${e.target.value} 00:00:00`).getTime() + 32400000,
                            },
                          });

                          inflow.setSearchInfo({
                            ...inflow.searchInfo,

                            timeStart: e.target.value,
                          });
                        }}
                        value={inflow.searchInfo.timeStart}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={1}
                      sx={{
                        m: "auto",
                        textAlign: "center",
                      }}
                    >
                      ~
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Input
                        width={"100%"}
                        type="date"
                        onChange={(e) => {
                          inflow.setChartOption({
                            ...inflow.chartOption,

                            xaxis: {
                              ...inflow.chartOption.xaxis,

                              max: new Date(`${e.target.value} 23:59:59`).getTime() + 32400000,
                            },
                          });

                          inflow.setSearchInfo({
                            ...inflow.searchInfo,

                            timeEnd: e.target.value,
                          });
                        }}
                        value={inflow.searchInfo.timeEnd}
                      />
                    </Grid> */}

                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        m: "auto",
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        오픈마켓
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={6}>
                      <ComboBox
                        sx={{
                          width: "100%",
                        }}
                        value={inflow.searchInfo.siteCode}
                        onChange={(e) => {
                          inflow.setChartOption({
                            ...inflow.chartOption,

                            colors: e.target.value === "ALL" ? ["#77B6EA"] : ["#77B6EA", "#545454"],
                          });

                          inflow.setSearchInfo({
                            ...inflow.searchInfo,

                            siteCode: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="A077">스마트스토어</MenuItem>
                        <MenuItem value="B378">쿠팡</MenuItem>
                        <MenuItem value="A112">11번가(글로벌)</MenuItem>
                        <MenuItem value="A113">11번가(일반)</MenuItem>
                        <MenuItem value="A006">지마켓</MenuItem>
                        <MenuItem value="A001">옥션</MenuItem>
                        <MenuItem value="A523">지마켓(2.0)</MenuItem>
                        <MenuItem value="A522">옥션(2.0)</MenuItem>
                        <MenuItem value="A027">인터파크</MenuItem>
                        <MenuItem value="B719">위메프</MenuItem>
                        <MenuItem value="A524">롯데온(글로벌)</MenuItem>
                        <MenuItem value="A525">롯데온(일반)</MenuItem>
                        <MenuItem value="B956">티몬</MenuItem>
                      </ComboBox>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    sx={{
                      p: 2,
                    }}
                  >
                    <Grid item xs={6} md={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          textAlign: "center",
                          p: 1,
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 18,
                            fontWeight: "bold",
                            mb: 4,
                          }}
                        >
                          전체유입수
                        </Typography>

                        <Typography
                          noWrap
                          sx={{
                            fontSize: 64,
                            fontWeight: "bold",
                          }}
                        >
                          {inflow.dataCounts.total}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} md={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          textAlign: "center",
                          p: 1,
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 18,
                            fontWeight: "bold",
                            mb: 4,
                          }}
                        >
                          마켓별유입수
                        </Typography>

                        <Typography
                          noWrap
                          sx={{
                            fontSize: 64,
                            fontWeight: "bold",
                          }}
                        >
                          {inflow.searchInfo.siteCode === "ALL"
                            ? "-"
                            : inflow.searchInfo.siteCode === "A077"
                            ? inflow.dataCounts.a077
                            : inflow.searchInfo.siteCode === "B378"
                            ? inflow.dataCounts.b378
                            : inflow.searchInfo.siteCode === "A112"
                            ? inflow.dataCounts.a112
                            : inflow.searchInfo.siteCode === "A113"
                            ? inflow.dataCounts.a113
                            : inflow.searchInfo.siteCode === "A006"
                            ? inflow.dataCounts.a006
                            : inflow.searchInfo.siteCode === "A001"
                            ? inflow.dataCounts.a001
                            : inflow.searchInfo.siteCode === "A523"
                            ? inflow.dataCounts.a523
                            : inflow.searchInfo.siteCode === "A522"
                            ? inflow.dataCounts.a522
                            : inflow.searchInfo.siteCode === "A027"
                            ? inflow.dataCounts.a027
                            : inflow.searchInfo.siteCode === "B719"
                            ? inflow.dataCounts.b719
                            : inflow.searchInfo.siteCode === "A524"
                            ? inflow.dataCounts.a524
                            : inflow.searchInfo.siteCode === "A525"
                            ? inflow.dataCounts.a525
                            : inflow.searchInfo.siteCode === "B956"
                            ? inflow.dataCounts.b956
                            : null}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={6} md={9}>
              <Paper
                variant="outlined"
                sx={{
                  height: 280,
                  p: 2,
                }}
              >
                <Chart options={inflow.chartOption} series={inflow.dataInfos.slice()} type={"line"} width="100%" height="100%" />
              </Paper>
            </Grid>

            <Grid item xs={6} md={12}>
              <Paper variant="outlined">
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell colSpan={15}>
                        <Toolbar
                          disableGutters
                          style={{
                            minHeight: 50,
                          }}
                        >
                          <Grid container spacing={0.5}>
                            <Grid
                              item
                              xs={6}
                              md={4}
                              sx={{
                                margin: "auto",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  p: 0.5,
                                }}
                              >
                                <Select
                                  sx={{
                                    fontSize: 13,
                                    height: 30,
                                    minWidth: 100,
                                    mx: 0.5,
                                  }}
                                  value={inflow.filterInfo.type}
                                  onChange={(e: any) => {
                                    inflow.setFilterInfo({
                                      ...inflow.filterInfo,

                                      type: e.target.value,
                                    });
                                  }}
                                >
                                  <MenuItem value="PCODE">상품코드</MenuItem>
                                  <MenuItem value="PNAME">상품명</MenuItem>
                                </Select>

                                <Input
                                  id="inflow_table_keyword"
                                  onChange={(e: any) => {
                                    inflow.setFilterInfo({
                                      ...inflow.filterInfo,

                                      keyword: e.target.value,
                                    });
                                  }}
                                  onKeyPress={(e: any) => {
                                    if (e.key !== "Enter") {
                                      return;
                                    }

                                    inflow.getInflowInfos(inflow.searchInfo.timeStart, inflow.searchInfo.timeEnd);
                                  }}
                                />

                                <MyButton
                                  disableElevation
                                  variant="contained"
                                  color="info"
                                  sx={{
                                    minWidth: 60,
                                    ml: 0.5,
                                  }}
                                  onClick={() => {
                                    inflow.getInflowInfos(inflow.searchInfo.timeStart, inflow.searchInfo.timeEnd);
                                  }}
                                >
                                  검색
                                </MyButton>
                              </Box>
                            </Grid>

                            <Grid
                              item
                              xs={6}
                              md={8}
                              sx={{
                                margin: "auto",
                              }}
                            ></Grid>
                          </Grid>
                        </Toolbar>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell width={90}>
                        <Box
                          sx={{
                            fontSize: 11,
                          }}
                        >
                          상품코드
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell width={50}>
                        <Box
                          sx={{
                            fontSize: 11,
                          }}
                        >
                          이미지
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Box
                          sx={{
                            fontSize: 11,
                          }}
                        >
                          상품명
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: 11,
                            textAlign: "center",
                          }}
                        >
                          TOTAL
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-smartstore.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-coupang.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-street-global.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-street-normal.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="ESM1.0">
                            <img src="/resources/icon-gmarket.png" />
                          </Tooltip>
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="ESM1.0">
                            <img src="/resources/icon-auction.png" />
                          </Tooltip>
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-interpark.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-wemakeprice.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-lotteon-global.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-lotteon-normal.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src="/resources/icon-tmon.png" />
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="ESM2.0">
                            <img src="/resources/icon-gmarket.png" />
                          </Tooltip>
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        width={50}
                        sx={{
                          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="ESM2.0">
                            <img src="/resources/icon-auction.png" />
                          </Tooltip>
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <StyledTableCell colSpan={17}>
                        <div
                          style={{
                            height: common.innerSize.height - 469,
                          }}
                        >
                          {inflow.dataGroup.length > 0 ? (
                            <AutoSizer>
                              {({ height, width }) => (
                                <List width={width} height={height} rowCount={inflow.dataGroup.length} rowRenderer={rowRenderer} rowHeight={41} />
                              )}
                            </AutoSizer>
                          ) : null}
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <ImagePopOver />

        <NoticeModal />
      </Frame>
    </ThemeProvider>
  );
});
