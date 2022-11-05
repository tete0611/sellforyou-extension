import React from 'react';

import { format } from "date-fns";
import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { styled, Box, Modal, Paper, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)({
    textAlign: "center",
    borderBottom: "1px solid ghostwhite",
    padding: 5,
    fontSize: 12,
});

export const UploadFailedModal = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Modal
        open={product.modalInfo.uploadFailed}
        onClose={() => {
            product.toggleUploadFailedModal(0, false);
        }}
    >
        <Paper className='uploadModal' sx={{
            width: 800
        }}>
            <Typography fontSize={16} sx={{
                mb: 3
            }}>
                실패사유 ({product.itemInfo.items[product.uploadFailedIndex]?.productCode})
            </Typography>

            {product.itemInfo.items[product.uploadFailedIndex]?.productStore.map((v: any) => v.productStoreLog.length > 0 ? <Paper sx={{
                border: "1px solid #d1e8ff",
                mb: 1,
            }} variant="outlined">
                <Box sx={{
                    background: "#d1e8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                }}>
                    <Typography fontSize={14}>
                        {v.siteCode === 'A077' ? "스마트스토어" :
                            v.siteCode === 'B378' ? "쿠팡" :
                                v.siteCode === 'A112' ? "11번가 글로벌" :
                                    v.siteCode === 'A113' ? "11번가 일반" :
                                        v.siteCode === 'A006' ? "지마켓 1.0" :
                                            v.siteCode === 'A001' ? "옥션 1.0" :
                                                v.siteCode === 'A027' ? "인터파크" :
                                                    v.siteCode === 'B719' ? "위메프 2.0" :
                                                        v.siteCode === 'A524' ? "롯데온 글로벌" :
                                                            v.siteCode === 'A525' ? "롯데온 일반" :
                                                                v.siteCode === 'B956' ? "티몬" : ""}
                    </Typography>
                </Box>

                <Table>
                    <TableBody>
                        {v.productStoreLog.map((w: any) => {
                            return <TableRow hover>
                                <StyledTableCell width="75%" style={{
                                    textAlign: "left"
                                }}>
                                    {w.errorMessage}
                                </StyledTableCell>

                                <StyledTableCell width="25%" style={{
                                    textAlign: "right"
                                }}>
                                    {format(new Date(w.createdAt), "yyyy-MM-dd HH:mm:ss")}
                                </StyledTableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </Paper> : null)}
        </Paper>
    </Modal>
});