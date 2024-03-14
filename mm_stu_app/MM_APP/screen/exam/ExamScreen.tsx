import { connect } from "react-redux"
import { ContainerBox } from "../../compoment/ContainerBox";
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RootStoreRedux } from "../../store";
import { StackScreenProps } from "../../navigator";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { useCallback, useEffect, useState } from "react";
import exam, { ExamStatus, StuExamProps } from "../../request/api/exam";
import { Toast } from "../../compoment/display/toast/Toast";
import { Column } from "../../compoment/flex-box/Column";
import { DateTransform, rpx } from "../../utils/common";
import { Row } from "../../compoment/flex-box/Row";
import { Color } from "../../utils/style";

const ExamStyle = StyleSheet.create({
  Item: {
    marginTop: rpx(10),
    height: rpx(120)
  },
  Exam: {
    width: "100%",
    paddingLeft: rpx(40),
    paddingRight: rpx(40)
  }
})

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps
}

type IExamScreenProps = StackScreenProps<"ExamScreen"> & ReduxProps

const ExamScreen = ({ useAppUserRedux, navigation } : IExamScreenProps) => {

  const onRefresh = () => {
    setRefreshing(true);
    const studentId = useAppUserRedux.student?.id;
    // 加载作业列表
    if(studentId){
      exam.getExamLists({ studentId: studentId })
          .then( ({ data }) => { setExamLists(data), setRefreshing(false) } )
          .catch( error => Toast.show("错误", JSON.stringify(error)))
    }
  }

  const [ examLists, setExamLists ] = useState<StuExamProps[]>([]);

  const [ refreshing, setRefreshing ] = useState(false);

  useEffect(onRefresh , []);

  const select = useCallback((status: ExamStatus) => {
    const colors = {} as Record<string, string>;
    colors[ExamStatus.successful] = Color.Success;
    colors[ExamStatus.uncommitted] = Color.Danger;
    colors[ExamStatus.waiting] = Color.Info;
    return colors[status];
  }, []);

  const toExam = (examId: number, exam_status: ExamStatus) => {
    navigation.navigate("ToExamScreen", {
      examId: examId,
      status: exam_status
    });
  }

  const getRelaTime = useCallback(( time: string ) => {
    const x1 = new Date(time).getTime();
    const x2 = new Date().getTime();
    if(x1 - x2 <= 0) return "已结束"
    else {
      const ms = x1 - x2 - 8 * 60 * 60 * 1000; // 毫秒 - 8小时时差
      const s = ms / 1000; // 秒
      const m = s / 60; // 分
      const mm = m % 60; // 剩余时间(分)
      const h = m / 60; // 小时
      const d = h / 24;
      return `还有 ${d.toFixed(0)}天 ${(h % 24).toFixed(0)}小时 ${mm.toFixed(0)}分结束`;
    }
  }, []);

  const _renderExamItem = ({ data } : { data: StuExamProps}) : JSX.Element => {
    return (
      <Column style={ ExamStyle.Item }>
        <TouchableOpacity
          style={{ width: "100%"}}
          onPress={ () => toExam(data.exam.id, data.exam_status) }
          activeOpacity = { 0.8 }
        >
          <Row style={{ width: "100%", alignItems: "flex-start"}}>
            <Image style={{ width: rpx(90), height: rpx(90), marginRight: rpx(20) }} source={{ uri: "http://124.220.176.205:8080/image/b7db4ab7df571cb9659b6f9e2132e637.png" }} />
            <Column style={{ flex: 1, alignItems: "flex-start" }}>
              <Text>{ data.exam.name }</Text>
              <Text>{ data.exam.course.name }</Text>
              <Row style={{ justifyContent: "space-between" }}>
                <Text>{ getRelaTime(DateTransform(data.exam.time)) }</Text>
                <Text style={{ color: select(data.exam_status) }}>{ data.exam_status }</Text>
              </Row>
            </Column>
          </Row>
        </TouchableOpacity>
      </Column>
    )
  }

  return (
    <ContainerBox>
      <FlatList 
        style={ ExamStyle.Exam }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={ examLists }
        renderItem={ ({ item }) => <_renderExamItem data={ item } />}
      />
    </ContainerBox>
  )
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"ExamScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux
  };
};


export default connect(mapStateToProps)(ExamScreen);