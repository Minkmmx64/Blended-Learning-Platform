import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContainerBox } from "../../compoment/ContainerBox"
import { StackScreenProps } from "../../navigator"
import exam, { StuSubjectProps, SubjectType } from '../../request/api/exam';
import { Toast } from "../../compoment/display/toast/Toast";
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { Column } from "../../compoment/flex-box/Column";
import { Animated, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Row } from "../../compoment/flex-box/Row";
import { debounce, rpx } from "../../utils/common";
import { Color } from "../../utils/style";
import { SelectOptions } from "./SelectOptions";
import { FloatBall } from "../../compoment/display/FloatBall";

const Style = StyleSheet.create({
  ExamBottom: {
    position: "absolute",
    bottom: rpx(40),
    justifyContent: "space-around"
  },
  ExamInput: {
    width: "90%",
    height: rpx(300),
    backgroundColor: "rgba(200, 214, 229,0.2)",
    marginTop: rpx(30),
    borderWidth: rpx(0.5),
    borderColor: "rgba(200, 214, 229,1.0)"
  },
  Modal: {
    backgroundColor: "#ffffff",
    width: rpx(500), 
    paddingTop: rpx(40), 
    paddingBottom: rpx(40), 
    height: rpx(300), 
    justifyContent: "space-between",
    shadowColor: "rgba(61, 193, 211,1.0)",
    borderRadius: rpx(5),
    shadowOpacity: 1,
    elevation: 10
  }
});

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps;
}

//答题组件
interface IToAccessAnswerProps {
  subject: StuSubjectProps;
}

//题目答案集合
interface ExamResult {
  //题目答案
  value: number[] | string | undefined;
  //题目id
  subjectId: number;
}

//渲染选项列表
interface I_renderSubjectOptions {
  //题目类型
  type: SubjectType
  //题目选项
  options: string;
}

type IAccessExamScreenProps = StackScreenProps<"AccessExamScreen"> & ReduxProps;

const AccessExamScreen = ({ route, navigation, useAppUserRedux }: IAccessExamScreenProps): JSX.Element => {

  useEffect(() => {
    const { examId } = route.params;
    idProps.current.examId = examId;
    if (useAppUserRedux.student) {
      idProps.current.studentId = useAppUserRedux.student.id;
    }
    // 加载考试信息
    loadExam(examId);
  }, []);

  //当前考试id, 试卷id, 学生id
  const idProps = useRef<{ examId: number, paperId: number, studentId: number }>({ examId: -1, paperId: -1, studentId: -1 });

  const [ examResult, setExamResult ] = useState<ExamResult[]>([]);

  const changeInput = (val: number[] | string) => {
    const nextState = [...examResult];
    nextState[currentCount] = { value: val, subjectId: subjects[currentCount].id }
    setExamResult(nextState);
  }

  const ToAccessAnswer = ({ subject }: IToAccessAnswerProps): JSX.Element => {
    if (!subject)
      return <Text>加载题目</Text>

    const ChooseNextSubject = useCallback((val: 1 | -1) => {
      const nextVal = currentCount + val;
      if (nextVal < 0 || nextVal >= subjects.length) return;
      setCurrentCount(nextVal);
    }, []);

    
    const __renderSubjectOptions = ({ options, type }: I_renderSubjectOptions): JSX.Element => {
      if (type === SubjectType.Signal || SubjectType.Multiple === type) {
        const lists = JSON.parse(options) as string[];

        return <SelectOptions
                  result={(examResult[currentCount]?.value ?? []) as number[]}
                  onChangeSelects={ changeInput }
                  listtype="letter"
                  multiple={SubjectType.Multiple === type}
                  options={lists} />
      }
      else if (type === SubjectType.Judge) 

        return <SelectOptions 
                  result={(examResult[currentCount]?.value ?? []) as number[]} 
                  onChangeSelects={ changeInput } 
                  options={["对", "错"]} />
      else {
        const changeText = debounce((text: string) => { changeInput(text) }, 500);
        //changeText("");
        return (
          <Column>
            <TextInput
              defaultValue={(examResult[currentCount]?.value ?? "") as string}
              onChangeText={changeText}
              style={Style.ExamInput} 
              multiline 
              textAlignVertical="top" />
          </Column>
        )
      }
    }

    return (
      <Column style={{ flex: 1, justifyContent: "flex-start", position: "relative" }}>
        <Row style={{ justifyContent: "space-around", marginTop: rpx(20) }}>
          <Text style={{ fontSize: rpx(40), color: Color.Primary }}>{subject.type}: </Text>
          <Text style={{ fontSize: rpx(40), color: Color.Primary }}>{subject.points} 分</Text>
        </Row>
        <Text style={{ marginTop: rpx(20), fontSize: rpx(32), alignSelf: "flex-start" }}>    {currentCount + 1}、{subject.describe}</Text>
        {/** 渲染题目类型 */}
        <__renderSubjectOptions type={subject.type} options={subject.options} />
        <Row style={Style.ExamBottom}>
          <Button onPress={() => ChooseNextSubject(-1)} title="上一题" />
          {
            currentCount >= subjects.length-1 ? 
                <Button title="交卷" onPress={ submitSubject }/> : 
                <Button onPress={() => ChooseNextSubject(1)} title="下一题" />
          }
        </Row>
      </Column>
    )
  }

  const __judeg_res_value_valid = (val?: string | number[]) => {
    if(!val) return false;
    return typeof val === 'string' && val || (val?.length ?? 0) > 0;
  }

  //提交试卷
  const submitSubject = () => {
    const check = examResult.length && examResult.every(v => __judeg_res_value_valid(v?.value));
    if(!check) {
      // 还有未完成的题目 
      setModalVisible(true);
      return;
    } else uploadSubject();
  }

  const uploadSubject = async () => {
    const res = examResult.filter(e => __judeg_res_value_valid(e?.value)).map( v => {
      let ret = v.value;
      if(v?.value && v.value instanceof Array) {
        ret = v.value.map( num => String.fromCharCode("A".charCodeAt(0) + num)).toString().split(",").join("");
      }
      return { id: v?.subjectId, value: ret }
    });

    try {
      // 上传学生答题情况
      const data = await exam.submitSubjectsResult(idProps.current, res);
      console.log(data);
      //提交成功返回
    } catch (error) {
     console.error(error);
    }
  }

  //题目列表
  const [subjects, setSubjects] = useState<StuSubjectProps[]>([]);

  //当前做到的题目
  const [currentCount, setCurrentCount] = useState(0);

  const loadExam = async (examId: number) => {
    try {
      const { data } = await exam.getExamById(examId)
      navigation.setOptions({ headerTitle: data.paper.name, headerRight: () => {
        return <Row style={{ width: "auto", gap: rpx(10)}}>
                <Button color="rgba(5, 196, 107,1.0)" title="查看" onPress={ _in } />
              </Row>
      } });
      const { id } = data.paper;
      idProps.current.paperId = id;
      const paper = await exam.getPaperSubjectsByPaperId(id);
      setSubjects(paper.data);
    } catch (error) {
      Toast.show("加载错误", JSON.stringify(error));
    }
  }

  const onFloatBallPress = () => { _in(); }

  const X = useRef(new Animated.Value(rpx(750))).current;

  const [ isShowAnswerResultDetail, setIsShowAnswerResultDetail ] = useState(false);

  useEffect(() => {
    const beforeRemove = navigation.addListener("beforeRemove", (event) => {
      // 考试中途退出弹出提示
      //event.preventDefault();
      if(isShowAnswerResultDetail) {
        _out();
        event.preventDefault();
      }
    });
    return beforeRemove;
  }, [ isShowAnswerResultDetail ]);

  const _in = () => {
    setIsShowAnswerResultDetail(true);
    Animated.timing(X, {
      useNativeDriver: true,
      duration: 300,
      toValue: 0
    }).start();
  }

  const _out = () => {
    setIsShowAnswerResultDetail(false);
    Animated.timing(X, {
      useNativeDriver: true,
      duration: 300,
      toValue: rpx(750)
    }).start();
  }

  const _renderAnswerResultDetail = () : JSX.Element => {

    const AnswerResultDetail = useRef(StyleSheet.create({
      content: {
        position: "absolute",
        left: 0,
        top: 0,
        width: rpx(750),
        height: "100%",
        backgroundColor: "rgba(247, 241, 227,1)",
        paddingLeft: rpx(40),
        paddingRight: rpx(40)
      },
      type: {
        fontSize: rpx(40),
        marginBottom: rpx(20),
        marginTop: rpx(10)
      },
      btn: {
        width: rpx(90),
        height:rpx(90),
        backgroundColor: Color.Primary,
        borderRadius: rpx(10),
      }
    })).current;

    const getSubjectGroups = () => {

      const group : Record<string, number[]> = {};

      subjects.forEach((sub, index) => {
        if(group[sub.type]) group[sub.type].push(index + 1);
        else group[sub.type] = [index + 1];
      });

      return group;
    }

    const groups = useRef(getSubjectGroups()).current;

    const _selectCurrentCount = useCallback(( val: number) => {
      setCurrentCount(val);
      setTimeout( _out, 0);
    }, []);

    return (
      <Animated.View style={ { ...AnswerResultDetail.content, transform: [{ translateX: X }] } }>
        <Column style={{ alignItems: "flex-start" }}>
          {/* 显示试卷题目编号以及题目类型 */}
          <FlatList 
            style={{ width: "100%" }}
            data={Object.keys(groups)}
            renderItem={
              value => {
                return (
                  <Column style={{ alignItems: "flex-start" }}>
                    <Text style={ AnswerResultDetail.type }>{ value.item }</Text>
                    <Row style={{ gap: rpx(30), justifyContent: "flex-start" }}>
                      { groups[value.item].map( number => {
                        return (
                          <TouchableOpacity 
                            onPress={ () => _selectCurrentCount(number - 1) }
                            style={[
                              { ...AnswerResultDetail.btn }, 
                                __judeg_res_value_valid(examResult[number - 1]?.value) ? { backgroundColor: Color.Success } : {}
                            ]} key={ number }>
                            <Column style={{ height: "100%"}}>
                              <Text style={{ color: "#ffffff" }}>{ number }</Text>
                            </Column>
                          </TouchableOpacity>
                        ) })}
                    </Row>
                  </Column>
                )
              }
            }
          />
        </Column>
      </Animated.View>
    )
  }

  const [ modalVisible , setModalVisible ] = useState(false);

  return (
    <ContainerBox>
      {/* 
          由于 setExamResult 会触发组件重新渲染, 子组件里面设置了 useEffect 
          监听 选项的 currentSelectOption 属性变化 返回一个选择该列表的回调 
          该回调 会调用 setExamResult 所以造成死循环， 解决方法：由于 ToAccessAnswer 组件只是获取题目信息的组件，具体操作放在 该组件内部
          顶级组件的 setExamResult 会重新渲染 ToAccessAnswer, 当当前题目和切换题目没有变化时不需要重新渲染该组件
      */}
      { useMemo(() => <ToAccessAnswer subject={subjects[currentCount]} />, [ subjects, currentCount ])}
      
      {/* 右侧查看试卷完成情况 */}
      { useMemo(() => <_renderAnswerResultDetail />, [ subjects, examResult ])}

      {/* 渲染悬浮球 */}
      <FloatBall onFloatBallPress={ onFloatBallPress }/>

      {/* 弹框 */}
      <Modal
        animationType="fade"
        transparent={ true }
        visible={ modalVisible }
        onRequestClose={() => {
          console.log("close");
        }}
      >
        <Column style={{ flex: 1, backgroundColor: "rgba(61, 61, 61,0.4)" }}>
          <Column style={ Style.Modal }>
            <Text>您还有没提交的答案，是否继续交卷</Text>
            <Row style={{ justifyContent: "space-around" }}>
              <Button color={ Color.Danger } title="关闭" onPress={ () => setModalVisible(false) }/>
              <Button color={ Color.Primary } title="继续交卷" onPress={ () => { setModalVisible(false), uploadSubject() } }/>
            </Row>
          </Column>
        </Column>
      </Modal>
    </ContainerBox>
  )
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"ExamScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux
  };
};

export default connect(mapStateToProps)(AccessExamScreen);