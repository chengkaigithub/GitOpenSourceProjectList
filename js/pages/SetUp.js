/**
 * Created by chengkai on 2017/4/23.
 */
import React, {Component} from 'react';
import {
    Navigator
} from 'react-native';

import HomeView from '../pages/HomeView';

export default function SetUp() {

    class SetUp extends Component {

        renderScene(route, navigator) {
            let Target = route.component;
            return (
                <Target navigator={navigator} {...route.params} />
                // <Target navigator={navigator}{...route.params} /> 给子组件的props传值
            )
        }

        render() {
            return (
                <Navigator
                    initialRoute={{component: HomeView, params: {title: 'hello', message: 'hehehe'}}}
                    renderScene={(route, navigator) => this.renderScene(route, navigator)}
                ></Navigator>
            );
        }
    }

    return <SetUp></SetUp>

}

