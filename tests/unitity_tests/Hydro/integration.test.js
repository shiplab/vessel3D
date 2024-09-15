import { trapezoidalIntegratorCoefficients } from "../../../source/jsm/math/integration";

trapezoidalIntegratorCoefficients

describe( "Test Ship Hydrostatics Formulas", () => {

    const delta_l = 0.893

    let half_breadths = [0.0, 0.9, 1.189, 1.325, 1.377, 1.335, 1.219, 1.024, 0.749, 0.389, 0.0]
    
    // Different from the example on Birian, the half breadth is already scaled
    let levers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(e => e * delta_l)
    
    test( "Integration Code", () => {

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

    }
)