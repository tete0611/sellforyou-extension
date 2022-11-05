import React from 'react';

import { AppContext } from "../../../../containers/AppContext";
import { Header } from "../../Common/Header";
import { observer } from "mobx-react";
import { styled, Box, Button, Container, CircularProgress, Grid, IconButton, MenuItem, LinearProgress, Paper, Select, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
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

const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  padding: 0,
  fontSize: 13,
});

export const Analysis = observer(() => {
  const { common, analysis } = React.useContext(AppContext);

  return (
    <>
      <Header />

      <Container maxWidth={'lg'}>
        <Paper variant="outlined" sx={{
          border: "1px solid #d1e8ff",
          fontSize: 14,
          p: 0,
          mb: 1,
        }}>
          <LinearProgress variant="determinate" value={analysis.searchInfo.progress} />

          <Box sx={title}>
            키워드 분석

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right"
            }}>
              {analysis.searchInfo.progress > 0 ?
                <Button disableElevation disabled sx={{
                  fontSize: 13,
                  width: 150,
                  height: 30
                }} variant="contained">
                  <CircularProgress size="1rem" />

                  &nbsp;

                  분석중...
                </Button>
                :
                <Button disableElevation color="info" sx={{
                  fontSize: 13,
                  width: 150,
                  height: 30
                }} variant="contained"
                  onClick={analysis.searchKeywordByNaver}>
                  분석 시작
                </Button>
              }
            </Box>
          </Box>

          <Grid container spacing={1} sx={{
            textAlign: "center",
            p: 0.5
          }}>
            <Grid item xs={6} md={3} sx={{
              margin: "auto"
            }}>
              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 0.5
              }}>
                <Grid item xs={6} md={4} sx={{
                  margin: "auto"
                }}>
                  연관키워드

                  <br />

                  노출개수
                </Grid>

                <Grid item xs={6} md={8} sx={{
                  display: "flex",
                  alignItems: "center"
                }}>
                  <Select sx={{
                    fontSize: 13,
                    width: "100%",
                    height: 30
                  }}
                    defaultValue={analysis.searchInfo.expose}
                    onChange={(e) => {
                      analysis.setSearchInfo({
                        ...analysis.searchInfo,

                        expose: e.target.value
                      });
                    }}>
                    <MenuItem value={100}>
                      100
                    </MenuItem>

                    <MenuItem value={200}>
                      200
                    </MenuItem>

                    <MenuItem value={300}>
                      300
                    </MenuItem>

                    <MenuItem value={500}>
                      500
                    </MenuItem>

                    <MenuItem value={1000}>
                      1000
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={6} md={4} sx={{
                  margin: "auto"
                }}>
                  분석결과

                  <br />

                  자동저장
                </Grid>

                <Grid item xs={6} md={8} sx={{
                  display: "flex",
                  alignItems: "center"
                }}>
                  <Select value={analysis.searchInfo.saveAuto} sx={{
                    fontSize: 13,
                    width: "100%",
                    height: 30
                  }} onChange={(e) => {
                    analysis.setSearchInfo({
                      ...analysis.searchInfo,

                      saveAuto: e.target.value
                    })
                  }}>
                    <MenuItem value={"Y"}>
                      사용
                    </MenuItem>

                    <MenuItem value={"N"}>
                      미사용
                    </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} md={9}>
              <Input
                id="analysis_keyword"
                placeholder="키워드를 입력해주세요. (복수 입력 시 최대 5개까지 입력 가능, Enter로 구분)"
                multiline
                rows={5}
                onBlur={(e: any) => {
                  analysis.setSearchInfo({
                    ...analysis.searchInfo,

                    keyword: e.target.value
                  });
                }}
                defaultValue={analysis.searchInfo.keyword}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{
          border: "1px solid #d1e8ff",
          fontSize: 14,
          p: 0,
          mb: 1,
        }}>
          <Box sx={title}>
            분석 결과

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right"
            }}>
              <Button disableElevation color="info" sx={{
                fontSize: 13,
                width: 150,
                height: 30
              }} variant="contained"
                onClick={() => {
                  analysis.download();
                }}>
                분석결과 다운로드
              </Button>
            </Box>
          </Box>

          <Box sx={{
            height: 630,
            overflowY: "auto"
          }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell width={50}>
                    순번
                  </StyledTableCell>

                  <StyledTableCell width={100} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    연관키워드
                  </StyledTableCell>

                  <StyledTableCell sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    카테고리
                  </StyledTableCell>

                  <StyledTableCell width={150} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    구매처
                  </StyledTableCell>

                  <StyledTableCell width={75} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    검색

                    <br />

                    상품수
                  </StyledTableCell>

                  <StyledTableCell width={75} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    경쟁률
                  </StyledTableCell>

                  <StyledTableCell width={75} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월간

                    <br />

                    검색수

                    <br />

                    (PC)
                  </StyledTableCell>

                  <StyledTableCell width={75} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월간

                    <br />

                    검색수

                    <br />

                    (모바일)
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월평균

                    <br />

                    클릭수

                    <br />

                    (PC)
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월평균

                    <br />

                    클릭수

                    <br />

                    (모바일)
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월평균

                    <br />

                    클릭률

                    <br />

                    (PC)
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월평균

                    <br />

                    클릭률

                    <br />

                    (모바일)
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    월평균

                    <br />

                    노출

                    <br />

                    광고수
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    광고

                    <br />

                    경쟁도
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {analysis.searchInfo.results.map((v: any) => <>
                  <TableRow hover>
                    <StyledTableCell>
                      {v['순번']}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "left"
                    }}>
                      {v['연관키워드']}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "left"
                    }}>
                      {v['카테고리']}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    }}>
                      <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => { window.open(v['URL_TAOBAO']) }}
                        >
                          <img src="/resources/icon-taobao.png" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => { window.open(v['URL_TMALL']) }}
                        >
                          <img src="/resources/icon-tmall.png" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => { window.open(v['URL_ALIEXPRESS']) }}
                        >
                          <img src="/resources/icon-express.png" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => { window.open(v['URL_1688']) }}
                        >
                          <img src="/resources/icon-1688.png" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => { window.open(v['URL_VVIC']) }}
                        >
                          <img src="/resources/icon-vvic.png" />
                        </IconButton>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['검색상품수'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['경쟁률'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월간검색수(PC)'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월간검색수(모바일)'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월평균클릭수(PC)'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월평균클릭수(모바일)'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월평균클릭률(PC)'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월평균클릭률(모바일)'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v['월평균노출광고수'].toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    }}>
                      {v['광고경쟁정도']}
                    </StyledTableCell>
                  </TableRow>
                </>)}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Container >
    </>
  )
})

