import React from 'react';
import MUTATIONS from "../GraphQL/Mutations";
import gql from "../GraphQL/Requests";
import LoadingButton from '@mui/lab/LoadingButton';

import { observer } from "mobx-react";
import { getLocalStorage, queryTabs, queryWindow, setLocalStorage } from '../../Tools/ChromeAsync';
import { Box, Button, Checkbox, Container, FormControlLabel, Paper, TextField, Typography } from '@mui/material';

type AppInfo = {
  id: string,
  password: string,
  accessToken: string,
  refreshToken: string,
  loading: boolean,
  autoFill: boolean,
  autoLogin: boolean,
  pageSize: number,
}

export const SignIn = observer(() => {
  const initAppInfo: AppInfo = {
    "id": "",
    "password": "",
    "accessToken": "",
    "refreshToken": "",
    "loading": false,
    "autoFill": false,
    "autoLogin": false,
    "pageSize": 10
  };

  const [appInfo, setAppInfo] = React.useState<AppInfo>(initAppInfo);

  const keyHandler = async (e: any) => {
    if (e.key === 'Enter') {
      signIn(appInfo);
    }
  }

  const initTabs = async () => {
    const windows: any = await queryWindow({ populate: true });

    windows.map((v: any) => {
      v.tabs.filter((w: any) => w.url.includes(chrome.runtime.getURL("/"))).map((w: any) => {
        if (v.focused && w.active) {
          return;
        }

        chrome.tabs.reload(w.id);
      })
    })

    window.location.href = '/dashboard.html';
  }

  const signIn = async (info: any) => {
    setAppInfo({ ...appInfo, loading: true })

    const response = await gql(MUTATIONS.SIGN_IN_USER_BY_EVERYONE, {
      id: info.id,
      pw: info.password
    }, false);

    if (response.errors) {
      alert(response.errors[0].message);

      setAppInfo({ ...appInfo, loading: false })

      return;
    }

    setAppInfo((state) => {
      const result: AppInfo = {
        ...state,

        id: info.id,
        password: info.password,

        autoFill: info.autoFill,
        autoLogin: info.autoLogin,

        accessToken: response.data.signInUserByEveryone.accessToken,
        refreshToken: response.data.signInUserByEveryone.refreshToken,

        loading: false
      }

      setLocalStorage({ appInfo: result }).then(initTabs);

      return result;
    });
  }

  const signUp = async () => {
    window.location.href = '/signup.html';
  }

  React.useEffect(() => {
    getLocalStorage('appInfo').then((info: any) => {
      if (!info) {
        return;
      }

      setAppInfo({
        ...info,

        id: info.autoFill ? info.id : "",
        password: info.autoFill ? info.password : "",
      });

      if (info.autoFill && info.autoLogin) {
        signIn(info);
      }
    });
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{
          ml: 10,
          mr: 10,
          mt: 30,
          mb: 30
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
              로그인
            </h1>

            <TextField
              id="appId"
              variant='outlined'
              size='small'
              style={{
                width: '100%',
                marginBottom: 10
              }}
              label="아이디"
              value={appInfo.id}
              onChange={(e) => setAppInfo({ ...appInfo, id: e.target.value })}
              onKeyDown={keyHandler}
            />

            <TextField
              id="appPassword"
              type="password"
              variant='outlined'
              size='small'
              style={{
                width: '100%',
                marginBottom: 30
              }}
              label="비밀번호"
              value={appInfo.password}
              onChange={(e) => setAppInfo({ ...appInfo, password: e.target.value })}
              onKeyDown={keyHandler}
            />

            <LoadingButton
              color="info"
              disableElevation
              loading={appInfo.loading}
              variant="contained"
              size='large'
              style={{
                width: '100%',
                marginBottom: 30
              }}
              onClick={() => signIn(appInfo)}
            >
              로그인
            </LoadingButton>

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: "30px"
            }}>
              <FormControlLabel control={<Checkbox checked={appInfo.autoFill} onChange={(e) => {
                setAppInfo((state) => {
                  const result: AppInfo = {
                    ...state,

                    autoFill: e.target.checked
                  }

                  setLocalStorage({ appInfo: result });

                  return result;
                });
              }} />} label={
                <Typography fontSize={14}>
                  아이디저장
                </Typography>
              } />

              <FormControlLabel control={<Checkbox checked={appInfo.autoLogin} onChange={(e) => {
                setAppInfo((state) => {
                  const result: AppInfo = {
                    ...state,

                    autoLogin: e.target.checked
                  }

                  setLocalStorage({ appInfo: result });

                  return result;
                });
              }} />} label={
                <Typography fontSize={14}>
                  자동로그인
                </Typography>
              } />
            </Box>

            <div>
              <span style={{
                marginRight: 10
              }}>
                아직 셀포유 회원이 아니신가요?
              </span>

              <Button
                variant="outlined"
                size='small'
                style={{
                  width: 100,
                  // marginBottom: 50
                }}
                onClick={signUp}
              >
                회원가입
              </Button>
            </div>
          </Paper>
        </Box>
      </Container>
    </>
  )
})

