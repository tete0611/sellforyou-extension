import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { Header } from "../../Common/Header";
import { Box, Container, Paper } from '@mui/material';
import { deleteLocalStorage } from '../../../Tools/ChromeAsync';
import { DeliveryTable } from '../Components/DeliveryTable';
import { ImagePopOver } from '../../PopOver/ImagePopOver';

const title = {
  alignItems: "center",
  background: "#d1e8ff",
  display: "flex",
  fontSize: 16,
  justifyContent: "space-between",
  px: 1,
  height: 40
};

export const Delivery = observer(() => {
  const { delivery } = React.useContext(AppContext);

  React.useEffect(() => {
    // order.getOrder(false);

    deleteLocalStorage("order");
  }, []);

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
              주문발송관리 ({delivery.orderInfo.orders.length})
            </Box>
          </Box>

          <DeliveryTable />
        </Paper>
      </Container>

      <ImagePopOver />
    </>
  )
})

