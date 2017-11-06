/*
Script: Color.js
	Class for creating and manipulating colors in JavaScript. Includes basic color manipulations and HSB <-> RGB <-> HEX Conversions.
License:
	MIT-style license.
*/

function Color(params){
	var ptype = $type(params);
	if (ptype == 'array' || ptype == 'string') params = {color: params};
	var color = params.color, type = params.type, string = ($type(color) == 'string');
	if (!type) type = (string) ? ((/rgb/).test(color)) ? 'rgb' : ((/hsb/).test(color)) ? 'hsb' : 'hex' : 'rgb';

	switch (type.toUpperCase()){

		case 'RGB':
			this.rgb = ((string) ? color.match(/([\d]{1,3})/g) : color).map(function(bit, i){
				return Number(bit).limit(0, (i < 3) ? 255 : 1);
			});
			if (this.rgb.length > 3) this.alpha = this.rgb.pop();
			this.hsb = Color.RGBToHSB(this.rgb);
			this.hex = Color.RGBToHEX(this.rgb);
		break;

		case 'HSB':
			this.hsb = ((string) ? color.match(/([-\d]+)/g) : color).map(function(bit, i){
				bit = Number(bit);
				if (i == 0){
					while (bit >= 360) bit -= 360;
					while (bit < 0) bit += 360;
					return bit;
				}
				return bit.limit(0, (i < 3) ? 100 : 1);
			});
			if (this.hsb.length > 3) this.alpha = this.hsb.pop();
			this.rgb = Color.HSBToRGB(this.hsb);
			this.hex = Color.HSBToHEX(this.hsb);
		break;

		case 'HEX':
			this.hex = ((string) ? color.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/).slice(1) : color).map(function(bit){
				return (bit.length == 1) ? bit + bit : bit;
			});
			this.rgb = Color.HEXToRGB(this.hex);
			this.hsb = Color.HEXToHSB(this.hex);
		break;

	}

	if (!this.alpha && params.alpha != null) this.alpha = Number(params.alpha).limit(0, 1);
};

new Native({name: 'Color', initialize: Color});

Color.extend({

	HEXToRGB: function(hex){
		return hex.map(function(bit){
			return parseInt(bit, 16);
		});
	},

	HEXToHSB: function(hex){
		return Color.RGBToHSB(Color.HEXToRGB(hex));
	},

	RGBToHSB: function(rgb){
		//var red = rgb[0], green = rgb[1], blue = rgb[2], hue;
		var red = rgb[0], green = rgb[1], blue = rgb[2], hue = 0;
		var max = Math.max(red, green, blue), min = Math.min(red, green, blue), delta = max - min;
		var brightness = max / 255, saturation = (max != 0) ? delta / max : 0;
		/*
		if (saturation == 0){
			hue = 0;
		} else {
		*/
		if (saturation){
			var rr = (max - red) / delta, gr = (max - green) / delta, br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	RGBToHEX: function(rgb){
		return rgb.map(function(bit){
			bit = bit.toString(16);
			return (bit.length == 1) ? '0' + bit : bit;
		});
	},

	HSBToRGB: function(hsb){
		var br = Math.round(hsb[2] / 100 * 255);
		if (hsb[1] == 0){
			return [br, br, br];
		} else {
			var hue = hsb[0] % 360;
			var f = hue % 60;
			var p = Math.round((hsb[2] * (100 - hsb[1])) / 10000 * 255);
			var q = Math.round((hsb[2] * (6000 - hsb[1] * f)) / 600000 * 255);
			var t = Math.round((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	},

	HSBToHEX: function(hsb){
		return Color.RGBToHEX(Color.HSBToRGB(hsb));
	}

});

Color.implement({

	setHue: function(value){
		return new Color({color: [value, this.hsb[1], this.hsb[2]], alpha: this.alpha, type: 'hsb'});
	},

	setSaturation: function(percent){
		return new Color({color: [this.hsb[0], percent, this.hsb[2]], alpha: this.alpha, type: 'hsb'});
	},

	setBrightness: function(percent){
		return new Color({color: [this.hsb[0], this.hsb[1], percent], alpha: this.alpha, type: 'hsb'});
	},

	toRGB: function(){
		return this.toString('rgb');
	},

	toHSB: function(){
		return this.toString('hsb');
	},

	toHEX: function(){
		return this.toString('hex');
	},

	toString: function(type){
		type = type || 'rgb';
		if (type == 'hex') return '#' + this.hex.join('');
		var bits = this[type].join(', ');
		return (this.alpha != null) ? type + 'a(' + bits + ', ' + this.alpha + ')' : type + '(' + bits + ')';
	}

});

Color.alias('toRGB', 'valueOf');

function hex(hex, a){
	return new Color({color: hex, alpha: a, type: 'hex'});
};

function hsb(h, s, b, a){
	return new Color({color: [h, s, b], alpha: a, type: 'hsb'});
};

function rgb(r, g, b, a){
	return new Color({color: [r, g, b], alpha: a, type: 'rgb'});
};
