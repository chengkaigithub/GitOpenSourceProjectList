/**
 * Created by chengkai on 2017/4/23.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import NavigatorBar from '../component/NavigationBar';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-easy-toast';
import Utils from '../component/Utils';

const defaultLanguages = require('../data/default_languages.json');

export default class CustomKey extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            languages: defaultLanguages
            // languages: [
            //     {name: 'IOS', isChecked: true},
            //     {name: 'Android', isChecked: true},
            //     {name: 'Java', isChecked: false},
            //     {name: 'PHP', isChecked: false},
            //     {name: 'ReactNative', isChecked: false},
            //     {name: 'React', isChecked: false},
            // ]
        };
    }

    popThisPage() {
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <NavigatorBar
                    title="自定义界面"
                    leftView={this.renderNavigationLeftView()}
                    rightView={this.renderNavigationRightView()}
                ></NavigatorBar>
                {this.renderContentView()}
                <Toast
                    ref="mToast"
                    style={{backgroundColor:'#63B8FF'}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#FFF'}}
                />
            </View>
        )
    }

    renderNavigationLeftView() {
        return (
            <View style={styles.imageButtonContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.3}
                    onPress={() => this.handleBackImageOnPress()}
                >
                    <Image
                        style={styles.leftImageStyle}
                        source={require('../../res/images/ic_arrow_back_white_36pt.png')}
                    ></Image>
                </TouchableOpacity>
            </View>
        )
    }

    renderNavigationRightView() {
        return (
            <View style={styles.imageButtonContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.3}
                    onPress={() => this.handleSaveOnPress()}>
                    <Text style={styles.textStyle}>保存</Text>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        AsyncStorage.getItem('custom_languages_setting')
            .then(result => {
                if (result !== null) {
                    this.setState({
                        languages: JSON.parse(result)
                    });
                    this.originData = Utils.cloneArray(this.state.languages);
                }
            }).done();
    }

    handleSaveOnPress() {
        AsyncStorage.setItem('custom_languages_setting', JSON.stringify(this.state.languages))
            .then(() => {
                this.refs.mToast.show('保存成功');
                DeviceEventEmitter.emit('PopularView', 'reloadPopularView');
                this.popThisPage();
            }).done();
    }

    handleBackImageOnPress() {
        if (Utils.checkArrayIsEquals(this.originData, this.state.languages)) {
            this.popThisPage();
            return;
        }
        Alert.alert('提示','是否要保存?', [
            {text: '是', onPress: () => {this.handleSaveOnPress()}},
            {text: '否', onPress: () => {this.popThisPage()}}
        ])
    }

    /** draw content view */
    renderContentView() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        )
    }

    /** draw every row view */
    renderContent() {
        let length = this.state.languages.length;
        var views = [];
        for (let i = 0, j = length - 2; i < j; i += 2) {
            views.push(
                <View style={styles.itemRowStyle} key={`checkbox_${i}`}>
                    {this.renderCheckBox(this.state.languages[i])}
                    {this.renderCheckBox(this.state.languages[i + 1])}
                </View>
            )
        };
        views.push(
            <View style={styles.itemRowStyle} key={`checkbox_${length - 1}`}>
                {this.renderCheckBox(this.state.languages[length - 2])}
                {length % 2 === 0 ? this.renderCheckBox(this.state.languages[length - 1]) : <View style={{flex: 1, padding: 10}}></View>}
            </View>);
        return views;
    }

    handleCheckOnClick(item) {
        item.isChecked = !item.isChecked;
    }

    renderCheckBox(item) {
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                leftText={item.name}
                onClick={() => this.handleCheckOnClick(item)}
                isChecked={item.isChecked}
                checkedImage={<Image style={{tintColor: '#63B8FF'}} source={require('../../res/images/ic_check_box.png')}></Image>}
                unCheckedImage={<Image style={{tintColor: '#63B8FF'}} source={require('../../res/images/ic_check_box_outline_blank.png')}></Image>}
            ></CheckBox>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemRowStyle: {
        height: 30,
        flexDirection: 'row'
    },
    imageButtonContainerStyle: {
        flexDirection: 'row',
    },
    leftImageStyle: {
        width: 26,
        height: 26,
        marginLeft: 5,
    },
    textStyle: {
        fontSize: 16,
        color: '#ffffff',
        marginRight: 5,
    }
});