import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { styled, Box, Button, Checkbox, CircularProgress, FormControlLabel, FormControl, FormHelperText, IconButton, MenuItem, Modal, Paper, Select, Table, TableRow, TableCell, Typography } from '@mui/material';
import { request } from '../../Tools/Common';

import CloseIcon from '@mui/icons-material/Close';

const StyledTableCell = styled(TableCell)({
    textAlign: "center",
    borderBottom: "1px solid ghostwhite",
    padding: 0,
    fontSize: 12,
});

function CircularProgressWithLabel(props: any) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: "center" }}>
            <CircularProgress variant="determinate" {...props} size="2rem" />

            {props.value > 0 ?
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        fontSize={10}
                        fontWeight="bold"
                    >
                        {`${Math.round(props.value)}`}
                    </Typography>
                </Box>
                :
                null
            }
        </Box>
    );
}

export const UploadModal = observer(() => {
    const { common, product } = React.useContext(AppContext);

    return <Modal open={product.modalInfo.upload}>
        <Paper className='uploadModal' sx={{
            width: 600
        }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
            }}>
                <Typography fontSize={16} sx={{
                }}>
                    {common.uploadInfo.editable ?
                        "상품 수정등록"
                        :
                        "상품 신규등록"
                    }
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => {
                        product.toggleUploadModal(-1, false)
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <Paper variant="outlined">
                <Box sx={{
                    p: 1,
                }}>
                    <Table>
                        <TableRow>
                            <StyledTableCell colSpan={3} sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={<Checkbox size="small" onChange={(e) => { common.toggleUploadInfoMarketAll(e.target.checked) }} />} label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    오픈마켓 전체선택
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell colSpan={3} sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={<Checkbox size="small" onChange={(e) => { common.toggleUploadInfoVideoAll(e.target.checked) }} />} label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    동영상 전체선택
                                </Box>} />
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell width={"30%"} sx={{
                                textAlign: "left"
                            }}>
                                오픈마켓
                            </StyledTableCell>

                            <StyledTableCell width={"5%"}>
                                동영상
                            </StyledTableCell>

                            <StyledTableCell width={"15%"}>
                                상태
                            </StyledTableCell>

                            <StyledTableCell width={"30%"} sx={{
                                textAlign: "left"
                            }}>
                                오픈마켓
                            </StyledTableCell>

                            <StyledTableCell width={"5%"}>
                                동영상
                            </StyledTableCell>

                            <StyledTableCell width={"15%"}>
                                상태
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A077').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A077').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A077', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-smartstore.png" />

                                    &nbsp;

                                    스마트스토어
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell>
                                <Checkbox
                                    size="small"
                                    disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A077').disabled}
                                    checked={common.uploadInfo.markets.find((v: any) => v.code === 'A077').video}
                                    onChange={(e) => { common.toggleUploadInfoVideo('A077', e.target.checked) }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A077').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A077').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A077').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>

                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B378').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'B378').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('B378', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-coupang.png" />

                                    &nbsp;

                                    쿠팡
                                </Box>} />

                            </StyledTableCell>

                            <StyledTableCell>
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'B378').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'B378').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'B378').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A112').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A112').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A112', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-street-global.png" />

                                    &nbsp;

                                    11번가(글로벌)
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell>
                                <Checkbox
                                    size="small"
                                    disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A112').disabled}
                                    checked={common.uploadInfo.markets.find((v: any) => v.code === 'A112').video}
                                    onChange={(e) => { common.toggleUploadInfoVideo('A112', e.target.checked) }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A112').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A112').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A112').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>

                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A113').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A113').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A113', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-street-normal.png" />

                                    &nbsp;

                                    11번가(일반)
                                </Box>} />

                            </StyledTableCell>

                            <StyledTableCell>
                                <Checkbox
                                    size="small"
                                    disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A113').disabled}
                                    checked={common.uploadInfo.markets.find((v: any) => v.code === 'A113').video}
                                    onChange={(e) => { common.toggleUploadInfoVideo('A113', e.target.checked) }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A113').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A113').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A113').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A006').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A006').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A006', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-gmarket.png" />

                                    &nbsp;

                                    지마켓
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell>
                                <Checkbox
                                    size="small"
                                    disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A006').disabled}
                                    checked={common.uploadInfo.markets.find((v: any) => v.code === 'A006').video}
                                    onChange={(e) => { common.toggleUploadInfoVideo('A006', e.target.checked) }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A006').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A006').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A006').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>

                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A001').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A001').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A001', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-auction.png" />

                                    &nbsp;

                                    옥션
                                </Box>} />

                            </StyledTableCell>

                            <StyledTableCell>
                                <Checkbox
                                    size="small"
                                    disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A001').disabled}
                                    checked={common.uploadInfo.markets.find((v: any) => v.code === 'A001').video}
                                    onChange={(e) => { common.toggleUploadInfoVideo('A001', e.target.checked) }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A001').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A001').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A001').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A027').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A027').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A027', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-interpark.png" />

                                    &nbsp;

                                    인터파크
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell>
                                <Checkbox
                                    size="small"
                                    disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A027').disabled}
                                    checked={common.uploadInfo.markets.find((v: any) => v.code === 'A027').video}
                                    onChange={(e) => { common.toggleUploadInfoVideo('A027', e.target.checked) }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A027').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A027').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A027').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>

                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B719').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'B719').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('B719', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-wemakeprice.png" />

                                    &nbsp;

                                    위메프
                                </Box>} />

                            </StyledTableCell>

                            <StyledTableCell>
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'B719').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'B719').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'B719').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A524').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A524').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A524', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-lotteon-global.png" />

                                    &nbsp;

                                    롯데온(글로벌)
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell>
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A524').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A524').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A524').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>

                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A525').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'A525').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('A525', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-lotteon-normal.png" />

                                    &nbsp;

                                    롯데온(일반)
                                </Box>} />

                            </StyledTableCell>

                            <StyledTableCell>
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'A525').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'A525').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'A525').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>
                        </TableRow>

                        <TableRow>
                            <StyledTableCell sx={{
                                textAlign: "left"
                            }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        size="small"
                                        disabled={common.uploadInfo.markets.find((v: any) => v.code === 'B956').disabled}
                                        checked={common.uploadInfo.markets.find((v: any) => v.code === 'B956').upload}
                                        onChange={(e) => { common.toggleUploadInfoMarket('B956', e.target.checked) }}
                                    />
                                } label={<Box sx={{
                                    display: "flex",
                                    fontSize: 12,
                                    alignItems: "center"
                                }}>
                                    <img src="/resources/icon-tmon.png" />

                                    &nbsp;

                                    티몬
                                </Box>} />
                            </StyledTableCell>

                            <StyledTableCell>
                            </StyledTableCell>

                            <StyledTableCell>
                                {common.uploadInfo.markets.find((v: any) => v.code === 'B956').progress > 0 ?
                                    <CircularProgressWithLabel value={common.uploadInfo.markets.find((v: any) => v.code === 'B956').progress} />
                                    :
                                    common.uploadInfo.markets.find((v: any) => v.code === 'B956').disabled ?
                                        <Typography sx={{
                                            color: "red",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정불가" : "등록불가"}
                                        </Typography>
                                        :
                                        <Typography sx={{
                                            color: "green",
                                            fontSize: 12
                                        }}>
                                            {common.uploadInfo.editable ? "수정가능" : "등록가능"}
                                        </Typography>
                                }
                            </StyledTableCell>

                            <StyledTableCell colSpan={3}>
                            </StyledTableCell>
                        </TableRow>
                    </Table>
                </Box>
            </Paper>

            {common.uploadInfo.markets.find((v: any) => v.code === 'B719').upload ? <Paper variant="outlined" sx={{
                mt: 1,
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                위메프 발송정책

                <FormControl sx={{ width: 250 }} error={!common.uploadInfo.markets.find((v: any) => v.code === 'B719').policyInfo}>
                    <Select sx={{
                        background: "white",
                        fontSize: 13,
                        height: 30,
                    }} value={common.uploadInfo.markets.find((v: any) => v.code === 'B719').policyInfo} onOpen={async () => {
                        if (common.deliveryInfo.wemakepricePolicyList.length > 0) {
                            return;
                        }

                        const policyResp = await fetch('https://wpartner.wemakeprice.com/partner/sellerShip/getSellerShipList.json');
                        const policyJson = await policyResp.json();

                        if (!policyJson.sellerShipList) {
                            alert("위메프 로그인 후 이용해주세요.");

                            return;
                        }

                        common.setDeliveryInfo({
                            ...common.deliveryInfo,

                            wemakepricePolicyList: policyJson.sellerShipList
                        })
                    }} onChange={(e) => {
                        common.setPolicyInfo('B719', e.target.value);
                    }}>
                        {common.deliveryInfo.wemakepricePolicyList.map((v: any) => <MenuItem value={v.shipPolicyNo}>
                            배송비: {v.shipFee ? `${v.shipFee.toLocaleString('ko-KR')}원` : `무료`} / 반품비: {v.claimShipFee.toLocaleString('ko-KR')}원
                        </MenuItem>)}
                    </Select>

                    {!common.uploadInfo.markets.find((v: any) => v.code === 'B719').policyInfo ?
                        <FormHelperText>발송정책을 설정해주세요.</FormHelperText>
                        :
                        null
                    }
                </FormControl>
            </Paper> : null}

            {common.uploadInfo.markets.find((v: any) => v.code === 'A524').upload ? <Paper variant="outlined" sx={{
                mt: 1,
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                롯데온 발송정책

                <FormControl sx={{ width: 250 }} error={!common.uploadInfo.markets.find((v: any) => v.code === 'A524').policyInfo}>
                    <Select sx={{
                        background: "white",
                        fontSize: 13,
                        height: 30,
                        width: "100%",
                    }} value={common.uploadInfo.markets.find((v: any) => v.code === 'A524').policyInfo} onOpen={async () => {
                        if (common.deliveryInfo.lotteonPolicyList.length > 0) {
                            return;
                        }

                        const policyResp = await fetch(`https://openapi.lotteon.com/v1/openapi/contract/v1/dvl/getDvCstListSr`, {
                            headers: {
                                "Authorization": `Bearer ${common.user.userInfo.lotteonApiKey}`,
                                "Accept": "application/json",
                                "Accept-Language": "ko",
                                "X-Timezone": "GMT+09:00",
                                "Content-Type": "application/json",
                            },

                            method: "POST",

                            body: JSON.stringify({
                                afflTrCd: common.user.userInfo.lotteonVendorId
                            })
                        });

                        const policyJson = await policyResp.json();

                        common.setDeliveryInfo({
                            ...common.deliveryInfo,

                            lotteonPolicyList: policyJson.data.filter((v: any) => v.dvCstTypCd === 'DV_CST')
                        })
                    }} onChange={(e) => {
                        common.setPolicyInfo('A524', e.target.value);
                        common.setPolicyInfo('A525', e.target.value);
                    }}>
                        {common.deliveryInfo.lotteonPolicyList.map((v: any) => <MenuItem value={v.dvCstPolNo}>
                            배송비: {parseInt(v.dvCst).toLocaleString('ko-KR')}원 / 반품비: {parseInt(v.rcst).toLocaleString('ko-KR')}원
                        </MenuItem>)}
                    </Select>

                    {!common.uploadInfo.markets.find((v: any) => v.code === 'A524').policyInfo ?
                        <FormHelperText>발송정책을 설정해주세요.</FormHelperText>
                        :
                        null
                    }
                </FormControl>
            </Paper> : null}

            {common.uploadInfo.markets.find((v: any) => v.code === 'A525').upload ? <Paper variant="outlined" sx={{
                mt: 1,
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                롯데온 발송정책

                <FormControl sx={{ width: 250 }} error={!common.uploadInfo.markets.find((v: any) => v.code === 'A525').policyInfo}>
                    <Select sx={{
                        background: "white",
                        fontSize: 13,
                        height: 30,
                        width: "100%",
                    }} value={common.uploadInfo.markets.find((v: any) => v.code === 'A525').policyInfo} onOpen={async () => {
                        if (common.deliveryInfo.lotteonPolicyList.length > 0) {
                            return;
                        }

                        const policyResp = await fetch(`https://openapi.lotteon.com/v1/openapi/contract/v1/dvl/getDvCstListSr`, {
                            headers: {
                                "Authorization": `Bearer ${common.user.userInfo.lotteonApiKey}`,
                                "Accept": "application/json",
                                "Accept-Language": "ko",
                                "X-Timezone": "GMT+09:00",
                                "Content-Type": "application/json",
                            },

                            method: "POST",

                            body: JSON.stringify({
                                afflTrCd: common.user.userInfo.lotteonVendorId
                            })
                        });

                        const policyJson = await policyResp.json();

                        common.setDeliveryInfo({
                            ...common.deliveryInfo,

                            lotteonPolicyList: policyJson.data.filter((v: any) => v.dvCstTypCd === 'DV_CST')
                        })
                    }} onChange={(e) => {
                        common.setPolicyInfo('A524', e.target.value);
                        common.setPolicyInfo('A525', e.target.value);
                    }}>
                        {common.deliveryInfo.lotteonPolicyList.map((v: any) => <MenuItem value={v.dvCstPolNo}>
                            배송비: {parseInt(v.dvCst).toLocaleString('ko-KR')}원 / 반품비: {parseInt(v.rcst).toLocaleString('ko-KR')}원
                        </MenuItem>)}
                    </Select>

                    {!common.uploadInfo.markets.find((v: any) => v.code === 'A525').policyInfo ?
                        <FormHelperText>발송정책을 설정해주세요.</FormHelperText>
                        :
                        null
                    }
                </FormControl>
            </Paper> : null}

            {common.uploadInfo.markets.find((v: any) => v.code === 'B956').upload ? <Paper variant="outlined" sx={{
                mt: 1,
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                티몬 발송정책

                <FormControl sx={{ width: 250 }} error={!common.uploadInfo.markets.find((v: any) => v.code === 'B956').policyInfo}>
                    <Select sx={{
                        background: "white",
                        fontSize: 13,
                        height: 30,
                        width: "100%",
                    }} value={common.uploadInfo.markets.find((v: any) => v.code === 'B956').policyInfo} onOpen={async () => {
                        if (common.deliveryInfo.tmonPolicyList.length > 0) {
                            return;
                        }

                        const deliveryResp: any = await request(`https://spc-om.tmon.co.kr/api/delivery/template?productType=DP03&deliverySpot=DIRECT&scCatYn=N&partnerNo=${common.user.userInfo.tmonId}&detail=true`, { "method": "GET" });

                        let deliveryJson: any = null;

                        try {
                            deliveryJson = JSON.parse(deliveryResp);
                        } catch (e) {
                            //
                        }

                        if (!deliveryJson) {
                            alert("티몬 로그인 후 이용해주세요.");

                            return;
                        }

                        common.setDeliveryInfo({
                            ...common.deliveryInfo,

                            tmonPolicyList: deliveryJson.data.list
                        })
                    }} onChange={(e) => {
                        common.setPolicyInfo('B956', e.target.value);
                    }}>
                        {common.deliveryInfo.tmonPolicyList.map((v: any) => <MenuItem value={v.deliveryFeeSrl}>
                            배송비: {parseInt(v.detail.deliveryFeeInfo.deliveryAmount).toLocaleString('ko-KR')}원 / 반품비: {(parseInt(v.detail.deliveryFeeInfo.deliveryAmount) * 2).toLocaleString('ko-KR')}원
                        </MenuItem>)}
                    </Select>

                    {!common.uploadInfo.markets.find((v: any) => v.code === 'B956').policyInfo ?
                        <FormHelperText>발송정책을 설정해주세요.</FormHelperText>
                        :
                        null
                    }
                </FormControl>
            </Paper> : null}

            <Paper variant="outlined" sx={{
                height: 100,
                overflowY: "auto",
                mt: 1,
            }}>
                {product.uploadConsole?.map((v: any) => <Typography sx={{
                    fontSize: 12
                }}>
                    {v}
                </Typography>)}
            </Paper>

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3
            }}>
                {common.uploadInfo.editable ?
                    <Button disabled={!common.uploadInfo.uploadable} disableElevation variant="contained" color="info" sx={{
                        width: "33%",
                        mx: 0.5
                    }} onClick={async () => {
                        await common.setUploadable(false);

                        await product.uploadItems(common, true);
                        await product.toggleUploadModal(-1, false);
                    }}>
                        {!common.uploadInfo.uploadable && !common.uploadInfo.stopped ? "수정 중..." : "수정"}
                    </Button>
                    :
                    <Button disabled={!common.uploadInfo.uploadable} disableElevation variant="contained" color="info" sx={{
                        width: "33%",
                        mx: 0.5
                    }} onClick={async () => {
                        await common.setUploadable(false);

                        await product.uploadItems(common, false);
                        await product.toggleUploadModal(-1, false);
                    }}>
                        {!common.uploadInfo.uploadable && !common.uploadInfo.stopped ? "등록 중..." : "등록"}
                    </Button>
                }

                <Button disabled={common.uploadInfo.stopped} disableElevation variant="contained" color="error" sx={{
                    width: "33%",
                    mx: 0.5
                }} onClick={async () => {
                    let accept = confirm("상품등록을 중단하시겠습니까?\n상품등록이 중단되더라도 이전에 등록된 상품은 삭제되지 않을 수 있습니다.");

                    if (accept) {
                        await common.setStopped(true);
                    }
                }}>
                    {!common.uploadInfo.uploadable && common.uploadInfo.stopped ? "중단 중..." : "중단"}
                </Button>

                <Button disableElevation variant="contained" color="inherit" sx={{
                    width: "33%",
                    mx: 0.5
                }} onClick={() => { product.toggleUploadModal(-1, false) }}>
                    닫기
                </Button>
            </Box>
        </Paper>
    </Modal>
});