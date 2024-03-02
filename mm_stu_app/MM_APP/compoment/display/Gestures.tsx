// 手势图案
import { StyleSheet, Text, View, PanResponder, Vibration, Animated, Button } from "react-native"
import { Column } from "../flex-box/Column"
import { Row } from "../flex-box/Row"
import { rpx } from "../../utils/common"
import { Color } from "../../utils/style"
import { ForwardedRef, forwardRef , useImperativeHandle, useRef, useState } from "react"

interface IGesturesProps {

  //图案绘制完成
  onResult: (value: number[]) => Promise<boolean> | boolean;

  //顶部文字
  title: string;
}

interface _ILine {

  //线段宽度
  width : number;

  //线段旋转角度
  rotate: number;
}

interface _Point {
  x: number;
  y: number;
}

//每个元素坐标属性
interface _ICell {

  //该元素 距离屏幕左边距离
  pageX: number;

  //该元素距离屏幕右边距离
  pageY: number;

  //高亮元素func
  __onPressIn: () => void;

  //元素id;
  id: number;
}

interface _Cell_Forward_Ref {

  setLineWR: (l: number, r: number) => void;

  clear: () => void;

  id: number;

  setTheme: (color: string) => void;

}

// 从T 中排除 U 
type Choose<T, U extends keyof T> = {
  [V in keyof T as V extends U ? never : V ] : T[V];
}

//计算2点之间距离,以及夹角
const calcLWR = (A: _Point, B: _Point) : _ILine => {

  const width = Math.sqrt(Math.abs((A.x - B.x) ** 2  + (A.y - B.y) ** 2));

  const rotate = Math.atan2((B.y - A.y), (B.x - A.x)) * 180 / Math.PI;

  return { width , rotate }
}



const Style = StyleSheet.create({
  cell: {
    width: rpx(100),
    height: rpx(100),
    borderRadius: rpx(50),
    borderWidth: rpx(1),
    borderColor: Color.Primary,
  },
  getsures: {
    height: rpx(750),
    justifyContent: "space-around",
    alignContent: "space-around",
    borderColor: Color.Primary,
    borderBottomWidth: rpx(1),
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  title: {
    height: rpx(120),
    borderBottomColor: Color.Primary,
    borderBottomWidth: rpx(1),
  }
})

export const Gestures = ({ onResult, title }: IGesturesProps): JSX.Element => {

  //当前手势图案内容区
  const _Gesture_Cell_Ref = useRef<View>(null);

  const _Title = (): JSX.Element => {

    return (
      <Row style={Style.title}>
        <Text>{ title ?? "手势自定义标题"}</Text>
      </Row>
    );
  }

  //每个手势图案Ref属性
  const __Cell_Items_Forward_Ref = [] as React.MutableRefObject<_Cell_Forward_Ref>[];

  for(let i = 1 ; i <= 9; i ++) 
    __Cell_Items_Forward_Ref[i] = useRef() as React.MutableRefObject<_Cell_Forward_Ref>;
  
  //当前选中图案编号
  let _current_rendered_id : number = -1;

  const _Gesture_Cell = (): JSX.Element => {
    
    const res = [] as JSX.Element[];

    for (let i = 1; i <= 9; i++) {

      res.push(
        <Row key={i} style={{ width: "33%", height: "33%" }}>
          <_Cell 
            id={i} 
            ref={__Cell_Items_Forward_Ref[i]} />
        </Row>
      );
    }

    return (
      <View ref={_Gesture_Cell_Ref} style={Style.getsures}>
        {res}
      </View>
    )
  }

  //每个手势图案基本属性, 当前手势坐标，触发动画函数
  const __Cell_Items_: _ICell[] = [];

  //手势完成结果
  let getsures_result : number[] = [];

  //当前已经绘制的路径id
  let __gestures_id_set = new Set<number>();

  //当前是否完成绘制
  let isFinished = false;

  //手势重置
  const _clear = () => {
    isFinished = false;
    __gestures_id_set = new Set<number>();
    __Cell_Items_Forward_Ref.forEach( __ => __.current.clear() );
    getsures_result = [];
  }

  const _Cell = forwardRef((_CellProps: { id: number }, ref: ForwardedRef<_Cell_Forward_Ref>): JSX.Element => {

    useImperativeHandle(ref, () => ({
      setLineWR: (l: number, r: number) => setCellItemWR({ width: l + rpx(20), rotate: r}),
      id: _CellProps.id,
      clear: () => {
        __onPressOut();
        setCellItemWR({ width: rpx(20), rotate: 0});
        setColor(Color.Primary);
      },
      setTheme: (theme: string) => {
        setColor(theme);
      }
    }));
    
    //手势线段开始坐标
    const start = useRef<_Point>({ x: 0, y: 0 });

    //默认路径颜色
    const [ color , setColor ] = useState(Color.Primary);

    //每个手势图案触摸事件
    const _cell_gesture = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => true,

      onPanResponderGrant: async (evt, gestureState) => {
        if(isFinished)return;
        __onPressIn();

        const { pageX, pageY } = await _get_current_touch_cell_measure();

        let currentMovPoint : _Point = { x: pageX,  y: pageY }

        start.current = currentMovPoint;

        _current_rendered_id = _CellProps.id;

        __gestures_id_set.add(_current_rendered_id);

        getsures_result.push(_current_rendered_id);

      },
      onPanResponderMove: (evt, gestureState) => {
        if(isFinished)return;

        const end: _Point = { x: gestureState.moveX, y: gestureState.moveY }

        const { width, rotate } = calcLWR(start.current, end);

        __Cell_Items_Forward_Ref[_current_rendered_id].current.setLineWR(width, rotate);

        const findCellItem = __Cell_Items_.find( CellItem => 
                                                    Math.abs((CellItem.pageX - end.x)) <= 20 && 
                                                    Math.abs((CellItem.pageY - end.y)) <= 20 && 
                                                    !__gestures_id_set.has(CellItem.id)
                                       );

        if(findCellItem) {
          Vibration.vibrate(200)

          findCellItem.__onPressIn();

          const { width, rotate } = calcLWR(start.current, { x: findCellItem.pageX, y: findCellItem.pageY });

          __Cell_Items_Forward_Ref[_current_rendered_id].current.setLineWR(width, rotate);

          start.current = { x: findCellItem.pageX, y: findCellItem.pageY }

          _current_rendered_id = findCellItem.id;

          getsures_result.push(_current_rendered_id);

          __gestures_id_set.add(findCellItem.id);
        }
      },
      //手指松开
      onPanResponderRelease: (evt, gestureState) => {
        __Cell_Items_Forward_Ref[_current_rendered_id].current.setLineWR(-rpx(20), 0);

        isFinished = true;

        const setThemeForResult = (color: string) => {
          __Cell_Items_Forward_Ref.forEach( CellItemRef => {

            if(__gestures_id_set.has(CellItemRef.current.id)) 
              CellItemRef.current.setTheme(color);

          })
        }

        const res = onResult(getsures_result);

        if(Object.getPrototypeOf(res) === Boolean.prototype) {

          if(!res) setThemeForResult(Color.Danger);
          else setThemeForResult(Color.Success);

        } else {
          (res as Promise<boolean>)
              .then( res => {
                if(!res) setThemeForResult(Color.Danger);
                else setThemeForResult(Color.Success);
              })
              .catch( () =>  setThemeForResult(Color.Danger) );
        }
      },
    });

    //手势图案缩放
    const _hover_anim_value_scale = useRef(new Animated.Value(1));
    //手势图案透明的
    const _hover_anim_value_opacity = useRef(new Animated.Value(1));
    //手势图案过渡时间
    const _hover_anim_duration = useRef(200).current;
    //手势图案Ref
    const _hover_anim_ref = useRef<View>(null);

    const _hover = StyleSheet.create({
      _anim: {
        width: rpx(20),
        height: rpx(20),
        backgroundColor: color,
        borderRadius: rpx(9999999999),
        transform: [{ scale: _hover_anim_value_scale.current }],
        opacity: _hover_anim_value_opacity.current
      },
      _line: {
        height: rpx(20),
        borderRadius: rpx(20),
        backgroundColor: color,
        position: "absolute",
        left: rpx(40),
        top: rpx(40),
        transformOrigin: `5px 5px`
      }
    });

    //手势图案触发动画
    const __onPressIn = () => {
      Animated.timing(_hover_anim_value_opacity.current, {
        toValue: 0.2,
        useNativeDriver: false,
        duration: _hover_anim_duration
      }).start();
      Animated.timing(_hover_anim_value_scale.current, {
        toValue: 5,
        useNativeDriver: false,
        duration: _hover_anim_duration
      }).start();
    }

    //手势图啊结束动画
    const __onPressOut = () => {
      Animated.timing(_hover_anim_value_opacity.current, {
        toValue: 1,
        useNativeDriver: false,
        duration: _hover_anim_duration
      }).start();
      Animated.timing(_hover_anim_value_scale.current, {
        toValue: 1,
        useNativeDriver: false,
        duration: _hover_anim_duration
      }).start();
    }

    //获取当前触摸的图案宽度，以及位置信息
    const _get_current_touch_cell_measure = () : Promise<Choose<_ICell, "__onPressIn" | "id">>=> {
      return new Promise((resolve, reject) => {
        if (_hover_anim_ref.current) {
          _hover_anim_ref.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
            resolve({  pageX, pageY });
          });
        }
        else reject("节点不存在");
      })
    }

    const _hover_anim_layout = async () => {
      const { pageX, pageY } = await _get_current_touch_cell_measure();

      _Gesture_Cell_Ref.current?.measure((_, __, ___, ____, _____, _pageY) => {

        const _props: _ICell = { pageX, pageY: pageY, __onPressIn: __onPressIn, id: _CellProps.id };

        __Cell_Items_.push(_props);
      });
    }

    //设置当前手势图案线段长度和角度
    const [ CellItemWR, setCellItemWR ] = useState({ width: 0, rotate: 0 })

    const _Line = ( _LineProps : _ILine) : JSX.Element => {
      return <View 
        style={ { 
          ... _hover._line, 
          width: _LineProps.width,
          transform: [
            { rotate: `${_LineProps.rotate}deg` }
          ]} } />
    }

    return (
      <Row {..._cell_gesture.panHandlers} style={Style.cell}>
        <Animated.View
          ref={_hover_anim_ref}
          onLayout={_hover_anim_layout}
          style={_hover._anim}>
        </Animated.View>
        { <_Line width={ CellItemWR.width } rotate={ CellItemWR.rotate } /> }
      </Row>
    )
  });

  return (
    <Column>
      <_Title />
      <_Gesture_Cell />
      <Button title="重置" onPress={ _clear } />
    </Column>
  )
}