 function Audio(callback1,callback2,callback3,para){
	audioDom = document.createElement("audio");
	
	
	/*定义音乐播放的列表,playList是音乐列表，currentIndex:记录播放的索引*/
	this.playList = [];
	this.currentIndex=0;
	this.playMode=1;  //默认播放模式1  顺序播放
	
	//设置音量
	audioDom.volume=para.volume || 0.5;   //设置初始音量  play函数里面调节音量  但是这里的默认整体音量貌似没用
	//绑定事件  只需执行一次
	addEvents(callback1,callback2,callback3);
 };	
 
 
 Audio.prototype={
 	load:load,   //加载
	play:play,      //播放
	stop:stop,      //暂停
	continuePlay:continuePlay,  //继续播放
	prevOrNext:prevOrNext,  //上下曲
	add:add,      //添加歌曲
	
	isPaused:isPaused,  //是否暂停
	
	clear:clear,      //清空歌单
	remove:remove,    //移除歌曲
	
	getAudioDom:getAudioDom,  //得到播放器DOM
	getPlayMode:getPlayMode,  //得到播放模式
	setPlayMode:setPlayMode,  //设置播放模式
	getCurrentIndex:getCurrentIndex, //得到播放索引
	setCurrentIndex:setCurrentIndex, //设置播放索引
	setCurrentTime:setCurrentTime,  //设置播放时间
	
	getMusicDuration:getMusicDuration
		
}

	function getAudioDom(){
		return audioDom;
	}
	
	function play(index,callback){
		//播放音乐
		var song = this.playList[index];
		if(!this.playList){
			alert("列表为空");
			return 
		}
		
		
		if(song){
			//先暂停音乐
			this.stop();
			//重新加载
			audioDom.src = song.src;
			
			if(callback)callback(this.nowTime);   //这个回调函数用于设置currentTime 因为currentTime 要加载后，才能设置
			
			audioDom.play();
			
		}else{
			alert("!!!");
		}
	};
	
	function load(index){
		
	}


	//事件监听  
	function addEvents(callback1,callback2,callback3){
		//当播放条件满足时  读取歌曲的时长信息，并格式化
		audioDom.oncanplaythrough = function(){
			if(callback1)callback1.call(this,this.duration,getFormatTimer(this.duration));
			
		};
		
		//播放时间更新事件监听 用于进度条的每次刷新，播放时间的更新
		audioDom.ontimeupdate=function(){
			if(callback2)callback2.call(this,this.currentTime,getFormatTimer(this.currentTime));
		};
		
		//用dom0级事件注册，防止事件被多次注册，造成堆叠
		audioDom.onended=function(){
			if(callback3)callback3();
		}
	};

	/*获取格式化的分秒*/
	function getFormatTimer(timer){
		if(!timer)return "00:00";
		var m = parseInt(timer / 60,10);
		var s = parseInt(timer % 60,10);
		return (m<10?("0"+m):m)+":"+(s<10?("0"+s):s);
	};
	

	//暂停	返回暂停时间
	function stop(){
		audioDom.pause();
		return audioDom.currentTime;
	};
	
	function continuePlay(){
		audioDom.play();
	}

	
	function setCurrentTime(nowTime){
		//目前谷歌浏览器能直接这样设置
		audioDom.currentTime = nowTime;
	};
	
	function getCurrentIndex(){
		return this.currentIndex;
	}
	
	function setCurrentIndex(value){
		return this.currentIndex=value;
	}
	
	function getPlayMode(){
		return this.playMode;
	}
	
	function setPlayMode(value){
		return this.playMode=value;
	}
	
	
	
	function getMusicDuration(){
		
		return audioDom.duration;
	}
	
	
	
	

	
	/*
	 function：上一首/下一首	   
	 参数：flag  布尔值   true 下一首 false 上一首
	 * 返回值  索引
	 * */
	function prevOrNext(flag){
		//首先暂停播放
		this.stop();
		//如果歌单中没有歌直接返回
		if(this.playList.length==0)return ;	
		//如果索引值未设置 则默认从头开始播放
		if(this.currentIndex==null){
			this.setCurrentIndex(0);
			this.play(0);
		}else{
			
			var index = this.currentIndex;
			if(flag){
				//当step=1  即点击下一首时，当前歌曲如果是最后一首  则返回索引为0 ，否则索引加1
				index = (index < this.playList.length-1)?index+1:0; 
			}else{
				//当step=0  即点击上一首时，当前歌曲如果是第一首一首  则返回索引为歌单长度减一 ，否则索引减1
				index = (index >0)?index-1:this.playList.length-1; 
			}
			this.setCurrentIndex(index);
		}
		
		//返回索引 供其他函数使用
		return this.getCurrentIndex(index)
	};

	//name:歌曲的名称，src音乐播放的地址 --添加音乐方法
	function add(name,src){
		this.playList.push({name:name,src:src});
	};

	//删除音乐
	function remove(name){
		var len = this.playList.length;
		if(len==0)return;
		for(var i=0;i<len;i++){
			var pitem = this.playList[i];
			if(name==pitem.name){
				this.playList[i] = null;
				delete pitem;
				break;
			}
		}
	};
	//清空播放列表
	function clear(){
		this.playList = [];
		this.currentIndex = -1;
	};
	
	function isPaused(){
		return audioDom.paused;
	};
