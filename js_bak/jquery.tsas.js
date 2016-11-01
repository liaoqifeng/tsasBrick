
(function($){
	
	$.tsas = {
		version:"v1.0",
		displayNum:0,//显示第几个砖块
		displayCount:0,//显示砖块数
		trademarkCode:0,//当前配方牌号代码
		beginDate:'',//开始时间
		endDate:'',//结束时间
		type:'',//配方类型
		step:0,//砖块步长
		brickHeight:20,//砖块高度
		colors:{
			main:"01d4d4",//主料烟颜色
			mainDiffYears:"e89050",//主料烟年份不同颜色
			sub:"bbd789",//替代烟颜色 
			history:"a7a7a7",//历史烟颜色
			send:"66CC00"//已发送烟叶颜色
		},
		brickTypeIds:{
			main:"1",
			mainDiffYears:"2",
			sub:"3",
			history:"4",
			send:"5"
		},
		brickColorIdPrefix:"brick_color_",
		brickColorMap:null,
		svgBox : null
	}
	$.extend($.fn, {
		tsasBrick: function(setting) {
			var ps = $.extend({
				data:data1,
				boxes:{
					mainBox:$("#mainBox"),
					dateBox:$("#dateBox"),
					roleBox:$("#roleBox"),
					brickBox:$("#brickBox")
				},
				panels: {
					datePanel:$("#datePanel"),
					rolePanel:$("#rolePanel"),
					brickPanel:$("#brickPanel")
				},
				labels:{
					batchLabel:$("#batchLabel"),
					yieldLabel:$("#yieldLabel"),
					dateLabel:$("#dateLabel")
				},
				buttons:{
					colorPickerButton:$("#colorPickerButton")
				},
				templates:{
					insertBrick:{
						id:$("#insertBrickTemplate"),
						tabs:{
							leafTab:"#leafTab",
							bundleTab:"#bundleTab",
							qualityTab:"#qualityTab",
							leafUseTab:"#leafUseTab"
						},
						submitButton:""
					},
					brickInfo:$("#brickInfoTemplate"),
					brickProperty:{
						id:$("#brickPropertyTemplate"),
						submitButton:"#submitPropertyButton"
					},
					brickLock:{
						id:$("#brickLockTemplate"),
						tabs:{
							otherUseTab:"#otherUseTab"
						},
						submitButton:"#submitLockButton"
					},
					brickDelete:{
						id:$("#brickDeleteTemplate"),
						tabs:{
							leafUseTab:"#leafUseTab"
						},
						form:{
							startDate:"#txtStartDate"
						},
						submitButton:"#submitDeleteButton"
					}
				}
			}, setting);
			ps.boxes.dateBox = (typeof ps.boxes.dateBox == 'string' ? $(ps.boxes.dateBox) : ps.boxes.dateBox);
			ps.boxes.roleBox = (typeof ps.boxes.roleBox == 'string' ? $(ps.boxes.roleBox) : ps.boxes.roleBox);
			ps.boxes.brickBox = (typeof ps.boxes.brickBox == 'string' ? $(ps.boxes.brickBox) : ps.boxes.brickBox);
			ps.panels.datePanel = (typeof ps.panels.datePanel == 'string' ? $(ps.panels.datePanel) : ps.panels.datePanel);
			ps.panels.rolePanel = (typeof ps.panels.rolePanel == 'string' ? $(ps.panels.rolePanel) : ps.panels.rolePanel);
			ps.panels.brickPanel = (typeof ps.panels.brickPanel == 'string' ? $(ps.panels.brickPanel) : ps.panels.brickPanel);
			
			$.tsas.displayNum = ps.data.displayNum;
			$.tsas.displayCount = ps.data.displayCount;
			$.tsas.trademarkCode = ps.data.trademarkCode;
			$.tsas.beginDate = ps.data.beginDate;
			$.tsas.endDate = ps.data.endDate;
			$.tsas.type = ps.data.type;
			
			$.fn.initDatePanel(ps);//初始化日期面板
			
			$.fn.setCornerLabel(ps);
			
			$.fn.initRolePanel(ps);
			
			$.fn.initBrickPanel(ps);//初始化砖块面板
			
			$.fn.bindEvent(ps);
		},
		initDatePanel: function(setting){
			var $mainBox = setting.boxes.mainBox;
			var $dateBox = setting.boxes.dateBox;
			var $brickBox = setting.boxes.brickBox;
			var $datePanel = setting.panels.datePanel;
			var $brickPanel = setting.panels.brickPanel;
			$.tsas.step = ($dateBox.width() / $.tsas.displayCount).toFixed(2);//砖块步长,必须截取小数点位数,不然会存在砖块像素误差
			
			var dateArray = setting.data.dateInfoVOs;
			if(dateArray != null && dateArray.length > 0){
				var bw = dateArray.length * $.tsas.step;
				var bh = $datePanel.height()-5;
				$datePanel.width(bw);//初始化日期面板宽度
				$.BindingUtils.bindCss($brickPanel,"width",$datePanel,"width");//绑定砖块面板的宽度与日期面板宽度一致
				
				var dataBriks = "";
				for(var i=0;i<dateArray.length;i++){
					var dateBrick = new DateBrick({//日期砖块
						"width":$.tsas.step-2,"height":bh/3-1,"top":0,"left":i*$.tsas.step,"text":dateArray[i].label,"hasTop":false,"index":i
					},dateArray[i]);
					dataBriks += dateBrick.render();
					var batchBrick = new DateBrick({//批次砖块
						"width":$.tsas.step-2,"height":bh/3-1,"top":bh/3,"left":i*$.tsas.step,"text":dateArray[i].batch,"index":i
					},dateArray[i]);
					dataBriks += batchBrick.render();
					var yieldBrick = new DateBrick({//产量砖块
						"width":$.tsas.step-2,"height":bh/3-1,"top":bh/3*2,"left":i*$.tsas.step,"text":dateArray[i].output,"hasBottom":false,"index":i
					},dateArray[i]);
					dataBriks += yieldBrick.render();
				}
				$datePanel.append(dataBriks);
				if($.tsas.displayNum + $.tsas.displayCount >  dateArray.length){
					$.tsas.displayNum = 0;
				}
				$dateBox.scrollLeft($.tsas.displayNum * $.tsas.step);
				
				
				$datePanel.dragDateRange(setting);
			}else{
				$.MsgUtils.log("日期数据不能为空!");
			}
		},
		dragRect : function(callback){
			var $this = $(this);
			var range = {
                drag: function(e) {
					var d = e.data;
					var x = e.pageX - $this.offset().left + $this.scrollLeft();
					var y = e.pageY - $this.offset().top;
					var t = y - d.sy > 0 ? d.sy : y;
					var l = x - d.sx > 0 ? d.sx : x;
					var w = Math.abs(x - d.sx);
					var h = Math.abs(y - d.sy);
					d.r.width(w);
					d.r.height(h);
					d.r.css({"top":t,"left":l});
					if(x - d.sx == 0 ) {d.r.width(0); d.r.css({"left":d.sx});}
					if(y - d.sy == 0 ) {d.r.height(0); d.r.css({"top":d.sy});}
					d.x = x;
					d.y = y;
                },
                drop: function(e) {
                	var d = e.data;
                	if(callback){
                		callback(e,$this);
                	}
                	$this.unbind('mousemove', range.drag).unbind('mouseup', range.drop).unbind('mouseleave', range.drop);
                }
            };
			$this.mousedown(function(e){
				var x = e.pageX - $this.offset().left + $this.scrollLeft();
				var y = e.pageY - $this.offset().top;
				var r = $('<div style="position:absolute;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background-color:#F7F7BA;left:'+x+'px;top:'+y+'px;"></div>');
				$this.append(r);
				var d = { sx:x, sy:y, x:x, y:y, r:r};
				$this.bind("mousemove",d,range.drag).bind('mouseup', d, range.drop).bind('mouseleave', d, range.drop);
			});
		},
		dragDateRange:function(setting){
			$(this).dragRect(function(rs,obj){
				var d = rs.data;
            	var l = d.r.position().left;
            	var w = d.r.width();
            
            	var start_index = parseInt(l / $.tsas.step);
            	var end_index = parseInt((l + w) / $.tsas.step);
            	
            	//var data = setting.data;
            	setting.data.displayNum = start_index;
            	setting.data.displayCount = end_index - start_index + 1;
            	//$datePanel.find("div")
            	//alert(setting.data.displayNum);
            	$.fn.clearAllPanel(setting);
            	$.fn.tsasBrick();
            	
            	d.r.remove();
			});
		},
		setCornerLabel:function(setting){
			var $batchLabel = setting.labels.batchLabel;
			var $yieldLabel = setting.labels.yieldLabel;
			var dateArray = setting.data.dateInfoVOs;
			if(dateArray != null && dateArray.length > 0){
				var d = dateArray[$.tsas.displayNum];
				$batchLabel.text(d.batch);
				$yieldLabel.text(d.output);
			}
		},
		initRolePanel: function(setting){
			var roleArray = setting.data.dateInfoVOs[$.tsas.displayNum].counts;
			var $rolePanel = setting.panels.rolePanel.empty();
			var $brickPanel = setting.panels.brickPanel;
			var roleBricks = "";
			if(roleArray != null && roleArray.length > 0){
				var sumBox = 0;
				for(var i=0;i<roleArray.length;i++){
					var d = roleArray[i];
					var roleBrick = new RoleBrick({"height":$.tsas.brickHeight,"index":i},d);
					roleBricks += roleBrick.render();
					sumBox += d.box;
				}
				var text = "总计："+sumBox+"箱";
				var roleSumBrick = new RoleBrick({"height":$.tsas.brickHeight+1,"hasBottom":false,"index":roleArray.length,"text":text},null);
				roleBricks += roleSumBrick.render();
				$rolePanel.append(roleBricks);
				
				$.BindingUtils.bindCss($brickPanel,"height",$rolePanel,"height");
			}else{
				$.MsgUtils.log("角色数据不能为空!");
			}
		},
		resetRolePanel: function(setting){
			var roleArray = setting.data.dateInfoVOs[$.tsas.displayNum].counts;
			var $rolePanel = setting.panels.rolePanel;
			var $brickPanel = setting.panels.brickPanel;
			
			var roleBricks = $rolePanel.find("div:not(:last)");
			if(roleArray != null && roleArray.length > 0){
				var sumBox = 0;
				var addChilds = "";
				for(var i=0;i<roleArray.length;i++){
					var d = roleArray[i];
					
					if(roleBricks.eq(i).attr("roleCode") != null && roleBricks.eq(i).attr("roleCode") != undefined){
						roleBricks.eq(i).text("角色"+d.roleCode+"，"+d.box+"箱，"+d.use+"个月");
					}else{
						var roleBrick = new RoleBrick({"height":$.tsas.brickHeight*d.box,"index":i},d);
						addChilds += roleBrick.render();
					}
					sumBox += d.box;
				}
				var text = "总计："+sumBox+"箱";
				var $last = $rolePanel.find("div:last").text(text);
				if(addChilds != "")
					$last.prepend(addChilds);
			}else{
				$.MsgUtils.log("角色数据不能为空!");
			}
		},
		bindDrag:function(setting){
			var $dateBox = setting.boxes.dateBox;
			var $datePanel = setting.panels.datePanel;
			var $brickBox = setting.boxes.brickBox;
			var $brickPanel = setting.panels.brickPanel;
			var $roleBox = setting.boxes.roleBox;
			var $mainBox = $(this);
			
			var point = {x:0,y:0};
			var movePoint = 0;
			var boxEvent = {
                drag: function(e) {
					var px = $brickBox.scrollLeft() + point.x - e.pageX;
					var py = $brickBox.scrollTop() + e.pageY - point.y;
					point.x = e.pageX;
					point.y = e.pageY;
					
					$brickBox.scrollLeft(px);
					$dateBox.scrollLeft(px);
					$brickBox.scrollTop(py);
					$roleBox.scrollTop(py);
					if ($dateBox.scrollLeft() > ($datePanel.width()-$mainBox.width())){
						$dateBox.scrollLeft(($datePanel.width()-$mainBox.width()));
						$brickBox.scrollLeft(($datePanel.width()-$mainBox.width()));
					}
					
					//movePoint = point.x - e.offsetX;
					var c = $dateBox.getDateInfo(setting);
					$.tsas.displayNum = parseInt(c[0].attr("index"));
					setting.labels.dateLabel.text(c[0].attr("parentLabel"));
					$.fn.setCornerLabel(setting);
					$.fn.resetRolePanel(setting);
                },
                drop: function(e) {
					var brick = null;
					var c = $dateBox.getDateInfo(setting);
					var n = $dateBox.getNextDateInfo(setting);
					var i = null;
					if(c != null && n != null){
						var left = $dateBox.scrollLeft();
						if((left - parseFloat(c[0].attr("x"))) >= (parseFloat(n[0].attr("x")) - left)){
							brick = n[0];
						}else{
							brick = c[0];
						}
						i = parseInt(brick.attr("index"));
						var left = parseFloat(brick.attr("x"));
						$dateBox.scrollLeft(left);
						$brickBox.scrollLeft(left);
					}
					$.tsas.displayNum = i;
					setting.labels.dateLabel.text(brick.attr("label"));
					$.fn.setCornerLabel(setting);
					$.fn.resetRolePanel(setting);
					$brickBox.resetBrickPanel(setting);
                    $brickBox.css({"cursor":"default","filter":"alpha(opacity=100);","-moz-opacity":"1","opacity":"1" }).unbind('mousemove', boxEvent.drag).unbind('mouseup', boxEvent.drop).unbind('mouseout', boxEvent.drop);
                }
            };
			
			$brickBox.mousedown(function(e){
				if(e.which == 3) return false;
				$(".context-menu","body").remove();
				var $this = $(this).css({"cursor":"move","filter":"alpha(opacity=50);","-moz-opacity":"0.5","opacity":"0.5" });
				point.x = parseInt(e.pageX);
				point.y = parseInt(e.pageY);
				$this.bind("mousemove",null,boxEvent.drag).bind('mouseup', null, boxEvent.drop).bind('mouseleave', null, boxEvent.drop);
			});
		},
		getDateInfo: function(setting){
			var $dateBox = $(this);
			var $datePanel = setting.panels.datePanel;
			var s = parseInt($dateBox.scrollLeft()/$.tsas.step);
			var start_index = s * 3;
			var dateBrick = $datePanel.find("div:eq("+start_index+")");
			var batchBrick = $datePanel.find("div:eq("+(start_index+1)+")");
			var yieldBrick = $datePanel.find("div:eq("+(start_index+2)+")");
			return [dateBrick,batchBrick,yieldBrick];
		},
		getNextDateInfo: function(setting){
			var $dateBox = $(this);
			var $datePanel = setting.panels.datePanel;
			var s = parseInt($dateBox.scrollLeft()/$.tsas.step);
			var start_index = s * 3 + 3;
			var dateBrick = $datePanel.find("div:eq("+start_index+")");
			var batchBrick = $datePanel.find("div:eq("+(start_index+1)+")");
			var yieldBrick = $datePanel.find("div:eq("+(start_index+2)+")");
			return [dateBrick,batchBrick,yieldBrick];
		},
		initBrickPanel: function(setting){
			var $dateBox = setting.boxes.dateBox;
			var $datePanel = setting.panels.datePanel;
			var $brickBox = setting.boxes.brickBox;
			var $brickPanel = setting.panels.brickPanel;
			var $mainBox = setting.boxes.mainBox;
			var brickArray = setting.data.roleBricks;
			
			$mainBox.bindDrag(setting);//绑定拖拽事件
			if(brickArray == null){
				$.MsgUtils.log("烟叶砖块数据不能为空!");
				return false;
			}
			
			var view = new SVGView();
			
			$.fn.initBrickColor();
			$.fn.initSvgDefs(view);
			view.renderDefinitions();
			
			var top = 1;
			for(var i=0;i<brickArray.length;i++){
				var roleCode = brickArray[i].roleCode;
				var h = $.tsas.brickHeight + 1;
				var roles = brickArray[i].bricks;
				if(roles == null || roles.length <= 0)
					continue;
				for(var j=0;j<roles.length;j++){
					var d = roles[j];
					var sx = parseFloat(d.beginPosition) * $.tsas.step;
					sx = j == 0 ? sx : sx+1;
					var ex = parseFloat(d.endPosition) * $.tsas.step;
					var w = ex - sx;
					var brick = new LeafBrick({"width":w,"height":h,"top":top,"left":sx,"bgColorId":$.tsas.brickColorIdPrefix+d.type,"fontColor":"#000","fontSize":"10pt"},d);
					var b = brick.render();
					
					view.children.push(b);
				}
				top += $.tsas.brickHeight +2;
			}
			$brickPanel.append(view.render());
			$brickBox.scrollLeft($.tsas.displayNum * $.tsas.step);
			
			$brickBox.animateEffect();
			
			$brickPanel.find("g").contextMenu({
				data:[{"value":1,"text":"烟叶信息"},{"value":2,"text":"修改烟叶属性"},{"value":3,"text":"锁定烟叶"},{"value":4,"text":"插入烟叶(在选择烟叶前)"},{"value":5,"text":"插入烟叶(在选择烟叶后)"},{"value":6,"text":"抢用烟叶"},{"value":7,"text":"删除烟叶"}],
				callback:function(v,t){
					switch(v){
						case 1:
						  	setting.templates.brickInfo.renderBrickInfoPanel(setting);
						  	break;
						case 2:
						  	setting.templates.brickProperty.id.renderBrickPropertyPanel(setting);
						  	break;
						case 3:
						  	setting.templates.brickLock.id.renderBrickLockPanel(setting);
						  	break;
						case 4:
						  	setting.templates.insertBrick.id.renderInsertBrickPanel(setting);
						  	break;
						case 5:
						  	setting.templates.insertBrick.id.renderInsertBrickPanel(setting);
						  	break;
						case 6:
						  	setting.templates.insertBrick.id.renderInsertBrickPanel(setting);
						  	break;
						default:
							setting.templates.brickDelete.id.renderBrickDeletePanel(setting);
					}
				}
			});
			/*$brickPanel.find("g").click(function(){
				var $g = $(this);
				var $b = $g.children(":first");
				var $t = $g.children(":last");
				var x = $g.attr("x");
				var y = $g.attr("y");
				var count = 0;
				var timer = window.setInterval(function(){
					count++;
					if(count == 100){
						window.clearInterval(timer);
						$g.remove();
						return false;
					}
					$g.attr("transform","translate("+x+","+y+") scale("+(100-count)/100+","+1+")");
				},10)
			});*/
		},
		resetBrickPanel: function(setting){
			var $brickBox = $(this);
			var $brickPanel = setting.panels.brickPanel;
			var bricks = $brickPanel.find("g");
			if(bricks != null && bricks.length > 0){
				var left = $brickBox.scrollLeft();
				for(var i=0;i<bricks.length;i++){
					var brick = bricks.eq(i);
					var text = brick.find("text");
					var beginPosition = parseFloat(brick.attr("x"));
					var endPosition = parseFloat(brick.attr("ex"));
					var w2 = parseFloat(brick[0].querySelector("text").getBBox().width);
					
					if(left >= beginPosition && left <= endPosition){
						text.attr("x",left-beginPosition);
						var title = text.attr("title");
						var len = parseInt((endPosition-left) / 13);
						var substr = title.substr(0,len);
						if(substr == title){
							text.text(title);
						}else if(substr == ""){
							if((endPosition-(left-beginPosition)) < 10){
								text.text("");
							}else{
								text.text("..");
							}
						}else{
							text.text(substr+"...");
						}
					}else{
						text.attr("x",0);
					}
				}
			}
		},
		renderBrickInfoPanel : function(setting){
			$.overlay();
			var $this = $(this);
			$this.tmpl({"leaf":{"code":"1234","name":"河南C挑"}}).prependTo("body").find(":button.cancel").click(function(){
				$.removeOverlay();
				$(this).closest(".dialog").remove();
			});
		},
		renderBrickPropertyPanel : function(setting){
			$.overlay();
			var $this = $(this);
			$this.tmpl({"leaf":{"code":"1234","name":"河南C挑"}}).prependTo("body").find(":button.cancel").click(function(){
				$.removeOverlay();
				$(this).closest(".dialog").remove();
			});
		},
		renderBrickLockPanel : function(setting){
			$.overlay();
			var $this = $(this);
			$this.tmpl({"leaf":{"code":"1234","name":"河南C挑"}}).prependTo("body").find(":button.cancel").click(function(){
				$.removeOverlay();
				$(this).closest(".dialog").remove();
			});
			
			var $otherUseTab = $(setting.templates.brickLock.tabs.otherUseTab);
		    $otherUseTab.datagrid({
				idField:'id',
				treeField:'name',
				pagination:false,
				width:'auto',
				height:200,
				columns:[[
					{title:'配方牌号',field:'id',align:'center',width:'110'},
					{title:'开始时间',field:'name',align:'center',width:'110'},
					{title:'结束时间',field:'name',align:'center',width:'110'},
					{title:'使用量',field:'name',align:'center',width:'110'},
					{title:'是否锁定',field:'name',align:'center',width:'110'}
				]],
				loadMsg:"正在加载,请等待..."
			});
		},
		renderInsertBrickPanel : function(setting){
			$.overlay();
			var $this = $(this);
			$this.tmpl(null).prependTo("body").find(":button.cancel").click(function(){
				$.removeOverlay();
				$(this).closest(".dialog").remove();
			});
			var $leafTab = $(setting.templates.insertBrick.tabs.leafTab);
			$leafTab.datagrid({
				idField:'id',
				treeField:'name',
				pagination:true,
				width:'auto',
				height:260,
				columns:[[
					{title:'烟叶产地',field:'id',align:'center',width:'70'},
					{title:'烟叶类别',field:'name',align:'center',width:'70'},
					{title:'烟叶等级',field:'image',align:'center',width:'70'},
					{title:'烟叶形态',field:'url',align:'center',width:'70'},
					{title:'烟叶年份',field:'orderList',align:'center',width:'70'},
					{title:'锁定数量',field:'operator',align:'center',width:'70'},
					{title:'未锁定数量',field:'operator',align:'center',width:'90'},
					{title:'重量',field:'operator',align:'center',width:'70'},
					{title:'库存类型',field:'operator',align:'center',width:'90'}
				]],
				pageNumber:1,
				pageSize:20,
				loadMsg:"正在加载,请等待..."
			});
			$leafTab.datagrid('getPager').pagination({
		        pageSize: 20,
		        pageList: [10,20,30,50,100], 
		        beforePageText: '第',
		        afterPageText: '页    共 {pages} 页',  
		        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
		    });
		    
		    var $bundleTab = $(setting.templates.insertBrick.tabs.bundleTab);
		    $bundleTab.datagrid({
				idField:'id',
				treeField:'name',
				pagination:false,
				width:'auto',
				height:120,
				columns:[[
					{title:'把烟信息',field:'id',align:'center',width:'140'},
					{title:'把烟比例',field:'name',align:'center',width:'100'}
				]],
				loadMsg:"正在加载,请等待..."
			});
			var $qualityTab = $(setting.templates.insertBrick.tabs.qualityTab);
		    $qualityTab.datagrid({
				idField:'id',
				treeField:'name',
				pagination:false,
				width:'auto',
				height:125,
				columns:[[
					{title:'质量名称',field:'id',align:'center',width:'140'},
					{title:'质量值',field:'name',align:'center',width:'100'}
				]],
				loadMsg:"正在加载,请等待..."
			});
			var $leafUseTab = $(setting.templates.insertBrick.tabs.leafUseTab);
		    $leafUseTab.datagrid({
				idField:'id',
				treeField:'name',
				pagination:false,
				width:'auto',
				height:145,
				columns:[[
					{title:'配方牌号',field:'id',align:'center',width:'140'},
					{title:'开始日期',field:'name',align:'center',width:'140'},
					{title:'结束日期',field:'name',align:'center',width:'140'},
					{title:'使用量',field:'name',align:'center',width:'140'},
					{title:'是否锁定',field:'name',align:'center',width:'110'}
				]],
				loadMsg:"正在加载,请等待..."
			});
		},
		renderBrickDeletePanel : function(setting){
			$.overlay();
			var $this = $(this);
			$this.tmpl({"leaf":{"code":"1234","name":"河南C挑"}}).prependTo("body").find(":button.cancel").click(function(){
				$.removeOverlay();
				$(this).closest(".dialog").remove();
			});
			var d = [{"id":1,"ksrq":"2014-09-01","jsrq":"2014-09-30","syl":100,"sfsd":"是"}];
			var $txtStartDate = $(setting.templates.brickDelete.form.startDate).datetimebox();
			var $leafUseTab = $(setting.templates.brickDelete.tabs.leafUseTab);
		    $leafUseTab.datagrid({
		    	data:d,
				idField:'id',
				treeField:'name',
				pagination:false,
				width:'auto',
				height:145,
				columns:[[
					{title:'配方牌号',field:'id',align:'center',width:'100'},
					{title:'开始日期',field:'ksrq',align:'center',width:'120'},
					{title:'结束日期',field:'jsrq',align:'center',width:'120'},
					{title:'使用量',field:'syl',align:'center',width:'100'},
					{title:'是否锁定',field:'sfsd',align:'center',width:'100'}
				]],
				loadMsg:"正在加载,请等待..."
			});
		},
		animateEffect : function(){
			var $this = $(this);
			//var $animateLayer = $('<div id="animateLayer" style="width:100%;height:100%;position: absolute;background-color:#abc123;z-index:10000;">&nbsp;</div>').prependTo($this);
		},
		initBrickColor : function(){
			var colorMap = new HashMap();
			colorMap.put($.tsas.brickColorIdPrefix+$.tsas.brickTypeIds.main,$.tsas.colors.main);
			colorMap.put($.tsas.brickColorIdPrefix+$.tsas.brickTypeIds.mainDiffYears,$.tsas.colors.mainDiffYears);
			colorMap.put($.tsas.brickColorIdPrefix+$.tsas.brickTypeIds.sub,$.tsas.colors.sub);
			colorMap.put($.tsas.brickColorIdPrefix+$.tsas.brickTypeIds.history,$.tsas.colors.history);
			colorMap.put($.tsas.brickColorIdPrefix+$.tsas.brickTypeIds.send,$.tsas.colors.send);
			
			$.tsas.brickColorMap = colorMap;
		},
		initSvgDefs : function(view){
			var $this = $(this);
			var colorMap = $.tsas.brickColorMap;
			var defs = $.SvgUtils.T("defs");
			if(colorMap != null && colorMap.size() > 0){
				for(var i=1;i<=colorMap.size();i++){
					var key = $.tsas.brickColorIdPrefix+i;
					var color = colorMap.get(key);
					var color1 = $.ColorUtils.adjustBrightness2("0x"+color,80);
					var linearGradient = new SVGLinearGradient();
					linearGradient.options = {id:key,x1:"0%",y1:"0%",x2:"0%",y2:"100%"}
					
					var stop1 = new SVGStop();
					stop1.options = { offset:"10%", color:color1, opacity:1 }
					var stop2 = new SVGStop();
					stop2.options = { offset:"100%", color:color, opacity:1 }
					linearGradient.children.push(stop1.render());
					linearGradient.children.push(stop2.render());
					//linearGradient.renderChildren();
					view.definitions.push(linearGradient.render());
					/*var linearGradient = $.SvgUtils.T("linearGradient").attr({id:key,x1:"0%",y1:"0%",x2:"0%",y2:"100%"})
					.append($.SvgUtils.T("stop").attr({offset:"10%",style:"stop-color:#"+color1+"; stop-opacity:1"}))
					.append($.SvgUtils.T("stop").attr({offset:"100%",style:"stop-color:#"+color+"; stop-opacity:1"}));
					defs.append(linearGradient);*/
				}
			}
			$this.append(defs);
		},
		clearAllPanel: function(setting){
			setting.panels.datePanel.empty();
			setting.panels.brickPanel.empty();
			setting.panels.rolePanel.empty();
			
		},
		bindEvent: function(setting){
			setting.buttons.colorPickerButton.changeColor();
		},
		changeColor: function(setting){
			var $this = $(this);
			$this.click(function(){
				var $this = $(this);
				var $body = $("body");
				var masklayer = "<div class='masklayer'></div>";
				$body.prepend(masklayer);
				var colorMap = $.tsas.brickColorMap;
				var html = '<div class="dialog"><div class="title">颜色选择</div><div class="colorChange"><table>';
				html += '<tr><td style="height:40px;width:170px;"><b>主料烟叶:</b></td><td><div id="picker_'+($.tsas.brickColorIdPrefix+1)+'" class="colorPicker" style="float:left;background-color:#'+colorMap.get($.tsas.brickColorIdPrefix+1)+'" data-color="'+colorMap.get($.tsas.brickColorIdPrefix+1)+'"><img src="./images/colorPicker.png" /></div></td></tr>';
				html += '<tr><td style="height:40px;width:170px;"><b>主料烟叶(年份不同):</b></td><td><div id="picker_'+($.tsas.brickColorIdPrefix+2)+'" class="colorPicker" style="float:left;background-color:#'+colorMap.get($.tsas.brickColorIdPrefix+2)+'" data-color="'+colorMap.get($.tsas.brickColorIdPrefix+2)+'"><img src="./images/colorPicker.png" /></div></td></tr>';
				html += '<tr><td style="height:40px;width:170px;"><b>替代烟叶:</b></td><td><div id="picker_'+($.tsas.brickColorIdPrefix+3)+'" class="colorPicker" style="float:left;background-color:#'+colorMap.get($.tsas.brickColorIdPrefix+3)+'" data-color="'+colorMap.get($.tsas.brickColorIdPrefix+3)+'"><img src="./images/colorPicker.png"/></div></td></tr>';
				html += '<tr><td style="height:40px;width:170px;"><b>历史烟叶:</b></td><td><div id="picker_'+($.tsas.brickColorIdPrefix+4)+'" class="colorPicker" style="float:left;background-color:#'+colorMap.get($.tsas.brickColorIdPrefix+4)+'" data-color="'+colorMap.get($.tsas.brickColorIdPrefix+4)+'"><img src="./images/colorPicker.png"/></div></td></tr>';
				html += '<tr><td style="height:40px;" colspan="2"><input id="changeColorBotton" type="button" value=" 确  定 "/><input type="button" value=" 重  置 "/><input type="button" value=" 取  消 "/></td></tr>';
				html += '</table></div></div>';
				var $html = $(html);
				$body.prepend($html);
				$html.find("img").colorpicker({
				    fillcolor:true,
				    event:'click',
				    target:null,
				    success:function(obj,color){
				    	obj.closest("div").css("background-color",color).data("color",color.replace("#",""));
				    }
				});
				$("#changeColorBotton").click(function(){
					var colorMap = $.tsas.brickColorMap;
					if(colorMap != null && colorMap.size() > 0){
						for(var i=1;i<=colorMap.size();i++){
							var key = $.tsas.brickColorIdPrefix+i;
							var color = $("#picker_"+key).data("color");
							var color1 = $.ColorUtils.adjustBrightness2("0x"+color,80);
							var $stops = $("#"+key).find("stop");
							$stops.eq(0).css("stop-color","#"+color1);
							$stops.eq(1).css("stop-color","#"+color);
							colorMap.remove(key);
							colorMap.put(key,color);
						}
					}
				});
			});
		},
		rangeSlider : function(setting){
			var ps = $.extend({
				data:{"月":"1","季":"2","年":"3","三年":"4","五年":"5"},
				size:{
					width:250,
					height:40
				},
				count:5
			}, setting);
			var w = ps.size.width-40;
			var $slider = $('<div class="jslider"/>');
			var $bar = $('<div class="siderBar"/>').width(w).append($slider);
			if(ps.data != null){
				var step = w / ps.count;
				var pl = step/(ps.count-1);
				var html = '';
				var i = 0;
				for(var d in ps.data){
					var len = d.length - 1;
					var left = i*step;
					if(i > 0){ left += pl * i - len * 18; }
					if(i+1 == ps.count){
						html += '<span style="position: absolute;right:0px;top:-34px;cursor: pointer;" data-value="'+ps.data[d]+'">'+d+'</span>';
					}else{
						html += '<span style="position: absolute;left:'+left+'px;top:-34px;cursor: pointer;" data-value="'+ps.data[d]+'">'+d+'</span>';
					}
					i++;
				}
				$bar.append(html).find("span").click(function(){
					var len = $(this).text().length - 1;
					$slider.css("left",$(this).position().left + len * 8 + 1);
				});
			}
			var $box = $('<div class="radius"/>').width(20).height(20).css({"background-color":"blue","position":"absolute","top":10,"left":0});
			this.width(ps.size.width).append($bar);	
			var limited = {min:0,max:$bar.width()-$slider.width()}
			var evt = {
				drag: function(e) {
					var d = e.data;
					var x = e.pageX;
					var l = Math.min(Math.max(x - d.pageX + d.left, limited.min), limited.max);
					//$(this).css("left",l);
            	},
                drop: function(e) {
                	
					$(this).unbind('mousemove', evt.drag).unbind('mouseup', evt.drop);
				}
            }
			
			$slider.bind("mousedown",function(e){
				var $this = $(this);
				var d = {
                    left: parseInt($slider.css('left')),
                    pageX: e.pageX
                };
				$this.bind("mousemove",d,evt.drag).bind('mouseup', null, evt.drop).bind('mouseleave', null, evt.drop);
			});
			
		},
		initDateSelectPanel: function(setting){
			var ps = $.extend({
				count:5,
			}, setting);
			var w = this.width();
			var h = this.height() / 2 - 1;
			var current = new Date().getFullYear();
			var drawItem = function(box,type){
				var items = [];
				var index = 0;
				for(var i = 0; i < ps.count; i++){
					if(type == "year"){
						items.push('<div class="item" style="width:'+(w/ps.count-1)+'px;line-height:'+h+'px;height:'+h+'px;left:'+(i*(w/ps.count))+'px;">'+(current+i)+'</div>');
					}else{
						for(var j = 1; j <= 12; j++){
							items.push('<div class="item" style="width:'+(w/(ps.count*12)-1)+'px;line-height:'+h+'px;height:'+h+'px;left:'+(index*(w/(ps.count*12)))+'px;">'+j+'</div>');
							index++;
						}
					}
				}
				return box.replace(/#\{items\}/g,items.join(""));
			}
			var box = '<div class="box" style="height:'+(h+1)+'px">#{items}</div>';
			var $yp = $(drawItem(box,"year")).appendTo(this).dragDateSelect();
			var $mp = $(drawItem(box,"month")).appendTo(this).dragDateSelect();
			
		},
		dragDateSelect: function(e){
			$(this).dragRect(function(rs,obj){
				var d = rs.data;
                var l = d.r.position().left;
                var r = d.r.position().left + d.r.width();
                var $items = obj.find(".item");
                var w = $items.eq(0).width();
                var start_index = parseInt(l / w);
            	var end_index = parseInt(r / w);
            	$.each($items,function(i){
            		if(i >= start_index && i <= end_index){
            			var $this = $(this);
            		}
            	});
                d.r.remove();
			});
		},
		contextMenu: function(setting){
			var ps = $.extend({
				data:[{"value":1,"text":"烟叶信息"},{"value":2,"text":"删除烟叶"},{"value":3,"text":"插入烟叶"}],
				callback:null
			}, setting);
			
			this.mousedown(function(e){
				if(e.which == 3){
					var $this = $(this);
					$(".context-menu","body").remove();
					if(ps.data){
						var items = new Array();
						for(var i=0;i<ps.data.length;i++){
							var d = ps.data[i];
							items.push('<li data-value="'+d.value+'">'+d.text+'</li>');
						}
						var $menu = $('<div class="context-menu" style="left:'+e.pageX+'px;top:'+e.pageY+'px;"><ul>'+items.join("")+'</ul></div>').detach();
						$menu.prependTo("body");
						
						$menu.find("li").mousemove(function(){
							$(this).addClass("selected");
						}).mouseleave(function(){
							$(this).removeClass("selected");
						}).click(function(){
							var $li = $(this);
							if(ps.callback){
								ps.callback($li.data("value"),$li.text());
							}
							$(".context-menu","body").remove();
						});
					}
				}
			});
		}
	});
})(jQuery);