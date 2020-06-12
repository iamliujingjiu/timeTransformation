var dateUtils = {
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
		
		//获取特定年月的最大天数值 来自CSDN it-lisa 的思路启发
		maxDayCount = new Date(year,month,0).getDate();
		day > maxDayCount ? day = maxDayCount : ''; 

		
		month < 10 ? (month = '0' + month) : '';
		day < 10 ? (day = '0' + day) : '';
		return year + '-' + month + '-' + day + ' ' + dateArr[1];
	}

}
module.exports.dateUtils = dateUtils