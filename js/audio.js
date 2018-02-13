
				
	/*
	 * bug  说明  chrome下不能设置currentTime 不能完成快进 
	 * */
	
	var para={
		 t_time:"",  //音乐文件播放总时间
		 p_time:"",  //已播放时间
		 
		 volume:0.1,
		 isFirstPlay:true, //未播放
		 
		 musicList:[
			{songSheet:"我的歌单",name:"等你下课",src:"music/周杰伦-等你下课.mp3",author:"周杰伦"},
			{songSheet:"我的歌单",name:"刚好遇见你",src:"music/刚好遇见你.mp3",author:"李玉刚"},
		        {songSheet:"我的歌单",name:"前世情人",src:"music/前世情人.mp3",author:"周杰伦"},
			{songSheet:"我的歌单",name:"告白气球",src:"music/告白气球.mp3",author:"周杰伦"},
			{songSheet:"我的歌单",name:"稻香",src:"music/稻香.mp3",author:"周杰伦"},
		        {songSheet:"我的歌单",name:"珊瑚海",src:"music/珊瑚海.mp3",author:"周杰伦、梁心颐"}, 
			 {songSheet:"我的歌单",name:"晴天",src:"music/晴天.mp3",author:"周杰伦"},
			{songSheet:"我的歌单",name:"算什么男人",src:"music/算什么男人_周杰伦.mp3",author:"周杰伦"},
			{songSheet:"我的歌单",name:"给我一首歌的时间",src:"music/给我一首歌的时间.mp3",author:"周杰伦"},
			 {songSheet:"我的歌单",name:"简单爱（live）",src:"music/简单爱（live）.mp3",author:"周杰伦、陈奕迅"},
			  {songSheet:"我的歌单",name:"你听得到（live）",src:"music/你听得到（live）.mp3",author:"周杰伦"},
			 
		]
		 
	}

	var audio=new Audio(
		function(tTime,formatTTime){
			/*ttime  歌曲的总时间*/
			para.t_time=tTime;		
			IdDom("timer").innerHTML=formatTTime;	
			
		},function(pTimer,formatPTime){
			/*ptime 已经播放的时间*/
			para.p_time=pTimer;
			IdDom("ctimer").innerText=para.p_time;
			var percent = (para.p_time / para.t_time) * 100;
			var p = parseInt(percent)+"%";
			
			
			//进度控制相关
			IdDom("percent").style.width=percent+"%";  //底下的进度条
			document.getElementById("ctimer").innerHTML = formatPTime;
			document.getElementById("over").style.height = p;
			document.getElementById("pernum").innerHTML = p;
	},function(){
		//切换到暂停标志
		playIconTab(false);
		//播放前准备 确定索引
		beforePlay();

		setTimeout(function(){
			//切换到播放标志
			playIconTab(true);
			newPlay(true);
		},300)
		
		//页面歌曲列表
		
		
	},para);
	
	init();
	
	
	
	
	
	function init(){
		//初始化进度条
		setProgress();
		//初始化音量
		setVolume(para.volume);
		//添加音乐
		addMusic(para.musicList);  //这句要先执行
		
		//给页面设置歌曲数目
		musicCount("exlist");
		//给页面添加播放列表
		if(para.musicList.length){
			addMusicPlayList(para.musicList);
		}
		
		//初始化歌曲信息
		setMusicMsg(para.musicList[0]);
	}

	
	/*
	 名称：beforePlay
	 功能：播放前的准备，主要用于确定播放索引
	 返回值：播放索引
	 * 
	 * */
	function beforePlay(){
		//拿到当前播放索引
		var index=audio.getCurrentIndex();
		
		//拿到播放模式
		var mode =audio.getPlayMode();
		console.log(mode+"模式");
		
		if(mode==1){//顺序模式  索引加1
			//这里要做索引的值判断 不然顺序播放会越界
			index = (index < audio.playList.length-1)?index+1:0; 
		}else if(mode==2){//随机模式，索引随机
			index=rangeRandom(0,audio.playList.length-1);
		}else if(mode==3){//单曲循环模式，索引不变
			
		}
		
		//设置索引
		audio.setCurrentIndex(index);
		
		
		return audio.getCurrentIndex();
		
	}
	
	function setMusicMsg(msg){
		
		IdDom("musicMsg").querySelector(".musicName").innerText=msg.name;
		IdDom("musicMsg").querySelector(".author").innerText="演唱:"+msg.author;
		
	}
	
	
	
	function firstPlay(value){
		return (!value && value!=0)?true:false;
	}
	
	//播放  只做一件事 拿到索引播放，如果头一次播放设置一次播放
	/*
	 函数名称：newPlay
	 参数 flag  布尔值   true：表示从头开始执行（audio.play(index)） false ：表示暂停后的继续播放执行audio.continuePlay();
	 返回值 ：无
	 * 
	 * */
	
	
	
	function newPlay(flag,callback){  
		var index=audio.getCurrentIndex();
		//拿到歌曲信息
		var msg=para.musicList[index];
		//设置歌曲信息
		setMusicMsg(msg)
		//设置选中歌曲样式
		setSelect("music_list","#E13333","#1B1B1B");
		
		if(para.isFirstPlay){
			audio.play(index);
			para.isFirstPlay=false;
		}else{
			if(flag){
				
				audio.play(index);
			}else{
				audio.continuePlay();
			}
		}
		//打开播放按钮
		playIconTab(true);
		
	}
	
	/*
	 函数名称：stop()
	 功能：暂停歌曲
	 返回值 ：无
	 * 
	 * */
	function stop(){
		//调用audio.js的stop方法
		audio.stop();
		//关闭播放按钮的
		playIconTab(false);
	}
	
	/*
	 名称：playPrev
	 功能：播放上一首
	 * */
	function playPrev(_this){
		/*
		 
		 * 1  调用audio.js里面的接口
		 * 2 改变按钮状态
		 * */
		audio.prevOrNext(false);
		
		//按钮切换为播放状态  避免是由关闭直接点击下一首，按钮不能正常显示
		playIconTab(true);
		
		newPlay(true);
	}
	
	function setSelect(domName,selectColor,otherColor){
		
		var index= audio.getCurrentIndex();
		
		var childList=Array.prototype.slice.call(IdDom(domName).children);
		childList.forEach(function(value,index){
			value.style.background=otherColor;
		})
		
		IdDom(domName).childNodes[index+1].style.background=selectColor;
	}
	
	/*
	 名称：playNext
	 功能：播放上一首
	 * 
	 * */
	function playNext(_this){
		/*
		 1 调用audio.js里面的接口
		 2 改变按钮状态
		 * */
		//确定播放索引
		audio.prevOrNext(true);
		//按钮切换为播放状态  避免是由关闭直接点击下一首，按钮不能正常显示
		playIconTab(true);
		//播放
		newPlay(true);
		
	}

	/*
	名称：addMusic
            功能：    添加音乐到音乐列表中
	
	*/
	function addMusic(musicList){
		if(musicList){
			musicList.forEach(function(value,index){
				audio.add(value.songSheet,value.src);
			})
		}
	}
	
	/*
	 名称：addMusicPlayList
	 功能：在页面中生成音乐列表，并注册事件
	 * */
	function addMusicPlayList(musicList){
		if(musicList){
			musicList.forEach(function(value,index){
				//创建元素
				var liElement=document.createElement("li");
				//以后设置innerhtml就用这种形式
				liElement.innerHTML=["<a href='javascript:void(0)' class='sing_name'>"+value.name+"</a>",
									"<a href='javascript:void(0)' style='color:#FF6C00'>"+value.author+"</a>",
									"<a href='javascript:void(0)' class='fr'></a>"
				].join(" ");
				
				//添加节点
				IdDom("music_list").appendChild(liElement);
				//为节点注册事件
				IdDom("music_list").querySelectorAll("li")[index].onclick=function(){
					//设置索引
					audio.setCurrentIndex(index);
					//切换到播放按钮
					playIconTab(true);
					//播放
					newPlay(true);
					
					//
					setSelect("music_list","#E13333","#1B1B1B")
				}
			
			})
		}
	}
		
	/*
	 名称：repeat
	 功能：从头播放
	 * */
	function repeat(){
		audio.stop();
		audio.getAudioDom().currentTime=0;
		playIconTab(true);
		newPlay(true);
	}
	
	/*
	 名称：playModeTab
	 功能：实现模式切换  1 顺序播放  2 随机播放  3 单曲循环
	 参数 mode 取值 （1、2、3）
	 返回值 播放模式
	 * */
	function playModeTab(mode){
		if(mode==1){
			showHide("oder_cycle","none")
			showHide("random_cycle","inline-block")
			showHide("single_cycle","none");
			//设置播放模式
			
			IdDom("musicMsg").querySelector(".playMode").innerText="随机播放";
			audio.setPlayMode(2);
		}else if(mode==2){
			showHide("oder_cycle","none")
			showHide("random_cycle","none")
			showHide("single_cycle","inline-block")
			
			//设置播放模式
			IdDom("musicMsg").querySelector(".playMode").innerText="单曲循环";
			audio.setPlayMode(3);
		}else if(mode==3){
			showHide("oder_cycle","inline-block")
			showHide("random_cycle","none")
			showHide("single_cycle","none")
			
			//设置播放模式
			IdDom("musicMsg").querySelector(".playMode").innerText="顺序播放";
			audio.setPlayMode(1);
		}
		
		return audio.getPlayMode();
	}
	
	/*
	 名称：playIconTab
	 功能：实现按钮播放/暂停状态的切换
	 参数：playOrStop  布尔值 true 播放状态  false 暂停状态
	 
	 * 
	 * */
	function  playIconTab(playOrStop){
		if(playOrStop){  //播放状态
			showHide("play","none");
			showHide("pause","inline-block");
		}else{   //暂停状态
			showHide("play","inline-block");
			showHide("pause","none");
		}
	}
	
	
	
	function musicCount(idDom){
		IdDom(idDom).innerText=audio.playList.length;
	}

	function showHide(id,mark){
		document.getElementById(id).style.display = mark;
	}
	
	function setProgress(){
		//父元素绑定事件
		IdDom("play_rolling").addEventListener("click",function(e){
			if(!para.isFirstPlay){//如果首次还没播放就快进，我们不予处理
				var move=mousePosition(e)[0]-getElementLeft(this);
				var percent= move/ parseInt(getStyle(this).width);
				
				//设置滚动条位置
				IdDom("percent").style.width=percent*100+"%";
				
				//切换到播放状态
				playIconTab(true);
				//播放歌曲
				var duration=audio.getMusicDuration();
				audio.setCurrentTime(duration*percent);
				//暂停后  再快进 就需要继续播放
				if(audio.getAudioDom().paused)audio.continuePlay();
			}
			//得到
		},false);
	}
	
	
	function setVolume(initVolume){
		//初始音量  para.volume
		IdDom("v_percent").style.width=initVolume*100+"%";
		IdDom("v_progress").addEventListener("click",function(e){
			var move=mousePosition(e)[0]-getElementLeft(this);
			var percent= move/ parseInt(getStyle(this).width);
			
			IdDom("v_percent").style.width=percent*100+"%";
			audio.getAudioDom().volume=percent;
		})
	}
	
	function muted(flag){
		
			if(flag){
				showHide("muted","inline-block");
				showHide("unMuted","none");
			}else{
				showHide("muted","none");
				showHide("unMuted","inline-block");
			}
			audio.getAudioDom().muted= ! audio.getAudioDom().muted;
		
	}
	
	function getStyle(element){
		return element.currentStyle? element.currentStyle : window.getComputedStyle(element, null);
	}
	
	
	//得到元素的绝对位置  left
	function getElementLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualLeft;
　　}
	
	
	function mousePosition(evt){
    var xPos,yPos;         
    evt=evt || window.event;
    if(evt.pageX){         
        xPos=evt.pageX;         
        yPos=evt.pageY;     
    } else {         
        xPos=evt.clientX+document.body.scrollLeft -document.body.clientLeft;
        yPos=evt.clientY+document.body.scrollTop-document.body.clientTop;     
    }
    return [xPos, yPos];
}
	
		
		
		
	/*start -end的范围随机数  包含start值和end值 返回整数值 */
	function rangeRandom(start,end){
		if(start===end){
			return start;
		}
		return Math.floor(Math.random()*(end-start+1))+start;
	};
		
		
	function IdDom(id){
		return document.getElementById(id)
	}
		
	//列表菜单的展开或者收起
	document.getElementById("exlist").onclick = function(){
		var listDom = document.getElementsByClassName("play_list")[0];
		if(listDom .style.display=="none"){
			listDom .style.display="block";
			move(listDom,{height:507},function(){
				
			});
		}else{
			move(listDom,{height:0},function(){
				this.style.display="none";
			});
		}
	};

	//展开
	document.getElementById("expyes").onclick= function(){
		//获取音乐播放器的盒子
		var musicDoms = document.getElementsByClassName("music_box")[0];
		//音乐列表的盒子
		var listDom = document.getElementsByClassName("play_list")[0];
		//动画收起来
		move(musicDoms,{left:-560})
		move(listDom,{left:-560})
		//点击元素隐藏
		this.style.display = "none";
		//把对立面显示出来
		document.getElementById("expno").style.display = "block";
	};
		
	//收起
	document.getElementById("expno").onclick= function(){
		//获取音乐播放器的盒子
		var musicDoms = document.getElementsByClassName("music_box")[0];
		//音乐列表的盒子
		var listDom = document.getElementsByClassName("play_list")[0];
		//动画收起来
		move(musicDoms,{left:0})
		move(listDom,{left:0})
		//点击元素隐藏
		this.style.display = "none";
		//把对立面显示出来
		document.getElementById("expyes").style.display = "block";
	}

		

		

	function move(obj,json,callback){ 
		clearInterval(obj.timer);//防止用户重复执行动画
		obj.timer =  setInterval(function(){
			//标识判断是否已经循环到最后一个了
			var mark = true;
			for(var attr in json){
				attr = attr.toLowerCase();
				var val = "";
				if(attr=="opacity"){
					val = Math.round(css( obj, 'opacity' ) * 100);
				}else{
					val = parseInt(css(obj,attr));//val实时在变化
				}
	
				//计算速度 (json[k]-val) 距离 除以8计算，这段距离平均要走多少步才走完
				var speed = (json[attr]-val) / 8;//没30毫秒所走的距离.
				//取最大值，小于0去最小值 .val可能会出现小数
				speed = speed >0 ? Math.ceil(speed) : Math.floor(speed);
				if(val != json[attr]){
					mark = false;
					if(attr=="opacity"){
						obj.style.opacity = (val + speed) / 100;
						obj.style.filter = 'alpha(opacity='+ (val + speed) +')';
					}else{
						obj.style[attr] = val+speed+"px";
					}
				}
			}
	
			
			//回调函数的处理
			if(mark){
				clearInterval(obj.timer);
				if(callback)callback.call(obj);
			}
		},30);
	};

	function css(obj,attr){
		var v = obj.currentStyle ?obj.currentStyle[attr]:
		window.getComputedStyle(obj,null)[attr];
		if(v=="auto")v = 0;
		return v;
	};
