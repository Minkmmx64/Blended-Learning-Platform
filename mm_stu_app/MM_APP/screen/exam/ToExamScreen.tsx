import { Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ContainerBox } from "../../compoment/ContainerBox"
import { StackScreenProps } from "../../navigator"
import { useEffect, useRef, useState } from "react";
import { RootStoreRedux } from "../../store";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { connect } from "react-redux";
import { Column } from "../../compoment/flex-box/Column";
import { rpx } from "../../utils/common";
import { Color } from "../../utils/style";
import { CheckBox, CheckBoxGroup } from "../../compoment/Form/CheckBox";
import { Toast } from "../../compoment/display/toast/Toast";
import { Row } from "../../compoment/flex-box/Row";

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
  },
  Msg: {
    height: rpx(400),
    borderWidth: rpx(0.5),
    borderColor: Color.Info,
    width: rpx(600),
    justifyContent: "flex-start",
    borderRadius: rpx(10),
    paddingLeft: rpx(10)
  }
})

const ToExamScreen = ({ route, navigation }: IToExamScreenProps): JSX.Element => {

  const taskMsg = useRef([
    "作业提交时间：作业需在截止日期前完成并提交，逾期将扣分。",
    "提交格式：请按要求使用规定格式提交作业，确保文件清晰可读。",
    "合作与引用：允许合作讨论，但请独立完成作业。引用他人观点时需注明出处。",
    "诚信守则：请保持诚实守信，杜绝抄袭和作弊行为，一经发现将受到严厉处罚。",
    "问题沟通：如有疑问，请及时向老师请教，不要等到最后一刻。",
    "评分标准：请仔细阅读评分标准，确保作业符合要求，以获得更好的成绩。"
  ]).current;

  const [ read, setRead ] = useState<number | null>(null);

  const ToExam = () => {
    if(!read) return Toast.show("请确认");
    const { examId } = route.params;
    navigation.navigate("AccessExamScreen", { examId: examId });
  }

  return (
    <ContainerBox>
      <Column style={{ flex: 1, position: "relative" }}>
        <Column style={Style.Msg}>
          <ScrollView style={{ width: "100%"}}>
            <Text style={{ textAlign: "center", color: Color.Primary, fontSize: rpx(40), marginBottom: rpx(15), marginTop: rpx(20) }}>
              请阅读作业须知
            </Text>
            { taskMsg.map( (msg, _) => <Text key={ _ } style={{ fontSize: rpx(31), marginTop: rpx(5)}}>    { msg }</Text>)}
          </ScrollView>
        </Column>
        <Row>
          <CheckBoxGroup
            isChecked={ read ?? -1 }
            checks={[{ name: "我已阅读", value: 1 } ]} 
            onChange={ setRead }
          />
        </Row>
        <TouchableOpacity 
          onPress={ ToExam }
          activeOpacity={0.9} style={{ position: "absolute", bottom: rpx(200) }}>
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