import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ToolbarAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TabViewAnimated, TabViewPagerAndroid, TabBar, SceneMap } from 'react-native-tab-view'

const FirstRoute = () => <View style={[styles.container, { backgroundColor: '#ffffff' }]} />
const SecondRoute = () => <View style={[styles.container, { backgroundColor: '#ffffff' }]} />
const NachrichtenRoute = () => <View style={[styles.container, { backgroundColor: '#ffffff' }]} />

export default class TabViewExample extends PureComponent {
  state = {
    index: 0,
    routes: [
      { key: '1', icon: 'md-restaurant' },
      { key: '2', icon: 'md-bicycle' },
      { key: '3', icon: 'md-bicycle' },
    ],
  }

  _handleIndexChange = index => this.setState({ index })

  _renderIcon = ({ route }) => {
      return <Ionicons name={route.icon} size={24} color="blue" />;
    }

  _renderHeader = props => <TabBar {...props} renderIcon={this._renderIcon} style={{ backgroundColor: '#ffffff' }} labelStyle={{ color: '#ff00ff' }} />

  _renderScene = SceneMap({
    '1': FirstRoute,
    '2': SecondRoute,
    '3': NachrichtenRoute,
  })

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1,  height: 26 }} />
        <View style={{flex: 3, backgroundColor: 'powderblue'}}>
          <Text style={{flex: 2,  height: 26 }}>Hello world!</Text>
        </View>
        <View style={{flex: 4, backgroundColor: 'skyblue'}} />
        <View style={{flex: 5, backgroundColor: 'steelblue'}} />
        {/*
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
        />
        */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})