import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Header } from "../Common/Header";
import { styled, Box, Button, Container, Checkbox, Grid, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, Typography } from '@mui/material';
import { readFileDataURL } from '../../Tools/Common';

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
  borderBottom: "1px solid ghostwhite",
  padding: 0,
  fontSize: 14,
});

export const BanWords = observer(() => {
  const { restrict } = React.useContext(AppContext);

  React.useEffect(() => {
    restrict.getRestrictWords();
  }, []);

  return (
    <>
      <Header />

      {restrict.restrictWordInfo.loading ? <>
        <Container maxWidth={'lg'}>
          <Grid container spacing={1} sx={{
            p: 0,
          }}>
            <Grid item xs={6} md={6} sx={{
              margin: "auto",
            }}>
              <Paper variant="outlined" sx={{
                border: "1px solid #d1e8ff",
                fontSize: 14,
                p: 0,
              }}>
                <Box sx={title}>
                  금지어 목록

                  <Button disableElevation color="error" variant="contained" sx={{
                    width: 100,
                    height: 30
                  }} onClick={restrict.deleteBanWordFromTable}>
                    삭제
                  </Button>
                </Box>

                <Box sx={{
                  p: 0,
                  height: 680,
                  overflowY: "auto"
                }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell width={100} style={{
                          background: "whitesmoke",
                        }}>
                          <Checkbox onChange={(e) => {
                            restrict.toggleBanCheckedAll(e.target.checked);
                          }} />
                        </StyledTableCell>

                        <StyledTableCell style={{
                          background: "whitesmoke",
                        }}>
                          금지어명
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {restrict.restrictWordInfo.banList?.map((v: any, index: number) =>
                        <TableRow hover>
                          <StyledTableCell>
                            <Checkbox checked={restrict.restrictWordInfo.banChecked[index]} onChange={(e) => {
                              restrict.toggleBanChecked(e.target.checked, index);
                            }} />
                          </StyledTableCell>

                          <StyledTableCell>
                            <Typography fontSize={14}>{v.findWord}</Typography>
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>

                <Box sx={{
                  p: 1
                }}>
                  <Grid container spacing={1} sx={{
                    p: 0,
                  }}>
                    <Grid item xs={6} md={8} sx={{
                      margin: "auto",
                    }}>
                      <TextField
                        id='banWords_banWordInput'
                        variant='outlined'
                        size='small'
                        style={{
                          width: "100%"
                        }}
                        inputProps={{
                          style: {
                            fontSize: 14,
                          }
                        }}
                        onBlur={(e) => {
                          restrict.setRestrictWordInfo({
                            ...restrict.restrictWordInfo,

                            banWordInput: e.target.value,
                          })
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} md={4} sx={{
                      margin: "auto",
                    }}>
                      <Button disableElevation variant="contained" color="info" sx={{
                        width: "100%"
                      }} onClick={restrict.addBanWordTable}>
                        등록
                      </Button>
                    </Grid>

                    <Grid item xs={6} md={12} sx={{
                      margin: "auto",
                    }}>
                      <Button disableElevation variant="contained" component="label" color="info" sx={{
                        width: "100%"
                      }}>
                        금지어 대량등록

                        <input hidden accept="application/*" multiple type="file" onChange={async (e) => {
                          const fileList = e.target.files ?? [];

                          await readFileDataURL(fileList[0]);

                          restrict.uploadExcel({ data: fileList[0], isReplace: false });
                        }} />
                      </Button>
                    </Grid>

                    <Grid item xs={6} md={12} sx={{
                      margin: "auto",
                    }}>
                      <Button disableElevation variant="contained" color="info" sx={{
                        width: "100%"
                      }} onClick={() => {
                        window.open(`${process.env.SELLFORYOU_MINIO_HTTPS}/data/셀포유 금지어 양식.xlsx`);
                      }}>
                        금지어 대량등록 양식 다운로드
                      </Button>
                    </Grid>
                  </Grid>

                </Box>
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sx={{
              margin: "auto",
            }}>
              <Paper variant="outlined" sx={{
                border: "1px solid #d1e8ff",
                fontSize: 14,
                p: 0,
              }}>
                <Box sx={title}>
                  치환어 목록

                  <Button disableElevation color="error" variant="contained" sx={{
                    width: 100,
                    height: 30
                  }} onClick={restrict.deleteReplaceWordFromTable}>
                    삭제
                  </Button>
                </Box>

                <Box sx={{
                  p: 0,
                  height: 680,
                  overflowY: "auto"
                }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell width={100} style={{
                          background: "whitesmoke",
                        }}>
                          <Checkbox onChange={(e) => {
                            restrict.toggleReplaceCheckedAll(e.target.checked);
                          }} />
                        </StyledTableCell>

                        <StyledTableCell style={{
                          background: "whitesmoke",
                        }}>
                          검색어명
                        </StyledTableCell>

                        <StyledTableCell style={{
                          background: "whitesmoke",
                        }}>
                          치환어명
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {restrict.restrictWordInfo.replaceList?.map((v: any, index: number) =>
                        <TableRow hover>
                          <StyledTableCell>
                            <Checkbox checked={restrict.restrictWordInfo.replaceChecked[index]} onChange={(e) => {
                              restrict.toggleReplaceChecked(e.target.checked, index);
                            }} />
                          </StyledTableCell>

                          <StyledTableCell>
                            <Typography fontSize={14}>{v.findWord}</Typography>
                          </StyledTableCell>

                          <StyledTableCell>
                            <Typography fontSize={14}>{v.replaceWord}</Typography>
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>

                <Box sx={{
                  p: 1
                }}>
                  <Grid container spacing={1} sx={{
                    p: 0,
                  }}>
                    <Grid item xs={6} md={4} sx={{
                      margin: "auto",
                    }}>
                      <TextField
                        id='banWords_findWordInput'
                        variant='outlined'
                        size='small'
                        style={{
                          width: "100%"
                        }}
                        inputProps={{
                          style: {
                            fontSize: 14,
                          }
                        }}
                        onBlur={(e) => {
                          restrict.setRestrictWordInfo({
                            ...restrict.restrictWordInfo,

                            findWordInput: e.target.value
                          })
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} md={4} sx={{
                      margin: "auto",
                    }}>
                      <TextField
                        id='banWords_replaceWordInput'
                        variant='outlined'
                        size='small'
                        style={{
                          width: "100%"
                        }}
                        inputProps={{
                          style: {
                            fontSize: 14,
                          }
                        }}
                        onBlur={(e) => {
                          restrict.setRestrictWordInfo({
                            ...restrict.restrictWordInfo,

                            replaceWordInput: e.target.value ?? ""
                          })
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} md={4} sx={{
                      margin: "auto",
                    }}>
                      <Button disableElevation variant="contained" color="info" sx={{
                        width: "100%"
                      }} onClick={restrict.addReplaceWordTable}>
                        등록
                      </Button>
                    </Grid>

                    <Grid item xs={6} md={12} sx={{
                      margin: "auto",
                    }}>
                      <Button disableElevation variant="contained" component="label" color="info" sx={{
                        width: "100%"
                      }}>
                        치환어 대량등록

                        <input hidden accept="application/*" multiple type="file" onChange={async (e) => {
                          const fileList = e.target.files ?? [];

                          await readFileDataURL(fileList[0]);

                          restrict.uploadExcel({ data: fileList[0], isReplace: true });
                        }} />
                      </Button>
                    </Grid>

                    <Grid item xs={6} md={12} sx={{
                      margin: "auto",
                    }}>
                      <Button disableElevation variant="contained" color="info" sx={{
                        width: "100%"
                      }} onClick={() => {
                        window.open(`${process.env.SELLFORYOU_MINIO_HTTPS}/data/셀포유 치환 양식.xlsx`);
                      }}>
                        치환어 대량등록 양식 다운로드
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </>
        :
        null
      }
    </>
  )
})

