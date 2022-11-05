import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Modal, Paper } from '@mui/material';

const title = {
    alignItems: "center",
    background: "#d1e8ff",
    display: "flex",
    fontSize: 16,
    justifyContent: "space-between",
    px: 1,
    height: 40
};

export const NoticeModal = observer(() => {
    const { dashboard } = React.useContext(AppContext);

    return <Modal
        open={dashboard.modalInfo.notice}
        onClose={() => { dashboard.toggleNoticeModal(false) }}
    >
        <Paper className='uploadModal' sx={{ width: 800 }}>
            <Box sx={title}>
                {dashboard.currentNotice.title}
            </Box>

            <Box sx={{
                p: 1,
            }}>
                <div dangerouslySetInnerHTML={{
                    __html: dashboard.currentNotice.content
                }} />
            </Box>
        </Paper>
    </Modal>
});