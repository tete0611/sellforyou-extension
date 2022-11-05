import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../../../containers/AppContext";
import { styled, Badge, Box, Collapse, TableCell, TableRow, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { TabBase } from './TabBase';
import { TabOption } from './TabOption';
import { TabPrice } from './TabPrice';
import { TabThumbnails } from './TabThumbnails';
import { TabOptionImages } from './TabOptionImages';
import { TabDescriptions } from './TabDescriptions';
import { TabAttribute } from './TabAttribute';

const CollapsedTableCell = styled(TableCell)({
    textAlign: "center",
    background: "ghostwhite",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    padding: 0,
    fontSize: 14,
});

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{
                    p: 0.5,

                    height: 425
                }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function tabProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const Details = observer((props: any) => {
    const theme = useTheme();

    const { product } = React.useContext(AppContext);

    return <>
        <TableRow>
            <CollapsedTableCell colSpan={4}>
                <Collapse in={props.item.collapse} timeout={0} unmountOnExit>
                    <Box>
                        <Tabs
                            style={{
                                background: "ghostwhite"
                            }}
                            value={props.item.tabs}
                            onChange={(e, value) => {
                                product.switchTabs(props.index, value);
                            }}
                        >
                            <Tab label={
                                <Badge badgeContent={props.item.searchTagError ? 1 : 0} color="error" variant="dot">
                                    <Typography fontSize={14} sx={{
                                        px: 1
                                    }}>
                                        기본정보
                                    </Typography>
                                </Badge>
                            } {...tabProps(0)} />

                            <Tab label={
                                <Typography fontSize={14} sx={{
                                    px: 1
                                }}>
                                    상품속성
                                </Typography>
                            } {...tabProps(1)} />

                            <Tab disabled={!props.item.productOptionName.length} label={"옵션"} {...tabProps(2)} />

                            <Tab label={
                                <Badge badgeContent={props.item.optionPriceError ? 1 : 0} color="error" variant="dot">
                                    <Typography fontSize={14} sx={{
                                        px: 1
                                    }}>
                                        가격
                                    </Typography>
                                </Badge>
                            } {...tabProps(3)} />

                            <Tab label={
                                <Badge badgeContent={props.item.thumbnailImageError ? 1 : 0} color="error" variant="dot">
                                    <Typography fontSize={14} sx={{
                                        px: 1
                                    }}>
                                        썸네일이미지
                                    </Typography>
                                </Badge>
                            } {...tabProps(4)} />

                            <Tab disabled={!props.item.productOptionName.length} label={
                                <Badge badgeContent={props.item.optionImageError ? 1 : 0} color="error" variant="dot">
                                    <Typography fontSize={14} sx={{
                                        px: 1
                                    }}>
                                        옵션이미지
                                    </Typography>
                                </Badge>
                            } {...tabProps(5)} />

                            <Tab label={
                                <Badge badgeContent={props.item.descriptionImageError ? 1 : 0} color="error" variant="dot">
                                    <Typography fontSize={14} sx={{
                                        px: 1
                                    }}>
                                        상세이미지
                                    </Typography>
                                </Badge>
                            } {...tabProps(6)} />
                        </Tabs>

                        <TabPanel value={props.item.tabs} index={0} dir={theme.direction}>
                            <TabBase item={props.item} index={props.index} />
                        </TabPanel>

                        <TabPanel value={props.item.tabs} index={1} dir={theme.direction}>
                            <TabAttribute item={props.item} index={props.index} />
                        </TabPanel>

                        <TabPanel value={props.item.tabs} index={2} dir={theme.direction}>
                            <TabOption item={props.item} index={props.index} />
                        </TabPanel>

                        <TabPanel value={props.item.tabs} index={3} dir={theme.direction}>
                            <TabPrice item={props.item} index={props.index} />
                        </TabPanel>

                        <TabPanel value={props.item.tabs} index={4} dir={theme.direction}>
                            <TabThumbnails item={props.item} index={props.index} />
                        </TabPanel>

                        <TabPanel value={props.item.tabs} index={5} dir={theme.direction}>
                            <TabOptionImages item={props.item} index={props.index} />
                        </TabPanel>

                        <TabPanel value={props.item.tabs} index={6} dir={theme.direction}>
                            <TabDescriptions item={props.item} index={props.index} />
                        </TabPanel>
                    </Box>
                </Collapse>
            </CollapsedTableCell>
        </TableRow>
    </>
});