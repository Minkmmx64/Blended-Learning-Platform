import { useCallback, useEffect, useRef, useState } from "react";
import { ContainerBox } from "../../compoment/ContainerBox"
import { StackScreenProps } from "../../navigator"
import exam, { StuSubjectProps, SubjectType } from '../../request/api/exam';
import { Toast } from "../../compoment/display/toast/Toast";
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { Column } from "../../compoment/flex-box/Column";
import { Button, StyleSheet, Text } from "react-native";
import { Row } from "../../compoment/flex-box/Row";
import { rpx } from "../../utils/common";
import { Color } from "../../utils/style";
import { SelectOptions } from "./SelectOptions";

const Style = StyleSheet.create({

  ExamBottom: {
    position: "absolute",
    bottom: rpx(40),
    justifyContent: "space-around"
  }
});

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps;
}

type IAccessExamScreenProps = StackScreenProps<"AccessExamScreen"> & ReduxProps;

const AccessExamScreen = ({ route, navigation, useAppUserRedux } : IAccessExamScreenProps) : JSX.Element => {

  useEffect(() => {
    const { examId } = route.params;
    
    idProps.current.examId = examId;
    if(useAppUserRedux.student){
      idProps.current.studentId = useAppUserRedux.student.id;
    }

    // 加载考试信息
    loadExam(examId);

    const beforeRemove = navigation.addListener("beforeRemove", (event) => {
      // 考试中途退出弹出提示
      //event.preventDefault();
    });

    return beforeRemove;
  }, []);

  //当前考试id, 试卷id, 学生id
  const idProps = useRef<{ examId: number, paperId: number, studentId: number }>({
    examId: -1,
    paperId: -1,
    studentId: -1
  });

  interface IToAccessAnswerProps {
    subject: StuSubjectProps;
  }

  const ToAccessAnswer = ({ subject } : IToAccessAnswerProps) : JSX.Element => {

    if(!subject) {
      return (
        <Text>加载题目</Text>
      )
    }

    const ChooseNextSubject = useCallback((val: 1 | -1) => {
      const nextVal = currentCount + val;
      if(nextVal < 0 || nextVal >= subjects.length) return;
      setCurrentCount(nextVal);
    }, []);

    interface I_renderSubjectOptions {
      type: SubjectType
      options: string;
    }

    const _renderSubjectOptions = ({ options, type } : I_renderSubjectOptions ) : JSX.Element => {
      if(type === SubjectType.Signal || SubjectType.Multiple === type) {
        const lists = JSON.parse(options) as string[];
        return <SelectOptions listtype="letter" multiple options={lists} />
      }
      else if(type === SubjectType.Judge) {
        return <SelectOptions options={["对", "错"]} />
      } else {
        return (
          <Column>

          </Column>
        )
      }

      return <></>;
    }

    return (
      <Column style={{ flex: 1, justifyContent: "flex-start", position: "relative"}}>
        <Row style={{ justifyContent: "space-around", marginTop: rpx(20) }}>
          <Text style={{ fontSize: rpx(40), color: Color.Primary }}>{ subject.type }: </Text>
          <Text style={{ fontSize: rpx(40), color: Color.Primary }}>{ subject.points } 分</Text>
        </Row>
        <Text style={{ marginTop: rpx(20), fontSize: rpx(32), alignSelf: "flex-start" }}>    {currentCount + 1}、{ subject.describe }</Text>
        {/** 渲染题目类型 */}
        <_renderSubjectOptions type={ subject.type } options={ subject.options }/>

        <Row style={Style.ExamBottom}>
          <Button onPress={() => ChooseNextSubject(-1)} title="上一题"/>
          <Button onPress={() => ChooseNextSubject(1)} title="下一题"/>
        </Row>
      </Column>
    )
  }

  //题目列表
  const [ subjects, setSubjects ] = useState<StuSubjectProps[]>([]);
  //当前做到的题目
  const [ currentCount, setCurrentCount ] = useState(0);

  const loadExam = async (examId: number) => {
    try {
      const { data } = await exam.getExamById(examId)
      navigation.setOptions({ headerTitle: data.paper.name, headerRight: () =>  <Button title="交卷"/> });
      const { id } = data.paper;
      idProps.current.paperId = id;
      const paper = await exam.getPaperSubjectsByPaperId(id);
      setSubjects(paper.data);
    } catch (error) {
      Toast.show("加载错误", JSON.stringify(error));
    }
  }

  return (
    <ContainerBox>
      <ToAccessAnswer subject={subjects[currentCount]} />
    </ContainerBox>
  )
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"ExamScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux
  };
};

export default connect(mapStateToProps)(AccessExamScreen);