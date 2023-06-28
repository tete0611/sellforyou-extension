import * as React from "react";

import { useRef, useState, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";

// 이미지 뷰(LazyLoad 기법 적용)
export default function Image(props: any) {
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  const [isLoad, setIsLoad] = useState(false);

  // 엘리먼트가 화면에 노출되었는지 확인
  function onIntersection(entries: IntersectionObserverEntry[], io: IntersectionObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        io.unobserve(entry.target);
        setIsLoad(true);
      }
    });
  }

  // 50% 이상 노출되었을 경우 이미지를 렌더링함
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(onIntersection, {
        threshold: 0.5,
      });
    }

    imgRef.current && observerRef.current.observe(imgRef.current);
  }, []);

  // 이미지 렌더링 전에는 <Skeleton> 태그로 회색바탕으로만 보이도록 설정
  return (
    <Box
      sx={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={imgRef}
    >
      {isLoad ? <img {...props} /> : <Skeleton variant="rectangular" width={props.width} height={props.height} />}
    </Box>
  );
}
