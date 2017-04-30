/**
 * Created by chengkai on 2017/4/29.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    WebView
} from 'react-native';

import NavigationBar from '../component/NavigationBar';

export default class DetailInfoView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            canGoBack: false
        };
    }

    handleBackImageOnPress() {
        if (this.state.canGoBack) {
            this.refs.mWebView.goBack();
        } else {
            this.popThisPage();
        }
    }

    popThisPage() {
        this.props.navigator.pop();
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

    renderNavigatorLeftView() {
        return (
            <View style={styles.imageButtonContainerStyle}>
                <TouchableOpacity activeOpacity={0.3}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../res/images/ic_share.png')}
                    ></Image>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../res/images/ic_unstar_transparent.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.props.title}
                    leftView={this.renderNavigationLeftView()}
                    rightView={this.renderNavigatorLeftView()}
                />
                <WebView
                    ref="mWebView"
                    startInLoadingState={true}
                    onNavigationStateChange={(navState) => this.handlerOnNavigationStateChange(navState)}
                    source={{uri: this.props.url}}
                ></WebView>
            </View>
        )
    }

    handlerOnNavigationStateChange(navState) {
        this.setState({canGoBack: navState.canGoBack});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageButtonContainerStyle: {
        flexDirection: 'row',
    },
    imageStyle: {
        width: 20,
        height: 20,
        marginRight: 5,
        tintColor: '#FFF'
    },
    leftImageStyle: {
        width: 26,
        height: 26,
        marginLeft: 5,
    },
});