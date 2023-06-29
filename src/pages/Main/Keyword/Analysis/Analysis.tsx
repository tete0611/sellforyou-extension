import React from 'react';

import { AppContext } from '../../../../containers/AppContext';
import { Header } from '../../Common/Header';
import { observer } from 'mobx-react';
import {
  styled,
  Box,
  Button,
  Container,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  LinearProgress,
  Paper,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { Frame, Input, Title } from '../../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 커스텀 테이블 컬럼 뷰
const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  padding: '4px',
  fontSize: 11,
});

// 키워드 분석 뷰
export const Analysis = observer(() => {
  // MobX 스토리지 로드
  const { common, analysis } = React.useContext(AppContext);

  // 다크모드 지원 설정
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: common.darkTheme ? 'dark' : 'light',
        },
      }),
    [common.darkTheme]
  );

  return (
    <ThemeProvider theme={theme}>
      <Frame dark={common.darkTheme}>
        <Header />

        <Container
          maxWidth={'xl'}
          sx={{
            py: '10px',
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              mb: 1,
            }}
          >
            <LinearProgress variant="determinate" value={analysis.searchInfo.progress} />

            <Title dark={common.darkTheme}>
              키워드 분석
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right',
                }}
              >
                {analysis.searchInfo.progress > 0 ? (
                  <Button
                    disableElevation
                    disabled
                    sx={{
                      fontSize: 13,
                      width: 150,
                      height: 30,
                    }}
                    variant="contained"
                  >
                    <CircularProgress size="1rem" />
                    &nbsp; 분석중...
                  </Button>
                ) : (
                  <Button
                    disableElevation
                    color="info"
                    sx={{
                      fontSize: 13,
                      width: 150,
                      height: 30,
                    }}
                    variant="contained"
                    onClick={analysis.searchKeywordByNaver}
                  >
                    분석 시작
                  </Button>
                )}
              </Box>
            </Title>

            <Grid
              container
              spacing={1}
              sx={{
                textAlign: 'center',
                p: 1,
              }}
            >
              <Grid
                item
                xs={6}
                md={3}
                sx={{
                  margin: 'auto',
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    mb: 0.5,
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography fontSize={14}>
                          연관키워드
                          <br />
                          노출개수
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Select
                        size="small"
                        sx={{
                          fontSize: 14,
                          width: '100%',
                        }}
                        defaultValue={analysis.searchInfo.expose}
                        onChange={(e) => {
                          analysis.setSearchInfo({
                            ...analysis.searchInfo,

                            expose: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                        <MenuItem value={300}>300</MenuItem>
                        <MenuItem value={500}>500</MenuItem>
                        <MenuItem value={1000}>1000</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid
                item
                xs={6}
                md={3}
                sx={{
                  margin: 'auto',
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography fontSize={14}>
                          분석결과
                          <br />
                          자동저장
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={6}
                      sx={{
                        margin: 'auto',
                      }}
                    >
                      <Select
                        size="small"
                        sx={{
                          fontSize: 14,
                          width: '100%',
                        }}
                        value={analysis.searchInfo.saveAuto}
                        onChange={(e) => {
                          analysis.setSearchInfo({
                            ...analysis.searchInfo,

                            saveAuto: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value={'Y'}>사용</MenuItem>

                        <MenuItem value={'N'}>미사용</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={6} md={6}></Grid>

              <Grid item xs={6} md={12}>
                <Input
                  id="analysis_keyword"
                  placeholder="키워드를 입력해주세요. (복수 입력 시 최대 5개까지 입력 가능, Enter로 구분)"
                  multiline
                  rows={3}
                  onBlur={(e: any) => {
                    analysis.setSearchInfo({
                      ...analysis.searchInfo,

                      keyword: e.target.value,
                    });
                  }}
                  defaultValue={analysis.searchInfo.keyword}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined">
            <Title dark={common.darkTheme}>
              키워드 분석결과
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right',
                }}
              >
                <Button
                  disableElevation
                  color="info"
                  sx={{
                    fontSize: 13,
                    width: 150,
                    height: 30,
                  }}
                  variant="contained"
                  onClick={() => {
                    analysis.download();
                  }}
                >
                  분석결과 다운로드
                </Button>
              </Box>
            </Title>

            <Box
              sx={{
                height: common.innerSize.height - 339,
                overflowY: 'auto',
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell width={25}>순번</StyledTableCell>

                    <StyledTableCell
                      width={100}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      연관키워드
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      카테고리
                    </StyledTableCell>

                    <StyledTableCell
                      width={125}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      구매처
                    </StyledTableCell>

                    <StyledTableCell
                      width={75}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      검색상품수
                    </StyledTableCell>

                    <StyledTableCell
                      width={50}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      경쟁률
                    </StyledTableCell>

                    <StyledTableCell
                      width={75}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월간검색수(PC)
                    </StyledTableCell>

                    <StyledTableCell
                      width={100}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월간검색수(모바일)
                    </StyledTableCell>

                    <StyledTableCell
                      width={85}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월평균클릭수(PC)
                    </StyledTableCell>

                    <StyledTableCell
                      width={100}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월평균클릭수(모바일)
                    </StyledTableCell>

                    <StyledTableCell
                      width={85}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월평균클릭률(PC)
                    </StyledTableCell>

                    <StyledTableCell
                      width={100}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월평균클릭률(모바일)
                    </StyledTableCell>

                    <StyledTableCell
                      width={100}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      월평균노출광고수
                    </StyledTableCell>

                    <StyledTableCell
                      width={55}
                      sx={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      광고경쟁도
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {analysis.searchInfo.results.map((v: any) => (
                    <>
                      <TableRow hover>
                        <StyledTableCell>{v['순번']}</StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'left',
                          }}
                        >
                          {v['연관키워드']}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'left',
                          }}
                        >
                          {v['카테고리']}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => {
                                window.open(v['URL_TAOBAO']);
                              }}
                            >
                              <img src="/resources/icon-taobao.png" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                window.open(v['URL_TMALL']);
                              }}
                            >
                              <img src="/resources/icon-tmall.png" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                window.open(v['URL_ALIEXPRESS']);
                              }}
                            >
                              <img src="/resources/icon-express.png" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                window.open(v['URL_1688']);
                              }}
                            >
                              <img src="/resources/icon-1688.png" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                window.open(v['URL_VVIC']);
                              }}
                            >
                              <img src="/resources/icon-vvic.png" />
                            </IconButton>
                          </Box>
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['검색상품수'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['경쟁률'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월간검색수(PC)'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월간검색수(모바일)'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월평균클릭수(PC)'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월평균클릭수(모바일)'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월평균클릭률(PC)'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월평균클릭률(모바일)'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            textAlign: 'right',
                          }}
                        >
                          {v['월평균노출광고수'].toLocaleString('ko-KR')}
                        </StyledTableCell>

                        <StyledTableCell
                          sx={{
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                          }}
                        >
                          {v['광고경쟁정도']}
                        </StyledTableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Container>
      </Frame>
    </ThemeProvider>
  );
});
