import * as THREE from "../../libs/three.js"

import { bisectionSearch, lerp } from "../math/interpolation.js";

import { PREDEFINED_HULLS } from "../database/predefinedHull.js"


export class Hull extends THREE.Group {

    // -----------------> Data Structure <--------------------- //
    // The data structure must follow similar examples like the following:
    // hulll = {
    //     "attributes": {
    //         "LOA": 22.5,
    //         "BOA": 10,
    //         "Depth": 2.5,
    //         "APP": 0
    //     },
    //     "halfBreadths": {
    //         "waterlines": [0, 0, 1],
    //         "stations": [0, 1],
    //         "table": [[0, 0], [1, 1], [1, 1]]
    //     },
    //     "style": {
    //         upperColor: 0x33aa33
    //         upperColor: 0xaa3333
    //         opacity: 0.5
    //     }
    // }

    // Function based on the original Ship3D from Vessel.js
    constructor(hull, design_draft ) {

        super();

        // TODO: This is a bypass in case no hull is defined, the file will create a 
        // wigley type hull
        if(hull == undefined) {

            hull = PREDEFINED_HULLS["wigleyHull"]

        } else {
			
			Object.assign(this, hull)

		}

		this.bulkheads = undefined
        this.group = "Hull3D";
		this.name = "Hull3D";
		this.design_draft = design_draft !== undefined ? design_draft : 0.5 * this.attributes.Depth;
		this.structureWeight = hull.attributes.hasOwnProperty("structureWeight") ? hull.attributes.structureWeight : undefined;
		this.upperColor = typeof this.style.upperColor !== "undefined" ? this.style.upperColor : 0x33aa33;
		this.lowerColor = typeof this.style.lowerColor !== "undefined" ? this.style.lowerColor : 0xaa3333;
		this.opacity = typeof this.style.opacity !== "undefined" ? this.style.opacity : 0.5;

		this.update();        
        
    }

    addStation( p ) {

		const hb = this.halfBreadths;
		const { index, mu } = bisectionSearch( hb.stations, p );
		hb.stations.splice( index, 0, p );
		for ( let i = 0; i < hb.waterlines.length; i ++ ) {

			hb.table[ i ].splice( index, 0, 0 );

		}

		this.update();

	}

	addWaterline( p ) {

		const hb = this.halfBreadths;
		const { index, mu } = bisectionSearch( hb.waterlines, p );
		hb.waterlines.splice( index, 0, p );
		hb.table.splice( index, 0, new Array( hb.stations.length ).fill( 0 ) );

		this.update();

	}

    getWaterline( z ) {
        let ha = this.attributes;
		let zr = z / ha.Depth; //using zr requires fewer operations and less memory than a scaled copy of wls.
		let wls = this.halfBreadths.waterlines;//.map(wl=>wl*ha.Depth);
		let sts = this.halfBreadths.stations;
		let tab = this.halfBreadths.table;

		if ( zr < wls[ 0 ] ) {

			//console.warn("getWaterLine: z below lowest defined waterline. Defaulting to all zero offsets.");
			return new Array( sts.length ).fill( 0 );

		} else {

			let a, mu;
			if ( zr > wls[ wls.length - 1 ] ) {

				//console.warn("getWaterLine: z above highest defined waterline. Proceeding with highest data entries.");
				a = wls.length - 2; //if this level is defined...
				mu = 1;
				//wl = tab[a].slice();

			} else {

				( { index: a, mu: mu } = bisectionSearch( wls, zr ) );
				if ( a === wls.length - 1 ) {

					a = wls.length - 2;
					mu = 1;

				}

			}

			//Try to do linear interpolation between closest data waterlines, but handle null values well:
			let wl = new Array( sts.length );
			for ( let j = 0; j < wl.length; j ++ ) {

				let lower, upper;
				let b = a;
				//Find lower value for interpolation
				if ( tab[ b ][ j ] !== null && ! isNaN( tab[ b ][ j ] ) ) {

					lower = tab[ b ][ j ];

				} else {

					b = a + 1;
					while ( b < wls.length && ( isNaN( tab[ b ][ j ] ) || tab[ b ][ j ] === null ) ) {

						b ++;

					}

					if ( b !== wls.length ) {

						//Inner NaN
						lower = 0;

					} else {

						//Upper NaN, search below:
						b = a - 1;
						while ( b >= 0 && ( isNaN( tab[ b ][ j ] ) || tab[ b ][ j ] === null ) ) {

							b --;

						}

						if ( b === - 1 ) {

							//No number found:
							lower = 0;
							upper = 0;

						} else {

							lower = tab[ b ][ j ];
							upper = lower;

						}

					}

				}

				//Find upper value for interpolation
				let c = a + 1;
				if ( upper !== undefined ) { /*upper found above*/ } else if ( tab[ c ][ j ] !== null && ! isNaN( tab[ c ][ j ] ) ) {

					upper = tab[ c ][ j ];

				} else {

					//The cell value is NaN.
					//Upper is not defined.
					//That means either tab[a][j] is a number
					//or tab[a][j] is an inner NaN and
					//there exists at least one number above it.
					//In both cases I have to check above a+1.
					c = a + 2;
					while ( c < wls.length && ( isNaN( tab[ c ][ j ] ) || tab[ c ][ j ] === null ) ) {

						c ++;

					}

					if ( c === wls.length ) upper = lower;
					else {

						upper = tab[ c ][ j ];

					}

				}

				//Linear interpolation
				wl[ j ] = lerp( lower, upper, mu );
				//Scale numerical values
				if ( wl[ j ] !== null && ! isNaN( wl[ j ] ) ) wl[ j ] *= 0.5 * ha.BOA;

			}

			return wl;

		}
    }

    // Function heritaged from the old Vessels.js HUll
    //This must be debugged more. getWaterline got an overhaul, but this did not.
	getStation( x ) {

		let ha = this.attributes;
		let xr = x / ha.LOA;
		let sts = this.halfBreadths.stations;
		let wls = this.halfBreadths.waterlines;
		let tab = this.halfBreadths.table;

		let { index: a, mu: mu } = bisectionSearch( sts, xr );

		let st;
		if ( a < 0 || a >= sts.length ) st = new Array( wls.length ).fill( null );
		else if ( a + 1 === sts.length ) st = tab.map( row => row[ sts.length - 1 ] );
		else {

			st = [];
			for ( let j = 0; j < wls.length; j ++ ) {

				let after = tab[ j ][ a ];
				let forward = tab[ j ][ a + 1 ];
				if ( ( after === null || isNaN( after ) ) && ( forward === null || isNaN( forward ) ) ) {

					st.push( null );

				} else {

					//Simply correcting by "|| 0" is not consistent with what is done in getWaterline. It may be better to correct upper nulls by nearest neighbor below.
					st.push( lerp( after || 0, forward || 0, mu ) );

				}

			}

		}

		for ( let j = 0; j < this.halfBreadths.waterlines.length; j ++ ) {

			st[ j ] *= 0.5 * ha.BOA;
			if ( isNaN( st[ j ] ) || st[ j ] === null ) st[ j ] = null;

		}

		return st;

	}


    update() {

        const { upperColor, lowerColor, design_draft, opacity } = this;

		const { attributes: { LOA, BOA, Depth }, halfBreadths: { stations, waterlines, table } } = this;

        if ( this.hullGeometry ) this.hullGeometry.dispose();
        this.hullGeometry = new HullSideGeometry( stations, waterlines, table );

        let N = stations.length;
        let M = waterlines.length;

        //Bow cap:
        let bowPlaneOffsets = this.getStation( LOA ).map( str => str / ( 0.5 * BOA ) ); //normalized
        if ( this.bowCapG ) this.bowCapG.dispose();
        this.bowCapG = new THREE.PlaneBufferGeometry( undefined, undefined, 1, M - 1 );
        let pos = this.bowCapG.getAttribute( "position" );
        let pa = pos.array;
        //constant x-offset yz plane
        for ( let j = 0; j < M; j ++ ) {

            pa[ 3 * ( 2 * j ) ] = 1;
            pa[ 3 * ( 2 * j ) + 1 ] = bowPlaneOffsets[ j ];
            pa[ 3 * ( 2 * j ) + 2 ] = waterlines[ j ];
            pa[ 3 * ( 2 * j + 1 ) ] = 1;
            pa[ 3 * ( 2 * j + 1 ) + 1 ] = - bowPlaneOffsets[ j ];
            pa[ 3 * ( 2 * j + 1 ) + 2 ] = waterlines[ j ];

        }

        pos.needsUpdate = true;

        //Aft cap:
        let aftPlaneOffsets = this.getStation( 0 ).map( str => str / ( 0.5 * BOA ) ); //normalized
        if ( this.aftCapG ) this.aftCapG.dispose();
        this.aftCapG = new THREE.PlaneBufferGeometry( undefined, undefined, 1, M - 1 );
        pos = this.aftCapG.getAttribute( "position" );
        pa = pos.array;
        //constant x-offset yz plane
        for ( let j = 0; j < M; j ++ ) {

            pa[ 3 * ( 2 * j ) ] = 0;
            pa[ 3 * ( 2 * j ) + 1 ] = - aftPlaneOffsets[ j ];
            pa[ 3 * ( 2 * j ) + 2 ] = waterlines[ j ];
            pa[ 3 * ( 2 * j + 1 ) ] = 0;
            pa[ 3 * ( 2 * j + 1 ) + 1 ] = aftPlaneOffsets[ j ];
            pa[ 3 * ( 2 * j + 1 ) + 2 ] = waterlines[ j ];

        }

        pos.needsUpdate = true;

        //Bottom cap:
        let bottomPlaneOffsets = this.getWaterline( 0 ).map( hw => hw / ( 0.5 * BOA ) ); //normalized
        if ( this.bottomCapG ) this.bottomCapG.dispose();
        this.bottomCapG = new THREE.PlaneBufferGeometry( undefined, undefined, N - 1, 1 );
        pos = this.bottomCapG.getAttribute( "position" );
        pa = pos.array;
        //constant z-offset xy plane
        for ( let i = 0; i < N; i ++ ) {

            pa[ 3 * ( i ) ] = stations[ i ];
            pa[ 3 * ( i ) + 1 ] = - bottomPlaneOffsets[ i ];
            pa[ 3 * ( i ) + 2 ] = 0;
            pa[ 3 * ( N + i ) ] = stations[ i ];
            pa[ 3 * ( N + i ) + 1 ] = bottomPlaneOffsets[ i ];
            pa[ 3 * ( N + i ) + 2 ] = 0;

        }

        pos.needsUpdate = true;

        //Hull material
        if ( ! this.hMat ) {

            let phong = THREE.ShaderLib.phong;
            let commonDecl = "uniform float wlThreshold;uniform vec3 aboveWL; uniform vec3 belowWL;\nvarying float vZ;";
            this.hMat = new THREE.ShaderMaterial( {
                uniforms: THREE.UniformsUtils.merge( [ phong.uniforms, {
                    wlThreshold: new THREE.Uniform( 0.5 ),
                    aboveWL: new THREE.Uniform( new THREE.Color() ),
                    belowWL: new THREE.Uniform( new THREE.Color() )
                } ] ),
                vertexShader: commonDecl + phong.vertexShader.replace( "main() {", "main() {\nvZ = position.z;" ).replace( "#define PHONG", "" ),
                fragmentShader: commonDecl + phong.fragmentShader.replace( "vec4 diffuseColor = vec4( diffuse, opacity );",
                    "vec4 diffuseColor = vec4( (vZ>wlThreshold)? aboveWL.rgb : belowWL.rgb, opacity );" ).replace( "#define PHONG", "" ),
                side: THREE.DoubleSide,
                lights: true,
                transparent: true
            } );

        }

        this.hMat.uniforms.wlThreshold.value = this.design_draft / Depth;
        this.hMat.uniforms.aboveWL.value = new THREE.Color( upperColor );
        this.hMat.uniforms.belowWL.value = new THREE.Color( lowerColor );
        this.hMat.uniforms.opacity.value = opacity;

        if ( this.port ) this.remove( this.port );
        this.port = new THREE.Mesh( this.hullGeometry, this.hMat );
		this.port.name = "HullPortSide"
        if ( this.starboard ) this.remove( this.starboard );
        this.starboard = new THREE.Mesh( this.hullGeometry, this.hMat );
		this.starboard.name = "HullStarboardSide"
        this.starboard.scale.y = - 1;
        this.add( this.port, this.starboard );

        //Caps:
        if ( this.bowCap ) this.remove( this.bowCap );
        this.bowCap = new THREE.Mesh( this.bowCapG, this.hMat );
        if ( this.aftCap ) this.remove( this.aftCap );
        this.aftCap = new THREE.Mesh( this.aftCapG, this.hMat );
        if ( this.bottomCap ) this.remove( this.bottomCap );
        this.bottomCap = new THREE.Mesh( this.bottomCapG, this.hMat );

        this.add( this.bowCap, this.aftCap, this.bottomCap );

        this.scale.set( LOA, 0.5 * BOA, Depth );

    }

	addBulkheads(att, x, th, d) {

		if (this.bulkheads == undefined) {

			let BOA = att.BOA
			let Depth = att.Depth

			this.bulkheads =  new THREE.Group()
			this.bulkheads.scale.set( 1, 0.5 * BOA, Depth );

		}		

        this.bulkHeadGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        this.bulkHeadGeometry.translate( 0, 0, 0.5 );
        
		let bhMat = new THREE.MeshPhongMaterial( { color: 0xcccccc /*this.randomColor()*/, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
        bulkHeadGeometry.translate( 0.5, 0, 0 );
        
		let bhs = ship.structure.bulkheads;
        let bhk = Object.keys( bhs );

	}

}


// TODO: Understand the following explanation under the Ship3D_v2.js in the original Vessels.js
// Why should the HullSideGeometry can not be a subclass of PlaneBufferGeometry?

// Class to contain the geometry of a hull side.
// (Should perhaps be replaced by a HullGeometry class, but then
// it cannot be a simple subclass of PlaneBufferGeometry.)
// After instantiation, stations, waterlines and table can be modified or replaced,
// but the data dimensions NxM must remain the same.

class HullSideGeometry extends THREE.PlaneBufferGeometry {

	constructor( stations, waterlines, table ) {

		const N = stations.length;
		const M = waterlines.length;

		super( undefined, undefined, N - 1, M - 1 );

		this.stations = stations;
		this.waterlines = waterlines;
		this.table = table;
		this.N = N;
		this.M = M;

		this.update();

	}

	update() {

		let pos = this.getAttribute( "position" );
		let pa = pos.array;

		const N = this.N;
		const M = this.M;

		//loop1:
		//zs
		let c = 0;
		//Iterate over waterlines
		for ( let j = 0; j < M; j ++ ) {

			//loop2:
			//xs
			//iterate over stations
			for ( let i = 0; i < N; i ++ ) {

				//if (table[j][i] === null) continue;// loop1;
				pa[ c ] = this.stations[ i ]; //x
				//DEBUG, OK. No attempts to read outside of table
				/*if(typeof table[j] === "undefined") console.error("table[%d] is undefined", j);
				else if (typeof table[j][i] === "undefined") console.error("table[%d][%d] is undefined", j, i);*/
				//y
				pa[ c + 1 ] = this.table[ j ][ i ]; //y
				pa[ c + 2 ] = this.waterlines[ j ]; //z
				c += 3;

			}

		}
		//console.error("c-pa.length = %d", c-pa.length); //OK, sets all cells

		//Get rid of nulls by merging their points with the closest non-null point in the same station:
		/*I am joining some uvs too. Then an applied texture will be cropped, not distorted, where the hull is cropped.*/
		// TODO: Instead of getting the closest, makes it find and approximation for the tip of the vessel
		let uv = this.getAttribute( "uv" );
		let uva = uv.array;
		//Iterate over stations
		for ( let i = 0; i < N; i ++ ) {

			let firstNumberJ;
			let lastNumberJ;
			//Iterate over waterlines
			let j;
			for ( j = 0; j < M; j ++ ) {

				let y = this.table[ j ][ i ];
				//If this condition is satisfied (number found),
				//the loop will be quitted
				//after the extra logic below:
				if ( y !== null ) {

					firstNumberJ = j;
					lastNumberJ = j;
					//copy vector for i,j to positions for all null cells below:
					let c = firstNumberJ * N + i;
					let x = pa[ 3 * c ];
					let y = pa[ 3 * c + 1 ];
					let z = pa[ 3 * c + 2 ];
					let d = c;
					while ( firstNumberJ > 0 ) {

						firstNumberJ --;
						d -= N;
						pa[ 3 * d ] = x;
						pa[ 3 * d + 1 ] = y;
						pa[ 3 * d + 2 ] = z;
						uva[ 2 * d ] = uva[ 2 * c ];
						uva[ 2 * d + 1 ] = uva[ 2 * c + 1 ];

					}

					break;

				}
				//console.log("null encountered.");

			}

			//Continue up the hull (with same j counter), searching for upper number. This does not account for the existence of numbers above the first null encountered.
			for ( ; j < M; j ++ ) {

				let y = this.table[ j ][ i ];
				if ( y === null ) {

					//console.log("null encountered.");
					break;

				}

				//else not null:
				lastNumberJ = j;

			}

			//copy vector for i,j to positions for all null cells above:
			let c = lastNumberJ * N + i;
			let x = pa[ 3 * c ];
			let y = pa[ 3 * c + 1 ];
			let z = pa[ 3 * c + 2 ];
			let d = c;
			while ( lastNumberJ < M - 1 ) {

				lastNumberJ ++;
				d += N;
				pa[ 3 * d ] = x;
				pa[ 3 * d + 1 ] = y;
				pa[ 3 * d + 2 ] = z;
				uva[ 2 * d ] = uva[ 2 * c ];
				uva[ 2 * d + 1 ] = uva[ 2 * c + 1 ];

			}
			//////////

		}

		//console.log(pa);

		pos.needsUpdate = true;
		uv.needsUpdate = true;
		this.computeVertexNormals();

	}

}

class Bulkhead extends THREE.Mesh {

	constructor(bulkHeadGeometry, bhMat) {


		// let bulkHeadGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		// bulkHeadGeometry.translate( 0, 0, 0.5 );
		// bulkHeadGeometry.translate( 0.5, 0, 0 );

		// let bhMat = new THREE.MeshPhongMaterial( { color: 0xcccccc /*this.randomColor()*/, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );

		// super(bulkHeadGeometry, bhMat)

		// bulkhead.scale.set( bh.thickness, 1, 1 );
		// bulkhead.position.set( bh.xAft, 0, 0 );

	}

}