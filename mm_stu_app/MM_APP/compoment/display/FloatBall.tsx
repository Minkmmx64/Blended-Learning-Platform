//悬浮球
import { Animated, PanResponder, StyleSheet, TouchableOpacity, Vibration } from "react-native"
import { Column } from "../flex-box/Column"
import { Device_H, Device_W, rpx } from "../../utils/common"
import { Color } from "../../utils/style"
import { Row } from "../flex-box/Row"
import { useState } from "react"

const Style = StyleSheet.create({
  ball: {
    position: "absolute",
    width: rpx(70),
    height: rpx(70),
    borderRadius: rpx(35),
    backgroundColor: "#ffffff",
    borderWidth: rpx(12),
    borderColor: Color.Primary,
  },
})

interface IFloatBallProps {
  //悬浮窗点击事件
  onFloatBallPress ?: () => void;
}

export const FloatBall = (Props: IFloatBallProps): JSX.Element => {

  const onLongPress = () => {
    setIsPress(true);
    Vibration.vibrate(100);
  }

  const onPress = () => {
    Props.onFloatBallPress && Props.onFloatBallPress();
  }

  const getPanResponder = () => {
    if(isPress) return panResponder.panHandlers;
    return {};
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderTerminate: (evt, gestureState) => { },
    onShouldBlockNativeResponder: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {},
    onPanResponderMove: (evt, gestureState) => {
      const { pageX, pageY } = evt.nativeEvent;
      setPoint({ x: Device_W - pageX, y : pageY - 90})
    },
    onPanResponderRelease: (evt, gestureState) => {
      setIsPress(false);
      setPoint({ ...point, x: 0 })
    }
  })

  const [ isPress, setIsPress ] = useState(false);

  const [ point, setPoint ] = useState({
    x: 0,
    y: 600
  })

  return (
    <>
      <Column {...getPanResponder()} style={{ flex: 1, position: "absolute", top: 0, right: 0 }} >
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={1}
          style={{ ...Style.ball, right: point.x, top: point.y }}>
        </TouchableOpacity>
      </Column>
    </>
  )
}