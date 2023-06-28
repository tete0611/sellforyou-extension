import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Modal, Paper } from "@mui/material";
import { ModalFrame, Title } from "../Common/UI";

// 공지사항 모달 뷰
export const NoticeModal = observer(() => {
  // MobX 스토리지 로드
  const { dashboard } = React.useContext(AppContext);

  return (
    <Modal
      open={dashboard.modalInfo.notice}
      onClose={() => {
        dashboard.toggleNoticeModal(false);
      }}
    >
      <ModalFrame
        sx={{
          width: 800,
        }}
      >
        <Title>{dashboard.currentNotice.title}</Title>

        <Box
          sx={{
            fontSize: "1.2em",
            p: 1,
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: dashboard.currentNotice.content,
            }}
          />
        </Box>
      </ModalFrame>
    </Modal>
  );
});
