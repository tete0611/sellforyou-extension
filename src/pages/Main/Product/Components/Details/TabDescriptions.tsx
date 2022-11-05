import React from 'react';
import ReactQuill from 'react-quill';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';

import { observer } from "mobx-react";
import { ListManager } from "react-beautiful-dnd-grid";
import { AppContext } from "../../../../../containers/AppContext";
import { Box, Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Image } from "../../../Common/UI";
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

export const TabDescriptions = observer((props: any) => {
    const { product } = React.useContext(AppContext);

    const classes = useStyles();

    const modules = React.useMemo(() => ({
        toolbar: false
    }), []);

    return <>
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "auto",
        }}>
            <Grid container spacing={0.5}>
                <Grid item xs={6} md={6}>
                    <Paper className={props.item.descriptionImageError ? classes.errorPaper : classes.defaultPaper} variant="outlined">
                        <Box className={props.item.descriptionImageError ? classes.errorBox : classes.defaultBox} sx={{
                            background: "#d1e8ff",
                            display: "flex",
                            alignItems: "center",
                            fontSize: 13,
                            p: 1
                        }}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                이미지목록

                                {props.item.descriptionImageError ?
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
                                                JPG/PNG 형식이 아닌 이미지가 있습니다.
                                            </Paper>
                                        </Box>
                                    </>
                                    :
                                    null
                                }
                            </Box>
                        </Box>

                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 1,

                            height: 372,
                            overflowY: "auto"
                        }}>
                            <Box>
                                <ListManager
                                    items={props.item.descriptionImages}
                                    direction="horizontal"
                                    maxItems={4}
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

                                        if (fixed === 'true') {
                                            if (isNaN(left) || isNaN(top)) {
                                                elem.parentNode.setAttribute('fixed', 'false');

                                                return;
                                            }
                                        } else {
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
                                        {props.item.descriptionImages.map((v: any, i: number) => {
                                            if (v !== img) {
                                                return null;
                                            }

                                            return <>
                                                <Box className={props.item.imageCheckList && props.item.imageCheckList[img] ? classes.errorBox : classes.defaultBox} sx={{
                                                    background: "whitesmoke",
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
                                                            {`상세이미지 ${(i + 1).toString().padStart(2, '0')} `}
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

                                                    <IconButton color="error" sx={{
                                                        p: 0
                                                    }}
                                                        size="small"
                                                        onClick={() => {
                                                            product.filterDescription(props.index, i);
                                                        }}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Box>

                                                <Image src={img} width={153} height={153} style={{
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
                                                        window.open(chrome.runtime.getURL(`/trangers_single.html?id=${props.item.id}&type=3&index=${i}`))
                                                    }}>
                                                        이미지 편집/번역
                                                    </Button>
                                                </Box>
                                            </>
                                        })}
                                    </Paper>
                                    }
                                    onDragEnd={(src, dst) => {
                                        product.switchDescription(src, dst, props.index)
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={6} md={6}>
                    <Paper variant="outlined" sx={{
                        border: "1px solid #d1e8ff",
                    }}>
                        <Box sx={{
                            background: "#d1e8ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: 13,
                            px: 1,
                            py: 0.5
                        }}>
                            미리보기

                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <Button disableElevation variant="contained" color="info" sx={{
                                    fontSize: 13,
                                    height: 26
                                }} onClick={() => {
                                    product.toggleDescriptionModal(true, props.index);
                                }}>
                                    상세페이지 에디터열기
                                </Button>

                                <Button disableElevation variant="contained" color="info" sx={{
                                    ml: 0.5,
                                    fontSize: 13,
                                    height: 26
                                }} onClick={() => {
                                    window.open(chrome.runtime.getURL(`/trangers_multiple.html?id=${props.item.id}&type=3`))
                                }}>
                                    전체 이미지 편집/번역
                                </Button>

                                <Button disableElevation variant="contained" color="error" sx={{
                                    ml: 0.5,
                                    fontSize: 13,
                                    height: 26
                                }} onClick={() => {
                                    product.initProductDescription(props.item.id, props.index);
                                }}>
                                    상세페이지 복구
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{
                            p: 1,
                            height: 373,
                            overflowY: "auto"
                        }}>
                            <ReactQuill
                                readOnly
                                value={product.itemInfo.items[props.index]?.description}
                                modules={modules}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </>
})