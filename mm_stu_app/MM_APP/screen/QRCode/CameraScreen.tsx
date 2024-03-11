import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox"
import { BarCodeReadEvent, RNCamera, TakePictureOptions } from "react-native-camera";
import { useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Row } from "../../compoment/flex-box/Row";
import { rpx } from "../../utils/common";
export const CameraScreen = (): JSX.Element => {
  const Style = StyleSheet.create({
    Capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      margin: 20,
      width: rpx(200),
      
    },
  });

  const isFocuse = useIsFocused();

  const Camera = useRef<RNCamera | null>();

  const takePicture = async () => {
    if (Camera.current) {
      const options: TakePictureOptions = {
        base64: true,
        imageType: "png",
      };
      const data = await Camera.current.takePictureAsync(options);

      

      console.log(data.uri);
    }
  };

  return (
    <ContainerBox
      isFocuse={isFocuse}
      StatusBarOptions={{ backgroundColor: "transparent", }}
      style={{ backgroundColor: "#000" }}>
      <RNCamera
        ref={ref => Camera.current = ref}
        style={{ flex: 1, position: "relative", flexDirection: "column", justifyContent: "flex-end", width: "100%" }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        useNativeZoom={true}
      >
        <Row style={{ justifyContent: "space-around" }}>
          <TouchableOpacity
            onPress={ takePicture }
            style={ Style.Capture }
          >
            <Text style={{ textAlign: "center" }}>拍照</Text>
          </TouchableOpacity>
        </Row>
      </RNCamera>
    </ContainerBox>
  )
}