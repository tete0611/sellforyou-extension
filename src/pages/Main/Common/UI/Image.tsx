import * as React from "react";

import { useRef, useState, useEffect } from "react";
import { Box, Skeleton } from '@mui/material';

export default function Image(props: any) {
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver>();

    const [isLoad, setIsLoad] = useState(false);

    function onIntersection(
        entries: IntersectionObserverEntry[],
        io: IntersectionObserver
    ) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                io.unobserve(entry.target);
                setIsLoad(true);
            }
        });
    }

    useEffect(() => {
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(onIntersection, {
                threshold: 0.5
            });
        }

        imgRef.current && observerRef.current.observe(imgRef.current);
    }, []);

    return <Box sx={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }} ref={imgRef}>
        {isLoad ? <img {...props} /> : <Skeleton variant="rectangular" width={props.width} height={props.height} />}
    </Box>;
}
