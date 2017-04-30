/**
 * Created by chengkai on 2017/4/23.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import NavigatorBar from '../component/NavigationBar';

import CustomKey from './CustomKey';
import SortPage from './SortPage';

export default class MyView extends Component {

    render() {
        return (
            <View style={styles.container}>
                <NavigatorBar title='我的'></NavigatorBar>
                <View style={styles.itemStyles}>
                    <Text
                        style={styles.textItem}
                        onPress={() => this.jumpToCustomPage()}>自定义语言界面</Text>
                </View>
                <View style={styles.itemStyles}>
                    <Text
                        style={styles.textItem}
                        onPress={() => this.jumpToSortPage()}>语言分类排序</Text>
                </View>
            </View>
        )
    }

    jumpToCustomPage() {
        this.props.navigator.push({
            component: CustomKey
        })
    }

    jumpToSortPage() {
        this.props.navigator.push({
            component: SortPage
        })
    }
}

const Platform = require('Platform');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.OS === 'ios' ? 'rgba(235,235,235,0)': 'white',
    },
    itemStyles: {
        height: 40,
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottomWidth: 0.7,
        borderBottomColor: '#eee'
    },
    textItem: {
        flex: 1,
        color: '#535353',
        textAlign: 'center',
        marginTop: 12
    }
});