import { useEffect, useState } from "react";
import { StackScreenProps } from "../../navigator"
import { rpx } from "../../utils/common";
import Chapter, { ChapterResources } from '../../request/api/class'
import { FlatList, Image, Text } from "react-native";
import { Column } from "../../compoment/flex-box/Column";
import { ContainerBox } from "../../compoment/ContainerBox";
import { Row } from "../../compoment/flex-box/Row";
type ChapterDetailScreenProps = StackScreenProps<"ChapterDetailScreen">;

export const ChapterDetailScreen = ({ navigation, route }: ChapterDetailScreenProps) => {

  const [resource, setResource] = useState<ChapterResources[]>([]);

  const loadChapterResource = async (chapterId: number) => {
    try {
      const { data } = await Chapter.getChapterResource(chapterId);
      setResource(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.chapterName,
      headerTitleStyle: {
        fontSize: rpx(30)
      }
    });
    loadChapterResource(route.params.chapterId);
  }, []);


  return (
    <ContainerBox>
      <Column>
        <FlatList
          data={resource}
          style={{ width: rpx(750), paddingHorizontal: rpx(50)}}
          renderItem={resourceItem => {
            return (
              <>
                <Row style={{ justifyContent: "flex-start", height: rpx(60), alignContent: "center" }}>
                  <Text style={{ fontSize: rpx(40), color: "#000000"}}>资源</Text>
                  <Image source={require("../../static/course/resource_dot.png")} style={{ width: rpx(30), height: rpx(30)}} />
                </Row>
                <Column>
                  <Row gapV={10}>
                    <Text>文件类型: {resourceItem.item.type} </Text>
                    <Text>文件描述: {resourceItem.item.remark} </Text>
                  </Row>
                  <Image source={{ uri: resourceItem.item.cover }} style={{ width: rpx(500), height: rpx(200) }} />
                  <Column gapV={5}>
                    <Text>{resourceItem.item.name}</Text>
                  </Column>
                </Column>
              </>
            )
          }}
        />
      </Column>
    </ContainerBox>
  );
}
