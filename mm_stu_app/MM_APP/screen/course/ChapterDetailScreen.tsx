import { useEffect } from "react";
import { StackScreenProps } from "../../navigator"
import { rpx } from "../../utils/common";

type ChapterDetailScreenProps = StackScreenProps<"ChapterDetailScreen"> ;

export const ChapterDetailScreen = ({ navigation, route } : ChapterDetailScreenProps) => {

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.chapterName,
      headerTitleStyle: {
        fontSize: rpx(30)
      }
    });
    const chapterId = route.params.chapterId;
    //console.log(chapterId);
  }, []);
}