import * as React from 'react';

import { observer } from "mobx-react";
import { Footer } from "../Main/Common/Footer";
import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';

export const App = observer(() => {
  const connect = () => {
    alert("로그인 후 이용해주세요.");

    window.open("/signin.html");
  };

  const scroll = (anchor: string) => {
    let element = document.getElementById(anchor);

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} style={{
        background: "whitesmoke",
        color: "black",
      }}>
        <Toolbar>
          <Box sx={{
            display: {
              xs: 'none',
              md: 'flex'
            }
          }} style={{
            marginRight: 50
          }}>
            <a href='/app.html'>
              <img src="icon.png" />
            </a>
          </Box>

          <Box sx={{
            display: {
              xs: 'none',
              md: 'flex'
            }
          }} style={{
            marginRight: 20
          }}>
            <Button style={{
              fontSize: 16,
              fontWeight: "bold",

              marginRight: 5,

              width: 100
            }} onClick={() => scroll('anchor1')}>
              셀포유
            </Button>

            <Button style={{
              fontSize: 16,
              fontWeight: "bold",

              marginRight: 5,

              width: 100
            }} onClick={() => scroll('anchor2')}>
              가격
            </Button>

            <Button style={{
              fontSize: 16,
              fontWeight: "bold",

              width: 100
            }} onClick={() => scroll('anchor3')}>
              매뉴얼
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{
            display: {
              xs: 'none',
              md: 'flex'
            }
          }} style={{
            marginRight: 20
          }}>
            <Button
              variant="contained"
              style={{
                fontSize: 16,
                fontWeight: "bold",

                marginRight: 5,

                width: 100
              }}
              onClick={connect}
            >
              로그인
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <div style={{
        margin: 80
      }} />

      <Container maxWidth="lg">
        <Box sx={{
          pl: 10,
          pr: 10
        }} >
          <div id="anchor1" style={{ height: 100 }} />

          <div>
            <iframe width="100%" height="550" src="https://www.youtube.com/embed/Dm3xx1y-Oa0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>

            <div style={{
              background: "cornflowerblue",
              color: "white",
              padding: 25,
              fontSize: 20,
              fontWeight: "bold"
            }}>
              셀포유로 초간편 상품소싱, 판매관리까지 한번에!

              <br />

              생활의 여유를 주는 풀필먼트 직구셀러 솔루션
            </div>
          </div>

          <div id="anchor2" style={{ height: 100 }} />

          <h1>
            2. 가격
          </h1>

          <div style={{
            height: 1200
          }}>

          </div>

          <div id="anchor3" style={{ height: 100 }} />

          <h1>
            3. 매뉴얼
          </h1>

          <div style={{
            height: 1200
          }}>

          </div>
        </Box>
      </Container>

      <Footer />
    </>
  )
});
