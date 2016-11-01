String.prototype.contains = function (str) { return (this.indexOf(str) > -1); };
String.prototype.trim = function (s) { if (s) return this.trimEnd(s).trimStart(s); else return this.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, ''); };
String.prototype.trimEnd = function (s) { if (this.endsWith(s)) { return this.substring(0, this.length - s.length); } return this; };
String.prototype.trimStart = function (s) { if (this.startsWith(s)) { return this.slice(s.length); } return this; };
String.prototype.startsWith = function (str) { return (this.indexOf(str) == 0); };
String.prototype.endsWith = function (str) { return (str.length <= this.length && this.substr(this.length - str.length, str.length) == str); };
String.prototype.remove = function (start, l) { var str1 = this.substring(0, start); var str2 = this.substring(start + l, this.length); return str1 + str2; }
String.prototype.insert = function (index, str) { var str1 = this.substring(0, index); var str2 = this.substring(index, this.length); return str1 + str + str2; }
String.prototype.getHashCode = function () { var h = 31; var i = 0; var l = this.length; while (i < l) h ^= (h << 5) + (h >> 2) + this.charCodeAt(i++); return h; }
String.isNullOrEmpty = function (str) { return str; };
String.format = function () { var str = arguments[0]; for (var i = 1; i < arguments.length; i++) { var reg = new RegExp("\\{" + (i - 1) + "\\}", "ig"); str = str.replace(reg, arguments[i]); } return str; };
Array.prototype.contains = function (val) { for (var i = 0; i < this.length; i++) { if (val == this[i]) return true; } return false; }

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

(function($){
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
	* Message/Logging Utility
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