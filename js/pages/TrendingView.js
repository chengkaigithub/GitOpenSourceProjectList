/**
 * Created by chengkai on 2017/4/21.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ListView,
    Image,
    RefreshControl,
    TouchableOpacity,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../../js/component/NavigationBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TrendingRowView from '../component/TrendingRowView';
import DetailInfoView from '../pages/DetailInfoView';
import Popover from '../component/Popover';
import MorePopover from '../component/MorePopover';
import GitHubTrending from 'GitHubTrending';
const defaultLanguages = require('../data/default_languages.json');

const TIME_MAP = new Map([
    ["今 天", "since=daily"],
    ["本 周", "since=weekly"],
    ["本 月", "since=monthly"]
]);

export default class TrendingView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            languages: defaultLanguages,
            switchTime: {key: "今 天", vel: "since=daily"}
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('custom_languages_setting')
            .then(result => {
                if (result !== null) {
                    this.setState({languages: JSON.parse(result)})
                }
            }).done();
        this.deviceEventEmitter = DeviceEventEmitter.addListener('PopularView', (param) => {
            if (param === 'reloadPopularView') {
                AsyncStorage.getItem('custom_languages_setting')
                    .then(result => {
                        if (result !== null) {
                            this.setState({languages: JSON.parse(result)})
                        }
                    }).done();
            }
        });
    }

    renderTitleView() {
        return (
            <TouchableOpacity
                ref="popoverBtn"
                style={styles.actionBarCenterStyle}
                onPress={() => this.handleTitleClick()}
                activeOpacity={0.5}>
                <Text style={styles.actionBarTextStyle}>趋势 {this.state.switchTime.key}</Text>
                <Image
                    style={[styles.imageStyle, {tintColor: '#FFF'}]}
                    source={require('../../res/images/ic_tiaozhuan_down@2x.png')}
                ></Image>
            </TouchableOpacity>
        );
    }

    renderNavigatorRightView() {
        return (
            <View
                style={styles.imageButtonContainerStyle}>
                <TouchableOpacity
                    ref="MorePopoverAnchorView"
                    activeOpacity={0.6}
                    onPress={() => this.refs.moreBtn.onPressMore()}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../res/images/ic_more_vert_white_48pt.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    TitleView={this.renderTitleView()}
                    rightView={this.renderNavigatorRightView()}
                />
                <ScrollableTabView
                    tabBarBackgroundColor="#63B8FF"
                    tabBarActiveTextColor="#ffffff"
                    tabBarInactiveTextColor="ffffff"
                    tabBarTextStyle={styles.tabBarTextStyle}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}>
                    {this.state.languages.map((item, position) => {
                        return (
                            item.isChecked === undefined || item.isChecked
                                ?
                                <PopularContent
                                    {...this.props}
                                    key={`tab${position}`}
                                    tabLabel={item.name}
                                    switchTime={this.state.switchTime}>
                                </PopularContent>
                                :
                                null
                        );
                    })}
                </ScrollableTabView>
                <Popover
                    isVisible={this.state.isVisible}
                    fromRect={this.state.buttonRect}
                    onClose={() => this.closePopover()}
                    contentStyle={{backgroundColor:'#343434', opacity:0.5}}
                    placement="bottom"
                >
                    {this.renderTitleClickView()}
                </Popover>
                <MorePopover ref="moreBtn" anchorView={this.refs.MorePopoverAnchorView}/>
            </View>
        );
    }

    showPopover() {
        this.refs.popoverBtn.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({isVisible: false});
    }

    /** title点击事件 */
    handleTitleClick() {
        this.showPopover();
    }

    /** 处理点击 */
    onPressSelectTime(key, vel) {
        this.setState({
            switchTime: {key: key, vel: vel}
        });
        this.closePopover();
    }

    renderTitleClickView() {
        var views = [];
        for (let [key, vel] of TIME_MAP) {
            views.push(
                <TouchableOpacity
                    key={`key_${key}`}
                    style={{marginLeft: 10,marginRight: 10, marginTop: 5, marginBottom: 5}}
                    onPress={() => this.onPressSelectTime(key, vel)}>
                    <Text style={{color: '#FFFFFF'}}>{key}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{alignItems: 'center', flex: 1}}>{views}</View>
        );
    }
}

class PopularContent extends Component {

    static get defaultProps() {
        tabLabel: 'popular'
        switchTime: 'since=daily'
    }


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isRefreshing: true
        };
    }

    reSetDataSource(dataSource) {
        this.setState({dataSource: this.state.dataSource.cloneWithRows(dataSource)});
    }

    openRefreshStatus() {
        this.setState({isRefreshing: true});
    }

    closeRefreshStatus() {
        this.setState({isRefreshing: false});
    }

    componentDidMount() {
        this.getDataFromNetWork();
    }

    getDataFromNetWork(time = `${this.props.switchTime.vel}`) {
        this.openRefreshStatus();
        new GitHubTrending().fetchTrending(`https://github.com/trending/${this.props.tabLabel}?${time}`)
            .then((resultData) => {
                this.reSetDataSource(resultData);
                this.closeRefreshStatus();
            })
            .catch(error => {
                alert(error);
                alert(this.props.tabLabel);
                this.closeRefreshStatus();
            })
            .done();
    }

    renderItem(itemData) {
        return (
            <TrendingRowView
                itemData={itemData}
                onSelect={() => this.onItemSelectListener(itemData)}
            ></TrendingRowView>
        )
    }

    onItemSelectListener(itemData) {
        this.props.navigator.push({
            component: DetailInfoView,
            params: {title: itemData.fullName, url: `https://github.com${itemData.url}`}
        });
    }

    handleOnRefresh() {
        this.getDataFromNetWork();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.switchTime.key != nextProps.switchTime.key) {
            this.getDataFromNetWork(nextProps.switchTime.vel);
        }
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => this.renderItem(rowData)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.handleOnRefresh()}
                        tintColor="#63B8FF" // support ios
                        title="正在加载中,请耐心等待..." // support ios
                        titleColor="#63B8FF" // support ios
                        colors={['#63B8FF', '#B8FF63', '#FF63B8']} // support android
                        enabled={true} // support android
                        progressBackgroundColor='#FFFFFF' // support android
                    />
                }
            ></ListView>
        )
    }

}

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabBarTextStyle: {
        color: 'white',
        fontSize: 16,
        marginTop: 10
    },
    tabBarUnderlineStyle: {
        backgroundColor: 'white',
        height: 2
    },
    imageButtonContainerStyle: {
        flexDirection: 'row',
    },
    imageStyle: {
        width: 26,
        height: 26,
        marginRight: 5,
    },
    actionBarTextStyle: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
    },
    // actionBarTextStyle: {
    //     position: 'absolute',
    //     left: 0,
    //     right: 0,
    //     textAlign: 'center',
    //     fontSize: 16,
    //     color: 'white',
    // },
    actionBarCenterStyle: {
        // position: 'absolute',
        // left: 30,
        // right: 30,
        width: 100,
        // backgroundColor: 'red',
        // flex: 1,
        marginLeft: (ScreenWidth / 2) - 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }

});