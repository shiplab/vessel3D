import {HullHydrostatics} from "../../source/jsm/physics/Hydrostatic.js";
import {Ship} from "../../source/jsm/ship/Ship.js";
import {PREDEFINED_HULLS} from "../../source/jsm/database/predefinedHull.js";

describe("HullHydrostatics", () => {
    let hydro, hull;

    beforeEach(() => {
        const ship = new Ship();
        hydro = {
            "wigleyHull": new HullHydrostatics(ship.getPredefinedHull("wigleyHull")),
            "barge": new HullHydrostatics(ship.getPredefinedHull("barge"))
        };
    });

    test("Draft definition", () => {
        expect(hydro["wigleyHull"].h).toBe(0.5);
    });

    // Interpolated waterline functions
    test("Test errors interpolated waterline", () => {
        const hydro_wigley = hydro["wigleyHull"];
        
        // Expected errors:
        expect(() => hydro_wigley.interpolateWaterline(-1)).toThrow(RangeError);
        expect(() => hydro_wigley.interpolateWaterline(2)).toThrow(RangeError);
        expect(() => hydro_wigley.interpolateWaterline(NaN)).toThrow(RangeError);

    });

    test("Interpolate waterline", () => {
        const hydro_barge = hydro["barge"];
        const tables = hydro_barge.interpolateWaterline(hydro_barge.h);
        const expected_table = PREDEFINED_HULLS["barge"].halfBreadths;

        // Check intermediate values
        expected_table.table.forEach((row, i) => {
            row.forEach((value, j) => {
                const new_value = value * 5; // Scale by BOA/2
                expect(tables.submerged_table[i][j]).toBeCloseTo(new_value, 5);
            });
        });
    });
    

    test("Hull must be an object", () => {
        const ship_fail = new Ship();
        expect(() => {
            ship_fail.addHull("not an object");
        }).toThrow("The 'hull' parameter must be an object.");
    });
});
