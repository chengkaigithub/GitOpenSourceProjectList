/**
 * Created by chengkai on 2017/4/20.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;

export default class NavigationBar extends Component {

    /** 元素类型校验,不匹配会警告 */
    static propTypes() {
        title: PropTypes.string
        leftView: PropTypes.element
        rightView: PropTypes.element
    }

    static get defaultProps() {
        title: ''
        leftView: {
        }
        rightView: {
        }
    }

    render() {
        let titleView =
            this.props.title != undefined
                ? <Text style={styles.actionBarTextStyle}>{this.props.title}</Text>
                : this.props.TitleView;

        return (
            <View style={styles.container}>
                <View style={styles.statusBarStyle}>
                    <StatusBar
                        hidden={false}
                        barStyle='light-content'
                        translucent={true}
                        backgroundColor="#63B8FF"
                    ></StatusBar>
                </View>
                <View style={styles.actionBarStyle}>
                    {titleView}
                    {this.props.leftView === undefined ? <View></View> : this.props.leftView}
                    {this.props.rightView}
                </View>
            </View>
        )
    }

}

const Platform = require('Platform');
const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    statusBarStyle: {
        // height: Platform.OS === 'ios' ? 20 : 0,
        height: 20,
        backgroundColor: '#63B8FF'
    },
    actionBarStyle: {
        flexDirection: 'row',
        // flex: 1,
        width: ScreenWidth,
        height: 30,
        backgroundColor: '#63B8FF',
        // justifyContent: 'flex-end',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionBarTextStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
    },
});