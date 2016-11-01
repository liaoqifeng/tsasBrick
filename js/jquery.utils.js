String.prototype.contains = function (str) { 
	return (this.indexOf(str) > -1); 
};
String.prototype.trim = function (s) { 
	if (s) return this.trimEnd(s).trimStart(s); 
	else return this.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, ''); 
};
String.prototype.trimEnd = function (s) { 
	if (this.endsWith(s)) { 
		return this.substring(0, this.length - s.length); 
	} 
	return this; 
};
String.prototype.trimStart = function (s) { 
	if (this.startsWith(s)) { 
		return this.slice(s.length); 
	} 
	return this; 
};
String.prototype.startsWith = function (str) { 
	return (this.indexOf(str) == 0); 
};
String.prototype.endsWith = function (str) { 
	return (str.length <= this.length && this.substr(this.length - str.length, str.length) == str); 
};
String.prototype.remove = function (start, l) { 
	var str1 = this.substring(0, start); var str2 = this.substring(start + l, this.length); 
	return str1 + str2; 
}
String.prototype.insert = function (index, str) { 
	var str1 = this.substring(0, index); 
	var str2 = this.substring(index, this.length); 
	return str1 + str + str2; 
}
String.prototype.getHashCode = function () { 
	var h = 31; 
	var i = 0; 
	var l = this.length; 
	while (i < l) h ^= (h << 5) + (h >> 2) + this.charCodeAt(i++); 
	return h; 
}
String.isNullOrEmpty = function (str) { 
	return str; 
};
String.format = function () { 
	var str = arguments[0]; 
	for (var i = 1; i < arguments.length; i++) { 
		var reg = new RegExp("\\{" + (i - 1) + "\\}", "ig"); 
		str = str.replace(reg, arguments[i]); 
	} 
	return str; 
};
Array.prototype.contains = function (val) { 
	for (var i = 0; i < this.length; i++) { 
		if (val == this[i]) return true; 
	} 
	return false; 
}

Date.prototype.isLeapYear = function() { 
	return (0==this.getYear()%4&&((this.getYear()%100!=0)||(this.getYear()%400==0))); 
}
/** 
 * 日期格式化 
 * 格式 YYYY/yyyy/YY/yy 表示年份 
 * MM/M 月份 
 * W/w 星期 
 * dd/DD/d/D 日期 
 * hh/HH/h/H 时间 
 * mm/m 分钟 
 * ss/SS/s/S 秒 
**/
Date.prototype.format = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
	str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
	str = str.replace(/M/g, this.getMonth());
	str = str.replace(/w|W/g, Week[this.getDay()]);
	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());
	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());
	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());
	return str;
}
Date.prototype.toArray = function() {
	myDate = this;
	var myArray = Array();
	myArray[0] = myDate.getFullYear();
	myArray[1] = myDate.getMonth();
	myArray[2] = myDate.getDate();
	myArray[3] = myDate.getHours();
	myArray[4] = myDate.getMinutes();
	myArray[5] = myDate.getSeconds();
	return myArray;
}

Date.prototype.add = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
		case 's':
			return new Date(Date.parse(dtTmp) + (1000 * Number));
		case 'n':
			return new Date(Date.parse(dtTmp) + (60000 * Number));
		case 'h':
			return new Date(Date.parse(dtTmp) + (3600000 * Number));
		case 'd':
			return new Date(Date.parse(dtTmp) + (86400000 * Number));
		case 'w':
			return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
		case 'q':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		case 'm':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		case 'y':
			return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	}
}
Date.prototype.diff = function(strInterval, dtEnd) {
	var dtStart = this;
	if (typeof dtEnd == 'string'){
		dtEnd = $.DateUtils.stringToDate(dtEnd);
	}
	switch (strInterval) {
		case 's':
			return parseInt((dtEnd - dtStart) / 1000);
		case 'n':
			return parseInt((dtEnd - dtStart) / 60000);
		case 'h':
			return parseInt((dtEnd - dtStart) / 3600000);
		case 'd':
			return parseInt((dtEnd - dtStart) / 86400000);
		case 'w':
			return parseInt((dtEnd - dtStart) / (86400000 * 7));
		case 'm':
			return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
		case 'y':
			return dtEnd.getFullYear() - dtStart.getFullYear();
	}
}
Date.prototype.part = function(interval) {
	var myDate = this;
	var partStr = '';
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	switch (interval) {
		case 'y':
			partStr = myDate.getFullYear();
			break;
		case 'm':
			partStr = myDate.getMonth() + 1;
			break;
		case 'd':
			partStr = myDate.getDate();
			break;
		case 'w':
			partStr = Week[myDate.getDay()];
			break;
		case 'ww':
			partStr = myDate.WeekNumOfYear();
			break;
		case 'h':
			partStr = myDate.getHours();
			break;
		case 'n':
			partStr = myDate.getMinutes();
			break;
		case 's':
			partStr = myDate.getSeconds();
			break;
	}
	return partStr;
}
Date.prototype.max = function() {
	var myDate = this;
	var ary = myDate.toArray();
	var date1 = (new Date(ary[0], ary[1] + 1, 1));
	var date2 = date1.add(1, 'm', 1);
	var result = dateDiff(date1.format('yyyy-MM-dd'), date2.format('yyyy-MM-dd'));
	return result;
}




var CustomerTimer = function(interval,ontick){
    this.counter = 0;
    this.interval = interval;
    this.ontick = ontick;
    this.handler = null;
}
CustomerTimer.prototype.start = function () {
    //window._count=0;
    var _ts = this
    this.handler = window.setInterval(function () { _ts.ontick(++_ts.counter); }, this.interval);
    //var _this = this; if (this.interval > 0) { if (this.ontick != null) this.ontick(++this.counter); window.setTimeout(function() { _this.start() }, _this.interval); }

}
CustomerTimer.prototype.stop = function () {
    window.clearInterval(this.handler);
    this.interval = 0;
}

//自定义HashMap
function HashMap() {
    this._hash = new Object();
    this.put = function(key, value) {
        if (typeof (key) != "undefined") {
            if (this.containsKey(key) == false) {
                this._hash[key] = typeof (value) == "undefined" ? null : value;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    this.remove = function(key) { delete this._hash[key]; }
    this.size = function() { var i = 0; for (var k in this._hash) { i++; } return i; }
    this.get = function(key) { return this._hash[key]; }
    this.containsKey = function(key) { return typeof (this._hash[key]) != "undefined"; }
    this.clear = function() { for (var k in this._hash) { delete this._hash[k]; } }
}

//深度扩展
function deepExtend(destination) {
    var i = 1,
        length = arguments.length;
    for (i = 1; i < length; i++) {
        deepExtendOne(destination, arguments[i]);
    }
    return destination;
}

function deepExtendOne(destination, source) {
    var property,
        propValue,
        propType,
        destProp;

    for (property in source) {
        propValue = source[property];
        propType = typeof propValue;
        if (propType === "object" && propValue !== null && propValue.constructor !== Array) {
            destProp = destination[property];
            if (typeof (destProp) === "object") {
                destination[property] = destProp || {};
            } else {
                destination[property] = {};
            }
            deepExtendOne(destination[property], propValue);
        } else if (propType !== "undefined") {
            destination[property] = propValue;
        }
    }

    return destination;
}

(function($){
	jQuery.DateUtils = {
		/**
		    * 字符串转换为日期对象
		    * @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
	    */
	    strToDate : function(dateStr){
	        var data = dateStr;  
	        var reCat = /(\d{1,4})/gm;   
	        var t = data.match(reCat);
	        t[1] = t[1] - 1;
	        eval('var d = new Date('+t.join(',')+');');
	        return d;
	    },
	    /**
		* 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
	    */
	    strFormatToDate : function(formatStr, dateStr){
	        var year = 0;
	        var start = -1;
	        var len = dateStr.length;
	        if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
	            year = dateStr.substr(start, 4);
	        }
	        var month = 0;
	        if((start = formatStr.indexOf('MM')) > -1  && start < len){
	            month = parseInt(dateStr.substr(start, 2)) - 1;
	        }
	        var day = 0;
	        if((start = formatStr.indexOf('dd')) > -1 && start < len){
	            day = parseInt(dateStr.substr(start, 2));
	        }
	        var hour = 0;
	        if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
	            hour = parseInt(dateStr.substr(start, 2));
	        }
	        var minute = 0;
	        if((start = formatStr.indexOf('mm')) > -1  && start < len){
	            minute = dateStr.substr(start, 2);
	        }
	        var second = 0;
	        if((start = formatStr.indexOf('ss')) > -1  && start < len){
	            second = dateStr.substr(start, 2);
	        }
	        return new Date(year, month, day, hour, minute, second);
	    },
	    /**
	     * 日期对象转换为毫秒数
	     */
	    dateToLong : function(date){
	        return date.getTime();
	    },
	    /**
	     * 毫秒转换为日期对象
	     * @param dateVal number 日期的毫秒数 
	     */
	    longToDate : function(dateVal){
	        return new Date(dateVal);
	    },
	 	/**
	     * 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
	     * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒  
	     * @param dtStart Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
	     * @param dtEnd Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒 
	     */
	    diff : function(strInterval, dtStart, dtEnd) {   
	        switch (strInterval) {   
	            case 's' :return parseInt((dtEnd - dtStart) / 1000);  
	            case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
	            case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
	            case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
	            case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
	            case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
	            case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
	        }  
	    },
		/**
		 * 日期计算
		 * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
		 * @param num int
		 * @param date Date 日期对象
		 * @return Date 返回日期对象
		 */
		add : function(strInterval, num, date) {
			date = arguments[2] || new Date();
			switch (strInterval) {
				case 's':
					return new Date(date.getTime() + (1000 * num));
				case 'n':
					return new Date(date.getTime() + (60000 * num));
				case 'h':
					return new Date(date.getTime() + (3600000 * num));
				case 'd':
					return new Date(date.getTime() + (86400000 * num));
				case 'w':
					return new Date(date.getTime() + ((86400000 * 7) * num));
				case 'm':
					return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
				case 'y':
					return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			}
		},
		/**
	     * 日期对象转换为指定格式的字符串
	     * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
	     * @param date Date日期对象, 如果缺省，则为当前时间
	     *
	     * YYYY/yyyy/YY/yy 表示年份  
	     * MM/M 月份  
	     * W/w 星期  
	     * dd/DD/d/D 日期  
	     * hh/HH/h/H 时间  
	     * mm/m 分钟  
	     * ss/SS/s/S 秒  
	     * @return string 指定格式的时间字符串
	     */
	    dateToStr : function(formatStr, date){
	        formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
	        date = arguments[1] || new Date();
	        var str = formatStr;   
	        var Week = ['日','一','二','三','四','五','六'];  
	        str=str.replace(/yyyy|YYYY/,date.getFullYear());   
	        str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));   
	        str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));   
	        str=str.replace(/M/g,date.getMonth());   
	        str=str.replace(/w|W/g,Week[date.getDay()]);   
	      
	        str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());   
	        str=str.replace(/d|D/g,date.getDate());   
	      
	        str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());   
	        str=str.replace(/h|H/g,date.getHours());   
	        str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());   
	        str=str.replace(/m/g,date.getMinutes());   
	      
	        str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());   
	        str=str.replace(/s|S/g,date.getSeconds());   
	      
	        return str;   
	    },
		/**
	     * 取得当前日期所在月的最大天数  
	     */
	    maxDayOfDate : function(date) {   
	        date = arguments[0] || new Date();
	        date.setDate(1);
	        date.setMonth(date.getMonth() + 1);
	        var time = date.getTime() - 24 * 60 * 60 * 1000;
	        var newDate = new Date(time);
	        return newDate.getDate();
	    }

	};
	jQuery.BindingUtils = {
		/**
			* 动态绑定属性
			* @params site:Object 被绑定对象
			* @params prop:String 被绑定对象的属性,如text的value属性
			* @params host:Object 监视者对象
			* @params chain:String 监视者对象的属性
		**/     
		bindProperty : function(site,prop,host,chain) {
			site = (typeof site == 'string' ? $("#"+site) : site);
			host = (typeof host == 'string' ? $("#"+host) : host);
			site.attr(prop,host.attr(chain));
		},
		/**
			* 动态绑定属性
			* @params site:Object 被绑定对象
			* @params prop:String 被绑定对象的样式,如div的width属性
			* @params host:Object 监视者对象
			* @params chain:String 监视者对象的样式
		**/        
		bindCss:function(site,prop,host,chain) {
			site = (typeof site == 'string' ? $("#"+site) : site);
			host = (typeof host == 'string' ? $("#"+host) : host);
			site.css(prop,host.css(chain))
		}
	};
	jQuery.ColorUtils = {
		/**
			* RGB颜色转换
			* @params value RGB颜色值
		**/
		rgbToHex : function(value){
			var str = value.toString(16).toUpperCase();
			str = ("000000" + str).toString().substr(-6);
			return str;
		},
		/**
			* 调节颜色亮度
			* @params rgb RGB颜色值
			* @params brite 亮度粒子
		**/
		adjustBrightness2 : function(rgb,brite){
			var r,g,b;
			if (brite == 0)
				return rgb;
			if (brite < 0){
				brite = (100 + brite) / 100;
				r = ((rgb >> 16) & 0xFF) * brite;
				g = ((rgb >> 8) & 0xFF) * brite;
				b = (rgb & 0xFF) * brite;
			} else {
				brite /= 100;
				r = ((rgb >> 16) & 0xFF);
				g = ((rgb >> 8) & 0xFF);
				b = (rgb & 0xFF);
				
				r += ((0xFF - r) * brite);
				g += ((0xFF - g) * brite);
				b += ((0xFF - b) * brite);
				
				r = Math.min(r, 255);
				g = Math.min(g, 255);
				b = Math.min(b, 255);
			}
			return $.ColorUtils.rgbToHex((r << 16) | (g << 8) | b);
		}
	};
	
	jQuery.SvgUtils = {
		/**
			* 动态创建SVG标签
			* @params tag 标签
		**/
		T : function(tag){
			var _xmlns = "http://www.w3.org/2000/svg";
			var t = document.createElementNS(_xmlns, tag);
			return $(t);
		},
		S : function(box){
			var _xmlns = "http://www.w3.org/2000/svg";
			var _xlink = "http://www.w3.org/1999/xlink";
			var _version = "1.1";
			var _svg = $.SvgUtils.T("svg").attr({"version":_version, "xmlns":_xmlns});
			_svg.css({"width":"100%", "height":"100%"});
			if(box != null && box != "" && box != undefined){
				box.append(_svg);
			}
			return _svg;
		}
	};
	
	jQuery.overlay = function(options){
		var $dialogOverlay =$('<div class="masklayer"></div>');
		$("body").prepend($dialogOverlay).data("overlay",$dialogOverlay);
		return $dialogOverlay;
	};
	
	jQuery.removeOverlay = function(options){
		var $dialogOverlay = $("body").data("overlay");
		if($dialogOverlay) $dialogOverlay.remove();
	};
	/**
	* Message/Logging 工具类
	*
	* @example $.MsgUtils.alert("My message");				// log text
	* @example $.MsgUtils.alert("My message", true);		// alert text
	* @example $.MsgUtils.alert({ foo: "bar" }, "Title");	// log hash-data, with custom title
	* @example $.MsgUtils.alert({ foo: "bar" }, true, "Title", { sort: false }); -OR-
	* @example $.MsgUtils.alert({ foo: "bar" }, "Title", { sort: false, display: true }); // alert hash-data
	*
	* @param {(Object|string)}			info			String message OR Hash/Array
	* @param {(Boolean|string|Object)=}	[popup=false]	True means alert-box - can be skipped
	* @param {(Object|string)=}			[debugTitle=""]	Title for Hash data - can be skipped
	* @param {Object=}					[debugOpts]		Extra options for debug output
	*/
	jQuery.MsgUtils = {
		log : function (info, popup, debugTitle, debugOpts) {
			if ($.isPlainObject(info) && window.debugData) {
				if (typeof popup === "string") {
					debugOpts	= debugTitle;
					debugTitle	= popup;
				}
				else if (typeof debugTitle === "object") {
					debugOpts	= debugTitle;
					debugTitle	= null;
				}
				var t = debugTitle || "log( <object> )"
				,	o = $.extend({ sort: false, returnHTML: false, display: false }, debugOpts);
				if (popup === true || o.display)
					debugData( info, t, o );
				else if (window.console)
					console.log(debugData( info, t, o ));
			}
			else if (popup)
				alert(info);
			else if (window.console)
				console.log(info);
			else {
				var id	= "#layoutLogger"
				,	$l = $(id);
				if (!$l.length)
					$l = createLog();
				$l.children("ul").append('<li style="padding: 4px 10px; margin: 0; border-top: 1px solid #CCC;">'+ info.replace(/\</g,"&lt;").replace(/\>/g,"&gt;") +'</li>');
			}
	
			function createLog () {
				var pos = $.support.fixedPosition ? 'fixed' : 'absolute'
				,	$e = $('<div id="layoutLogger" style="position: '+ pos +'; top: 5px; z-index: 999999; max-width: 25%; overflow: hidden; border: 1px solid #000; border-radius: 5px; background: #FBFBFB; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">'
					+	'<div style="font-size: 13px; font-weight: bold; padding: 5px 10px; background: #F6F6F6; border-radius: 5px 5px 0 0; cursor: move;">'
					+	'<span style="float: right; padding-left: 7px; cursor: pointer;" title="Remove Console" onclick="$(this).closest(\'#layoutLogger\').remove()">X</span>Layout console.log</div>'
					+	'<ul style="font-size: 13px; font-weight: none; list-style: none; margin: 0; padding: 0 0 2px;"></ul>'
					+ '</div>'
					).appendTo("body");
				$e.css('left', $(window).width() - $e.outerWidth() - 5)
				if ($.ui.draggable) $e.draggable({ handle: ':first-child' });
				return $e;
			};
		}
	}

})(jQuery);   