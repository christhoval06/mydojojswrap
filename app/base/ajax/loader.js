define([
	"dojo",
	"dojox/html/styles"
], 
function(dojo, styles) {


		fadingBarsG = function(place){
			var fadingBarsG = dojo.create('div',{id : "fadingBarsG", style: "position:relative; width:414px; height:50px;"}, place || dojo.body());
			styles.insertCssRule('.fadingBarsG', "position:absolute; top:0; background-color:#FFFFFF; width:50px; height:50px; -moz-animation-name:bounce_fadingBarsG; -moz-animation-duration:1.2s; -moz-animation-iteration-count:infinite; -moz-animation-direction:linear; -moz-transform:scale(.3); -webkit-animation-name:bounce_fadingBarsG; -webkit-animation-duration:1.2s; -webkit-animation-iteration-count:infinite; -webkit-animation-direction:linear; -webkit-transform:scale(.3); -ms-animation-name:bounce_fadingBarsG; -ms-animation-duration:1.2s; -ms-animation-iteration-count:infinite; -ms-animation-direction:linear; -ms-transform:scale(.3); -o-animation-name:bounce_fadingBarsG; -o-animation-duration:1.2s; -o-animation-iteration-count:infinite; -o-animation-direction:linear; -o-transform:scale(.3); animation-name:bounce_fadingBarsG; animation-duration:1.2s; animation-iteration-count:infinite; animation-direction:linear; transform:scale(.3);");
			var style = [
					"left:0px; -moz-animation-delay:0.48s; -webkit-animation-delay:0.48s; -ms-animation-delay:0.48s; -o-animation-delay:0.48s; animation-delay:0.48s;",
					"left:52px; -moz-animation-delay:0.6s;-webkit-animation-delay:0.6s; -ms-animation-delay:0.6s; -o-animation-delay:0.6s; animation-delay:0.6s;", 
					"left:104px;-moz-animation-delay:0.72s; -webkit-animation-delay:0.72s;-ms-animation-delay:0.72s; -o-animation-delay:0.72s; animation-delay:0.72s;",
					"left:155px; -moz-animation-delay:0.84s; -webkit-animation-delay:0.84s;-ms-animation-delay:0.84s; -o-animation-delay:0.84s; animation-delay:0.84s;",
					"left:207px; -moz-animation-delay:0.96s; -webkit-animation-delay:0.96s; -ms-animation-delay:0.96s; -o-animation-delay:0.96s; animation-delay:0.96s;",
					"left:259px; -moz-animation-delay:1.08s; -webkit-animation-delay:1.08s; -ms-animation-delay:1.08s; -o-animation-delay:1.08s; animation-delay:1.08s;",
					"left:311px; -moz-animation-delay:1.2s; -webkit-animation-delay:1.2s; -ms-animation-delay:1.2s; -o-animation-delay:1.2s; animation-delay:1.2s;",
					"left:362px; -moz-animation-delay:1.32s; -webkit-animation-delay:1.32s; -ms-animation-delay:1.32s; -o-animation-delay:1.32s; animation-delay:1.32s;"]

			for (var i = 1; i <= 8; i++) {
				var block = dojo.create('div', { class: 'fadingBarsG', id: "fadingBarsG_" + i, style: style[i-1]}, fadingBarsG)
			}
		}

		circular = function(place){
			var circular = dojo.create('div',{id : "circular"}, place || dojo.body());
			for (var i = 1; i <= 8; i++) {
				var block = dojo.create('div', { class: 'circular', id: "circular_" + i }, circular)
			}
		}


		bar = function(place){
			var bar = dojo.create('div',{id : "outer-bar"}, place || dojo.body());
			var _bar = dojo.create('div',{id : "front-bar", class: 'bar-animation'}, bar );
			for (var i = 1; i <= 3; i++) {
				var block = dojo.create('div', { class: 'bar-line', id: "bar_" + i }, _bar)
			}
		}

		circle = function(place){
			var circle = dojo.create('div',{id : "circle"}, place || dojo.body());
			for (var i = 1; i <= 3; i++) {
				var block = dojo.create('div', { class: 'circle', id: "circle_" + i }, circle)
			}
		}

		facebook = function(place){
			var facebook = dojo.create('div',{id : "facebook"}, place || dojo.body());
			for (var i = 1; i <= 3; i++) {
				var block = dojo.create('div', { class: 'facebook_block', id: "block_" + i }, facebook)
			}

		}

		gen = function(place){
			var gen = dojo.create('div',{id : "genLoader"}, place || dojo.body());
			for (var i = 1; i <= 8; i++) {
				var block = dojo.create('div', { class: 'block', id: "rotate_0" + i }, gen )
			}
		}

		destroy = function(){
			if (dojo.byId('_Loader_'))
				dojo.destroy(dojo.byId('_Loader_'));
		}

		create = function(type, place){
			destroy();
			var loader = dojo.create('div', {id : "_Loader_", style: "position: absolute; top: 0px; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.39); z-index: 9999999;"}, place || dojo.body());
			var content = dojo.create('div',{style: "position: absolute; top: 50%; left: 50%;"}, loader);
			var type = (type || 'gen');

			switch(type.toLowerCase()){
				case 'gen': gen(content); break;
				case 'facebook': facebook(content); break;
				case 'circle': circle(content); break;
				case 'bar': bar(content); break;
				case 'circular': circular(content); break;
				default: gen(content);
			}
		}

	return {
		create: create,
		destroy: destroy,

		circular: circular,
		circulo: circle,
		barra: bar,
		facebook: facebook,
		gen: gen,
		fbar: fadingBarsG
	};
});