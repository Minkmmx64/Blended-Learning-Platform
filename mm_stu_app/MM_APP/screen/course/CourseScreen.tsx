import { StyleSheet, Text } from "react-native"
import { ContainerBox } from "../../compoment/ContainerBox"
import { Column } from "../../compoment/flex-box/Column"
import { StackScreenProps } from "../../navigator"
import { useEffect, useState } from "react"
import Index, { Chapters } from '../../request/api/index';
import { FlatList } from "react-native"
import { rpx } from "../../utils/common"

const CourseScreenStyle = StyleSheet.create({
  ChapterTitle: {
    width: rpx(700),
    height: rpx(60),
    backgroundColor: "rgba(0,0,0,1)"
  }
})

export const CourseScreen = (Props: StackScreenProps<"CourseScreen">) => {

  const [ chp , setChapters ] = useState<Chapters[]>([]);

  useEffect(() => {
    const { courseId } = Props.route.params;
    Index.getChaptersByCourseId(courseId).then( ({ data }) => {
      setChapters(data);
    })
  }, []);

  return (
    <ContainerBox style={{ flex: 1 }}>
      <FlatList
        style={{ width: "100%", height: 700 }}
        data={chp}
        renderItem={ chapter => {
          return (
            <Column>
              <Text style={CourseScreenStyle.ChapterTitle}>{chapter.item.name }</Text>
              <FlatList 
                data={chapter.item.children}
                renderItem={ ch => {
                  return (
                    <Column>
                      <Text>{ch.item.name}</Text>
                    </Column>
                  )
                }}
              />
            </Column>
          )
        }}
      />
    </ContainerBox>
  )
}