import { useEffect, useRef, useState } from "react";
import { ToastContainerProps } from "./Toast.type";
import { Column } from "../../flex-box/Column";
import { Animated, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { rpx } from "../../../utils/common";
import ToastObserver from './ToastObserver';
import { Row } from "../../flex-box/Row";

const ToastContainerStyle = StyleSheet.create({
  Main: {
    position: "absolute",
    width: rpx(500),
    backgroundColor: "rgba(13, 27, 42, 0.7)",
    top: rpx(600),
    left: rpx(125),
    borderRadius: rpx(20),
    zIndex: 100000
  },
  ShowTitle: { 
    width: "100%",
    height: rpx(60),
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: rpx(20),
    paddingRight: rpx(30),
    alignContent: "center"
  },
  ShowMessage: {
    paddingLeft: rpx(30),
    paddingRight: rpx(20),
    maxHeight: rpx(500)
  }
});

export const ToastContainer = (Props: ToastContainerProps) => {

  const [ visible , setVisible ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ message, setMessage ] = useState("");

  const anim_opacity = useRef(new Animated.Value(0)).current;

  const anim_duration = useRef(400).current;

  const fade_in = () => {
    Animated.timing(anim_opacity, {
      toValue: 1,
      duration: anim_duration,
      useNativeDriver: true
    }).start();
  }
  const fade_out = () => {
    Animated.timing(anim_opacity, {
      toValue: 0,
      duration: anim_duration,
      useNativeDriver: true
    }).start(({ finished }) => {
      if(finished) setVisible(false);
    });
  }
  
  useEffect(() => {
    ToastObserver.on("show", e => {
      setVisible(true);
      fade_in();
      setTitle(e.title);
      setMessage(e.message);
    });

    ToastObserver.on("hide", e => {
      setVisible(false);
    });
  }, []);

  return (
    <>
      {Props.children}
      { visible &&  <Animated.View style={{ ...ToastContainerStyle.Main, opacity: anim_opacity }}>
                      <Column>
                        <Row style={ { ... ToastContainerStyle.ShowTitle } }>
                          <Text style={{ color: "#ffffff" }}>{ title }</Text>
                          <TouchableOpacity
                            onPress={ fade_out } 
                            activeOpacity={ 1 }
                          >
                            <Image style={{ width: rpx(50), height: rpx(50)}} source={require("../../../static/course/close.png")} />
                          </TouchableOpacity>
                        </Row>
                        <ScrollView 
                          style={ToastContainerStyle.ShowMessage}>
                          { message && <Text style={{ color: "#ffffff", fontSize: rpx(35)}}>    {message}</Text>}
                        </ScrollView>
                      </Column>
                    </Animated.View>
      }
    </>
  )
}