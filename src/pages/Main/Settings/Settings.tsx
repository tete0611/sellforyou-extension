import React from 'react';
import gql from "../../../pages/Main/GraphQL/Requests";
import MUTATIONS from "../../../pages/Main/GraphQL/Mutations";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Header } from "../Common/Header";
import { readFileDataURL } from '../../Tools/Common';
import { Box, Container, Grid, IconButton, MenuItem, Paper, Select, TextField, Tooltip, Typography } from '@mui/material';

const title = {
  alignItems: "center",
  background: "#d1e8ff",
  display: "flex",
  fontSize: 16,
  justifyContent: "space-between",
  px: 1,
  height: 40
};

async function uploadImage(data: any) {
  let formData = new FormData();

  if (data.fixImageTop) {
    let operations = {
      "variables": {
        "fixImageTop": null
      },

      "query": "mutation ($fixImageTop: Upload) {\n  updateMyDataByUser(\n    fixImageTop: $fixImageTop\n  )\n}\n"
    };

    let map = { "1": ["variables.fixImageTop"] };

    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('1', data.fixImageTop, `top1.${data.fixImageTop.name.split(".")[1]}`);
  }

  if (data.fixImageSubTop) {
    let operations = {
      "variables": {
        "fixImageSubTop": null
      },

      "query": "mutation ($fixImageSubTop: Upload) {\n  updateMyDataByUser(\n    fixImageSubTop: $fixImageSubTop\n  )\n}\n"
    };

    let map = { "1": ["variables.fixImageSubTop"] };

    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('1', data.fixImageSubTop, `top2.${data.fixImageSubTop.name.split(".")[1]}`);
  }

  if (data.fixImageBottom) {
    let operations = {
      "variables": {
        "fixImageBottom": null
      },

      "query": "mutation ($fixImageBottom: Upload) {\n  updateMyDataByUser(\n    fixImageBottom: $fixImageBottom\n  )\n}\n"
    };

    let map = { "1": ["variables.fixImageBottom"] };

    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('1', data.fixImageBottom, `bottom1.${data.fixImageBottom.name.split(".")[1]}`);
  }

  if (data.fixImageSubBottom) {
    let operations = {
      "variables": {
        "fixImageSubBottom": null
      },

      "query": "mutation ($fixImageSubBottom: Upload) {\n  updateMyDataByUser(\n    fixImageSubBottom: $fixImageSubBottom\n  )\n}\n"
    };

    let map = { "1": ["variables.fixImageSubBottom"] };

    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('1', data.fixImageSubBottom, `bottom2.${data.fixImageSubBottom.name.split(".")[1]}`);
  }

  const response = await gql(null, formData, true);

  if (response.errors) {
    alert(response.errors[0].message);

    return;
  }
}

async function uploadImageFromUrl(data: any) {
  const response = await gql(MUTATIONS.UPDATE_MY_IMAGE_URL_BY_USER, data, false);

  if (response.errors) {
    alert(response.errors[0].message);

    return;
  }
}

export const Settings = observer(() => {
  const { common } = React.useContext(AppContext);

  return (
    <>
      <Header />

      <Container maxWidth={'lg'}>
        {common.user.userInfo ?
          <>
            <Paper variant="outlined" sx={{
              border: "1px solid #d1e8ff",
              fontSize: 14,
              p: 0,
              mb: 1,
            }}>
              <Box sx={title}>
                공통 설정
              </Box>

              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 1
              }}>
                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            환율
                          </Typography>

                          <Tooltip title="위안화인 경우 원화로 환산될 단위를 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_cnyRate" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.cnyRate}`}
                            onBlur={async (e) => {
                              const cnyRate = parseInt(e.target.value);

                              if (isNaN(cnyRate)) {
                                alert("[환율] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ cnyRate });
                              common.setUserInfo({ ...common.user.userInfo, cnyRate });
                            }}
                          />

                          <Typography fontSize={14}>
                            원
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            배대지배송비
                          </Typography>

                          <Tooltip title="배대지까지의 운송비용을 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_defaultShippingFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.defaultShippingFee}`}
                            onBlur={async (e) => {
                              const defaultShippingFee = parseInt(e.target.value);

                              if (isNaN(defaultShippingFee)) {
                                alert("[배대지배송비] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ defaultShippingFee });
                              common.setUserInfo({ ...common.user.userInfo, defaultShippingFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            원
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            마진율
                          </Typography>

                          <Tooltip title="원화 + 배대지배송비 기준 추가 마진 금액을 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_marginRate" size="small"
                            variant='outlined'
                            sx={{
                              width: 60,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.marginRate}`}
                            onBlur={async (e) => {
                              const marginRate = parseInt(e.target.value);

                              if (isNaN(marginRate)) {
                                alert("[마진율] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ marginRate });
                              common.setUserInfo({ ...common.user.userInfo, marginRate });
                            }}
                          />

                          &nbsp;

                          <Select size="small"
                            sx={{
                              fontSize: 14,
                              width: 60
                            }}
                            value={common.user.userInfo?.marginUnitType}
                            onChange={async (e) => {
                              const marginUnitType = e.target.value;

                              if (!marginUnitType) {
                                alert("[마진단위] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ marginUnitType });
                              common.setUserInfo({ ...common.user.userInfo, marginUnitType });
                            }}
                          >
                            <MenuItem value="PERCENT">
                              %
                            </MenuItem>

                            <MenuItem value="WON">
                              원
                            </MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본할인가
                          </Typography>

                          <Tooltip title="오픈마켓에 표시할 할인금액을 설정합니다. (0 입력 시 미적용)">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_discountAmount" size="small"
                            variant='outlined'
                            sx={{
                              width: 60,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.discountAmount}`}
                            onBlur={async (e) => {
                              const discountAmount = parseInt(e.target.value);

                              if (isNaN(discountAmount)) {
                                alert("[기본할인가] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ discountAmount });
                              common.setUserInfo({ ...common.user.userInfo, discountAmount });
                            }}
                          />

                          &nbsp;

                          <Select size="small"
                            sx={{
                              fontSize: 14,
                              width: 60
                            }}
                            value={common.user.userInfo?.discountUnitType}
                            onChange={async (e) => {
                              const discountUnitType = e.target.value;

                              if (!discountUnitType) {
                                alert("[기본할인가단위] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ discountUnitType });
                              common.setUserInfo({ ...common.user.userInfo, discountUnitType });
                            }}
                          >
                            <MenuItem value="PERCENT">
                              %
                            </MenuItem>

                            <MenuItem value="WON">
                              원
                            </MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            유료배송비
                          </Typography>

                          <Tooltip title="오픈마켓에 표시할 배송비를 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_extraShippingFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.extraShippingFee}`}
                            onBlur={async (e) => {
                              const extraShippingFee = parseInt(e.target.value);

                              if (isNaN(extraShippingFee)) {
                                alert("[유료배송비] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ extraShippingFee });
                              common.setUserInfo({ ...common.user.userInfo, extraShippingFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            원
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            반품배송비
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_refundShippingFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.refundShippingFee}`}
                            onBlur={async (e) => {
                              const refundShippingFee = parseInt(e.target.value);

                              if (isNaN(refundShippingFee)) {
                                alert("[반품배송비] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ refundShippingFee });
                              common.setUserInfo({ ...common.user.userInfo, refundShippingFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            원
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            교환배송비
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_exchangeShippingFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.exchangeShippingFee}`}
                            onBlur={async (e) => {
                              const exchangeShippingFee = parseInt(e.target.value);

                              if (isNaN(exchangeShippingFee)) {
                                alert("[교환배송비] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ exchangeShippingFee });
                              common.setUserInfo({ ...common.user.userInfo, exchangeShippingFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            원
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            제주/도서배송비
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_additionalShippingFeeJeju" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.additionalShippingFeeJeju}`}
                            onBlur={async (e) => {
                              const additionalShippingFeeJeju = parseInt(e.target.value);

                              if (isNaN(additionalShippingFeeJeju)) {
                                alert("[제주/도서배송비] 숫자만 입력하실 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ additionalShippingFeeJeju });
                              common.setUserInfo({ ...common.user.userInfo, additionalShippingFeeJeju });
                            }}
                          />

                          <Typography fontSize={14}>
                            원
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            A/S전화번호
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_asTel" size="small"
                            variant='outlined'
                            sx={{
                              width: "100%",
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.asTel}`}
                            onBlur={async (e) => {
                              const asTel = e.target.value;

                              if (!asTel) {
                                alert("[A/S전화번호] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ asTel });
                              common.setUserInfo({ ...common.user.userInfo, asTel });
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={9}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={1.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            A/S안내내용
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={10.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_asInformation" size="small"
                            variant='outlined'
                            sx={{
                              width: "100%",
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.asInformation}`}
                            onBlur={async (e) => {
                              const asInformation = e.target.value;

                              if (!asInformation) {
                                alert("[A/S안내내용] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ asInformation });
                              common.setUserInfo({ ...common.user.userInfo, asInformation });
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            상단이미지1
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex"
                        }}>
                          <a target="_blank" href={common.user.userInfo?.fixImageTop}>
                            <img src={common.user.userInfo?.fixImageTop} width={126} height={126} style={{
                              objectFit: "contain"
                            }} />
                          </a>
                        </Box>

                        <Paper variant="outlined" sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}>
                          <label htmlFor="fixImageTop">
                            <input accept="image/*" id="fixImageTop" type="file" style={{
                              display: "none"
                            }} onChange={async (e) => {
                              const fileList = e.target.files ?? [];
                              const fileData = await readFileDataURL(fileList[0]);

                              await uploadImage({ fixImageTop: fileList[0] });

                              common.setUserInfo({
                                ...common.user.userInfo,
                                fixImageTop: fileData
                              });
                            }} />
                            <IconButton size="small" color="info" component="span">
                              <InsertPhotoIcon />
                            </IconButton>
                          </label>

                          <IconButton size="small" component="span" onClick={async () => {
                            const url = prompt("이미지 URL을 입력해주세요.") ?? "";

                            if (url === "") {
                              alert("주소가 올바르지 않습니다.");

                              return 0;
                            }

                            await uploadImageFromUrl({ fixImageTop: url });

                            common.setUserInfo({
                              ...common.user.userInfo,
                              fixImageTop: url
                            });
                          }}>
                            <LinkIcon />
                          </IconButton>

                          <IconButton size="small" color="error" component="span" onClick={async () => {
                            await common.testUserInfo({ fixImageTop: null })

                            common.setUserInfo({ ...common.user.userInfo, fixImageTop: null });
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            상단이미지2
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex"
                        }}>
                          <a target="_blank" href={common.user.userInfo?.fixImageSubTop}>
                            <img src={common.user.userInfo?.fixImageSubTop} width={126} height={126} style={{
                              objectFit: "contain"
                            }} />
                          </a>
                        </Box>

                        <Paper variant="outlined" sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}>
                          <label htmlFor="fixImageSubTop">
                            <input accept="image/*" id="fixImageSubTop" type="file" style={{
                              display: "none"
                            }} onChange={async (e) => {
                              const fileList = e.target.files ?? [];
                              const fileData = await readFileDataURL(fileList[0]);

                              await uploadImage({ fixImageSubTop: fileList[0] });

                              common.setUserInfo({
                                ...common.user.userInfo,
                                fixImageSubTop: fileData
                              });
                            }} />
                            <IconButton size="small" color="info" component="span">
                              <InsertPhotoIcon />
                            </IconButton>
                          </label>

                          <IconButton size="small" component="span" onClick={async () => {
                            const url = prompt("이미지 URL을 입력해주세요.") ?? "";

                            if (url === "") {
                              alert("주소가 올바르지 않습니다.");

                              return 0;
                            }

                            await uploadImageFromUrl({ fixImageSubTop: url });

                            common.setUserInfo({
                              ...common.user.userInfo,
                              fixImageSubTop: url
                            });
                          }}>
                            <LinkIcon />
                          </IconButton>

                          <IconButton size="small" color="error" component="span" onClick={async () => {
                            await common.testUserInfo({ fixImageSubTop: null })

                            common.setUserInfo({ ...common.user.userInfo, fixImageSubTop: null });
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            하단이미지1
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex"
                        }}>
                          <a target="_blank" href={common.user.userInfo?.fixImageBottom}>
                            <img src={common.user.userInfo?.fixImageBottom} width={126} height={126} style={{
                              objectFit: "contain"
                            }} />
                          </a>
                        </Box>

                        <Paper variant="outlined" sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}>
                          <label htmlFor="fixImageBottom">
                            <input accept="image/*" id="fixImageBottom" type="file" style={{
                              display: "none"
                            }} onChange={async (e) => {
                              const fileList = e.target.files ?? [];
                              const fileData = await readFileDataURL(fileList[0]);

                              await uploadImage({ fixImageBottom: fileList[0] });

                              common.setUserInfo({
                                ...common.user.userInfo,
                                fixImageBottom: fileData
                              });
                            }} />
                            <IconButton size="small" color="info" component="span">
                              <InsertPhotoIcon />
                            </IconButton>
                          </label>

                          <IconButton size="small" component="span" onClick={async () => {
                            const url = prompt("이미지 URL을 입력해주세요.") ?? "";

                            if (url === "") {
                              alert("주소가 올바르지 않습니다.");

                              return 0;
                            }

                            await uploadImageFromUrl({ fixImageBottom: url });

                            common.setUserInfo({
                              ...common.user.userInfo,
                              fixImageBottom: url
                            });
                          }}>
                            <LinkIcon />
                          </IconButton>

                          <IconButton size="small" color="error" component="span" onClick={async () => {
                            await common.testUserInfo({ fixImageBottom: null })

                            common.setUserInfo({ ...common.user.userInfo, fixImageBottom: null });
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            하단이미지2
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex"
                        }}>
                          <a target="_blank" href={common.user.userInfo?.fixImageSubBottom}>
                            <img src={common.user.userInfo?.fixImageSubBottom} width={126} height={126} style={{
                              objectFit: "contain"
                            }} />
                          </a>
                        </Box>

                        <Paper variant="outlined" sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}>
                          <label htmlFor="fixImageSubBottom">
                            <input accept="image/*" id="fixImageSubBottom" type="file" style={{
                              display: "none"
                            }} onChange={async (e) => {
                              const fileList = e.target.files ?? [];
                              const fileData = await readFileDataURL(fileList[0]);

                              await uploadImage({ fixImageSubBottom: fileList[0] });

                              common.setUserInfo({
                                ...common.user.userInfo,
                                fixImageSubBottom: fileData
                              });
                            }} />
                            <IconButton size="small" color="info" component="span">
                              <InsertPhotoIcon />
                            </IconButton>
                          </label>

                          <IconButton size="small" component="span" onClick={async () => {
                            const url = prompt("이미지 URL을 입력해주세요.") ?? "";

                            if (url === "") {
                              alert("주소가 올바르지 않습니다.");

                              return 0;
                            }

                            await uploadImageFromUrl({ fixImageSubBottom: url });

                            common.setUserInfo({
                              ...common.user.userInfo,
                              fixImageSubBottom: url
                            });
                          }}>
                            <LinkIcon />
                          </IconButton>

                          <IconButton size="small" color="error" component="span" onClick={async () => {
                            await common.testUserInfo({ fixImageSubBottom: null })

                            common.setUserInfo({ ...common.user.userInfo, fixImageSubBottom: null });
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            상세페이지

                            <br />

                            옵션위치
                          </Typography>

                          <Tooltip title="상세페이지에 옵션을 표시할 위치를 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.optionAlignTop ?? ""}
                            onChange={async (e) => {
                              const optionAlignTop = e.target.value;

                              if (!optionAlignTop) {
                                alert("[상세페이지옵션위치] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ optionAlignTop })
                              common.setUserInfo({ ...common.user.userInfo, optionAlignTop });
                            }}
                          >
                            <MenuItem value={"Y"}>상단</MenuItem>
                            <MenuItem value={"N"}>하단</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            상세페이지

                            <br />

                            상품명표시
                          </Typography>

                          <Tooltip title="상세페이지 상단에 상품명을 표기할 수 있습니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.descriptionShowTitle ?? ""}
                            onChange={async (e) => {
                              const descriptionShowTitle = e.target.value;

                              if (!descriptionShowTitle) {
                                alert("[상세페이지상품명표시] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ descriptionShowTitle })
                              common.setUserInfo({ ...common.user.userInfo, descriptionShowTitle });
                            }}
                          >
                            <MenuItem value={"Y"}>사용</MenuItem>
                            <MenuItem value={"N"}>사용안함</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            옵션정보

                            <br />

                            표기방식
                          </Typography>

                          <Tooltip title="옵션을 표기할 방식을 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.optionIndexType ?? ""}
                            onChange={async (e) => {
                              const optionIndexType = e.target.value;

                              if (!optionIndexType) {
                                alert("[옵션정보표기방식] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ optionIndexType })
                              common.setUserInfo({ ...common.user.userInfo, optionIndexType });
                            }}
                          >
                            <MenuItem value={1}>숫자 + 옵션명</MenuItem>
                            <MenuItem value={2}>옵션명만 사용</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            옵션정보

                            <br />

                            배치형식
                          </Typography>

                          <Tooltip title="옵션을 배치할 레이아웃을 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.optionTwoWays ?? ""}
                            onChange={async (e) => {
                              const optionTwoWays = e.target.value;

                              if (!optionTwoWays) {
                                alert("[옵션정보배치형식] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ optionTwoWays })
                              common.setUserInfo({ ...common.user.userInfo, optionTwoWays });
                            }}
                          >
                            <MenuItem value={"N"}>1열</MenuItem>
                            <MenuItem value={"Y"}>2열</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            판매가격

                            <br />

                            노출설정
                          </Typography>

                          <Tooltip title="상품에 표시되는 기준가격을 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.defaultPrice ?? ""}
                            onChange={async (e) => {
                              const defaultPrice = e.target.value;

                              if (!defaultPrice) {
                                alert("[판매가격노출설정] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ defaultPrice })
                              common.setUserInfo({ ...common.user.userInfo, defaultPrice });
                            }}
                          >
                            <MenuItem value={"L"}>최저가격</MenuItem>
                            <MenuItem value={"M"}>중간가격</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            판매가격

                            <br />

                            환산단위
                          </Typography>

                          <Tooltip title="환산될 단위를 설정합니다. (오픈마켓 등록 시 올림으로 처리)">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.calculateWonType ?? ""}
                            onChange={async (e) => {
                              const calculateWonType = e.target.value;

                              if (!calculateWonType) {
                                alert("[판매가격설정단위] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ calculateWonType })
                              common.setUserInfo({ ...common.user.userInfo, calculateWonType });
                            }}
                          >
                            <MenuItem value={"100"}>100원</MenuItem>
                            <MenuItem value={"500"}>500원</MenuItem>
                            <MenuItem value={"1000"}>1000원</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            옵션가격

                            <br />

                            자동설정
                          </Typography>

                          <Tooltip title="오픈마켓 가격 허용범위를 초과하는 옵션을 자동으로 탐색합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.autoPrice ?? ""}
                            onChange={async (e) => {
                              const autoPrice = e.target.value;

                              if (!autoPrice) {
                                alert("[옵션가격자동설정] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ autoPrice })
                              common.setUserInfo({ ...common.user.userInfo, autoPrice });
                            }}
                          >
                            <MenuItem value={"Y"}>사용</MenuItem>
                            <MenuItem value={"N"}>사용안함</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            재고수량

                            <br />

                            일괄설정
                          </Typography>

                          <Tooltip title="상품 수집 시 고정 재고수량을 설정합니다. (0 입력 시 자동설정)">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_collectStock" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.collectStock}`}
                            onBlur={async (e) => {
                              const collectStock = parseInt(e.target.value);

                              if (isNaN(collectStock)) {
                                alert("[재고수량일괄설정] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ collectStock })
                              common.setUserInfo({ ...common.user.userInfo, collectStock });
                            }}
                          />

                          <Typography fontSize={14}>
                            개
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            상품수집

                            <br />

                            제한시간
                          </Typography>

                          <Tooltip title="상품 수집 시 최대 대기시간을 설정합니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_collectTimeout" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.collectTimeout}`}
                            onBlur={async (e) => {
                              const collectTimeout = parseInt(e.target.value);

                              if (isNaN(collectTimeout)) {
                                alert("[상품수집제한시간] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ collectTimeout })
                              common.setUserInfo({ ...common.user.userInfo, collectTimeout });
                            }}
                          />

                          <Typography fontSize={14}>
                            초
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={9} sx={{
                  margin: "auto"
                }}>

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
                오픈마켓수수료 설정
              </Box>

              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 1
              }}>
                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-smartstore.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_naverFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.naverFee}
                            onBlur={async (e) => {
                              const naverFee = parseFloat(e.target.value)

                              if (isNaN(naverFee)) {
                                alert("[스마트스토어 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ naverFee })
                              common.setUserInfo({ ...common.user.userInfo, naverFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-coupang.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_coupangFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.coupangFee}
                            onBlur={async (e) => {
                              const coupangFee = parseFloat(e.target.value)

                              if (isNaN(coupangFee)) {
                                alert("[쿠팡 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangFee })
                              common.setUserInfo({ ...common.user.userInfo, coupangFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-street-global.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_streetFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.streetFee}
                            onBlur={async (e) => {
                              const streetFee = parseFloat(e.target.value)

                              if (isNaN(streetFee)) {
                                alert("[11번가(글로벌) 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ streetFee })
                              common.setUserInfo({ ...common.user.userInfo, streetFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-street-normal.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_streetNormalFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.streetNormalFee}
                            onBlur={async (e) => {
                              const streetNormalFee = parseFloat(e.target.value)

                              if (isNaN(streetNormalFee)) {
                                alert("[11번가(일반) 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ streetNormalFee })
                              common.setUserInfo({ ...common.user.userInfo, streetNormalFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-gmarket.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_gmarketFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.gmarketFee}
                            onBlur={async (e) => {
                              const gmarketFee = parseFloat(e.target.value)

                              if (isNaN(gmarketFee)) {
                                alert("[지마켓 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ gmarketFee })
                              common.setUserInfo({ ...common.user.userInfo, gmarketFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-auction.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_auctionFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.auctionFee}
                            onBlur={async (e) => {
                              const auctionFee = parseFloat(e.target.value)

                              if (isNaN(auctionFee)) {
                                alert("[옥션 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ auctionFee })
                              common.setUserInfo({ ...common.user.userInfo, auctionFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-interpark.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_interparkFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.interparkFee}
                            onBlur={async (e) => {
                              const interparkFee = parseFloat(e.target.value)

                              if (isNaN(interparkFee)) {
                                alert("[인터파크 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ interparkFee })
                              common.setUserInfo({ ...common.user.userInfo, interparkFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-wemakeprice.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_wemakepriceFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.wemakepriceFee}
                            onBlur={async (e) => {
                              const wemakepriceFee = parseFloat(e.target.value)

                              if (isNaN(wemakepriceFee)) {
                                alert("[위메프 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ wemakepriceFee })
                              common.setUserInfo({ ...common.user.userInfo, wemakepriceFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-lotteon-global.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_lotteonFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.lotteonFee}
                            onBlur={async (e) => {
                              const lotteonFee = parseFloat(e.target.value)

                              if (isNaN(lotteonFee)) {
                                alert("[롯데온(글로벌) 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ lotteonFee })
                              common.setUserInfo({ ...common.user.userInfo, lotteonFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-lotteon-normal.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_lotteonNormalFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.lotteonNormalFee}
                            onBlur={async (e) => {
                              const lotteonNormalFee = parseFloat(e.target.value)

                              if (isNaN(lotteonNormalFee)) {
                                alert("[롯데온(일반) 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ lotteonNormalFee })
                              common.setUserInfo({ ...common.user.userInfo, lotteonNormalFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={1.5}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={4} sx={{
                        margin: "auto"
                      }}>
                        <img src="/resources/icon-tmon.png" />
                      </Grid>

                      <Grid item xs={6} md={8} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_tmonFee" size="small"
                            variant='outlined'
                            sx={{
                              width: 50,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.tmonFee}
                            onBlur={async (e) => {
                              const tmonFee = parseFloat(e.target.value)

                              if (isNaN(tmonFee)) {
                                alert("[티몬 수수료] 숫자만 입력할 수 있습니다.");

                                return;
                              }

                              await common.testUserInfo({ tmonFee })
                              common.setUserInfo({ ...common.user.userInfo, tmonFee });
                            }}
                          />

                          <Typography fontSize={14}>
                            %
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
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
                스마트스토어 설정
              </Box>

              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 1
              }}>
                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            원산지
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.naverOriginCode ?? ""}
                            onChange={async (e) => {
                              const naverOriginCode = e.target.value;

                              if (!naverOriginCode) {
                                alert("[원산지] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ naverOriginCode })
                              common.setUserInfo({ ...common.user.userInfo, naverOriginCode });
                            }}
                          >
                            <MenuItem value={"0200037"}>중국</MenuItem>
                            <MenuItem value={"0204000"}>미국</MenuItem>
                            <MenuItem value={"0200036"}>일본</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            수입사
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_naverOrigin" size="small"
                            variant='outlined'
                            sx={{
                              width: "100%",
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                              }
                            }}
                            defaultValue={`${common.user.userInfo?.naverOrigin}`}
                            onBlur={async (e) => {
                              const naverOrigin = e.target.value;

                              if (!naverOrigin) {
                                alert("[수입사] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ naverOrigin })
                              common.setUserInfo({ ...common.user.userInfo, naverOrigin });
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            스토어전용상품명
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.naverStoreOnly ?? ""}
                            onChange={async (e) => {
                              const naverStoreOnly = e.target.value;

                              if (!naverStoreOnly) {
                                alert("[스토어상품명] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ naverStoreOnly })
                              common.setUserInfo({ ...common.user.userInfo, naverStoreOnly });
                            }}
                          >
                            <MenuItem value={"Y"}>사용</MenuItem>
                            <MenuItem value={"N"}>사용안함</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            태그자동입력
                          </Typography>

                          <Tooltip title="상품 수집 시 카테고리에 맞는 태그 10개가 임의로 설정됩니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.naverAutoSearchTag}`}
                            onChange={async (e) => {
                              const naverAutoSearchTag = e.target.value;

                              if (!naverAutoSearchTag) {
                                alert("[태그자동입력] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ naverAutoSearchTag })
                              common.setUserInfo({ ...common.user.userInfo, naverAutoSearchTag });
                            }}
                          >
                            <MenuItem value="Y">
                              사용
                            </MenuItem>

                            <MenuItem value="N">
                              미사용
                            </MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
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
                쿠팡 설정
              </Box>

              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 1
              }}>
                <Grid item xs={6} md={6}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={2.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본출고지
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={9.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.coupangDefaultOutbound}`}
                            onChange={async (e) => {
                              const coupangDefaultOutbound = e.target.value;

                              if (!coupangDefaultOutbound) {
                                alert("[기본출고지] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangDefaultOutbound })
                              common.setUserInfo({ ...common.user.userInfo, coupangDefaultOutbound });
                            }}
                          >
                            {common.deliveryInfo.coupangOutboundList?.map((v: any) => <MenuItem value={`${v.outboundShippingPlaceCode}`}>
                              [{v.shippingPlaceName}] {v.placeAddresses[0].returnAddress} {v.placeAddresses[0].returnAddressDetail}
                            </MenuItem>)}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={6}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={2.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본반품지
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={9.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.coupangDefaultInbound}`}
                            onChange={async (e) => {
                              const coupangDefaultInbound = e.target.value;

                              if (!coupangDefaultInbound) {
                                alert("[기본반품지] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangDefaultInbound })
                              common.setUserInfo({ ...common.user.userInfo, coupangDefaultInbound });
                            }}
                          >
                            {common.deliveryInfo.coupangInboundList?.map((v: any) => <MenuItem value={`${v.returnCenterCode}`}>
                              [{v.shippingPlaceName}] {v.placeAddresses[0].returnAddress} {v.placeAddresses[0].returnAddressDetail}
                            </MenuItem>)}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            배송출고

                            <br />

                            소요기간
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_coupangOutboundShippingTimeDay" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.coupangOutboundShippingTimeDay}
                            onBlur={async (e) => {
                              const coupangOutboundShippingTimeDay = parseInt(e.target.value);

                              if (isNaN(coupangOutboundShippingTimeDay)) {
                                alert("[배송출고소요기간] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangOutboundShippingTimeDay })
                              common.setUserInfo({ ...common.user.userInfo, coupangOutboundShippingTimeDay });
                            }}
                          />

                          <Typography fontSize={14}>
                            일
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            묶음배송

                            <br />

                            처리여부
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.coupangUnionDeliveryType ?? ""}
                            onChange={async (e) => {
                              const coupangUnionDeliveryType = e.target.value;

                              if (!coupangUnionDeliveryType) {
                                alert("[묶음배송] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangUnionDeliveryType })
                              common.setUserInfo({ ...common.user.userInfo, coupangUnionDeliveryType });
                            }}
                          >
                            <MenuItem value={"Y"}>사용</MenuItem>
                            <MenuItem value={"N"}>사용안함</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            1인당최대

                            <br />

                            구매수량
                          </Typography>

                          <Tooltip title="1인당 최대 구매수량을 제한합니다. (0 입력 시 제한없음)">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <TextField id="settings_coupangMaximumBuyForPerson" size="small"
                            variant='outlined'
                            sx={{
                              width: 100,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "right"
                              }
                            }}
                            defaultValue={common.user.userInfo?.coupangMaximumBuyForPerson}
                            onBlur={async (e) => {
                              const coupangMaximumBuyForPerson = parseInt(e.target.value);

                              if (isNaN(coupangMaximumBuyForPerson)) {
                                alert("[1인당최대구매수량] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangMaximumBuyForPerson })
                              common.setUserInfo({ ...common.user.userInfo, coupangMaximumBuyForPerson });
                            }}
                          />

                          <Typography fontSize={14}>
                            개
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            옵션이미지

                            <br />

                            대표설정
                          </Typography>

                          <Tooltip title="옵션별 대표이미지를 다르게 설정합니다. (상품이 분리될 수 있음)">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={common.user.userInfo?.coupangImageOpt ?? ""}
                            onChange={async (e) => {
                              const coupangImageOpt = e.target.value;

                              if (!coupangImageOpt) {
                                alert("[옵션이미지대표설정] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ coupangImageOpt })
                              common.setUserInfo({ ...common.user.userInfo, coupangImageOpt });
                            }}
                          >
                            <MenuItem value={"Y"}>사용</MenuItem>
                            <MenuItem value={"N"}>사용안함</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
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
                11번가 설정
              </Box>

              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 1
              }}>
                <Grid item xs={6} md={6}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={2.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본출고지(글로벌)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={9.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.streetDefaultOutbound}`}
                            onChange={async (e) => {
                              const streetDefaultOutbound = e.target.value;

                              if (!streetDefaultOutbound) {
                                alert("[기본출고지(글로벌)] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ streetDefaultOutbound })
                              common.setUserInfo({ ...common.user.userInfo, streetDefaultOutbound });
                            }}
                          >
                            {common.deliveryInfo.streetGlobalOutboundList?.map((v: any) => <MenuItem value={`${v.addrSeq[0]}`}>
                              [{v.addrNm[0]}] {v.addr[0]}
                            </MenuItem>)}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={6}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={2.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본반품지(글로벌)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={9.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.streetDefaultInbound}`}
                            onChange={async (e) => {
                              const streetDefaultInbound = e.target.value;

                              if (!streetDefaultInbound) {
                                alert("[기본반품지(글로벌)] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ streetDefaultInbound })
                              common.setUserInfo({ ...common.user.userInfo, streetDefaultInbound });
                            }}
                          >
                            {common.deliveryInfo.streetGlobalInboundList?.map((v: any) => <MenuItem value={`${v.addrSeq[0]}`}>
                              [{v.addrNm[0]}] {v.addr[0]}
                            </MenuItem>)}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={6}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={2.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본출고지(일반)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={9.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.streetNormalOutbound}`}
                            onChange={async (e) => {
                              const streetNormalOutbound = e.target.value;

                              if (!streetNormalOutbound) {
                                alert("[기본출고지(일반)] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ streetNormalOutbound })
                              common.setUserInfo({ ...common.user.userInfo, streetNormalOutbound });
                            }}>
                            {common.deliveryInfo.streetNormalOutboundList?.map((v: any) => <MenuItem value={`${v.addrSeq[0]}`}>
                              [{v.addrNm[0]}] {v.addr[0]}
                            </MenuItem>)}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={6}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={2.9} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            기본반품지(일반)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={9.1} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.streetNormalInbound}`}
                            onChange={async (e) => {
                              const streetNormalInbound = e.target.value;

                              if (!streetNormalInbound) {
                                alert("[기본반품지(일반)] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ streetNormalInbound })
                              common.setUserInfo({ ...common.user.userInfo, streetNormalInbound });
                            }}
                          >
                            {common.deliveryInfo.streetNormalInboundList?.map((v: any) => <MenuItem value={`${v.addrSeq[0]}`}>
                              [{v.addrNm[0]}] {v.addr[0]}
                            </MenuItem>)}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
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
                롯데온 설정
              </Box>

              <Grid container spacing={1} sx={{
                textAlign: "center",
                p: 1
              }}>
                <Grid item xs={6} md={3}>
                  <Paper variant="outlined" sx={{
                    p: 1
                  }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Typography fontSize={14}>
                            셀러구분
                          </Typography>

                          <Tooltip title="글로벌유형과 일반유형 중 하나만 사용할 수 있습니다.">
                            <HelpOutlineIcon color="info" sx={{
                              fontSize: 14
                            }} />
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{
                        margin: "auto"
                      }}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Select size="small" sx={{
                            width: "100%",
                            fontSize: 14
                          }}
                            value={`${common.user.userInfo?.lotteonSellerType}`}
                            onChange={async (e) => {
                              const lotteonSellerType = e.target.value;

                              if (!lotteonSellerType) {
                                alert("[기본반품지(일반)] 입력이 잘못되었습니다.");

                                return;
                              }

                              await common.testUserInfo({ lotteonSellerType })
                              common.setUserInfo({ ...common.user.userInfo, lotteonSellerType });
                            }}
                          >
                            <MenuItem value={"G"}>
                              글로벌
                            </MenuItem>

                            <MenuItem value={"N"}>
                              일반
                            </MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={9}>
                </Grid>
              </Grid>
            </Paper>
          </>
          :
          null
        }
      </Container >
    </>
  )
})

