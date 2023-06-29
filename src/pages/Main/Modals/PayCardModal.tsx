import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Modal, Paper, Typography } from '@mui/material';

// 카드 결제 모달 뷰
export const PayCardModal = observer(() => {
  // MobX 스토리지 로드
  const { common, payments } = React.useContext(AppContext);

  // 사용자 정보 로드
  React.useEffect(() => {
    if (!common.loaded) {
      return;
    }
  }, [common.loaded]);

  return (
    <Modal open={payments.modalInfo.payCard}>
      <Paper
        className="uploadModal"
        sx={{
          width: 500,
          textAlign: 'center',
        }}
      >
        <Typography fontSize={24} fontWeight="bold">
          신용카드 결제가 진행중입니다...
        </Typography>

        <br />
        <br />

        <Typography fontSize={16} color="gray">
          결제가 완료/취소되면 자동으로 창이 사라집니다.
        </Typography>
      </Paper>
    </Modal>
  );
});
