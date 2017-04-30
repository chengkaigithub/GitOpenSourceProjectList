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
import PopularRowView from '../component/PopularRowView';
import DetailInfoView from '../pages/DetailInfoView';

const defaultLanguages = require('../data/default_languages.json');


export default class PopularView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            languages: defaultLanguages
            // languages: [
            //     {name: 'Ios'},
            //     {name: 'Android'},
            //     {name: 'Java'},
            //     {name: 'Javascript'},
            //     {name: 'React'}
            // ]
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

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='最热'
                    rightView={this.renderNavigatorLeftView()}
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
                                <PopularContent {...this.props} key={`tab${position}`} tabLabel={item.name}></PopularContent>
                                :
                                null
                        );
                    })}
                </ScrollableTabView>
            </View>
        );
    }

    renderNavigatorLeftView() {
        return (
            <View style={styles.imageButtonContainerStyle}>
                <TouchableOpacity activeOpacity={0.3}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../res/images/ic_search_white_48pt.png')}
                    ></Image>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../res/images/ic_more_vert_white_48pt.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }
}

class PopularContent extends Component {

    static get defaultProps() {
        tabLabel: 'popular'
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

    getDataFromNetWork() {
        this.openRefreshStatus();
        fetch(`https://api.github.com/search/repositories?q=${this.props.tabLabel}&sort=stars`)
            .then(response => response.json())
            .then((resultData) => {
                this.reSetDataSource(resultData.items);
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
            <PopularRowView
                itemData={itemData}
                onSelect={() => this.onItemSelectListener(itemData)}
            ></PopularRowView>
        )
    }

    onItemSelectListener(itemData){
        this.props.navigator.push({
            component: DetailInfoView,
            params: {title: itemData.full_name, url: itemData.html_url}
        });
    }

    handleOnRefresh() {
        this.getDataFromNetWork();
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
});