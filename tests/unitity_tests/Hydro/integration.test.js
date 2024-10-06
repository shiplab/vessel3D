import { trapezoidalIntegratorCoefficients } from "../../../source/jsm/math/integration";
import { HullHydrostatics } from "../../../source/jsm/physics/Hydrostatic.js";
import * as Vessel3D from "../../../source/vessel3D.js";

/**
 * @jest-environment jsdom
 */


describe( "Test Ship Hydrostatics Formulas for Area", () => {

    const delta_l = 0.893

    let half_breadths = [0.0, 0.9, 1.189, 1.325, 1.377, 1.335, 1.219, 1.024, 0.749, 0.389, 0.0]
    
    // Different from the example on Birian, the half breadth is already scaled on the Vessel3D.js
    let levers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(e => e * delta_l)
    
    test( "Area Integration Code", () => {

        // Integration similar to the code used in table 4.1 Birian 

        const { AWL, LCF, IT, Iy, IL } = trapezoidalIntegratorCoefficients(levers, half_breadths)
        
        expect( AWL ).toBeCloseTo( 16.98 );
        console.log(`AWL: ${AWL}`);        
        expect( LCF ).toBeCloseTo( -0.387 );
        console.log(`LCF: ${LCF}`);
        expect( IT ).toBeCloseTo( 7.79 );
        console.log(`IT: ${IT}`);
        expect( Iy ).toBeCloseTo( 71.29 );
        console.log(`Iy: ${Iy}`);
        expect( IL ).toBeCloseTo( 68.75 );
        console.log(`IL: ${IL}`);

    } )

    test( "Volumetric verification formulas for sparse points triangular ship", () => {

        // Used the blockCase_compare.html
        let hull = {}
        hull.halfBreadths = {        
            "waterlines": [0, 1],
            "stations":[0, 1],
            "table": [
                [0, 0], 
                [1, 1],
            ],
        }        
        hull.attributes = {
            "LOA": 20.0,
            "BOA": 10.0,
            "Depth": 4.0,
            "APP": 0
        }
        hull.style = {
            "upperColor": "yellow",
            "lowerColor": "green",
            "opacity": 0.5
        }
        hull.design_draft = 2

        // Function to moch the Three.js behavior for getObjectByNameFunctions
        hull["getObjectByName"] = function(_) {

            const sideSurface = {
                "geometry": {
                    "table": hull.halfBreadths["table"],
                    "stations": hull.halfBreadths["stations"],
                    "waterlines": hull.halfBreadths["waterlines"]
                }
            }

            return sideSurface

        }
                                
        const hullHydrostatics = new HullHydrostatics(hull)

        expect( hullHydrostatics.volume ).toBeCloseTo( 100.0 );
        console.log(`hullHydrostatics.volume: ${hullHydrostatics.volume}`);        
        expect( hullHydrostatics.KB ).not.toBeCloseTo( 2 * 2 / 3 ); 
        console.log(`At the spaced level of approximation KB analytical of 1.333 != ${hullHydrostatics.KB}`);        
        expect( hullHydrostatics.LCB ).toBeCloseTo( 10.00 );
        console.log(`hullHydrostatics.LCB: ${hullHydrostatics.LCB}`);        
        expect( hullHydrostatics.AWL ).toBeCloseTo( 100.0 );
        console.log(`hullHydrostatics.AWL: ${hullHydrostatics.AWL}`);        
        expect( hullHydrostatics.LCF ).toBeCloseTo( 10.0 );
        console.log(`hullHydrostatics.LCF: ${hullHydrostatics.LCF}`);   
        
        const BWL = hull.attributes.BOA / 2
        const LOA = hull.attributes.LOA 
        const IT = LOA * Math.pow(BWL, 3) / 12
        const IL = BWL * Math.pow(LOA, 3) / 12
        const KB = hull.design_draft * 2 / 3 // Center of the volume of a triangular hull

        expect( hullHydrostatics.IT ).toBeCloseTo( IT );
        console.log(`IT = ${IT} = ${hullHydrostatics.IT}`); 
        expect( hullHydrostatics.KB ).not.toBeCloseTo( 2 * 2 / 3 ); 
        console.log(`KB = ${KB} = ${hullHydrostatics.KB}`);
        
    })

    test( "Volumetric verification formulas for dense points triangular ship", () => {

        // Used the blockCase_compare.html
        let hull = {}
        hull.halfBreadths = {        
            "waterlines": [0, 0.125, 0.25, 0.375, 0.5, 0.75, 1],
            "stations":[0, 0.25, 0.5, 0.75, 1],
            "table": [
                [0, 0, 0, 0, 0], 
                [0.125, 0.125, 0.125, 0.125, 0.125], 
                [0.25, 0.25, 0.25, 0.25, 0.25], 
                [0.375, 0.375, 0.375, 0.375, 0.375], 
                [0.5, 0.5, 0.5, 0.5, 0.5], 
                [0.75, 0.75, 0.75, 0.75, 0.75], 
                [1, 1, 1, 1, 1],
            ],
        }        
        hull.attributes = {
            "LOA": 20.0,
            "BOA": 10.0,
            "Depth": 4.0,
            "APP": 0
        }
        hull.style = {
            "upperColor": "yellow",
            "lowerColor": "green",
            "opacity": 0.5
        }
        hull.design_draft = 2

        // Function to moch the Three.js behavior for getObjectByNameFunctions
        hull["getObjectByName"] = function(_) {

            const sideSurface = {
                "geometry": {
                    "table": hull.halfBreadths["table"],
                    "stations": hull.halfBreadths["stations"],
                    "waterlines": hull.halfBreadths["waterlines"]
                }
            }

            return sideSurface

        }

        const hullHydrostatics = new HullHydrostatics(hull)

        console.log(`At the spaced level of approximation KB analytical of 1.333 != ${hullHydrostatics.KB}`);
        
        const BWL = hull.attributes.BOA / 2
        const LOA = hull.attributes.LOA 
        const IL = BWL * Math.pow(LOA, 3) / 12
        console.log(`IL = ${IL} = ${hullHydrostatics.IL}`); 

    })

    }
    
)