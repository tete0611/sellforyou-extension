import React from 'react';
import MUTATIONS from "../GraphQL/Mutations";
import gql from "../GraphQL/Requests";
import LoadingButton from '@mui/lab/LoadingButton';

import { observer } from "mobx-react";
import { Box, Button, Checkbox, Container, FormGroup, FormControlLabel, Grid, Paper, TextField } from '@mui/material';
import QUERIES from '../GraphQL/Queries';

type SignInfo = {
  email: string,
  password: string,
  passwordConfirm: string,

  name: string,
  phone: string,

  refCode: string,
  verifyCode: string,

  serviceAgreed: boolean,
  refCodeVerified: boolean,

  loading: boolean | undefined
}

type VerifyInfo = {
  process: number,

  timer: number
}

export const SignUp = observer(() => {
  const initSignInfo: SignInfo = {
    "email": "",
    "password": "",
    "passwordConfirm": "",

    "name": "",
    "phone": "",

    "refCode": "",
    "refCodeVerified": false,

    "verifyCode": "",

    "serviceAgreed": false,

    "loading": false
  };

  const initVerifyInfo: VerifyInfo = {
    "process": 0,

    "timer": 59
  };

  const [signInfo, setSignInfo] = React.useState<SignInfo>(initSignInfo);
  const [verifyInfo, setVerifyInfo] = React.useState<VerifyInfo>(initVerifyInfo);

  const getUserPurchaseInfo = async (id: string) => {
    if (!id) {
      alert("공백은 입력하실 수 없습니다.");

      return;
    }

    const response = await gql(QUERIES.SELECT_EXIST_PURCHASE_LOG, { email: id }, false);

    if (response.errors) {
      alert(response.errors[0].message);

      return;
    }

    setSignInfo({ ...signInfo, refCodeVerified: true });
  }

  const keyHandler = async (e: any) => {
    if (e.key === 'Enter') {
      signUp();
    }
  }

  const phoneVerify = async () => {
    const response = await gql(MUTATIONS.REQUEST_PHONE_VERIFICATION_BY_EVERYONE, {
      phoneNumber: signInfo.phone
    }, false);

    if (response.errors) {
      alert(response.errors[0].message);

      return;
    }

    alert("인증번호가 발송되었습니다.");

    setVerifyInfo({ ...verifyInfo, process: 1 })

    let interval = setInterval(() => {
      setVerifyInfo((state) => {
        if (state.process > 1) {
          clearInterval(interval);
        }

        if (state.timer === 0) {
          alert("입력 시간이 초과되었습니다.");

          setVerifyInfo(initVerifyInfo);

          clearInterval(interval);
        }

        const result: VerifyInfo = {
          ...state,

          timer: state.timer - 1
        }

        return result;
      });
    }, 1000);
  };

  const verifyNumber = async () => {
    const response = await gql(MUTATIONS.VERIFY_PHONE_BY_EVERYONE, {
      phoneNumber: signInfo.phone,
      verificationNumber: signInfo.verifyCode
    }, false);

    if (response.errors) {
      alert(response.errors[0].message);

      return;
    }

    setVerifyInfo({ ...verifyInfo, process: 2 })
  }

  const signUp = async () => {
    if (!signInfo.email) {
      alert("이메일 주소를 입력해주세요.");

      return;
    }

    if (!signInfo.password) {
      alert("비밀번호를 입력해주세요.");

      return;
    }

    if (signInfo.password !== signInfo.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");

      return;
    }

    if (!signInfo.phone) {
      alert("연락처를 입력해주세요.");

      return;
    }

    if (verifyInfo.process < 2) {
      alert("연락처 인증을 완료해주세요.");

      return;
    }

    if (!signInfo.serviceAgreed) {
      alert("서비스 이용약관에 동의해주세요.");

      return;
    }

    if (!signInfo.refCode) {
      let accept = confirm("추천인코드가 입력되지 않았습니다. 가입을 계속 진행하시겠습니까?");

      if (!accept) {
        return;
      }
    }

    setSignInfo({ ...signInfo, loading: true });

    const response = await gql(MUTATIONS.SIGN_UP_USER_BY_EVERYONE, {
      email: signInfo.email,
      password: signInfo.password,
      phone: signInfo.phone,
      verificationId: 0,
      refCode: signInfo.refCode ?? ""
    }, false);

    if (response.errors) {
      alert(response.errors[0].message);

      setSignInfo({ ...signInfo, loading: false });

      return;
    }

    setSignInfo(initSignInfo);

    alert("회원가입이 완료되었습니다.\n가입하신 아이디로 다시 로그인해주시기 바랍니다.");

    window.location.href = '/signin.html';
  }

  const signIn = async () => {
    window.location.href = '/signin.html';
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{
          ml: 10,
          mr: 10,
          mt: 15,
          mb: 15
        }} >
          <Paper variant='outlined'
            sx={{
              border: "1px solid #d1e8ff",
              p: 4,
              textAlign: "center"
            }}
          >
            <h1 style={{
              marginBottom: 50
            }}>
              회원가입
            </h1>

            <TextField
              id="appEmail"
              variant='outlined'
              size='small'
              style={{
                width: '100%',
                marginBottom: 10
              }}
              label="이메일"
              value={signInfo.email}
              onChange={(e) => setSignInfo({ ...signInfo, email: e.target.value })}
              onKeyDown={keyHandler}
            />

            <TextField
              id="appPassword"
              type="password"
              variant='outlined'
              size='small'
              style={{
                width: '100%',
                marginBottom: 10
              }}
              label="비밀번호"
              value={signInfo.password}
              onChange={(e) => setSignInfo({ ...signInfo, password: e.target.value })}
              onKeyDown={keyHandler}
            />

            <TextField
              id="appPasswordConfirm"
              type="password"
              variant='outlined'
              size='small'
              style={{
                width: '100%',
                marginBottom: 30
              }}
              label="비밀번호 확인"
              value={signInfo.passwordConfirm}
              onChange={(e) => setSignInfo({ ...signInfo, passwordConfirm: e.target.value })}
              onKeyDown={keyHandler}
            />

            {/* <TextField
              id="appName"
              variant='outlined'
              size='small'
              style={{
                width: '100%',
                marginBottom: 10
              }}
              label="성명"
              value={signInfo.name}
              onChange={(e) => setSignInfo({ ...signInfo, name: e.target.value })}
              onKeyDown={keyHandler}
            /> */}

            <Grid container spacing={1} style={{
              marginBottom: 30
            }}>
              <Grid item xs={6} md={7} sx={{
                margin: "auto"
              }}>
                <TextField
                  id="appPhone"
                  variant='outlined'
                  size='small'
                  style={{
                    width: '100%',
                  }}
                  label="연락처"
                  value={signInfo.phone}
                  onChange={(e) => setSignInfo({ ...signInfo, phone: e.target.value })}
                  onKeyDown={keyHandler}
                />
              </Grid>

              <Grid item xs={6} md={5} sx={{
                textAlign: "center",
                margin: "auto"
              }}>
                <LoadingButton
                  color="info"
                  disableElevation
                  loading={verifyInfo.process > 0 ? true : false}
                  loadingIndicator={verifyInfo.process > 1 ? `인증완료` : `00:${verifyInfo.timer.toString().padStart(2, '0')}`}
                  variant="contained"
                  size='large'
                  style={{
                    width: '100%',
                  }}
                  onClick={phoneVerify}
                >
                  인증
                </LoadingButton>
              </Grid>

              {verifyInfo.process === 1 ? <>
                <Grid item xs={6} md={7} sx={{
                  margin: "auto"
                }}>
                  <TextField
                    id="appPhone"
                    variant='outlined'
                    size='small'
                    style={{
                      width: '100%',
                    }}
                    label="인증번호"
                    value={signInfo.verifyCode}
                    onChange={(e) => setSignInfo({ ...signInfo, verifyCode: e.target.value })}
                    onKeyDown={keyHandler}
                  />
                </Grid>

                <Grid item xs={6} md={5} sx={{
                  textAlign: "center",
                  margin: "auto"
                }}>
                  <Button
                    color="info"
                    disableElevation
                    variant="contained"
                    size='large'
                    style={{
                      width: '100%',
                    }}
                    onClick={verifyNumber}
                  >
                    확인
                  </Button>
                </Grid>
              </> : null}
            </Grid>

            <Grid container spacing={1} style={{
              marginBottom: 30
            }}>
              <Grid item xs={6} md={7} sx={{
                margin: "auto"
              }}>
                <TextField
                  disabled={signInfo.refCodeVerified}
                  id="appRef"
                  variant='outlined'
                  size='small'
                  style={{
                    width: '100%',
                  }}
                  label="추천인코드"
                  value={signInfo.refCode}
                  onChange={(e) => setSignInfo({ ...signInfo, refCode: e.target.value })}
                  onKeyDown={keyHandler}
                />
              </Grid>

              <Grid item xs={6} md={5} sx={{
                textAlign: "center",
                margin: "auto"
              }}>
                <Button
                  disabled={signInfo.refCodeVerified}
                  color="info"
                  disableElevation
                  variant="contained"
                  size='large'
                  style={{
                    width: '100%',
                  }}
                  onClick={() => {
                    getUserPurchaseInfo(signInfo.refCode);
                  }}
                >
                  {signInfo.refCodeVerified ? "등록완료" : "등록"}
                </Button>
              </Grid>
            </Grid>

            <FormGroup style={{
              marginBottom: 30
            }}>
              <FormControlLabel control={<Checkbox onChange={(e) => {
                setSignInfo({ ...signInfo, serviceAgreed: e.target.checked })
              }} />} label={
                <span style={{
                  fontSize: 11
                }}>
                  가입 내용을 확인하였으며,

                  &nbsp;

                  <a target="_blank" href="https://panoramic-butternut-291.notion.site/5090b4282d88479f8608cd7f60bce6c2" style={{
                    textDecoration: "underline"
                  }}>
                    서비스 이용약관
                  </a>

                  에 동의합니다.
                </span>
              } />
            </FormGroup>

            <LoadingButton
              color="info"
              disableElevation
              loading={signInfo.loading}
              variant="contained"
              size='large'
              style={{
                width: '100%',
                marginBottom: 10
              }}
              onClick={signUp}
            >
              가입하기
            </LoadingButton>

            <Button
              variant="outlined"
              size='large'
              style={{
                width: '100%',
              }}
              onClick={signIn}
            >
              로그인으로 돌아가기
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  )
})

