import { Button } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { TabScreenProps } from "../../navigator";

type IndexScreenProps = TabScreenProps<"IndexScreen">;

function IndexScreen({ }: IndexScreenProps) {

  return (
    <ContainerBox>
      <Button title="发送请求" />
    </ContainerBox>
  )
}



export default IndexScreen;