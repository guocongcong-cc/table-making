export const utliTools =  {}
utliTools.address="sfsfsdfdsfd"

//生成UUID
/*
* 参数说明：空
* 返回格式“xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx”
* */
utliTools.generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}

//深拷贝
/*
* 参数说明：
* obj：需要深拷贝的对象
* */
utliTools.deepClone = (obj) => {
  var o;
  if (typeof obj === 'object') {
    if (obj === null) {
      o = null;
    }
    else {
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(deepClone(obj[i]));
        }
      }
      else {
        o = {};
        for (var j in obj) {
          o[j] = deepClone(obj[j]);
        }
      }
    }
  }
  else {
    o = obj;
  }
  return o;
}


//生成一个指定范围内的随机数
/*
* 参数说明：
* Min----Max生成随机数字的范围
* */
utliTools.createRandomNum = (Min, Max) => {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

//生成一个指定长度的随机字符串
/*
* 参数说明：
* n:要生成的随机字符串位数
* */
utliTools.createRandomStr = (n) => {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

//生成一个随机时间戳
/*
* 参数说明：
* n:修正时间戳的随机数字
* */
utliTools.createDateTime = (n) => {
  var timestamp = (new Date()).getTime();
  return timestamp - n;
}

//金额大写格式化
/*
* 参数说明：
* number：要格式化的数字
* 返回中文金额大写
* */
utliTools.amountToWords = (number) => {
    var ret = "";
    if (number != "" && number != null && number != "0") {
      var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
        str = "";
      number += "00";
      var point = number.indexOf(".");
      if (point >= 0) {
        number = number.substring(0, point) + number.substr(point + 1, 2);
      }
      unit = unit.substr(unit.length - number.length);
      for (var i = 0; i < number.length; i++) {
        str +=
          "零壹贰叁肆伍陆柒捌玖".charAt(number.charAt(i)) + unit.charAt(i);
      }
      ret =
        str
          .replace(/零(仟|佰|拾|角)/g, "零")
          .replace(/(零)+/g, "零")
          .replace(/零(万|亿|元)/g, "$1")
          .replace(/(亿)万|(拾)/g, "$1$2")
          .replace(/^元零?|零分/g, "")
          .replace(/元$/g, "元");
    }
    return ret;
  }

//金额数字格式化
/*
* 参数说明：
* number：要格式化的数字
* decimals：保留几位小数
* dec_point：小数点符号
* thousands_sep：千分位符号
* */

utliTools.amountnNumberFormat = (number, decimals, dec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
utliTools.parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
utliTools.formatTime = (time, option) => {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} data '2019-01-03T00:18:21.000+0000'
 * @returns {Object}
 */

utliTools.renderTime = (date) => {
  var dateJson = new Date(date).toJSON();
  return new Date(+new Date(dateJson) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

/**
 * @param {string} url
 * @returns {Object}
 */
utliTools.getQueryObject = (url)=> {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
utliTools.byteLength = (str) => {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

