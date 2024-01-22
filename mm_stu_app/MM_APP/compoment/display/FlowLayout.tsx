import React, { forwardRef, useRef, useState } from "react";
import { Row } from "../flex-box/Row";
import { Column } from "../flex-box/Column";
import { View } from "react-native";

export interface IFlowLayout<Item> {
  data: Item[];
  onRender: (value: Item) => JSX.Element;
}

export function FlowLayout<T>({ onRender, ...props }: IFlowLayout<T>) {
  // 瀑布流 默认2列
  const [flowColumns, setFlowColumns] = useState<JSX.Element[][]>([[], []]);
  // 瀑布流 2 列 最高高度
  const flowMaxHeight = useRef([0, 0]);
  //寻找高度最小的列
  const findMinHeightColumns = () => {
    return flowMaxHeight.current.indexOf(Math.min(...flowMaxHeight.current));
  }
  // 重新分配元素
  const handleLayout = (height: number, layout: JSX.Element) => {
    // 获取高度最小的列
    const sortColumnsIndex = findMinHeightColumns();
    const newColumns = [...flowColumns];
    newColumns[sortColumnsIndex].push(layout);
    flowMaxHeight.current[sortColumnsIndex] += height;
    setFlowColumns(newColumns);
  }
  //渲染空列表
  const renderBlock = () => {
    const block = flowDatas.current.map((v, _) => {
      return (
        //默认2列，宽度就是50%
        <View key={_} style={{ width: "50%", alignSelf: "flex-start", alignItems: "center" }}>
          {_renderItem(v)}
        </View>
      );
    });

    return block;
  }

  // flows数据
  const flowDatas = useRef(props.data);

  const _renderItem = (data: T) => {
    const [ isShow, setIsShow ] = useState(true);
    const child = onRender(data);
    return (
      isShow && <Column
        onLayout={e => {
          // 当前容器实际高度
          const { height } = e.nativeEvent.layout;
          handleLayout(height, child);
          setIsShow(false);
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
            columns.map((item) => cells.push(item));
            return (
              <View key={_} style={{ flex: 1, alignSelf: "flex-start", alignItems: "center" }}>
                {cells}
              </View>
            );
          })
        }
      </Row>
    <Row style={{ display: "flex" }}>
      { renderBlock() }
    </Row>
  </>
  );
};