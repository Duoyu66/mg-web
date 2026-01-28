---
id: react-native
title: React Native
slug: /frontend/react-native
---

# React Native 移动开发

## 概览

使用 React 语法开发原生移动应用，一套代码多端运行。

## 核心知识

- **基础**：组件、样式、导航、原生模块
- **进阶**：性能优化、原生集成、发布部署
- **生态**：Expo、React Navigation、状态管理

## 基础组件

### 核心组件

```javascript
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'

function App() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>标题</Text>
        <Image source={require('./image.png')} />
        <TouchableOpacity onPress={() => alert('点击')}>
          <Text>按钮</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
```

### 样式系统

```javascript
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})
```

## 导航

### React Navigation

```javascript
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## 原生模块

### 调用原生功能

```javascript
import { NativeModules, Platform } from 'react-native'

const { CalendarModule } = NativeModules

// 调用原生方法
CalendarModule.createCalendarEvent('会议', '会议室A')
```

### 原生组件

```javascript
// 自定义原生组件
import { requireNativeComponent } from 'react-native'

const CustomView = requireNativeComponent('CustomView')

<CustomView style={{ flex: 1 }} />
```

## 性能优化

### 列表优化

```javascript
import { FlatList } from 'react-native'

<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
/>
```

### 图片优化

```javascript
import FastImage from 'react-native-fast-image'

<FastImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.contain}
/>
```

## 学习清单

- 能使用 React Native 开发移动应用
- 能处理导航和状态管理
- 能调用原生模块
- 能发布到 App Store 和 Google Play

## 推荐资源

- React Native 官方文档 — https://reactnative.dev/
- Expo — https://expo.dev/
- React Navigation — https://reactnavigation.org/
