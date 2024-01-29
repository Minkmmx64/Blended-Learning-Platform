import { ContainerBox } from "../../compoment/ContainerBox";
import { TabScreenProps } from "../../navigator";
import { RootStoreRedux } from "../../store";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { FlatList, Text } from "react-native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useCheckUserLoginOnTabPress } from "../../hooks/useCheckUserLogin";
import { useEffect, useState } from "react";
import Class, { CourseTables } from '../../request/api/class';
import { Column } from "../../compoment/flex-box/Column";
import { Image } from "react-native";
import { rpx } from "../../utils/common";
import { Row } from "../../compoment/flex-box/Row";
import { Color } from "../../utils/style";

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps
}

interface ReduxDispatch {

}

type CourseScreenProps = TabScreenProps<"CourseScreen"> & ReduxProps & BottomTabNavigationOptions;

function CourseScreen({ navigation, useAppUserRedux }: CourseScreenProps) {

  useCheckUserLoginOnTabPress(
    navigation,
    useAppUserRedux,
    [useAppUserRedux]
  );

  useEffect(() => {
    const classId = useAppUserRedux.student?.class?.id;
    if (classId) {
      Class.getStudentCourseTables(classId).then(tables => {
        setClassTables(tables.data);
      })
    }
  }, [useAppUserRedux]);

  const [classTables, setClassTables] = useState<CourseTables[]>([]);

  return (
    <>
      <ContainerBox>
        <FlatList
          data={classTables}
          renderItem={tables => {
            return (
              <Row style={{ justifyContent: "flex-start", padding: rpx(20), borderWidth: rpx(1),marginTop: rpx(10), width: rpx(750), borderColor: Color.Default }}>
                <Image source={{ uri: tables.item.course.avatar }} width={rpx(70)} height={rpx(70)}/>
                <Row style={{ flex: 1, justifyContent: "space-between", paddingLeft: rpx(50), paddingRight: rpx(50) }}>
                  <Text>{tables.item.course.name}</Text>
                  <Text>{tables.item.teacher.name}</Text>
                </Row>
              </Row>
            )
          }}
        />
      </ContainerBox>
    </>
  )
}

const mapStateToProps = (state: RootStoreRedux, ownProps: TabScreenProps<"CourseScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseScreen);