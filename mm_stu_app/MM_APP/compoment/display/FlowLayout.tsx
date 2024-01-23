import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Row } from "../flex-box/Row";
import { Column } from "../flex-box/Column";
import { Animated, View } from "react-native";

export interface IFlowLayout<Item> {
  // 分栏
  columns?: number;

  onRender: (value: Item) => JSX.Element;
}

export interface FlowLayoutProviderRef<T> {
  appendFlowDatas: (data : T[]) => void;
}

export function FlowLayout<T>({ onRender, ...props }: IFlowLayout<T>, ref: ForwardedRef<FlowLayoutProviderRef<T>>) {

  useImperativeHandle(ref, () => ({
    appendFlowDatas
  }));

  //添加元素
  const appendFlowDatas = (data : T[]) => {
    const olds = [...datas];
    setDatas([...olds, ...data]);
  }

  //集合，存放layout key , 避免重复渲染 ??
  const idx = useRef(new Set<string>());

  // 瀑布流 默认2列
  const [flowColumns, setFlowColumns] = useState<JSX.Element[][]>([]);
  // 数据源
  const [ datas, setDatas ] = useState<T[]>([]);
  // 瀑布流 列 最高高度
  const flowMaxHeight = useRef<number[]>([]);

  useEffect(() => {
    // 默认2列
    const columns = props.columns ?? 2;
    const x = [];
    for(let i = 0 ; i < columns; i++) {
      flowMaxHeight.current.push(0);
      x.push([]);
    }
    setFlowColumns(x);
  }, []);

  //寻找高度最小的列
  const findMinHeightColumns = () => {
    return flowMaxHeight.current.indexOf(Math.min(...flowMaxHeight.current));
  }

  // 重新分配元素
  const handleLayout = (height: number, layout: JSX.Element) => {
    const key = layout.key!;
    if(idx.current.has(key)) return;
    idx.current.add(layout.key!);
    // 获取高度最小的列
    const sortColumnsIndex = findMinHeightColumns();
    const newColumns = [...flowColumns];
    newColumns[sortColumnsIndex].push(layout);
    flowMaxHeight.current[sortColumnsIndex] += height;
    setFlowColumns(newColumns);
  }

  //渲染真实瀑布流元素
  const _renderFlowItem = useMemo(
    () => 
      (Props: { element: JSX.Element }) => {
      const anim = useRef(new Animated.Value(0)).current;
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();

      return (
        <Animated.View style={{ width: "100%", alignItems: "center", opacity: anim }}>
          { Props.element }
        </Animated.View>
      )
  }, []);
  
  const _renderItem = (data: T) => {
    const child = onRender(data);
    return (
      <Column
        onLayout={e => {
          // 当前容器实际高度
          const { height } = e.nativeEvent.layout;
          handleLayout(height, child);
        }}>
        {/** 内容区 */}
        { child }
      </Column>
    )
  }

  {/** 瀑布流 */ }
  return (
    <>
      <Row>
        {
          flowColumns.map((columns, _) => {
            const cells = [] as JSX.Element[];
            columns.map((item, __) => cells.push(<_renderFlowItem key = { __ } element={item} />));
            return (
              <View key={ _ } style={{ flex: 1, alignSelf: "flex-start", alignItems: "center" }}>
                { cells }
              </View>
            );
          })
        }
      </Row>
      <Row style={{ display: "flex", position: "absolute", left: "-100%" }}>
        { 
          //渲染空列表
          datas.map((v, _) => {
            return (
              //默认2列，宽度就是50%
              <View key={_} style={{ alignSelf: "flex-start", alignItems: "center" }}>
                {_renderItem(v)}
              </View>
            )
          })
        }
      </Row>
  </>
  );
};

export function FlowLayoutProvider <T>() { return forwardRef<FlowLayoutProviderRef<T>, IFlowLayout<T>>(FlowLayout); }