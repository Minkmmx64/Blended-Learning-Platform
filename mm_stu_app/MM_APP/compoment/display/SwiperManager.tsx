import React, { useEffect, useRef, useState } from "react";
import { Row } from "../flex-box/Row";
import { Animated, PanResponder, ViewStyle } from "react-native";
import { Column } from "../flex-box/Column";

interface ISwiperManager {
  //轮播图宽度
  width: number;
  //轮播图高度
  height: number;
  //轮播图子元素
  children: React.ReactElement<ISwiperManagerItem>[];
  //样式拓展
  style?: ViewStyle;
  //切换时间
  duration?: number;
  //过渡时间
  transition?: number;
}

interface ISwiperManagerItem {
  //轮播图子元素内容
  children?: JSX.Element | JSX.Element[];
  //样式拓展
  style?: ViewStyle

}


export const SwiperManagerItem: React.FC<ISwiperManagerItem> = (SwiperManagerItemProps) => {

  return (
    <>
      <Column style={{ width: "100%", height: "100%", ...SwiperManagerItemProps.style }}>
        {SwiperManagerItemProps.children}
      </Column>
    </>
  )
}

export const SwiperManager: React.FC<ISwiperManager> = (SwiperManagerProps) => {
  // 每一页宽度
  const { width } = SwiperManagerProps;
  //SwiperItem个数
  const swiperItemLength = SwiperManagerProps.children.length; 
  //当前偏移量
  //const [ offsetX, setOffsetX ] = useState(0);
  let offsetX = 0;
  let currentPage = 0;
  let time = null as unknown as NodeJS.Timeout;
  const transition = SwiperManagerProps.transition ?? 500;
  const useSwiperX = useRef(new Animated.Value(offsetX)).current;

  useEffect(() => {
    time = setInterval(start, SwiperManagerProps.duration ?? 2000);
    return () => {
      clearInterval(time);
    }
  });

  function play() {
    Animated.timing(useSwiperX, {
      toValue: - (offsetX + width * (currentPage + 1)),
      duration: transition,
      useNativeDriver: true
    }).start();
    currentPage++;
  }

  function start() {
    if (currentPage >= swiperItemLength - 1) {
      currentPage = 0;
      Animated.timing(useSwiperX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }).start(({ finished }) => {
        if(finished) {
          play();
        }
      });
      return;
    }
    else play()
  }

  return (
    <>
      <Animated.View
        style={{
          flexDirection: "row",
          width: SwiperManagerProps.width,
          height: SwiperManagerProps.height,
          ...SwiperManagerProps.style,
          transform: [{ translateX: useSwiperX }]
        }}>
        {[...SwiperManagerProps.children]}
      </Animated.View>
    </>
  )

}