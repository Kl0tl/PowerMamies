! define(["gamescene", "gameobject", "assets", "keyboard", "mouse", "utils", "red_component", "ai_component", "hit_depth", "math", "levelData"], function (gamescene, gameobject, assets, keyboard, mouse, utils, red_component, ai_component, HIT_DEPTH, math, levelData) {

	var CANVAS = utils.$("screen")
		, CTX = CANVAS.getContext("2d")

		, BACKGROUND = utils.$("back")
		, BACK = BACKGROUND.getContext("2d")

		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height

		, RED = null

		, AUDIO_SRC = "";

	var levelData = require('levelData');

	var scene = gamescene.extend({
				"onpause": function onpause() {
					console.log("[gamescene " + scene.name + "] paused");
					RED && RED.animation.pause();
					var ctx = CTX;
					ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
 					ctx.fillRect(0, 0, WIDTH, HEIGHT);
 					ctx.fillStyle = "white";
 					ctx.font = "15pt Helvetica";
					ctx.textAlign = "center";
 					ctx.fillText("Score : " + RED.red.score, WIDTH/2, HEIGHT/2);
					//ctx.fillText(station, this.bx + 1403, 85);
				}

			, "onresume": function onresume() {
					console.log("[gamescene " + scene.name + "] resumed");
					RED && RED.animation.resume();
				}

			, "onkeydown": function onkeydown(e) {
					if (e.keyCode === 80) gamescene.toggle();
				}

			, "line_number": 0
		});

	var Level = {

		ligne : [],

		currentStationId: 0,

		currentWave : 0,

		currentAlive : 0,
		waves : [],

		nextStation: function(){
			//console.log('nextStation', this);
			var currentStation = levelData.getStationData(this.ligne[this.currentStationId]);
			//console.log(currentStation);
			var trafic = currentStation[0].trafic.replace(/\s+|0/g, '');
			this.waves = [];
			for(i = 0; i < trafic.length; i++){
				this.waves.push(trafic[i]);
			}
			if(this.waves.length == 8){
				this.waves.push("3");
			}
			RED.red.life += 10;
			if(RED.red.life > 100){
				RED.red.life = 100;
			}
			this.nextWave();
		},

		nextWave: function(){
			console.log('nextWave', this);
			var _this = this;
			//this.currentAlive = +this.waves[this.currentWave];
			if(this.currentWave >= this.waves.length){
				this.currentWave = 0;
				this.currentStationId += 1;
				this.nextStation();
				return false;
			}
			for(i = 0; i < this.waves[this.currentWave]; i++){
				var go;
				if(this.currentWave == 8){
					go = gameobject().addComponent(ai_component, {spritesheet: "blacaille", life:100, power : 5});
				}
				else{
					if(this.waves[this.currentWave] > 6 && i < 4){
						i++;
						go = gameobject().addComponent(ai_component, {spritesheet: "racaille2", life:60, power : 2});
					}
					else{
						go = gameobject().addComponent(ai_component, {spritesheet: "racaille", life:40, power: 1});
					}
				}
				go.events.on("destroy", function () {

					_this.currentAlive -= 1;
					console.log(_this.currentAlive);
					if(_this.currentAlive <= 0){
						console.log(_this.currentAlive);
						_this.currentWave += 1;
						_this.nextWave();
					}
				});
				if(this.currentWave === 0){
					go.transform.localPosition.set(math.random() * 300 +(WIDTH - 320), math.random() * 190 + (HEIGHT - 240));
					gameobject.add(go);
				}
				else{
					if(i < 5){
						go.transform.localPosition.set(math.random() * 300 +(WIDTH - 320), math.random() * 190 + (HEIGHT - 240));
						gameobject.add(go);
					}
					else{
						go.transform.localPosition.set(math.random() * 300, math.random() * 190 + (HEIGHT - 240));
						gameobject.add(go);
					}
				}
				this.currentAlive += 1;
			}
		}
	};

	var backGround = {
		fx : 0,

		bx : 0,

		t1x : 0,
		t2x : 0,

		front : [],

		back : [],

		trains : [],

		renderFront : function(ctx){
			for(i = 0; i < this.front.length; i++){
				//console.log(this.fx);
				ctx.drawImage(this.front[i], this.fx,0);
				ctx.drawImage(this.front[i], 2108 + this.fx,0);
			}
			if(this.fx <= -2108){
				this.fx = 0;
			}
		},

		renderBack: function(ctx){
			if(RED.transform.localPosition.x > 750){
				RED.transform.localPosition.x = 750;
				this.bx -= 0.10 * scene.deltaTime;
				this.fx -= 0.20 * scene.deltaTime;
			}
			for(i = 0; i < this.back.length; i++){
				ctx.drawImage(this.back[i], this.bx,0);
				ctx.drawImage(this.back[i], 2108 + this.bx,0);
			}
			if(this.bx <= -2108){
				this.bx = 0;
			}
			ctx.font = "10pt Helvetica";
			ctx.textAlign = "center";

			var station = Level.ligne[Level.currentStationId].replace(/(^[a-z]|\s+[a-z])/g, function (_, $1) {
				return $1.toUpperCase();
			});

			ctx.fillText(station, this.bx + 320, 85);
			ctx.fillText(station, this.bx + 1403, 85);
			ctx.fillText(station, this.bx + 2428, 85);
			ctx.fillText(station, this.bx + 3511, 85);
		},

		renderTrain:function(ctx){
			for(i = 0; i < this.trains.length; i++){
				//console.log(this.trains[i].timer);
				if(this.trains[i].timer <= 0){

					// assets.get("fx.metro.audio*").play();

					ctx.drawImage(this.trains[i].img, this.trains[i].x,15);
					if(this.trains[i].id == 'front'){
						this.trains[i].x += 0.5 * scene.deltaTime;
						//console.log(this.trains[i].x);
						if(this.trains[i].x > 1200){
							this.trains[i].x = -6000;
							this.trains[i].timer = math.random() * 10000 + 5000;
						}
					}
					else{
						this.trains[i].x -= 0.5 * scene.deltaTime;
						// console.log(this.trains[i].x);
						if(this.trains[i].x < -6200){
							this.trains[i].x = 960;
							this.trains[i].timer = math.random() * 10000 + 5000;
						}
					}
				}
				else{
					this.trains[i].timer -= scene.deltaTime;
				}
			}
		}
	};
		
	assets.on("complete", function () {
		this.trains.push({img: assets.get('trainBack.png'), x: 960, timer: 1000, id: 'back'});
		this.trains.push({img: assets.get('trainFront.png'), x: -6000, timer: 15000, id: 'front'});

		this.front.push(assets.get('decorPremierPlan.png'));
		
		this.back.push(assets.get('decorFond.png'));
		this.back.push(assets.get('background' + (math.random() * 6 | 0) + '.png'));
	}, backGround);
		
	scene.on("start", function () {
			console.log("[gamescene " + scene.name + "] started");

			if (assets.audio) {
				//*
				AUDIO_SRC = "music.map" + (math.random() * 3 | 0) + ".audio*";

				var a = assets.get(AUDIO_SRC);
				a.loop = true;
				a.play();//*/

				assets.get("fx.ready.audio*").play();
			}

			if (RED === null) {
				RED = gameobject()
					.addComponent(red_component);
			}

			RED.red.can_move_time = Date.now() + assets.get("fx.ready.audio*").duration * 0.5;

			gameobject.add(RED);
			
			Level.ligne = levelData.LignesData[scene.line_number];
			Level.nextStation();

			mouse.listen(CANVAS);
			keyboard.listen();
			
			document.addEventListener("keydown", scene.onkeydown, false);

			gameobject.auto_sort = true;
			gameobject.sort_function = function sort_function(a, b) {
				//if (a.transform.depth === -1) return 1;
				//if (b.transform.depth === -1) return -1;
				return a.transform.localPosition.y - b.transform.localPosition.y;
			};

			Level.nextStation();
		})
		
		.on("destroy", function () {
			console.log("[gamescene " + scene.name + "] destroyed");

			gameobject.remove(RED);

			mouse.unlisten(CANVAS);
			keyboard.unlisten();

			document.removeEventListener("keydown", scene.onkeydown, false);

			//*
			var a = assets.get(AUDIO_SRC);
			a.currentTime = 0;
			a.pause();//*/
		})

		.on("pause", scene.onpause)
		.on("resume", scene.onresume)
		
		.on("eachframe", function (now) {
			gameobject.update(now, scene.deltaTime);

			var ctx = CTX,
			back = BACK;

			ctx.clearRect(0,0,WIDTH,HEIGHT);
			backGround.renderBack(back);
			backGround.renderTrain(back);
			backGround.renderFront(ctx);
			gameobject.render(ctx);
		});


	return scene;

});