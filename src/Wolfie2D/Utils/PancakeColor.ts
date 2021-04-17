import MathUtils from "./MathUtils";

// TODO: This should be moved to the datatypes folder
/**
 * A Color util class that keeps track of colors like a vector, but can be converted into a string format
 */
export default class PancakeColor {
	/** The red value */
	public r: number;
	/** The green value */
	public g: number;
	/** The blue value */
	public b: number;
	/** The alpha value */
	public a: number;

    static pancakeColors: string[] = [
        "#a0ddd3",
        "#6fb0b7",
        "#577f9d",
        "#4a5786",
        "#3e3b66",
        "#392945",
        "#2d1e2f",
        "#452e3f",
        "#5d4550",
        "#7b6268",
        "#9c807e",
        "#c3a79c",
        "#dbc9b4",
        "#fcecd1",
        "#aad795",
        "#64b082",
        "#488885",
        "#3f5b74",
        "#ebc8a7",
        "#d3a084",
        "#b87e6c",
        "#8f5252",
        "#6a3948",
        "#c57f79",
        "#ab597d",
        "#7c3d64",
        "#4e2b45",
        "#7a3b4f",
        "#a94b54",
        "#d8725e",
        "#f09f71",
        "#f7cf91",
    ];

	/**
	 * Creates a new color
	 * @param r Red
	 * @param g Green
	 * @param b Blue
	 * @param a Alpha
	 */
	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
	}

	/**	
	 * Transparent color
	 * @returns rgba(0, 0, 0, 0)
	 */
	static get TRANSPARENT(): PancakeColor {
		return new PancakeColor(0, 0, 0, 0);
	}
	
    // Colors from the NannerPancakes Color Palette

    /**
     * Sea Green color
     */
    static get SEA_GREEN(): PancakeColor {
        return this.fromStringHex("#a0ddd3");
    }

    /**
     * Turquoise color
     */
    static get TURQUOISE(): PancakeColor {
        return this.fromStringHex("#6fb0b7");
    }

    /**
     * Sea Blue color
     */
    static get SEA_BLUE(): PancakeColor {
        return this.fromStringHex("#577f9d");
    }

    /**
     * Royal Blue color
     */
    static get ROYAL_BLUE(): PancakeColor {
        return this.fromStringHex("#4a5786");
    }

    /**
     * Indigo color
     */
    static get INDIGO(): PancakeColor {
        return this.fromStringHex("#3e3b66");
    }

    /**
     * Purple color
     */
    static get PURPLE(): PancakeColor {
        return this.fromStringHex("#392945");
    }

    /**
     * Dark Purple color
     */
    static get DARK_PURPLE(): PancakeColor {
        return this.fromStringHex("#2d1e2f");
    }

    /**
     * Dusty Purple color
     */
    static get DUSTY_PURPLE(): PancakeColor {
        return this.fromStringHex("#452e3f");
    }

    /**
     * Dark Gray color
     */
    static get DARK_GRAY(): PancakeColor {
        return this.fromStringHex("#5d4550");
    }

    /**
     * Gray color
     */
    static get GRAY(): PancakeColor {
        return this.fromStringHex("#7b6268");
    }

    /**
     * LIGHT GRAY
     */
    static get LIGHT_GRAY(): PancakeColor {
        return this.fromStringHex("#9c807e");
    }

    /**
     * Light Sand color
     */
    static get LIGHT_SAND(): PancakeColor {
        return this.fromStringHex("#c3a79c");
    }

    /**
     * Tan color
     */
    static get TAN(): PancakeColor {
        return this.fromStringHex("#dbc9b4");
    }

    /**
     * Beige color
     */
    static get BEIGE(): PancakeColor {
        return this.fromStringHex("#fcecd1");
    }

    /**
     * Light Green color
     */
    static get LIGHT_GREEN(): PancakeColor {
        return this.fromStringHex("#aad795");
    }

    /**
     * Green color
     */
    static get GREEN(): PancakeColor {
        return this.fromStringHex("#64b082");
    }

    /**
     * Dark Green color
     */
    static get DARK_GREEN(): PancakeColor {
        return this.fromStringHex("#488885");
    }

    /**
     * Blue color
     */
    static get BLUE(): PancakeColor {
        return this.fromStringHex("#3f5b74");
    }

    /**
     * Hot Beige color
     */
    static get SAND(): PancakeColor {
        return this.fromStringHex("#ebc8a7");
    }

    /**
     * Light Peach
     */
    static get PEACH(): PancakeColor {
        return this.fromStringHex("#d3a084");
    }

    static get DUSTY_ORANGE(): PancakeColor {
        return this.fromStringHex("#b87e6c");
    }

    static get BROWN(): PancakeColor {
        return this.fromStringHex("#8f5252");
    }

    static get DARK_BROWN(): PancakeColor {
        return this.fromStringHex("#6a3948");
    }

    static get DUSTY_ROSE(): PancakeColor {
        return this.fromStringHex("#c57f79");
    }

    static get PINK(): PancakeColor {
        return this.fromStringHex("#ab597d");
    }

    static get DARK_PINK(): PancakeColor {
        return this.fromStringHex("#7c3d64");
    }

    static get MAGENTA(): PancakeColor {
        return this.fromStringHex("#4e2b45");
    }

    static get DARK_RED(): PancakeColor {
        return this.fromStringHex("#7a3b4f");
    }

    static get RED(): PancakeColor {
        return this.fromStringHex("#a94b54");
    }

    static get ORANGE(): PancakeColor {
        return this.fromStringHex("#d8725e");
    }

    static get LIGHT_ORANGE(): PancakeColor {
        return this.fromStringHex("#f09f71");
    }

    static get YELLOW(): PancakeColor {
        return this.fromStringHex("#f7cf91");
    }

    static colorFromIndex(i: number): PancakeColor {
        return PancakeColor.fromStringHex(PancakeColor.pancakeColors[i]);
    }

	/**
	 * Sets the color to the values provided
	 * @param r Red
	 * @param g Green
	 * @param b Blue
	 * @param a Alpha
	 */
	set(r: number, g: number, b: number, a: number = 1): void {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	/**
	 * Returns a new color slightly lighter than the current color
	 * @returns A new lighter Color
	 */
	lighten(): PancakeColor {
		return new PancakeColor(MathUtils.clamp(this.r + 40, 0, 255), MathUtils.clamp(this.g + 40, 0, 255), MathUtils.clamp(this.b + 40, 0, 255), MathUtils.clamp(this.a + 10, 0, 255));
	}

	/**
	 * Returns a new color slightly darker than the current color
	 * @returns A new darker Color
	 */
	darken(): PancakeColor {
		return new PancakeColor(MathUtils.clamp(this.r - 40, 0, 255), MathUtils.clamp(this.g - 40, 0, 255), MathUtils.clamp(this.b - 40, 0, 255), MathUtils.clamp(this.a + 10, 0, 255));
	}
	
	/**
	 * Returns this color as an array
	 * @returns [r, g, b, a]
	 */
	toArray(): [number, number, number, number] {
		return [this.r, this.g, this.b, this.a];
	}
	
	/**
	 * Returns the color as a string of the form #RRGGBB
	 * @returns #RRGGBB
	 */
	toString(): string {
		return "#" + MathUtils.toHex(this.r, 2) + MathUtils.toHex(this.g, 2) + MathUtils.toHex(this.b, 2);
	}

	/**
	 * Returns the color as a string of the form rgb(r, g, b)
	 * @returns rgb(r, g, b)
	 */
	toStringRGB(): string {
		return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
	}

	/**
	 * Returns the color as a string of the form rgba(r, g, b, a)
	 * @returns rgba(r, g, b, a)
	 */
	toStringRGBA(): string {
		if(this.a === 0){
			return this.toStringRGB();
		}
		return "rgba(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ", " + this.a.toString() +")"
	}

	/**
	 * Turns this color into a float32Array and changes color range to [0.0, 1.0]
	 * @returns a Float32Array containing the color
	 */
	toWebGL(): Float32Array {
		return new Float32Array([
			this.r/255,
			this.g/255,
			this.b/255,
			this.a
		]);
	}

	static fromStringHex(str: string): PancakeColor {
		let i = 0;
		if(str.charAt(0) == "#") i+= 1;
		let r = MathUtils.fromHex(str.substring(i, i+2));
		let g = MathUtils.fromHex(str.substring(i+2, i+4));
		let b = MathUtils.fromHex(str.substring(i+4, i+6));
		return new PancakeColor(r, g, b);
	}
}