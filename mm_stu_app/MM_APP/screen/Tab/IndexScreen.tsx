import { ScrollView, StyleSheet, RefreshControl, Image, Text, TouchableOpacity } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { TabScreenProps } from "../../navigator";
import { rpx, sleep } from "../../utils/common";
import { useCallback, useMemo, useState } from "react";
import { SwiperManager, SwiperManagerItem } from "../../compoment/display/SwiperManager";
import { Color } from "../../utils/style";
import { Column } from "../../compoment/flex-box/Column";
import { Row } from "../../compoment/flex-box/Row";
import { course } from "../../utils/data";
import { FlowLayout } from "../../compoment/display/FlowLayout";

type courseType = typeof course extends (infer U)[] ? U :  typeof course;

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

type IndexScreenProps = TabScreenProps<"IndexScreen">;

function IndexScreen({ }: IndexScreenProps) {

  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // 加载数据的逻辑
    // ...
    await sleep(1000);
    setRefreshing(false);
  }, []);

  //轮播图
  const image = [
    "http://124.220.176.205:8080/image/a3f3c218644ae86dc71a9a94b5d2a495.jpeg",
    "http://124.220.176.205:8080/image/4aceff3b14aaab2e52eda2f11cb8b715.png",
    "http://124.220.176.205:8080/image/abc0d68f16bdb9c09c7e01811f632031.png",
    "http://124.220.176.205:8080/image/5ceda3efb737fe6580c6a96dd187c179.png",
    "http://124.220.176.205:8080/image/a3f3c218644ae86dc71a9a94b5d2a495.jpeg",
  ]

  //轮播图点击
  const onCourseItemPress = (course: courseType) => {
    console.log(course.id);
  }

  return (
    <ContainerBox style={{ flex: 1 }}>
      <ScrollView
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
                {image.map((uri, _) => <SwiperManagerItem key={_}><Image width={rpx(750)} height={rpx(250)} source={{ uri }} /></SwiperManagerItem>)}
              </SwiperManager>, [])
          }
          {/** 瀑布流 */}
          <FlowLayout
            data={course}
            onRender={ course => {
              return (
                <TouchableOpacity 
                  onPress={ () => onCourseItemPress(course) }
                  activeOpacity={1} style={{ width: "95%" }}>
                  <Column key={course.id} style={{ marginTop: 10 }}>
                    <Image style={{ width: "100%" }} source={{ uri: course.avatar }} height={150} />
                    <Text>{ course.name }</Text>
                    <Text>{ course.remark }</Text>
                    <Text>{ course.college.name }</Text>
                    </Column>
                </TouchableOpacity>
              )
            }}
          />
        </Column>
      </ScrollView>
    </ContainerBox>
  );
}
export default IndexScreen;