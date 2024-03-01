// 手势图案
import { StyleSheet, Text, View, PanResponder, Vibration, Animated, Button } from "react-native"
import { Column } from "../flex-box/Column"
import { Row } from "../flex-box/Row"
import { rpx } from "../../utils/common"
import { Color } from "../../utils/style"
import { ForwardedRef, forwardRef , useImperativeHandle, useRef, useState } from "react"

interface IGesturesProps {

  onResult: (value: number[]) => Promise<boolean> | boolean;

  title: string;

}

interface _ILine {
      
  width : number;

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

interface __cell_forward_ref__ {

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
const calcLR = (A: _Point, B: _Point) => {

  const l = Math.sqrt(Math.abs((A.x - B.x) ** 2  + (A.y - B.y) ** 2));

  const r = Math.atan2((B.y - A.y), (B.x - A.x)) * 180 / Math.PI;

  return { l, r }
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

  const _Gesture_Cell_Ref = useRef<View>(null);

  const _Title = (): JSX.Element => {

    return (
      <Row style={Style.title}>
        <Text>{ title ?? "手势自定义标题"}</Text>
      </Row>
    );
  }

  const __cell__ref__ = [] as React.MutableRefObject<__cell_forward_ref__>[];

  for(let i = 0 ; i < 9; i ++) __cell__ref__[i] = useRef() as React.MutableRefObject<__cell_forward_ref__>;
  
  let current_id : number = -1;

  const _Gesture_Cell = (): JSX.Element => {
    const res = [] as JSX.Element[];
    for (let i = 1; i <= 9; i++) {
      res.push(
        <Row key={i} style={{ width: "33%", height: "33%" }}>
          <__Cell id={i - 1} ref={__cell__ref__[i - 1]} />
        </Row>
      );
    }

    return (
      <View ref={_Gesture_Cell_Ref} style={Style.getsures}>
        {res}
      </View>
    )
  }

  const _Cell_Props: _ICell[] = [];
  let result : number[] = [];

  let _set = new Set<number>();

  let isFinished = false;

  const _clear = () => {
    isFinished = false;
    _set = new Set<number>();
    __cell__ref__.forEach( __ => __.current.clear() );
    result = [];
  }

  const _Cell = (_CellProps: { id: number }, ref: ForwardedRef<__cell_forward_ref__>): JSX.Element => {

    useImperativeHandle(ref, () => ({
      setLineWR: (l: number, r: number) => setWR({ width: l + rpx(20), rotate: r}),
      id: _CellProps.id,
      clear: () => {
        __onPressOut();
        setWR({ width: rpx(20), rotate: 0});
        setColor(Color.Primary);
      },
      setTheme: (theme: string) => {
        setColor(theme);
      }
    }));
    
    const start = useRef<_Point>({ x: 0, y: 0 });

    const [ color , setColor ] = useState(Color.Primary);

    const _cell_gesture = PanResponder.create({
      // 要求成为响应者：
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
        const { pageX, pageY } = await _get_cell_measure();
        let mov : _Point = {
          x: pageX,
          y: pageY
        }
        start.current = mov;
        current_id = _CellProps.id;
        _set.add(current_id);
        result.push(current_id);
      },
      onPanResponderMove: (evt, gestureState) => {
        if(isFinished)return;
        const end: _Point = {
          x: gestureState.moveX,
          y: gestureState.moveY
        }
        const { l, r } = calcLR(start.current, end);
        __cell__ref__[current_id].current.setLineWR(l, r);

        const find = _Cell_Props.find( p => Math.abs((p.pageX - end.x)) <= 20 && Math.abs((p.pageY - end.y)) <= 20 && !_set.has(p.id));
        if(find) {
          Vibration.vibrate(200)
          find.__onPressIn();
          const { l, r } = calcLR(start.current, { x: find.pageX, y: find.pageY });
          __cell__ref__[current_id].current.setLineWR(l, r);
          start.current = {
            x: find.pageX,
            y: find.pageY
          }
          current_id = find.id;
          result.push(current_id);
          _set.add(find.id);
        }
      },
      //手指松开
      onPanResponderRelease: (evt, gestureState) => {

        __cell__ref__[current_id].current.setLineWR(-rpx(20), 0);

        isFinished = true;

        const fn = () => {
          __cell__ref__.forEach( p => {
            if(_set.has(p.current.id)) p.current.setTheme(Color.Danger);
          })
        }

        const res = onResult(result);

        if(Object.getPrototypeOf(res) === Boolean.prototype) {
          if(!res)fn();
        } else {
          (res as Promise<boolean>).then( res => {
            if(!res) {
              fn();
            }
          }).catch( error => {
            fn();
          })
        }
      },
    });

    const _hover_anim_value_scale = useRef(new Animated.Value(1));
    const _hover_anim_value_opacity = useRef(new Animated.Value(1));
    const _duration = useRef(200).current;
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

    const __onPressIn = () => {
      Animated.timing(_hover_anim_value_opacity.current, {
        toValue: 0.2,
        useNativeDriver: false,
        duration: _duration
      }).start();
      Animated.timing(_hover_anim_value_scale.current, {
        toValue: 5,
        useNativeDriver: false,
        duration: _duration
      }).start();
    }

    const __onPressOut = () => {
      Animated.timing(_hover_anim_value_opacity.current, {
        toValue: 1,
        useNativeDriver: false,
        duration: _duration
      }).start();
      Animated.timing(_hover_anim_value_scale.current, {
        toValue: 1,
        useNativeDriver: false,
        duration: _duration
      }).start();
    }

    const _get_cell_measure = () : Promise<Choose<_ICell, "__onPressIn" | "id">>=> {
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
      const { pageX, pageY } = await _get_cell_measure();
      _Gesture_Cell_Ref.current?.measure((_, __, ___, ____, _____, _pageY) => {
        const _props: _ICell = { pageX, pageY: pageY, __onPressIn: __onPressIn, id: _CellProps.id };
        _Cell_Props.push(_props);
      });
    }


    const [ WR, setWR ] = useState({ width: 0, rotate: 0 })

    const _Line = ( _Line_Props : _ILine) : JSX.Element => {
      return <View 
        style={ { 
          ... _hover._line, 
          width: _Line_Props.width,
          transform: [{ rotate: `${_Line_Props.rotate}deg` }]} } />
    }

    return (
      <Row {..._cell_gesture.panHandlers} style={Style.cell}>
        <Animated.View
          ref={_hover_anim_ref}
          onLayout={_hover_anim_layout}
          style={_hover._anim}>
        </Animated.View>
        { <_Line width={WR.width} rotate={WR.rotate} /> }
      </Row>
    )
  }

  const __Cell = forwardRef(_Cell);

  return (
    <Column>
      <_Title />
      <_Gesture_Cell />
      <Button title="重置" onPress={ _clear } />
    </Column>
  )
}