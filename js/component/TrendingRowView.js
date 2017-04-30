/**
 * Created by chengkai on 2017/4/23.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class PopularRowView extends Component {
    render() {
        let itemData = this.props.itemData;
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.props.onSelect}>
                <View style={styles.container}>
                    <Text style={styles.fullName}>{itemData.fullName}</Text>
                    <Text style={styles.description}>{itemData.description}</Text>
                    <View style={styles.bottomView}>
                        <View style={styles.bottomViewStyle}>
                            <Text style={styles.author}>{'作者:'}</Text>
                            {this.renderItemImages(itemData.contributors)}
                        </View>
                        <View style={styles.bottomViewStyle}>
                            <Text style={styles.author}>{'星:'}</Text>
                            <Text style={styles.author}>{itemData.meta}</Text>
                        </View>
                        <Image style={styles.imageStyle}
                               source={require('../../res/images/ic_unstar_transparent.png')}></Image>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemImages(itemData) {
        let views = [];
        for (var i = 0; i < itemData.length; i++){
            views.push(<Image key={`image_${i}`} style={[styles.imageStyle, {marginRight: 2}]} source={{uri: itemData[i]}}></Image>);
            if (i > 1) break;
        }
        return views;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        paddingLeft: 10,
        margin: 5,
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 2,
        shadowColor: '#ccc', // only support ios
        shadowOffset: {width: 3, height: 3}, // only support ios
        shadowOpacity: 2, // only support ios
        shadowRadius: 2, // only support ios
        backgroundColor: '#FFF',
        elevation: 5 // only support more than Android5.0
    },
    fullName: {
        fontWeight: 'bold',
        color: '#000000'
    },
    description: {
        color: '#535353'
    },
    author: {
        color: '#535353'
    },
    imageStyle: {
        width: 16,
        height: 16
    },
    bottomViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    stars: {
        color: '#535353'
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    }
});