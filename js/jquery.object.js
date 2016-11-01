var BaseView = function(){
	this.template = "";
	this.options = null;
	this.children = [];
	this.render = function(){
		if(this.template != null){
			if(this.options != null){
				for(var key in this.options){
					this.template = this.template.replace( "#{"+key+"}", this.options[key] ); 
				}
			}
			var functionBody = "";
			var regexp = this.template.match(/#=\{.*\}#/g);
			if(regexp != null && regexp != undefined){
				functionBody = (regexp+"").replace(/#/g,"").replace("=","").replace("{","").replace("}","");
				this.template = this.template.replace(regexp, eval(functionBody)); 
			}
		}
		return this.template;
	};
	this.renderChildren = function(){
		if(this.children != null && this.children.length > 0){
			var childrens = this.children.join("");
			return childrens;
		}
	};
}

var SVGView = function(){
	BaseView.call(this,null);
	this.template = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100%' height='100%' style='position: relative; display: block;'>" +
	                "#{definitions}#" +
	                "#={this.renderChildren()}#</svg>";
	this.definitions = [];
	this.renderDefinitions = function(){
		if(this.definitions != null && this.definitions.length > 0){
			var defs = "<defs>"+this.definitions.join("")+"</defs>";
			this.template = this.template.replace("#{definitions}",defs)
			return defs;
		}
	};
}

var SVGLinearGradient = function(){
	BaseView.call(this,null);
	this.template = '<linearGradient id="#{id}" x1="#{x1}" y1="#{y1}" x2="#{x2}" y2="#{y2}">#={this.renderChildren()}#</linearGradient>';
}

var SVGStop = function(){
	BaseView.call(this,null);
	this.template = '<stop offset="#{offset}" style="stop-color:##{color};stop-opacity:#{opacity};"/>';
}

var SVGRect = function(){
	BaseView.call(this,null);
	this.template = '<rect style="fill: url(##{bgColorId});" x="#{x}" y="#{y}" width="#{width}" height="#{height}"/>';
}

var SVGText = function(){
	BaseView.call(this,null);
	this.template = '<text title="#{title}" style="font-size: #{fontSize}pt; fill: #{fontColor};" x="#{x}" y="#{y}">#{text}</text>';
}

var SVGG = function(){
	BaseView.call(this,null);
	this.template = '<g transform="#{transform}" x="#{x}" y="#{y}" ex="#{ex}" ey="#{ey}" type="#{type}" data-options=\'{"leaf":#{leaf},"consume":#{consume},"storageTypeText":"#{storageTypeText}","main":#{main},"beginDate":"#{beginDate}","endDate":"#{endDate}"}\'>#={this.renderChildren()}#</g>';
}

var SVGCircle = function(){
	BaseView.call(this,null);
	this.template = '<circle id="#{id}" cx="#{cx}" cy="#{cy}" r="#{r}" stroke-width="0" fill="#{fill}"/>';
}

/**
 * 日期砖块对象
 * @name DateBrick
 * @params  params:{'width":10,"height":10,"top":10,"left":10...}
 * @params  data:{label:"2013",text:"1",batch:"10.00",yield:30000,boxs:[1,1,1,2,1,1,2,1,1,1,1,1,2]}
 */
var DateBrick = function(params,data){
	this.width = params.width;
	this.height = params.height;
	this.top = params.top;
	this.left = params.left;
	this.bgColor = params.bgColor;
	this.data = data;
	this.text = params.text;
	this.index = params.index;
	this.hasTop = (params.hasTop == null ? true : params.hasTop);
	this.hasLeft = (params.hasLeft == null ? true : params.hasLeft);
	this.hasRight = (params.hasRight == null ? true : params.hasRight);
	this.hasBottom = (params.hasBottom == null ? true : params.hasBottom);
}
/**
 * 渲染日期砖块对象
 * @name render
 * @constructor
 * @return html
 */
DateBrick.prototype.render = function(){
	var style = 'width:'+this.width+'px;height:'+this.height+'px;top:'+this.top+'px;left:'+(this.left)+'px;text-align:center;position:absolute; line-height:'+this.height+'px;';
	if(this.hasTop){ style += 'border-top:1px solid #738790;'; }
	if(this.hasLeft){ style += 'border-left:1px solid #738790;'; }
	if(this.hasRight){ style += 'border-right:1px solid #374e63;'; }
	if(this.hasBottom){ style += 'border-bottom:1px solid #374e63;'; }
	var html= '<div x="'+this.left+'" w="'+this.width+'" parentLabel="'+this.data.parentLabel+'" batch="'+this.data.batch+'" yield="'+this.data.yield+'" index="'+this.index+'" style="'+style+'">'+this.text+'</div>';
	return html
}
/**
 * 角色砖块对象
 * @name RoleBrick
 * @params  params:{"width":10,"height":10...}
 * @params  data:{roleCode:"8",text:"8",box:8,use:31}
 */
var RoleBrick = function(params,data){
	this.width = params.width;
	this.height = params.height;
	this.bgColor = params.bgColor;
	this.data = data;
	this.text = params.text;
	this.index = params.index;
	this.hasTop = (params.hasTop == null ? true : params.hasTop);
	this.hasLeft = (params.hasLeft == null ? false : params.hasLeft);
	this.hasRight = (params.hasRight == null ? false : params.hasRight);
	this.hasBottom = (params.hasBottom == null ? true : params.hasBottom);
}
/**
 * 渲染角色砖块对象
 * @name render
 * @constructor
 * @return html
 */
RoleBrick.prototype.render = function(){
	var style = 'height:'+this.height+'px;line-height:'+this.height+'px;padding-left: 20px;cursor: pointer;';
	if(this.width != null && this.width != "undefined"){
		style += 'width:'+this.width+'px;'
	}
	if(this.hasTop){ style += 'border-top:1px solid #ffffff;'; }
	if(this.hasLeft){ style += 'border-left:1px solid #ffffff;'; }
	if(this.hasRight){ style += 'border-right:1px solid #ffffff;'; }
	if(this.hasBottom){ style += 'border-bottom:1px solid #d6d6d6;'; }
	if(this.text == null || this.text == undefined){
		this.text = "角色"+this.data.roleCode+"，"+this.data.box+"箱，"+this.data.use+"个月";
	}
	var roleCode = this.data != null ? this.data.roleCode : 0;
	var html= '<div roleCode="'+roleCode+'" index="'+this.index+'" style="'+style+'">'+this.text+'</div>';
	return html
}
/**
 * 烟叶砖块对象
 * @name RoleBrick
 * @params  params:{"width":10,"height":10...}
 * @params  data:{roleCode:"8",text:"8",box:8,use:31,rows:1}
 */
var LeafBrick = function(params,data){
	this.width = params.width;
	this.height = params.height;
	this.top = params.top;
	this.left = params.left;
	this.data = data;
	this.bgColorId = params.bgColorId;
	this.fontColor = params.fontColor == null ? "#fff" : params.fontColor;
	this.fontSize = params.fontSize == null ? "10pt" : params.fontSize;
	this.index = params.index;
}
/**
 * 渲染烟叶砖块对象
 * @name render
 * @constructor
 * @return html
 */
LeafBrick.prototype.render = function(){
	var g = new SVGG();
	g.options = {
		"transform":"translate("+this.left+","+this.top+")",
		"x":this.left,
		"y":this.top,
		"w":this.width,
		"ex":this.left+this.width,
		"h":this.height,
		"ey":this.top+this.height,
		"type":this.data.type,
		"leaf":$.toJSON(this.data.leaf),
		"consume":this.data.consume,
		"storageTypeText":this.data.storageTypeText,
		"main":this.data.main,
		"beginDate":this.data.beginDate,
		"endDate":this.data.endDate
	}
	
	var rect = new SVGRect();
	rect.options = {
		"x":0,
		"y":0,
		"width":this.width,
		"height":this.height,
		"bgColorId":this.bgColorId
	}
	g.children.push(rect.render());
	
	var label = this.data.leaf.leafName + "("+this.data.leafYear+")";
	var text = new SVGText();
	 text.options = {
		"title":label,
		"text":label,
		"x":0,
		"y":this.height/2+5,
		"fontColor":this.fontColor,
		"fontSize":this.fontSize
	}
	g.children.push(text.render());
	return g.render();
}


