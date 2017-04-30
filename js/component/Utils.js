/**
 * Created by chengkai on 2017/4/27.
 */

export default class Utils {

    /**
     * 对比数组是否一样
     * @param arrA
     * @param arrB
     * @returns {boolean}
     */
    static checkArrayIsEquals(arrA, arrB) {
        return JSON.stringify(arrA) == JSON.stringify(arrB);
    }

    /**
     * 拷贝数组
     * @param arrA
     */
    static cloneArray(arrA) {
        return arrA.map((item) => {
            let obj = {};
            for (let attr in item) {
                obj[attr] = item[attr];
            }
            return obj;
        });
    }

}

/*
var a = [
    {name: 'IOS', isChecked: true},
    {name: 'Android', isChecked: true},
    {name: 'Java', isChecked: false},
    {name: 'PHP', isChecked: false},
    {name: 'ReactNative', isChecked: false},
    {name: 'React', isChecked: false},
];

var b = [
    {name: 'IOS', isChecked: true},
    {name: 'Android', isChecked: true},
    {name: 'Java', isChecked: false},
    {name: 'PHP', isChecked: false},
    {name: 'ReactNative', isChecked: false},
    {name: 'React', isChecked: false},
];

let cloneArray = Utils.cloneArray(a);
a[0].name = 'chengkai';
console.log(cloneArray);
console.log(a);

console.log(Utils.checkArrayIsEquals(a, b));
*/