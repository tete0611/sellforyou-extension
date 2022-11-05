import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';

import { observer } from "mobx-react";
import { ListManager } from "react-beautiful-dnd-grid";
import { AppContext } from "../../../../../containers/AppContext";
import { Box, Chip, IconButton, Button, Paper, Typography } from "@mui/material";
import { Image } from "../../../Common/UI";
import { readFileDataURL } from '../../../../Tools/Common';
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    defaultBox: {
        background: "#d1e8ff",
    },

    defaultPaper: {
        border: "1px solid #d1e8ff"
    },

    errorBox: {
        background: "#ffd1d1",
    },

    errorPaper: {
        border: "1px solid #ffd1d1"
    }
}));

export const TabThumbnails = observer((props: any) => {
    const { product } = React.useContext(AppContext);

    const classes = useStyles();

    return <>
        <Paper className={props.item.thumbnailImageError ? classes.errorPaper : classes.defaultPaper} variant="outlined">
            <Box className={props.item.thumbnailImageError ? classes.errorBox : classes.defaultBox} sx={{
                background: "#d1e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
                px: 1,
                py: 0.5
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    이미지목록

                    {props.item.thumbnailImageError ?
                        <>
                            <ErrorIcon color="error" sx={{
                                fontSize: 18,
                                mx: 0.5
                            }} />

                            <Box sx={{
                                position: "relative"
                            }}>
                                <Paper sx={{
                                    top: 0,
                                    color: "red",

                                    p: 1,
                                    position: "absolute",

                                    left: 0,
                                    textAlign: "left",

                                    width: 200,

                                    zIndex: 100
                                }}>
                                    600x600 이상, JPG/PNG 형식이 아닌 이미지가 있습니다.
                                </Paper>
                            </Box>
                        </>
                        :
                        null
                    }
                </Box>

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Button disableElevation variant="contained" component="label" color="info" sx={{
                        fontSize: 13,
                        height: 26
                    }}>
                        이미지 추가

                        <input hidden accept="image/*" multiple type="file" onChange={async (e) => {
                            const fileList = e.target.files ?? [];
                            const fileData = await readFileDataURL(fileList[0]);

                            product.addProductThumbnailImage(fileList[0], fileData, props.index);
                        }} />
                    </Button>

                    <Button disableElevation variant="contained" color="info" sx={{
                        ml: 0.5,
                        fontSize: 13,
                        height: 26
                    }} onClick={() => {
                        window.open(chrome.runtime.getURL(`/trangers_multiple.html?id=${props.item.id}&type=1`))
                    }}>
                        전체 이미지 편집/번역
                    </Button>

                    <Button disableElevation variant="contained" color="error" sx={{
                        ml: 0.5,
                        fontSize: 13,
                        height: 26
                    }} onClick={() => {
                        product.initProductThumbnailImage(props.item.id, props.index);
                    }}>
                        이미지 복구
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                height: 389,
                overflowY: "auto",
                display: "flex",
                justifyContent: "center",
            }}>
                <Box sx={{
                    width: 1210,
                    p: 1,
                }}>
                    <ListManager
                        items={props.item.imageThumbnail}
                        direction="horizontal"
                        maxItems={5}
                        render={img => <Paper className={props.item.imageCheckList && props.item.imageCheckList[img] ? classes.errorPaper : classes.defaultPaper} ref={(elem: any) => {
                            if (!elem || !elem.parentNode) {
                                return;
                            }

                            let fixed = elem.parentNode.getAttribute('fixed');

                            if (!fixed) {
                                elem.parentNode.setAttribute('fixed', 'false');

                                return;
                            }

                            let left = parseFloat(elem.parentNode.style.left);
                            let top = parseFloat(elem.parentNode.style.top);

                            if (isNaN(left) || isNaN(top)) {
                                elem.parentNode.setAttribute('fixed', 'false');

                                return;
                            }

                            if (fixed === 'false') {
                                const frame = document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0];
                                const framePos = frame.getBoundingClientRect();

                                const fixedWidth = (window.innerWidth - framePos.width) / 2;

                                elem.parentNode.style.setProperty('left', `${left - fixedWidth}px`, 'important');
                                elem.parentNode.style.setProperty('top', `${frame.scrollTop + top - 152}px`, 'important');
                                elem.parentNode.setAttribute('fixed', 'true');
                            }
                        }} sx={{
                            m: "2px",
                        }} variant="outlined">
                            {props.item.imageThumbnail.map((v: any, i: number) => {
                                if (v !== img) {
                                    return null;
                                }

                                return <>
                                    <Box className={props.item.imageCheckList && props.item.imageCheckList[img] ? classes.errorBox : classes.defaultBox} sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        p: 0.5,
                                    }}>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            <Typography noWrap fontSize={13}>
                                                {i === 0 ? "대표이미지" : `추가이미지 ${i.toString().padStart(2, '0')}`}
                                            </Typography>

                                            {props.item.imageCheckList && props.item.imageCheckList[img] ?
                                                <ErrorIcon color="error" sx={{
                                                    fontSize: 18,
                                                    mx: 0.5
                                                }} />
                                                :
                                                null
                                            }
                                        </Box>

                                        <Box sx={{
                                            alignItems: "center",
                                            display: "flex"
                                        }}>
                                            {props.item.imageThumbnailExtensions && props.item.imageThumbnailExtensions[i] ?
                                                <Chip size="small" label={props.item.imageThumbnailExtensions[i]} />
                                                :
                                                null
                                            }

                                            &nbsp;

                                            <IconButton color="error" sx={{
                                                p: 0
                                            }}
                                                size="small"
                                                onClick={() => {
                                                    product.updateProductThumbnailImage(i, -1, props.index)
                                                }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Image src={img} width={232} height={232} style={{
                                        objectFit: "contain"
                                    }} onClick={(e) => {
                                        product.setImagePopOver({
                                            element: e.target,
                                            data: { src: img },
                                            open: true
                                        });
                                    }} />

                                    <Box sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        alignItems: "center",

                                        p: 0.5
                                    }}>
                                        <Button disableElevation variant="contained" color="info" sx={{
                                            fontSize: 13,
                                            width: "100%",
                                            height: 26
                                        }} onClick={() => {
                                            window.open(chrome.runtime.getURL(`/trangers_single.html?id=${props.item.id}&type=1&index=${i}`))
                                        }}>
                                            이미지 편집/번역
                                        </Button>
                                    </Box>
                                </>
                            })}
                        </Paper>
                        }
                        onDragEnd={(src, dst) => {
                            product.updateProductThumbnailImage(src, dst, props.index)
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    </>
})