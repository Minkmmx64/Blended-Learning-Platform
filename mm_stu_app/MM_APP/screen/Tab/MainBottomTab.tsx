import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../navigator';
import IndexScreen from './IndexScreen';
import { AdminScreen } from './AdminScreen';
import { MessageScreen } from './MessageScreen';
import CourseScreen from './CourseScreen';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function MainBottomTab() : JSX.Element {
  
  const SwitchTabImage = (focused : boolean, def: ImageSourcePropType, activity: ImageSourcePropType) : JSX.Element => {
    const ImageStyle = StyleSheet.create({
      Image: {
        width: 25,
        height: 25
      }
    });
    return (
      focused ? <Image style={ImageStyle.Image} source={activity} /> : <Image style={ImageStyle.Image} source={def} /> 
    )
  }

  return (
    <Tab.Navigator id="MainBottomTab">
      <Tab.Screen name="IndexScreen" component={IndexScreen} options={{
        tabBarIcon: ({ focused, color, size }) => 
          SwitchTabImage(focused, require("../../static/tab/index_default.png"), require("../../static/tab/index_activity.png"))
        ,
        headerTitleAlign: "center",
        tabBarLabel: "首页"
      }} />
      <Tab.Screen name="CourseScreen" component={ CourseScreen } options={{
        tabBarIcon: ({ focused, color, size }) => 
          SwitchTabImage(focused, require("../../static/tab/course_default.png"), require("../../static/tab/course_activity.png"))
        ,
        headerTitleAlign: "center",
        tabBarLabel: "课程"
      }}/>
      <Tab.Screen name="MessageScreen" component={ MessageScreen } options={{
        tabBarIcon: ({ focused, color, size }) => 
          SwitchTabImage(focused, require("../../static/tab/message_default.png"), require("../../static/tab/message_activity.png"))
        ,
        headerTitleAlign: "center",
        tabBarLabel: "消息"
      }}/>
      <Tab.Screen name="AdminScreen" component={ AdminScreen } options={{
        tabBarIcon: ({ focused, color, size }) => 
          SwitchTabImage(focused, require("../../static/tab/admin_default.png"), require("../../static/tab/admin_activity.png"))
        ,
        headerTitleAlign: "center",
        tabBarLabel: "我的",
        headerShown: false
      }}/>
    </Tab.Navigator>
  );
}
