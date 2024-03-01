import { ContainerBox } from "../../compoment/ContainerBox"
import { Gestures } from "../../compoment/display/Gestures"

export const GesturesScreen = () : JSX.Element => {

  return (
    <ContainerBox>
      <Gestures 
        title="手势签到" 
        onResult={  (res) => {
          console.log(res);
          return true;
        }} 
      />
    </ContainerBox>
  )
}