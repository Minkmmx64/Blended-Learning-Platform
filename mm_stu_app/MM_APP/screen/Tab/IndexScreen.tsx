import { ScrollView, StyleSheet, RefreshControl, Image, Text, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { TabScreenProps } from "../../navigator";
import { DateTransform, debounce, rpx, sleep } from "../../utils/common";
import { useEffect, useMemo, useRef, useState } from "react";
import { SwiperManager, SwiperManagerItem } from "../../compoment/display/SwiperManager";
import { Color } from "../../utils/style";
import { Column } from "../../compoment/flex-box/Column";
import { Row } from "../../compoment/flex-box/Row";
import { UtilToolDatas, CourseDatas } from "../../utils/data";
import { FlowLayoutProvider, FlowLayoutProviderRef } from "../../compoment/display/FlowLayout";
import Index from "../../request/api/index";
import { BaseScreenProps } from "../../compoment/compoment";
import { IUtilTools } from "./tab.type";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootStoreRedux } from "../../store";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { UtilTools } from "../compoment/UtilTools";

interface ReduxDispatch {

}

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps
}

type IndexScreenProps = TabScreenProps<"IndexScreen"> & ReduxProps & ReduxDispatch;

type CourseType = typeof CourseDatas extends (infer U)[] ? U : typeof CourseDatas;

const IndexScreenStyle = StyleSheet.create({
  Main: {
    width: rpx(750),
    paddingLeft: rpx(10),
    paddingRight: rpx(10)
  },
  Search: {
    width: rpx(700),
    height: rpx(80),
    borderWidth: rpx(1),
    borderRadius: rpx(10),
    borderColor: Color.Default,
    marginTop: rpx(20),
    marginBottom: rpx(20),
    alignContent: "center",
    paddingLeft: rpx(20),
    paddingRight: rpx(20)
  },
  SearchIcon: {
    width: rpx(50),
    height: rpx(50)
  }
});

function IndexScreen({ navigation, useAppUserRedux }: IndexScreenProps) {

  //初始化
  useEffect(() => {
    append();
    
    return () => {

    }
  }, []);

  //瀑布流当前页数
  const currentOffset = useRef(1);
  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false);
  // 是否加载
  const [reload, setReload] = useState(false);
  // 加载文字
  const [reloadText, setReloadText] = useState("------ 下滑刷新 ------");
  //瀑布流列
  const [columns, setColumns] = useState(2);
  //瀑布流数据加载
  const flowDatasLoad = useRef(false);
  //瀑布流布局
  const FlowLayout = FlowLayoutProvider<CourseType>();
  //获取瀑布流布局对象
  const FlowLayoutRef = useRef<FlowLayoutProviderRef<CourseType>>(null);
  //下拉刷新
  const onRefresh = (async () => {
    setRefreshing(true);
    // 加载数据的逻辑
    setReload(!reload);
    currentOffset.current = 1;
    append();
    // ...
    await sleep(1000);
    setRefreshing(false);
  });

  // 加载课程
  const loadCourse = async (): Promise<CourseType[]> => {
    const { data } = await Index.loadCourse(currentOffset.current, 6);
    currentOffset.current += 1;
    return data;
  }
  // 添加课程
  const append = () => {
    loadCourse().then(cc => {
      if (cc.length) {
        setReloadText("------ 下滑刷新 ------");
      }
      FlowLayoutRef.current!.appendFlowDatas(cc);
    });
  }

  //轮播图
  const image = [
    "http://124.220.176.205:8080/image/a3f3c218644ae86dc71a9a94b5d2a495.jpeg",
    "http://124.220.176.205:8080/image/4aceff3b14aaab2e52eda2f11cb8b715.png",
    "http://124.220.176.205:8080/image/abc0d68f16bdb9c09c7e01811f632031.png",
    "http://124.220.176.205:8080/image/5ceda3efb737fe6580c6a96dd187c179.png",
    "http://124.220.176.205:8080/image/a3f3c218644ae86dc71a9a94b5d2a495.jpeg",
  ]

  //瀑布流元素点击
  const onCourseItemPress = (course: CourseType) => {
    // 点击去课程章节页面
    navigation.push("CourseScreen", { courseId: course.id });
  }

  //下滑加载
  const onScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent;
    const scrollH = contentOffset.y;
    const H = contentSize.height - layoutMeasurement.height;
    if (Math.abs(scrollH - H) <= 50) {
      // 加载瀑布流元素
      if (flowDatasLoad.current) return;
      flowDatasLoad.current = true;
      const setFlowDatas = debounce(FlowLayoutRef.current!.appendFlowDatas, 200);
      const courses = await loadCourse();
      if (courses.length < 1)
        setReloadText("------ 没有更多了 ------");
      setFlowDatas([...courses]);
    } else {
      flowDatasLoad.current = false;
    }
  }

  {/** 瀑布流 */ }
  const renderFlowData = useMemo(() =>
    <FlowLayout
      ref={FlowLayoutRef}
      columns={columns}
      onRender={course => {
        return (
          <TouchableOpacity
            key={course.id}
            onPress={() => onCourseItemPress(course)}
            activeOpacity={0.8}
            style={{ width: "92%" }}>
            <Column style={{ marginTop: 10 }}>
              <Image style={{ width: "100%", borderRadius: rpx(10) }} source={{ uri: course.avatar }} height={150} />
              <Text style={{ marginTop: rpx(10) }}><Text style={{ color: Color.Primary }}>课程名称: </Text>{course.name}</Text>
              <Text style={{ marginTop: rpx(10) }}><Text style={{ color: Color.Danger }}>所属学院: </Text>{course.college.name}</Text>
              <Text numberOfLines={8} style={{ marginTop: rpx(10) }}>    {course.remark}</Text>
              <Text style={{ marginTop: rpx(10), alignSelf: "flex-end", color: Color.Default }}>{DateTransform(course.update_time)}</Text>
            </Column>
          </TouchableOpacity>
        )
      }}
    />, [reload]
  );

  
  return (
    <ContainerBox style={{ flex: 1 }}>
      <ScrollView
        scrollEventThrottle={10}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={IndexScreenStyle.Main}>
        <Column>
          {/** 搜索框 */}
          <Row style={IndexScreenStyle.Search}>
            <Image style={IndexScreenStyle.SearchIcon} source={require("../../static/index/search.png")} />
            <TouchableOpacity
              style={{ marginLeft: rpx(20) }}>
              <Text>搜索</Text>
            </TouchableOpacity>
          </Row>
          {/** 轮播图 */}
          {
            useMemo(() =>
              <SwiperManager transition={500} duration={3000} width={rpx(750)} height={rpx(250)}>
                {
                  image.map((uri, _) =>
                    <SwiperManagerItem key={_}>
                      <Image width={rpx(750)} height={rpx(250)} source={{ uri }} />
                    </SwiperManagerItem>
                  )
                }
              </SwiperManager>, [])
          }
          {/** 常用功能 */}
          <UtilTools 
            renderTop={
              <Row style={{ justifyContent: "flex-start", marginTop: rpx(20) }}>
                <Text style={{ fontSize: rpx(40), color: "#000000" }}>常用</Text>
              </Row>
            }
            ItemOnPress={
              value => {
                if(useAppUserRedux.id === -1) {
                  return navigation.push("LoginScreen");
                }
                return value.nav.type === "tab" ? 
                        navigation.jumpTo(value.nav.url) :
                        navigation.push(value.nav.url);
            }}
            data={UtilToolDatas} />
          {/** 瀑布流 */}
          {renderFlowData}
        </Column>
        <Column style={{ marginTop: rpx(40) }}>
          <Text>{reloadText}</Text>
        </Column>
      </ScrollView>
    </ContainerBox>
  );
}
const mapStateToProps = (state : RootStoreRedux, ownProps : TabScreenProps<"CourseScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexScreen);