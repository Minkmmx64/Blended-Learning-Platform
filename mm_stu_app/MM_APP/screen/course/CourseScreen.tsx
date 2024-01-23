import { Text } from "react-native"
import { ContainerBox } from "../../compoment/ContainerBox"
import { Column } from "../../compoment/flex-box/Column"
import { StackScreenProps } from "../../navigator"
import { useEffect, useState } from "react"
import Index, { Chapters } from '../../request/api/index';
import { FlatList } from "react-native"
import { Color } from "../../utils/style"

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
              <Text>{chapter.item.name }</Text>
            </Column>
          )
        }}
      />
    </ContainerBox>
  )
}