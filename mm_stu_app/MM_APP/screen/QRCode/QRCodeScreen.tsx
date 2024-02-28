import { Animated, Button, StyleSheet, Text, View } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox"
import { isAndroid, rpx } from "../../utils/common";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { BarCodeReadEvent, Point, RNCamera, Size } from "react-native-camera";
import { Column } from "../../compoment/flex-box/Column";
import { Color } from "../../utils/style";

export const QRCodeScreen = (): JSX.Element => {

  const Style = StyleSheet.create({
    Camera: {
      position: "relative",
      flexDirection: "column",
      justifyContent: "flex-end",
      width: rpx(400),
      height: rpx(550),
      marginTop: rpx(300),
      alignItems: "center",
      marginBottom: rpx(20)
    },
    Line: {
      width: "110%",
      height: rpx(2),
      backgroundColor: "red",
      position: "absolute",
    },
    Ball: {
      width: rpx(50),
      height: rpx(50),
      backgroundColor: Color.Success,
      position: "absolute",
      borderRadius: rpx(25)
    }
  });

  const isFocuse = useIsFocused();

  const Camera = useRef<RNCamera | null>();

  const Tran = useRef(new Animated.Value(0));

  const up = () => {
    Animated.timing(Tran.current, {
      useNativeDriver: false,
      toValue: 0,
      duration: 2000,
    }).start(({ finished }) => {
      if (finished) {
        down();
      }
    })
  }

  const down = () => {
    Animated.timing(Tran.current, {
      useNativeDriver: false,
      toValue: rpx(550),
      duration: 2000
    }).start(({ finished }) => {
      if (finished) {
        up();
      }
    })
  }

  useEffect(() => {
    down();
  }, []);

  const [isBarCodeRead, setIsBarCodeRead] = useState(false);

  const [pos, setPos] = useState<Point<number>>({ x: 0, y: 0 });

  const _camera_pos = useRef<Point<number>>({ x: 0, y: 0 });

  const _render_pos = (bounds: BarCodeReadEvent["bounds"]) => {
    if (bounds.origin instanceof Array) {
      let W: number, H: number;
      if (isAndroid()) {
        const { width, height } = bounds as {
          width: number;
          height: number;
          origin: Point<string>[];
        };
        W = width, H = height;
      } else {
        const { size } = bounds as {
          origin: Point<string>;
          size: Size<string>;
        };
        const { width, height } = size;
        W = + width, H = + height;
      }
      const A: Point<string> = bounds.origin[1];
      const B: Point<string> = bounds.origin[0];
      //const C : Point<string> = e.bounds.origin[2];
      const D: Point<string> = bounds.origin[3];
      const X = Math.abs(+ B.y + + D.y) / 2;
      const Y = Math.abs(+ B.x + + A.x) / 2;
      const Top = (W - Y) / W;
      const Left = (H - X) / H;

      setPos({ x: Left * 100 - 2, y: ((1 - Top) * 100) - 2 });
    }

  }

  const onBarCodeRead = (e: BarCodeReadEvent) => {

    if (isBarCodeRead) return;
    setIsBarCodeRead(true);
     _render_pos(e.bounds)
    // 对于本机，这个相机视图是逆时针旋转过的
    // 这个坐标是本机相机视图需要顺时针旋转90度得到
    // 需要转化成能使用的坐标
  }

  return (
    <ContainerBox
      isFocuse={isFocuse}
      StatusBarOptions={{ backgroundColor: "transparent", }}
      style={{ backgroundColor: "#fff" }}>
      <Column>
        <RNCamera
          onLayout={e => {
            const { width: w, height: h } = e.nativeEvent.layout
            _camera_pos.current = { x: w, y: h }
          }}
          ref={ref => Camera.current = ref}
          style={Style.Camera}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          useNativeZoom={true}
          onBarCodeRead={onBarCodeRead}
        >
          <Animated.View style={{ ...Style.Line, top: Tran.current }}></Animated.View>
          {
            isBarCodeRead &&
            <Column style={{ ...Style.Ball, top: `${pos.y}%`, left: `${pos.x}%` }}>
              <View style={{ width: rpx(30), height: rpx(30), borderRadius: rpx(15), backgroundColor: "#ffffff" }}></View>
            </Column>
          }
        </RNCamera>
        <Text style={{ marginBottom: rpx(30) }}>请对准二维码或条形码扫描</Text>
        <Button title="重新扫码" onPress={() => setIsBarCodeRead(false)} />
      </Column>
    </ContainerBox>
  )
}