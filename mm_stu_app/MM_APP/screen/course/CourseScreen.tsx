import { StyleSheet, Text, Image, TouchableOpacity, ListRenderItemInfo, Animated } from "react-native"
import { ContainerBox } from "../../compoment/ContainerBox"
import { Column } from "../../compoment/flex-box/Column"
import { StackScreenProps } from "../../navigator"
import { useEffect, useRef, useState } from "react"
import Index, { Chapters } from '../../request/api/index';
import { FlatList } from "react-native"
import { rpx } from "../../utils/common"
import { Color } from "../../utils/style"
import { Row } from "../../compoment/flex-box/Row"

const CourseScreenStyle = StyleSheet.create({
  ChapterTitle: {
    width: rpx(700),
    height: rpx(60),
    borderWidth: rpx(1),
    borderRadius: rpx(10),
    borderColor: Color.Default,
    marginTop: rpx(20),
    paddingLeft: rpx(20),
    paddingRight: rpx(20)
  },
  ChildChapter: {
    width: rpx(700),
    alignItems: "flex-start",
    paddingLeft: rpx(30),
    height: rpx(60),
  }
})

export const CourseScreen = (Props: StackScreenProps<"CourseScreen">) => {

  const [chp, setChapters] = useState<Chapters[]>([]);

  useEffect(() => {
    const { courseId } = Props.route.params;
    Index.getChaptersByCourseId(courseId).then(({ data }) => {
      setChapters(data);
    }).catch( error => console.error(error));
  }, []);

  const _renderChapterLists = ({ chapter }: { chapter: ListRenderItemInfo<Chapters> }) => {
    const [visible, setVisible] = useState(false);
    const _Toggle = () => setVisible(!visible);
    const _img1 = "../../static/course/collapse.png";
    const _img2 = "../../static/course/collapse_close.png";
    return (
      <Column>
        <TouchableOpacity
          activeOpacity={1}
          onPress={_Toggle}>
          <Row style={{ ...CourseScreenStyle.ChapterTitle, justifyContent: "flex-start", alignContent: "center" }}>
            {
              visible ?
                <Image source={require(_img2)} style={{ width: rpx(30), height: rpx(30), marginRight: rpx(30) }} />
                :
                <Image source={require(_img1)} style={{ width: rpx(30), height: rpx(30), marginRight: rpx(30) }} />
            }
            <Text>{chapter.item.name}</Text>
          </Row>
        </TouchableOpacity>
        <FlatList
          data={chapter.item.children}
          renderItem={child => {
            return (
              <>
                {visible && <__renderChildChapters child={child} />}
              </>
            );
          }}
        />
      </Column>
    )
  }

  const __renderChildChapters = ({ child }: { child: ListRenderItemInfo<Chapters> }) => {
    const __showChapter = (ChapterInfo: ListRenderItemInfo<Chapters>) => {
      Props.navigation.push("ChapterDetailScreen", {
        chapterId: ChapterInfo.item.id,
        chapterName: ChapterInfo.item.name
      });
    }
    return (
      <TouchableOpacity
        onPress={ () => __showChapter(child) }
      >
        <Column style={CourseScreenStyle.ChildChapter}>
          <Text>{child.item.name}</Text>
        </Column>
      </TouchableOpacity>
    )
  }

  return (
    <ContainerBox style={{ flex: 1, paddingBottom: rpx(50) }}>
      <FlatList
        style={{ width: "100%", height: 700 }}
        data={chp}
        renderItem={chapter => <_renderChapterLists chapter={chapter} />}
      />
    </ContainerBox>
  )
}