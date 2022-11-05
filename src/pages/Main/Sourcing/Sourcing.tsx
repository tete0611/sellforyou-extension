import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Header } from "../Common/Header";
import { styled, Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, FormGroup, Grid, LinearProgress, Paper, Radio, RadioGroup, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { Image, Input, Search } from '../Common/UI';

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


export const Sourcing = observer(() => {
  const { common, sourcing } = React.useContext(AppContext);

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
          <LinearProgress variant="determinate" value={sourcing.searchInfo.progress} />

          <Box sx={title}>
            소싱 설정

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right"
            }}>
              {sourcing.searchInfo.progress > 0 ?
                <Button disableElevation disabled sx={{
                  fontSize: 13,
                  width: 150,
                  height: 30
                }} variant="contained">
                  <CircularProgress size="1rem" />

                  &nbsp;

                  소싱중...
                </Button>
                :
                <Button disableElevation color="info" sx={{
                  fontSize: 13,
                  width: 150,
                  height: 30
                }} variant="contained"
                  onClick={sourcing.searchProduct}>
                  소싱 시작
                </Button>
              }
            </Box>
          </Box>

          <Grid container spacing={1} sx={{
            textAlign: "center",
            p: 0.5
          }}>
            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              카테고리

              <br />

              검색
            </Grid>

            <Grid item xs={6} md={5} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Search
                value={sourcing.categoryInfo.info}
                onChange={(e: any, value: any) => {
                  sourcing.setCategoryInfo(value);
                }}
                onInputChange={(e: any, value: any, reason: any) => {
                  if (reason !== 'input') {
                    return;
                  }

                  sourcing.setCategoryInput(value);
                }}
                options={sourcing.categoryInfo.input ? sourcing.categoryInfo.data : []}
                getOptionLabel={(option: any) => option.name ?? ""}
                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                onOpen={async () => { sourcing.getCategoryList() }}
                onClose={() => { sourcing.setCategoryInput("") }}
                loading={sourcing.categoryInfo.loading}
              />
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              상품명
            </Grid>

            <Grid item xs={6} md={5}>
              <Input
                id="sourcing_productName"
                placeholder="상품명을 입력해주세요."
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    query: e.target.value
                  })
                }}
              />
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              카테고리

              <br />

              선택
            </Grid>

            <Grid item xs={6} md={5} sx={{
              display: "flex",
              alignItems: "center"
            }}>

            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              등록일
            </Grid>

            <Grid item xs={6} md={2} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Input
                id="sourcing_dateStart"
                placeholder="20220101 형식"
                defaultValue={sourcing.searchInfo.dateStart}
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    dateStart: e.target.value
                  })
                }}
              />
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              부터
            </Grid>

            <Grid item xs={6} md={2} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Input
                id="sourcing_dateEnd"
                placeholder="20220101 형식"
                defaultValue={sourcing.searchInfo.dateEnd}
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    dateEnd: e.target.value
                  })
                }}
              />
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              구매수
            </Grid>

            <Grid item xs={6} md={2} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Input
                id="sourcing_buyCount"
                defaultValue={sourcing.searchInfo.purchaseCnt}
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    purchaseCnt: parseInt(e.target.value)
                  })
                }}
              />

              &nbsp;

              <Typography sx={{
                fontSize: 14,
                width: 150
              }}>
                개 이상
              </Typography>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              리뷰수
            </Grid>

            <Grid item xs={6} md={2} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Input
                id="sourcing_reviewCount"
                defaultValue={sourcing.searchInfo.reviewCount}
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    reviewCount: parseInt(e.target.value)
                  })
                }}
              />

              <Typography sx={{
                fontSize: 14,
                width: 150
              }}>
                개 이상
              </Typography>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              찜수
            </Grid>

            <Grid item xs={6} md={2} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Input
                id="sourcing_favCount"
                defaultValue={sourcing.searchInfo.keepCnt}
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    keepCnt: parseInt(e.target.value)
                  })
                }}
              />

              <Typography sx={{
                fontSize: 14,
                width: 150
              }}>
                개 이상
              </Typography>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              최대

              <br />

              상품수
            </Grid>

            <Grid item xs={6} md={2} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Input
                id="sourcing_maxCount"
                defaultValue={sourcing.searchInfo.maxLimits}
                onBlur={(e: any) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    maxLimits: parseInt(e.target.value)
                  })
                }}
              />

              <Typography sx={{
                fontSize: 14,
                width: 150
              }}>
                개 이하
              </Typography>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              구분
            </Grid>

            <Grid item xs={6} md={5} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <RadioGroup row defaultValue={"total"} onChange={(e) => {
                sourcing.setSearchInfo({
                  ...sourcing.searchInfo,

                  productSet: e.target.value
                });
              }}>
                <FormControlLabel value="total" control={<Radio size="small" />} label={<Typography sx={{
                  fontSize: 14
                }}>
                  전체(해외 {"&"} 국내)
                </Typography>} />

                <FormControlLabel value="overseas" control={<Radio size="small" />} label={<Typography sx={{
                  fontSize: 14
                }}>
                  해외
                </Typography>} />
              </RadioGroup>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              정렬
            </Grid>

            <Grid item xs={6} md={5} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <RadioGroup row defaultValue={"review"} onChange={(e) => {
                sourcing.setSearchInfo({
                  ...sourcing.searchInfo,

                  sort: e.target.value
                });
              }}>
                <FormControlLabel value="review" control={<Radio size="small" />} label={<Typography sx={{
                  fontSize: 14
                }}>
                  리뷰순
                </Typography>} />

                <FormControlLabel value="sold" control={<Radio size="small" />} label={<Typography sx={{
                  fontSize: 14
                }}>
                  구매순
                </Typography>} />
              </RadioGroup>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              쇼핑몰

              <br />

              등급
            </Grid>

            <Grid item xs={6} md={5} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    includePlatinum: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  플래티넘
                </Typography>} />

                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    includePremium: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  프리미엄
                </Typography>} />

                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    inclueBigPower: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  빅파워
                </Typography>} />
              </FormGroup>

              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    includePower: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  파워
                </Typography>} />

                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    includePlant: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  새싹
                </Typography>} />

                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    includeSeed: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  씨앗
                </Typography>} />
              </FormGroup>
            </Grid>

            <Grid item xs={6} md={1} sx={{
              margin: "auto"
            }}>
              제외

              <br />

              쇼핑몰
            </Grid>

            <Grid item xs={6} md={5} sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    exceptAliExpress: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  알리익스프레스
                </Typography>} />

                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    exceptCoupang: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  쿠팡
                </Typography>} />

                <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => {
                  sourcing.setSearchInfo({
                    ...sourcing.searchInfo,

                    exceptQooten: e.target.checked
                  })
                }} />} sx={{
                  height: 20
                }} label={<Typography sx={{
                  fontSize: 14
                }}>
                  쿠텐
                </Typography>} />
              </FormGroup>
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
            검색 결과

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
                  sourcing.download();
                }}>
                소싱결과 다운로드
              </Button>
            </Box>
          </Box>

          <Box sx={{
            height: 540,
            overflowY: "auto"
          }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell width={50}>
                    순번
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    이미지
                  </StyledTableCell>

                  <StyledTableCell sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    상품명
                  </StyledTableCell>

                  <StyledTableCell width={300} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    카테고리
                  </StyledTableCell>

                  <StyledTableCell width={100} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    등록일
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    구매
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    리뷰
                  </StyledTableCell>

                  <StyledTableCell width={50} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    찜
                  </StyledTableCell>

                  <StyledTableCell width={75} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    가격
                  </StyledTableCell>

                  <StyledTableCell width={100} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    판매처
                  </StyledTableCell>

                  <StyledTableCell width={75} sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}>
                    등급
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sourcing.result.map((v: any) => <>
                  <TableRow hover>
                    <StyledTableCell>
                      {v.rank}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    }}>
                      <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <Image src={v.imageUrl} width={30} height={30} onClick={() => {
                          window.open(v.imageUrl)
                        }} />
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "left"
                    }}>
                      <Box sx={{
                        width: 300
                      }}>
                        <Typography noWrap sx={{
                          color: "gray",
                          cursor: "pointer",
                          fontSize: 13,
                        }} onClick={() => {
                          window.open(v.crUrl)
                        }}>
                          {v.productName}
                        </Typography>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "left"
                    }}>
                      <Box sx={{
                        width: 300
                      }}>
                        <Typography noWrap sx={{
                          color: "cornflowerblue",
                          cursor: "pointer",
                          fontSize: 13,
                        }} onClick={() => {
                          window.open(v.url)
                        }}>
                          {v.categorySummary}
                        </Typography>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    }}>
                      {v.time}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v.purchaseCnt?.toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v.reviewCount?.toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {v.keepCnt?.toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                      textAlign: "right"
                    }}>
                      {parseInt(v.price)?.toLocaleString('ko-KR')}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    }}>
                      {v.mallName}
                    </StyledTableCell>

                    <StyledTableCell sx={{
                      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    }}>
                      {v.mallGrade}
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

