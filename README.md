@[TOC](日期增加自然月)
# 前言
最近接到这样一个需求：

==业务场景==: 在线签订电子合同；
==具体需求==: 获取合同的起始时间与终止时间,以用户点击签约为起始时间,计算用户在页面中选择的合约生效时长(可选3个月、6个月、1年等等)并推算出终止时间；
==实现难点==: 可能存在大月小月以及平年闰年时二月的天数转换问题(例如：用户在2020年1月31号签约,选择合约生效时长为3个月,但是2020年4月份只有30天,按我接到的需求这里应该设置终止时间为2020-04-30)；
# 代码
核心
```javascript
	dateFormmat : function(date, format){
		if(null==date){
			return ''
		}
		if(typeof(date)=='string' || typeof date === 'number'){
			date = (typeof date === 'number') ? new Date(date) : new Date((date || '').replace(/-/g, '/'))
		}

		var o = { 
			"M+" : date.getMonth()+1, //month 
			"d+" : date.getDate(), //day 
			"h+" : date.getHours(), //hour 
			"m+" : date.getMinutes(), //minute 
			"s+" : date.getSeconds(), //second 
			"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
			"S" : date.getMilliseconds() //millisecond 
		} 

		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 

		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		return format; 
	},

	/**
	 * 在线生成合约 
	 * 当用户点击签约按钮时 就是合约的起始时间
	 * 截止时间为 用户选择的月数（或者是年数）累加起始时间
	 * 要解决的问题 : 
	 * 1.如在2020年2月29号签约，签约时间为1年，那么截止时间就只能返回2021年2月28号；
	 * 2.如在2020年1月31号签约，签约时间为1个月，那么截止时间就只能返回2020年2月29号；
	 * @param {*} date 要累加的时间
	 * @param {*} num 累加多少个月 1年就是12个月
	 */
	timeTransformation : function(date,num) {
		var day = date.getDate(),
		month = date.getMonth(),
		year = date.getFullYear(),
		dateArr = this.dateFormmat(date,'yyyy-MM-dd hh:mm:ss').split(' ');
	
		year = year + parseInt((month + num) / 12);
		month = (month + num) % 12;
		//0-11 转变为 1-12
		month += 1;

		// 大月31天，小月30天，2月份只有28天（平年）或29天（闰年）
		// 每年一﹑三﹑五﹑七﹑八﹑十﹑十二这七个月为大月，均三十一天
		switch(month){
			case 1 :
			case 3 :
			case 5 :
			case 7 :
			case 8 :
			case 10 :
			case 12 :
				day > 31 ? day = 31 : '';
				break;
			case 4 :
			case 6 :
			case 9 :
			case 11 :
				day > 30 ? day = 30 : '';
				break;
			case 2 :
				this.isLeapYear(year) ? (day > 29 ? day = 29 : '') : (day > 28 ? day = 28 : ''); 
				break;
			default : 
				break;	
		}
		month < 10 ? (month = '0' + month) : '';
		day < 10 ? (day = '0' + day) : '';
		return year + '-' + month + '-' + day + ' ' + dateArr[1];
	},

	/**
	 * 是否为闰年
	 * @param {*} year 
	 */
	isLeapYear : function(year) {
		// 普通闰年:公历年份是4的倍数的，且不是100的倍数，为普通闰年。（如2004年就是闰年）
		// 世纪闰年:公历年份是整百数的，必须是400的倍数才是世纪闰年（如1900年不是世纪闰年，2000年是世纪闰年）
		return ((year % 4 == 0) && (year % 100 != 0)) ? true : ((year % 400) == 0) ? true : false;
	}
```
另外一种思路，来自[CSDN用户 it-lisa](https://me.csdn.net/qq_33015075) 的思路启发：

```javascript
/**
	 * 在线生成合约 
	 * 当用户点击签约按钮时 就是合约的起始时间
	 * 截止时间为 用户选择的月数（或者是年数）累加起始时间
	 * 要解决的问题 : 
	 * 1.如在2020年2月29号签约，签约时间为1年，那么截止时间就只能返回2021年2月28号；
	 * 2.如在2020年1月31号签约，签约时间为1个月，那么截止时间就只能返回2020年2月29号；
	 * @param {*} date 要累加的时间
	 * @param {*} num 累加多少个月 1年就是12个月
	 */
	timeTransformation : function(date,num) {
		var day = date.getDate(),
		month = date.getMonth(),
		year = date.getFullYear(),
		dateArr = this.dateFormmat(date,'yyyy-MM-dd hh:mm:ss').split(' ');
	
		year = year + parseInt((month + num) / 12);
		month = (month + num) % 12;
		//0-11 转变为 1-12
		month += 1;
		
		//获取特定年月的最大天数值 来自CSDN it-lisa 的思路启发
		maxDayCount = new Date(year,month,0).getDate();
		day > maxDayCount ? day = maxDayCount : ''; 

		month < 10 ? (month = '0' + month) : '';
		day < 10 ? (day = '0' + day) : '';
		return year + '-' + month + '-' + day + ' ' + dateArr[1];
	}
```
这种写法的性能比上面一种要强的多，感兴趣可以自己测试一下，这里我就不展示我的测试数据了。
# 测试代码
==运行环境==：nodejs;
==判定依据==：以当前时间、2020-01-31 00:00:00、2020-02-29 00:00:00为起始时间,合约生效时长涵盖400年,计算出合约终止时间,将终止时间转时间戳后再转string并与转换前进行对比;
==例如==：
```javascript
var testDate = new Date('2021-02-29 00:00:00'.replace(/-/g,"/")),
    timestamp = Date.parse(testDate);
    
console.log(dateUtils.dateFormmat(timestamp,'yyyy-MM-dd hh:mm:ss'));//2021-03-01 00:00:0000:00:0000:00:00
```
==2021-02-29是不存在的 将它转时间戳后 所生成的时间戳就是转化2021-03-01 00:00:00的时间戳==
==具体代码==：

```javascript
var assert = require('assert'),
dateUtils = require('../src/dateUtils').dateUtils;
(()=>{
    var nowDate = new Date(),
    monthCount = 400 * 12;//400年 这样看方便点
    
    for(var i = 1;i<=monthCount;i++){
        var time = dateUtils.timeTransformation(nowDate,i),
        timestamp = Date.parse(time);
        assert.ok(time === dateUtils.dateFormmat(timestamp,'yyyy-MM-dd hh:mm:ss'),"出现不匹配时间");
    }
    
    console.log('end');
})();


(()=>{
    var testDate = new Date('2020-01-31 00:00:00'.replace(/-/g,"/"));
    monthCount = 400 * 12;//400年 这样看方便点
    
    for(var i = 1;i<=monthCount;i++){
        var time = dateUtils.timeTransformation(testDate,i),
        timestamp = Date.parse(time);
        assert.ok(time === dateUtils.dateFormmat(timestamp,'yyyy-MM-dd hh:mm:ss'),"出现不匹配时间");
    }
    
    console.log('end');
})();

(()=>{
    var testDate = new Date('2020-02-29 00:00:00'.replace(/-/g,"/"));
    monthCount = 400 * 12;//400年 这样看方便点

    for(var i = 1;i<=monthCount;i++){
        var time = dateUtils.timeTransformation(testDate,i),
        timestamp = Date.parse(time);
        assert.ok(time === dateUtils.dateFormmat(timestamp,'yyyy-MM-dd hh:mm:ss'),"出现不匹配时间");
    }

    console.log('end');
})();
```
这样测试一下还是很有必要的，我也是通过这些测试代码找出来一个bug，最开始我的timeTransformation 方法的month += 1是写在switch后面的，所以我switch中用的是month+1，到后来我改动了month += 1的位置,但是忘记去掉switch中的month+1：

==这里是错误的代码==
```javascript
timeTransformation : function(date,num) {
		var day = date.getDate(),
		month = date.getMonth(),
		year = date.getFullYear(),
		dateArr = this.dateFormmat(date,'yyyy-MM-dd hh:mm:ss').split(' ');
	
		year = year + parseInt((month + num) / 12);
		month = (month + num) % 12;
		//0-11 转变为 1-12
		month += 1;

		// 大月31天，小月30天，2月份只有28天（平年）或29天（闰年）
		// 每年一﹑三﹑五﹑七﹑八﹑十﹑十二这七个月为大月，均三十一天
		switch(month+1){
			case 1 :
			case 3 :
			case 5 :
			case 7 :
			case 8 :
			case 10 :
			case 12 :
				day > 31 ? day = 31 : '';
				break;
			case 4 :
			case 6 :
			case 9 :
			case 11 :
				day > 30 ? day = 30 : '';
				break;
			case 2 :
				this.isLeapYear(year) ? (day > 29 ? day = 29 : '') : (day > 28 ? day = 28 : ''); 
				break;
			default : 
				break;	
		}
		month < 10 ? (month = '0' + month) : '';
		day < 10 ? (day = '0' + day) : '';
		return year + '-' + month + '-' + day + ' ' + dateArr[1];
	},
```
# 结尾
在此感谢[js 当前日期增加自然月](https://www.cnblogs.com/linyijia/p/6118835.html)中的思路。
同时感谢[CSDN用户 it-lisa](https://me.csdn.net/qq_33015075) 的思路启发。
我把关于此博客所有代码整合起来放在了[timeTransformation](https://github.com/1058760330/timeTransformation)。
