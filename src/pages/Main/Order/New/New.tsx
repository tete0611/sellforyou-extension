import React from 'react';
import OrderTables from '../Components/OrderTables';

import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { Header } from "../../Common/Header";
import { Box, Chip, Container, Paper } from '@mui/material';
import { deleteLocalStorage } from '../../../Tools/ChromeAsync';

const title = {
  alignItems: "center",
  background: "#d1e8ff",
  display: "flex",
  fontSize: 16,
  justifyContent: "space-between",
  px: 1,
  height: 40
};

export const New = observer(() => {
  const { common, order } = React.useContext(AppContext);

  React.useEffect(() => {
    if (!common.loaded) {
      return;
    }

    order.loadOrder(common)

    // deleteLocalStorage("order");
  }, [common.loaded]);

  return (
    <>
      <Header />

      <Container maxWidth={'xl'}>
        <Paper variant="outlined" sx={{
          border: "1px solid #d1e8ff",
        }}>
          <Box sx={title}>
            <Box sx={{
              alignItems: "center",
              display: "flex"
            }}>
              신규주문목록 ({order.count})

              &nbsp;

              <Chip size="small" label="인터파크는 현재 주문조회가 불가능하며 위메프는 주문정보 일부가 별표(*)처리됩니다." color="info" />
            </Box>
          </Box>

          <OrderTables />
        </Paper>
      </Container>
    </>
  )
})

