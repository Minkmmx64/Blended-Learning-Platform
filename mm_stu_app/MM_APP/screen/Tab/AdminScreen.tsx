import { Button, Text, TouchableOpacity } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { useIsFocused } from "@react-navigation/native";
import { TabScreenProps } from "../../navigator";

export function AdminScreen({ route, navigation } : TabScreenProps<"AdminScreen">) {
  const isFocuse = useIsFocused();
  
  const goLogin = () => {
    navigation.navigate("LoginScreen");
  }
  return (
    <>
      <ContainerBox isFocuse={isFocuse} StatusBarOptions={{
        backgroundColor: "transparent"
      }}>
        <Text>AdminScreen</Text>
        <Button title="Login -" onPress={ goLogin } />
      </ContainerBox>
    </>
  )
}