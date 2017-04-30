/**
 * Created by chengkai on 2017/4/30.
 */
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';

import Popover from '../component/Popover';

export const MORE_MENU = {
    Custom_key: '自定义分类',
    Sort_Key: '语言排序',
    Share: '分享'
};

export default class MorePopover extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    onPressSelectMoreMenu(k, v) {
        switch (v) {
            case MORE_MENU.Custom_key:
                alert('custom');
                break;
            case MORE_MENU.Sort_Key:
                alert('sort');
                break;
            case MORE_MENU.Share:
                alert('share');
                break;
        }
        this.closePopover();
    }

    closePopover() {
        this.setState({isVisible: false});
    }

    onPressMore() {
        this.props.anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    renderTitleClickView() {
        var views = [];
        for (let key in MORE_MENU) {
            views.push(
                <TouchableOpacity
                    key={`key_${key}`}
                    style={{marginLeft: 10,marginRight: 10, marginTop: 5, marginBottom: 5}}
                    onPress={() => this.onPressSelectMoreMenu(key, MORE_MENU[key])}>
                    <Text style={{color: '#fff'}}>{MORE_MENU[key]}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{alignItems: 'center', flex: 1}}>{views}</View>
        );
    }

    render() {
        return (
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                onClose={() => this.closePopover()}
                contentStyle={{backgroundColor:'#343434', opacity:0.7}}
                placement="bottom"
            >
                {this.renderTitleClickView()}
            </Popover>
        );
    }

}