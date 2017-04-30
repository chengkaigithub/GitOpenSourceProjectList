/**
 * Created by chengkai on 2017/4/20.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import PopularView from '../pages/PopularView';
import TrendingView from '../pages/TrendingView';
import MyView from '../pages/MyView';
import SplashScreen from 'react-native-splash-screen';

export default class HomeView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentSelectTab: 'popular'
        };
    }

    componentDidMount() {
        SplashScreen.hide();
        this.deviceEventEmitter = DeviceEventEmitter.addListener('HomeView', (param) => {
            if (param === 'reloadHomeView') {
                // 方式一：重置盏，回到HomeView页
                this.props.navigator.resetTo({component: HomeView});
            } else {
                // 方式二：重新加载数据，应在PopilarView中进行
            }

        });
    }

    componentWillUnmount() {
        this.deviceEventEmitter.remove();
    }

    /** 下面标签: <MyView /> 不传{...this.props}时，下个界面会找不到navigator */
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        title='最热'
                        selected={this.state.currentSelectTab === 'popular'}
                        selectedTitleStyle={styles.selectTabTextStyle}
                        renderIcon={() => (<Image style={styles.imageStyle} source={require('../../res/images/ic_popular.png')}></Image>)}
                        renderSelectedIcon={() => (<Image style={[styles.imageStyle, {tintColor:'#63B8FF'}]} source={require('../../res/images/ic_popular.png')}></Image>)}
                        onPress={() => this.setState({currentSelectTab: 'popular'})}>
                        <PopularView {...this.props}></PopularView>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        title='趋势'
                        selected={this.state.currentSelectTab === 'trending'}
                        selectedTitleStyle={styles.selectTabTextStyle}
                        renderIcon={() => (<Image style={styles.imageStyle} source={require('../../res/images/ic_trending.png')}></Image>)}
                        renderSelectedIcon={() => (<Image style={[styles.imageStyle, {tintColor:'#63B8FF'}]} source={require('../../res/images/ic_trending.png')}></Image>)}
                        onPress={() => this.setState({currentSelectTab: 'trending'})}>
                        <TrendingView {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        title='收藏'
                        selected={this.state.currentSelectTab === 'favorite'}
                        selectedTitleStyle={styles.selectTabTextStyle}
                        renderIcon={() => (<Image style={styles.imageStyle} source={require('../../res/images/ic_favorite.png')}></Image>)}
                        renderSelectedIcon={() => (<Image style={[styles.imageStyle, {tintColor:'#63B8FF'}]} source={require('../../res/images/ic_favorite.png')}></Image>)}
                        onPress={() => this.setState({currentSelectTab: 'favorite'})}>
                        <View style={{flex: 1, backgroundColor: 'blue'}}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        title='我的'
                        selected={this.state.currentSelectTab === 'my'}
                        selectedTitleStyle={styles.selectTabTextStyle}
                        renderIcon={() => (<Image style={styles.imageStyle} source={require('../../res/images/ic_my.png')}></Image>)}
                        renderSelectedIcon={() => (<Image style={[styles.imageStyle, {tintColor:'#63B8FF'}]} source={require('../../res/images/ic_my.png')}></Image>)}
                        onPress={() => this.setState({currentSelectTab: 'my'})}>
                        <MyView {...this.props}></MyView>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'rgba(235, 0, 0, 0.5)'
    },
    imageStyle: {
        width: 26,
        height: 26
    },
    selectTabTextStyle: {
        color: "#63B8FF"
    }
});