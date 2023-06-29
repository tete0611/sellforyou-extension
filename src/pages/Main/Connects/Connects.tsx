import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Header } from '../Common/Header';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Frame, Title } from '../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 오픈마켓 연동 뷰
export const Connects = observer(() => {
  // MobX 스토리지 로드
  const { common } = React.useContext(AppContext);

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
          maxWidth={'lg'}
          sx={{
            py: '10px',
          }}
        >
          {common.user.userInfo ? (
            <>
              <Grid
                container
                spacing={1}
                sx={{
                  p: 0,
                }}
              >
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      스마트스토어
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.naverUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'A077').connected}
                        onChange={async (e) => {
                          const naverUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ naverUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            naverUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          스마트스토어 주소
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_naver1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A077').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.naverStoreUrl}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                naverStoreUrl: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A077').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A077');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      쿠팡
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.coupangUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'B378').connected}
                        onChange={async (e) => {
                          const coupangUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ coupangUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            coupangUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          아이디
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_coupang1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B378').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.coupangLoginId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                coupangLoginId: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          업체코드
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_coupang2"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B378').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.coupangVendorId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                coupangVendorId: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          액세스키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_coupang3"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B378').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.coupangAccessKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                coupangAccessKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          시크릿키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_coupang4"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B378').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.coupangSecretKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                coupangSecretKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'B378').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('B378');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        11번가 글로벌
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          startIcon={<AddIcon />}
                          sx={{
                            ml: 1,
                            fontSize: 13,
                            height: 26,
                          }}
                          onClick={() => {
                            if (!common.user.userInfo.streetApiKey) {
                              alert('글로벌셀러 오픈 API 키 최초등록을 먼저 진행해주세요.');

                              return;
                            }

                            if (common.streetMaxmumCount > 3) {
                              alert('더 이상 추가할 수 없습니다.');

                              return;
                            }

                            const apiKey = prompt('글로벌셀러 오픈 API 키를 입력해주세요.');

                            if (!apiKey) {
                              alert('글로벌셀러 오픈 API 키가 입력되지 않았습니다.');

                              return;
                            }

                            if (!common.user.userInfo.streetApiKey2) {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                streetUseKeyType: '2',
                                streetApiKey2: common.user.userInfo.streetApiKey2 ? undefined : apiKey,
                              });

                              common.verifyConnectedInfo('A112');

                              return;
                            }

                            if (!common.user.userInfo.streetApiKey3) {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                streetUseKeyType: '3',
                                streetApiKey3: common.user.userInfo.streetApiKey3 ? undefined : apiKey,
                              });

                              common.verifyConnectedInfo('A112');

                              return;
                            }

                            if (!common.user.userInfo.streetApiKey4) {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                streetUseKeyType: '4',
                                streetApiKey4: common.user.userInfo.streetApiKey4 ? undefined : apiKey,
                              });

                              common.verifyConnectedInfo('A112');

                              return;
                            }
                          }}
                        >
                          API 키 추가
                        </Button>
                      </Box>

                      <Switch
                        size="small"
                        checked={common.user.userInfo?.streetUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'A112').connected}
                        onChange={async (e) => {
                          const streetUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ streetUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            streetUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 183,
                      }}
                    >
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-global-group"
                        onChange={(e) => {
                          common.setUserInfo({
                            ...common.user.userInfo,
                            streetUseKeyType: e.target.value,
                          });

                          common.verifyConnectedInfo('A112');
                        }}
                        value={common.user.userInfo.streetUseKeyType}
                      >
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
                            md={4}
                            sx={{
                              margin: 'auto',
                            }}
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio size="small" />}
                              label={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: 125,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    color="inherit"
                                    edge="start"
                                    sx={{
                                      mx: 0.5,
                                    }}
                                    onClick={() => {
                                      const nick = prompt('별칭을 입력해주세요.');

                                      if (!nick) {
                                        return;
                                      }

                                      common.setUserInfo({
                                        ...common.user.userInfo,
                                        streetApiMemo: nick,
                                      });

                                      common.testUserInfo({
                                        streetApiMemo: nick,
                                      });
                                    }}
                                  >
                                    <EditIcon
                                      sx={{
                                        width: 18,
                                        height: 18,
                                      }}
                                    />
                                  </IconButton>

                                  <Typography noWrap fontSize={14}>
                                    {common.user.userInfo.streetApiMemo
                                      ? common.user.userInfo.streetApiMemo
                                      : '오픈 API (G1)'}
                                  </Typography>
                                </Box>
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            md={8}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <TextField
                              id="connects_streetGlobal1"
                              size="small"
                              disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A112').connected}
                              variant="outlined"
                              sx={{
                                width: '100%',
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                },
                              }}
                              defaultValue={common.user.userInfo.streetApiKey}
                              onBlur={(e) => {
                                common.setUserInfo({
                                  ...common.user.userInfo,
                                  streetApiKey: e.target.value,
                                });

                                common.initConnectedInfo('A112');
                              }}
                            />
                          </Grid>

                          {common.user.userInfo.streetApiKey2 ? (
                            <>
                              <Grid
                                item
                                xs={6}
                                md={4}
                                sx={{
                                  margin: 'auto',
                                }}
                              >
                                <FormControlLabel
                                  value="2"
                                  control={<Radio size="small" />}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 125,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        edge="start"
                                        sx={{
                                          mx: 0.5,
                                        }}
                                        onClick={() => {
                                          const nick = prompt('별칭을 입력해주세요.');

                                          if (!nick) {
                                            return;
                                          }

                                          common.setUserInfo({
                                            ...common.user.userInfo,
                                            streetApiMemo2: nick,
                                          });

                                          common.testUserInfo({
                                            streetApiMemo2: nick,
                                          });
                                        }}
                                      >
                                        <EditIcon
                                          sx={{
                                            width: 18,
                                            height: 18,
                                          }}
                                        />
                                      </IconButton>

                                      <Typography noWrap fontSize={14}>
                                        {common.user.userInfo.streetApiMemo2
                                          ? common.user.userInfo.streetApiMemo2
                                          : '오픈 API (G2)'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                md={8}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TextField
                                  id="connects_streetGlobal2"
                                  size="small"
                                  disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A112').connected}
                                  variant="outlined"
                                  sx={{
                                    width: '100%',
                                  }}
                                  inputProps={{
                                    style: {
                                      fontSize: 14,
                                    },
                                  }}
                                  defaultValue={common.user.userInfo.streetApiKey2}
                                  onBlur={(e) => {
                                    common.setUserInfo({
                                      ...common.user.userInfo,
                                      streetApiKey2: e.target.value,
                                    });

                                    common.initConnectedInfo('A112');
                                  }}
                                />
                              </Grid>
                            </>
                          ) : null}

                          {common.user.userInfo.streetApiKey3 ? (
                            <>
                              <Grid
                                item
                                xs={6}
                                md={4}
                                sx={{
                                  margin: 'auto',
                                }}
                              >
                                <FormControlLabel
                                  value="3"
                                  control={<Radio size="small" />}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 125,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        edge="start"
                                        sx={{
                                          mx: 0.5,
                                        }}
                                        onClick={() => {
                                          const nick = prompt('별칭을 입력해주세요.');

                                          if (!nick) {
                                            return;
                                          }

                                          common.setUserInfo({
                                            ...common.user.userInfo,
                                            streetApiMemo3: nick,
                                          });

                                          common.testUserInfo({
                                            streetApiMemo3: nick,
                                          });
                                        }}
                                      >
                                        <EditIcon
                                          sx={{
                                            width: 18,
                                            height: 18,
                                          }}
                                        />
                                      </IconButton>

                                      <Typography noWrap fontSize={14}>
                                        {common.user.userInfo.streetApiMemo3
                                          ? common.user.userInfo.streetApiMemo3
                                          : '오픈 API (G3)'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                md={8}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TextField
                                  id="connects_streetGlobal3"
                                  size="small"
                                  disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A112').connected}
                                  variant="outlined"
                                  sx={{
                                    width: '100%',
                                  }}
                                  inputProps={{
                                    style: {
                                      fontSize: 14,
                                    },
                                  }}
                                  defaultValue={common.user.userInfo.streetApiKey3}
                                  onBlur={(e) => {
                                    common.setUserInfo({
                                      ...common.user.userInfo,
                                      streetApiKey3: e.target.value,
                                    });

                                    common.initConnectedInfo('A112');
                                  }}
                                />
                              </Grid>
                            </>
                          ) : null}

                          {common.user.userInfo.streetApiKey4 ? (
                            <>
                              <Grid
                                item
                                xs={6}
                                md={4}
                                sx={{
                                  margin: 'auto',
                                }}
                              >
                                <FormControlLabel
                                  value="4"
                                  control={<Radio size="small" />}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 125,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        edge="start"
                                        sx={{
                                          mx: 0.5,
                                        }}
                                        onClick={() => {
                                          const nick = prompt('별칭을 입력해주세요.');

                                          if (!nick) {
                                            return;
                                          }

                                          common.setUserInfo({
                                            ...common.user.userInfo,
                                            streetApiMemo4: nick,
                                          });

                                          common.testUserInfo({
                                            streetApiMemo4: nick,
                                          });
                                        }}
                                      >
                                        <EditIcon
                                          sx={{
                                            width: 18,
                                            height: 18,
                                          }}
                                        />
                                      </IconButton>

                                      <Typography noWrap fontSize={14}>
                                        {common.user.userInfo.streetApiMemo4
                                          ? common.user.userInfo.streetApiMemo4
                                          : '오픈 API (G4)'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                md={8}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TextField
                                  id="connects_streetGlobal4"
                                  size="small"
                                  disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A112').connected}
                                  variant="outlined"
                                  sx={{
                                    width: '100%',
                                  }}
                                  inputProps={{
                                    style: {
                                      fontSize: 14,
                                    },
                                  }}
                                  defaultValue={common.user.userInfo.streetApiKey4}
                                  onBlur={(e) => {
                                    common.setUserInfo({
                                      ...common.user.userInfo,
                                      streetApiKey4: e.target.value,
                                    });

                                    common.initConnectedInfo('A112');
                                  }}
                                />
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                      </RadioGroup>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A112').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A112');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        11번가 일반
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          startIcon={<AddIcon />}
                          sx={{
                            ml: 1,
                            fontSize: 13,
                            height: 26,
                          }}
                          onClick={() => {
                            if (!common.user.userInfo.streetNormalApiKey) {
                              alert('일반셀러 오픈 API 키 최초등록을 먼저 진행해주세요.');

                              return;
                            }

                            if (common.streetMaxmumCount > 3) {
                              alert('더 이상 추가할 수 없습니다.');

                              return;
                            }

                            const apiKey = prompt('일반셀러 오픈 API 키를 입력해주세요.');

                            if (!apiKey) {
                              alert('일반셀러 오픈 API 키가 입력되지 않았습니다.');

                              return;
                            }

                            if (!common.user.userInfo.streetNormalApiKey2) {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                streetNormalUseKeyType: '2',
                                streetNormalApiKey2: common.user.userInfo.streetNormalApiKey2 ? undefined : apiKey,
                              });

                              common.verifyConnectedInfo('A113');

                              return;
                            }

                            if (!common.user.userInfo.streetNormalApiKey3) {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                streetNormalUseKeyType: '3',
                                streetNormalApiKey3: common.user.userInfo.streetNormalApiKey3 ? undefined : apiKey,
                              });

                              common.verifyConnectedInfo('A113');

                              return;
                            }

                            if (!common.user.userInfo.streetNormalApiKey4) {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                streetNormalUseKeyType: '4',
                                streetNormalApiKey4: common.user.userInfo.streetNormalApiKey4 ? undefined : apiKey,
                              });

                              common.verifyConnectedInfo('A113');

                              return;
                            }
                          }}
                        >
                          API 키 추가
                        </Button>
                      </Box>

                      <Switch
                        size="small"
                        checked={common.user.userInfo?.streetNormalUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'A113').connected}
                        onChange={async (e) => {
                          const streetNormalUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ streetNormalUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            streetNormalUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 183,
                      }}
                    >
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-normal-group"
                        onChange={(e) => {
                          common.setUserInfo({
                            ...common.user.userInfo,
                            streetNormalUseKeyType: e.target.value,
                          });

                          common.verifyConnectedInfo('A113');
                        }}
                        value={common.user.userInfo.streetNormalUseKeyType}
                      >
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
                            md={4}
                            sx={{
                              margin: 'auto',
                            }}
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio size="small" />}
                              label={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: 125,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    color="inherit"
                                    edge="start"
                                    sx={{
                                      mx: 0.5,
                                    }}
                                    onClick={() => {
                                      const nick = prompt('별칭을 입력해주세요.');

                                      if (!nick) {
                                        return;
                                      }

                                      common.setUserInfo({
                                        ...common.user.userInfo,
                                        streetNormalApiMemo: nick,
                                      });

                                      common.testUserInfo({
                                        streetNormalApiMemo: nick,
                                      });
                                    }}
                                  >
                                    <EditIcon
                                      sx={{
                                        width: 18,
                                        height: 18,
                                      }}
                                    />
                                  </IconButton>

                                  <Typography noWrap fontSize={14}>
                                    {common.user.userInfo.streetNormalApiMemo
                                      ? common.user.userInfo.streetNormalApiMemo
                                      : '오픈 API (N1)'}
                                  </Typography>
                                </Box>
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            md={8}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <TextField
                              id="connects_streetNormal1"
                              size="small"
                              disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A113').connected}
                              variant="outlined"
                              sx={{
                                width: '100%',
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                },
                              }}
                              defaultValue={common.user.userInfo.streetNormalApiKey}
                              onBlur={(e) => {
                                common.setUserInfo({
                                  ...common.user.userInfo,
                                  streetNormalApiKey: e.target.value,
                                });

                                common.initConnectedInfo('A113');
                              }}
                            />
                          </Grid>

                          {common.user.userInfo.streetNormalApiKey2 ? (
                            <>
                              <Grid
                                item
                                xs={6}
                                md={4}
                                sx={{
                                  margin: 'auto',
                                }}
                              >
                                <FormControlLabel
                                  value="2"
                                  control={<Radio size="small" />}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 125,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        edge="start"
                                        sx={{
                                          mx: 0.5,
                                        }}
                                        onClick={() => {
                                          const nick = prompt('별칭을 입력해주세요.');

                                          if (!nick) {
                                            return;
                                          }

                                          common.setUserInfo({
                                            ...common.user.userInfo,
                                            streetNormalApiMemo2: nick,
                                          });

                                          common.testUserInfo({
                                            streetNormalApiMemo2: nick,
                                          });
                                        }}
                                      >
                                        <EditIcon
                                          sx={{
                                            width: 18,
                                            height: 18,
                                          }}
                                        />
                                      </IconButton>

                                      <Typography noWrap fontSize={14}>
                                        {common.user.userInfo.streetNormalApiMemo2
                                          ? common.user.userInfo.streetNormalApiMemo2
                                          : '오픈 API (N2)'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                md={8}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TextField
                                  id="connects_streetNormal2"
                                  size="small"
                                  disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A113').connected}
                                  variant="outlined"
                                  sx={{
                                    width: '100%',
                                  }}
                                  inputProps={{
                                    style: {
                                      fontSize: 14,
                                    },
                                  }}
                                  defaultValue={common.user.userInfo.streetNormalApiKey2}
                                  onBlur={(e) => {
                                    common.setUserInfo({
                                      ...common.user.userInfo,
                                      streetNormalApiKey2: e.target.value,
                                    });

                                    common.initConnectedInfo('A113');
                                  }}
                                />
                              </Grid>
                            </>
                          ) : null}

                          {common.user.userInfo.streetNormalApiKey3 ? (
                            <>
                              <Grid
                                item
                                xs={6}
                                md={4}
                                sx={{
                                  margin: 'auto',
                                }}
                              >
                                <FormControlLabel
                                  value="3"
                                  control={<Radio size="small" />}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 125,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        edge="start"
                                        sx={{
                                          mx: 0.5,
                                        }}
                                        onClick={() => {
                                          const nick = prompt('별칭을 입력해주세요.');

                                          if (!nick) {
                                            return;
                                          }

                                          common.setUserInfo({
                                            ...common.user.userInfo,
                                            streetNormalApiMemo3: nick,
                                          });

                                          common.testUserInfo({
                                            streetNormalApiMemo3: nick,
                                          });
                                        }}
                                      >
                                        <EditIcon
                                          sx={{
                                            width: 18,
                                            height: 18,
                                          }}
                                        />
                                      </IconButton>

                                      <Typography noWrap fontSize={14}>
                                        {common.user.userInfo.streetNormalApiMemo3
                                          ? common.user.userInfo.streetNormalApiMemo3
                                          : '오픈 API (N3)'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                md={8}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TextField
                                  id="connects_streetNormal3"
                                  size="small"
                                  disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A113').connected}
                                  variant="outlined"
                                  sx={{
                                    width: '100%',
                                  }}
                                  inputProps={{
                                    style: {
                                      fontSize: 14,
                                    },
                                  }}
                                  defaultValue={common.user.userInfo.streetNormalApiKey3}
                                  onBlur={(e) => {
                                    common.setUserInfo({
                                      ...common.user.userInfo,
                                      streetNormalApiKey3: e.target.value,
                                    });

                                    common.initConnectedInfo('A113');
                                  }}
                                />
                              </Grid>
                            </>
                          ) : null}

                          {common.user.userInfo.streetNormalApiKey4 ? (
                            <>
                              <Grid
                                item
                                xs={6}
                                md={4}
                                sx={{
                                  margin: 'auto',
                                }}
                              >
                                <FormControlLabel
                                  value="4"
                                  control={<Radio size="small" />}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 125,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        edge="start"
                                        sx={{
                                          mx: 0.5,
                                        }}
                                        onClick={() => {
                                          const nick = prompt('별칭을 입력해주세요.');

                                          if (!nick) {
                                            return;
                                          }

                                          common.setUserInfo({
                                            ...common.user.userInfo,
                                            streetNormalApiMemo4: nick,
                                          });

                                          common.testUserInfo({
                                            streetNormalApiMemo4: nick,
                                          });
                                        }}
                                      >
                                        <EditIcon
                                          sx={{
                                            width: 18,
                                            height: 18,
                                          }}
                                        />
                                      </IconButton>

                                      <Typography noWrap fontSize={14}>
                                        {common.user.userInfo.streetNormalApiMemo4
                                          ? common.user.userInfo.streetNormalApiMemo4
                                          : '오픈 API (N4)'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                md={8}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TextField
                                  id="connects_streetNormal4"
                                  size="small"
                                  disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A113').connected}
                                  variant="outlined"
                                  sx={{
                                    width: '100%',
                                  }}
                                  inputProps={{
                                    style: {
                                      fontSize: 14,
                                    },
                                  }}
                                  defaultValue={common.user.userInfo.streetNormalApiKey4}
                                  onBlur={(e) => {
                                    common.setUserInfo({
                                      ...common.user.userInfo,
                                      streetNormalApiKey4: e.target.value,
                                    });

                                    common.initConnectedInfo('A113');
                                  }}
                                />
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                      </RadioGroup>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A113').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A113');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      지마켓
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.gmarketUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'A006').connected}
                        onChange={async (e) => {
                          const gmarketUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ gmarketUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            gmarketUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          지마켓 아이디
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_gmarket1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A006').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.esmplusGmarketId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                esmplusGmarketId: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A006').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A006');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      옥션
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.auctionUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'A001').connected}
                        onChange={async (e) => {
                          const auctionUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ auctionUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            auctionUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          옥션 아이디
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_auction1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A001').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.esmplusAuctionId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                esmplusAuctionId: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A001').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A001');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      인터파크
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.interparkUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'A027').connected}
                        onChange={async (e) => {
                          const interparkUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ interparkUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            interparkUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          상품등록 인증키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_interpark1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A027').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.interparkCertKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                interparkCertKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          상품등록 비밀키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_interpark2"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A027').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.interparkSecretKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                interparkSecretKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          상품수정 인증키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_interpark3"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A027').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.interparkEditCertKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                interparkEditCertKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          상품수정 비밀키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_interpark4"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A027').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.interparkEditSecretKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                interparkEditSecretKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A027').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A027');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      위메프
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.wemakepriceUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'B719').connected}
                        onChange={async (e) => {
                          const wemakepriceUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ wemakepriceUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            wemakepriceUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          위메프 아이디
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_wemakeprice1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B719').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.wemakepriceId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                wemakepriceId: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'B719').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('B719');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      롯데온
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.lotteonUseType === 'Y' ? true : false}
                        disabled={
                          !(
                            common.uploadInfo.markets.find((v: any) => v.code === 'A524').connected ||
                            common.uploadInfo.markets.find((v: any) => v.code === 'A525').connected
                          )
                        }
                        onChange={async (e) => {
                          const lotteonUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ lotteonUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            lotteonUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          거래처번호
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_lotteon1"
                            size="small"
                            disabled={
                              common.uploadInfo.markets.find((v: any) => v.code === 'A524').connected &&
                              common.uploadInfo.markets.find((v: any) => v.code === 'A525').connected
                            }
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.lotteonVendorId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                lotteonVendorId: e.target.value,
                              });
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          인증키
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_lotteon2"
                            size="small"
                            disabled={
                              common.uploadInfo.markets.find((v: any) => v.code === 'A524').connected &&
                              common.uploadInfo.markets.find((v: any) => v.code === 'A525').connected
                            }
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.lotteonApiKey}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                lotteonApiKey: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'A524').connected &&
                      common.uploadInfo.markets.find((v: any) => v.code === 'A525').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('A524/A525');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 275,
                    }}
                  >
                    <Title dark={common.darkTheme}>
                      티몬
                      <Switch
                        size="small"
                        checked={common.user.userInfo?.tmonUseType === 'Y' ? true : false}
                        disabled={!common.uploadInfo.markets.find((v: any) => v.code === 'B956').connected}
                        onChange={async (e) => {
                          const tmonUseType = e.target.checked ? 'Y' : 'N';

                          await common.testUserInfo({ tmonUseType });

                          common.setUserInfo({
                            ...common.user.userInfo,
                            tmonUseType,
                          });
                        }}
                      />
                    </Title>

                    <Box
                      sx={{
                        height: 190,
                      }}
                    >
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
                          md={4}
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          티몬 파트너 번호
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={8}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TextField
                            id="connects_tmon1"
                            size="small"
                            disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B956').connected}
                            variant="outlined"
                            sx={{
                              width: '100%',
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              },
                            }}
                            defaultValue={common.user.userInfo.tmonId}
                            onBlur={(e) => {
                              common.setUserInfo({
                                ...common.user.userInfo,
                                tmonId: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      {common.uploadInfo.markets.find((v: any) => v.code === 'B956').connected ? (
                        <Button
                          disabled
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          연동완료
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="info"
                          sx={{
                            width: '100%',
                          }}
                          onClick={() => {
                            common.verifyConnectedInfo('B956');
                          }}
                        >
                          연동하기
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : null}
        </Container>
      </Frame>
    </ThemeProvider>
  );
});
