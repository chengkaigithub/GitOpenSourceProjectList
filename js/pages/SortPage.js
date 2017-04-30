/**
 * Created by chengkai on 2017/4/27.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    Image,
    TouchableHighlight,
    DeviceEventEmitter,
    Alert
} from 'react-native';

import NavigatorBar from '../component/NavigationBar';
import SortableListView from 'react-native-sortable-listview';
import Utils from '../component/Utils';
import CKToast from '../../android_modle/CKToast';

const defaultLanguages = require('../data/default_languages.json');
const Platform = require('Platform');

export default class SortPage extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            originData: defaultLanguages,
            data: [],
            oldSortData: []
        };
        this.state.originData.forEach((item) => {
            if (item.isChecked) this.state.data.push(item);
        });
    }

    handleBackImageOnPress() {
        console.log(this.state.data);
        console.log(this.state.oldSortData);
        if (!Utils.checkArrayIsEquals(this.state.data, this.state.oldSortData)) {
            Alert.alert('提示', '排序规则改变,是否保存?', [
                {text: '是', onPress: () => this.handleSaveOnPress()},
                {text: '否', onPress: () => this.popThisPage()}
            ]);
        } else {
            this.popThisPage();
        }
    }

    popThisPage() {
        if (Platform.OS === 'android') {
            CKToast.alert((successResult) => {
                CKToast.show(successResult, CKToast.LENGTH_LONG); // 只能在android中调用
                this.props.navigator.pop();
            }, (errorResult) => {
                CKToast.show(errorResult, CKToast.LENGTH_LONG); // 只能在android中调用
            });
        } else {
            this.props.navigator.pop();
        }
    }

    renderNavigationLeftView() {
        return (
            <View style={styles.imageButtonContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.3}
                    onPress={() => this.handleBackImageOnPress()}
                >
                    <Image
                        style={[styles.leftImageStyle, {tintColor: 'white'}]}
                        source={require('../../res/images/ic_arrow_back_white_36pt.png')}
                    ></Image>
                </TouchableOpacity>
            </View>
        )
    }

    handleSaveOnPress() {
        this.saveSort();
        DeviceEventEmitter.emit('HomeView', 'reloadHomeView');
    }

    /**
     * 保存排序后的数据
     */
    saveSort() {
        var originData = this.state.originData;
        var newData = this.state.data;
        var saveData = [];
        for (var i = 0, j = 0; i < originData.length; i++) {
            let originDatum = originData[i];
            if (originDatum.isChecked) {
                saveData[i] = newData[j];
                j++;
            } else {
                saveData[i] = originDatum;
            }
        }
        AsyncStorage.setItem('custom_languages_setting', JSON.stringify(saveData))
            .then(() => {
                DeviceEventEmitter.emit('PopularView', 'reloadPopularView');
            }).done();
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
            .then((result) => {
                let arr = [];
                if (result != null) {
                    JSON.parse(result).forEach((item) => {
                        if (item.isChecked) {
                            arr.push(item);
                        }
                    })
                } else {
                    defaultLanguages.forEach((item) => {
                        if (item.isChecked) {
                            arr.push(item);
                        }
                    })
                }
                this.setState({originData: JSON.parse(result), data: arr, oldSortData: Utils.cloneArray(arr)});
            }).done();
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title="语言分类排序"
                    leftView={this.renderNavigationLeftView()}
                    rightView={this.renderNavigationRightView()}
                ></NavigatorBar>
                <SortableListView
                    data={this.state.data}
                    order={Object.keys(this.state.data)}
                    onRowMoved={(e) => {
                        this.state.data.splice(e.to, 0, this.state.data.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    onMoveStart={ () => console.log('on move start') }
                    onMoveEnd={ () => console.log('on move end') }
                    renderRow={row => <RowComponent data={row} />}
                />
            </View>
        )
    }

}

class RowComponent extends Component {

    static get defaultProps() {
        data: {
            name: ''
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={styles.touchableStyle}
                underlayColor={'#eee'}
                delayLongPress={500}
                {...this.props.sortHandlers}
            >
                <View style={styles.itemStyle}>
                    <Image
                        style={styles.leftImageStyle}
                        source={require('../../res/images/ic_sort.png')}></Image>
                    <Text style={styles.itemTextStyle}>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    leftImageStyle: {
        width: 26,
        height: 26,
        marginLeft: 5,
        tintColor: '#63B8FF'
    },
    imageButtonContainerStyle: {
        flexDirection: 'row',
    },
    textStyle: {
        fontSize: 16,
        color: '#ffffff',
        marginRight: 5,
    },
    touchableStyle: {
        padding: 10,
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTextStyle: {
        marginLeft: 10
    }
});