import React from 'react';

import { observer } from "mobx-react";

export const Footer = observer(function () {
    return <>
        <div style={{
            background: "cornflowerblue",
            color: "white",
            padding: 25
        }}>
            COPYRIGHT 2022, SELLFORYOU, ALL RIGHTS RESERVED
        </div>
    </>
});