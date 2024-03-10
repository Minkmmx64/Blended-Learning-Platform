import { Button, StyleSheet, Text, TouchableOpacity } from "react-native"
import { ContainerBox } from "../../compoment/ContainerBox"
import { StackScreenProps } from "../../navigator"
import { useEffect } from "react";
import { RootStoreRedux } from "../../store";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { connect } from "react-redux";
import { Column } from "../../compoment/flex-box/Column";
import { rpx } from "../../utils/common";
import { Color } from "../../utils/style";

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps
}

type IToExamScreenProps = StackScreenProps<"ToExamScreen"> & ReduxProps;

const Style = StyleSheet.create({
  start: {
    width: rpx(400),
    backgroundColor: Color.Primary,
    height: rpx(50),
    borderRadius: rpx(10),
    alignSelf: "flex-end",
  }
})

const ToExamScreen = ({ route } : IToExamScreenProps) : JSX.Element => {

  useEffect(() => {
    const { examId } = route.params;
    console.log(examId);
  }, []);

  return (
    <ContainerBox>
      <Column style={{ flex: 1, position: "relative"}}>
        <Text>您正在进行</Text>
          <TouchableOpacity activeOpacity={0.9} style={{ position: "absolute", bottom: rpx(200)}}>
            <Column style={Style.start}>
              <Text style={{ color: "#ffffff" }}>开始考试</Text>
            </Column>
          </TouchableOpacity>
        </Column>
    </ContainerBox>
  )
  
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"ToExamScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux
  };
};


export default connect(mapStateToProps)(ToExamScreen);