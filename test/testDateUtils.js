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


 //https://www.cnblogs.com/linyijia/p/6118835.html
