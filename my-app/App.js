import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ToolbarAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

const FirstRoute = () => <View style={[styles.container, { backgroundColor: '#ffffff' }]} />
const SecondRoute = () => <View style={[styles.container, { backgroundColor: '#ffffff' }]} />
const NachrichtenRoute = () => <View style={[styles.container, { backgroundColor: '#ffffff' }]} />

export default class TabViewExample extends PureComponent {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Dashboard', icon: 'md-restaurant' },
      { key: '2', title: 'Article', icon: 'md-bicycle' },
      { key: '3', title: 'Nachrichten', icon: 'md-bicycle' },
    ],
  }

  _handleIndexChange = index => this.setState({ index })

  _renderIcon = ({ route }) => {
      return <Ionicons name={route.icon} size={24} color="black" />;
    }

  _renderHeader = props => <TabBar {...props} renderIcon={this._renderIcon} style={{ backgroundColor: '#ffffff' }} labelStyle={{ color: '#ff00ff' }} />

  _renderScene = SceneMap({
    '1': FirstRoute,
    '2': SecondRoute,
    '3': NachrichtenRoute,
  })

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 24 }} />
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})