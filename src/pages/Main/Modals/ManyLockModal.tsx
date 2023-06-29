import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { MyButton } from '../Common/UI';

// 상품명 일괄설정 모달 뷰
export const ManyLockModal = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  return (
    <Modal open={product.modalInfo.locked} onClose={() => product.toggleManyLockModal(false)}>
      <Paper
        className="uploadModal"
        sx={{
          width: 400,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography fontSize={16}>상품잠금 일괄설정</Typography>

          <Box>
            <MyButton
              color="info"
              sx={{
                minWidth: 60,
              }}
              onClick={async () => {
                await Promise.all(
                  product.itemInfo.items.map(async (v: any, i: number) => {
                    if (!v.checked) {
                      return null;
                    }
                    await product.updateLockProduct(i, {
                      productId: v.id,
                      mylock: 2,
                    });
                  })
                );

                product.toggleManyLockModal(false);
              }}
            >
              상품잠금
            </MyButton>
            &nbsp;
            <MyButton
              color="info"
              sx={{
                minWidth: 60,
              }}
              onClick={async () => {
                let test = confirm('해당 상품을 정말로 잠금 해제하시겠습니까?');
                if (!test) return;
                await Promise.all(
                  product.itemInfo.items.map(async (v: any, i: number) => {
                    if (!v.checked) {
                      return null;
                    }
                    await product.updateLockProduct(i, {
                      productId: v.id,
                      mylock: 1,
                    });
                  })
                );

                product.toggleManyLockModal(false);
              }}
            >
              잠금해제
            </MyButton>
            &nbsp;
            <MyButton
              color="error"
              sx={{
                minWidth: 60,
              }}
              onClick={() => {
                product.toggleManyLockModal(false);
              }}
            >
              취소
            </MyButton>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
});
