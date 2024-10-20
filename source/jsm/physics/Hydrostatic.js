import { simpsonIntegratorDiscrete, trapezoidalIntegratorCoefficients } from "../math/integration.js"
import { lerp, bisectionSearch } from "../math/interpolation.js"
import { geometricCenter, multiplyArrayByConst } from "../math/arrayOperations.js"

export class HullHydrostatics {

    constructor(hull, draft = undefined) {

        if(draft === undefined) {
            
            // calculate the draft by interpolation in case it is not found
            // Step 1. Get all the weights
            

        }

        if (draft > hull.attributes.Depth) {

            throw new Error("Design draft is bigger than the depth which is realistically impossible.")

        }

        const h = draft / hull.attributes.Depth


        const { x, z, submerged_table, waterline_row } = this.interpolateWaterline(hull, h) 
        
        Object.assign(this, this.computeHydrostatics(x, z, submerged_table, waterline_row));
        
    }

    interpolateWaterline(hull, h = 1) {

        // Get the hull geometry's port side surface
        const waterLines = hull.halfBreadths.waterlines
        const stations = hull.halfBreadths.stations
        const table = hull.halfBreadths.table
        
        // Extract the geometry tables and hull dimensions
        const LOA = hull.attributes.LOA;  // Length Overall
        const Depth = hull.attributes.Depth;  // Depth
        const BOA = hull.attributes.BOA; // BOA

        const HALF_BREADTHS = BOA / 2
        
        
        // Find the parameters and the submerged waterlines and half breadths tables
        const { submergedWaterLines, submergedTables, interpolatedTableLine } = this.takeSubmergedTables(
                                                                        waterLines, 
                                                                        table, 
                                                                        h
                                                                    );
        
        // Scaling the submerged tables
        const slicedTables = submergedTables.map((row) => {

            // Reference in the center of the Ship, therefore multiply for BOA/2
            return multiplyArrayByConst(row, HALF_BREADTHS);
            
        });        
        const interpolatedWaterlineRow = multiplyArrayByConst(interpolatedTableLine, HALF_BREADTHS)
        const stationPositions = multiplyArrayByConst(stations, LOA)
        const scaledWaterlines = multiplyArrayByConst(submergedWaterLines, Depth)

        return {
            "x": stationPositions,
            "z": scaledWaterlines,
            "submerged_table": slicedTables,
            "waterline_row": interpolatedWaterlineRow
        };

    }

    /**
     * 
     * @param {Array.<number>} waterLines 
     * @param {number} h Location of the water line relative to the Depth. h = 1 for draft equals to the Depth 
     * @returns 
     */
    takeSubmergedTables ( waterLines, tables, h ) {

        // By pass in case the draft is equal to the depth
        if (h === 1) {
            
            const lastIndex = waterLines.length - 1
            
            return { index: lastIndex, mu: 0, submergedWaterLines: waterLines, submergedTables: tables}               
        }
        
        // Find the index and interpolation factor 'mu' for waterline height 'h'
        const { index, mu } = bisectionSearch(waterLines, h);
        
        const submergedWaterLines = waterLines.slice(0, index + 1)
        
        const submergedTables = tables.slice(0, submergedWaterLines.length)
        
        
        // Complete tables by applying a linear interpolation in the last height before the waterline
        const lastTableLine = tables[index]
        const nextTableLine = tables[index + 1]
        const interpolatedTableLine = lastTableLine.map((value, i) => {

            return lerp(value, nextTableLine[i], mu);
        
        });
        
        submergedTables.push(interpolatedTableLine)
        submergedWaterLines.push(h)

        return { index, mu, submergedWaterLines, submergedTables, interpolatedTableLine }

    }

    computeHydrostatics(x, z, submergedTable, waterlineRow) {

        // Cross-section areas
        const cs_area = this.calculateCrossSectionAreas(submergedTable, z)

        // Waterline areas
        const wl_area = this.calculateWaterlineAreas(submergedTable, x)
        
        const volume = simpsonIntegratorDiscrete(z, wl_area)
        const disp = 1025 * volume * 9.81
        
        const KB = geometricCenter(wl_area, z)
        const LCB = geometricCenter(cs_area, x)
        
        const { AWL, LCF, IT, Iy, IL } = trapezoidalIntegratorCoefficients(x, waterlineRow)
        
        const TPC = AWL * 1.025 / 100

        const BM = IT / volume

        return {
            "volume": volume,
            "disp": disp,
            "KB": KB,
            "LCB": LCB, 
            "AWL": AWL,
            "LCF": LCF, 
            "IT": IT,
            "Iy": Iy,
            "IL": IL,
            "TPC": TPC,
            "BM": BM,
        }

    }

    calculateCrossSectionAreas(submergedTable, z) {
        return submergedTable[0].map((_, i) => {
            const yi = submergedTable.map(row => row[i]);
            return 2 * simpsonIntegratorDiscrete(z, yi);
        });
    }

    calculateWaterlineAreas(submergedTable, x) {
        return submergedTable.map(row => {
            return 2 * simpsonIntegratorDiscrete(x, row);
        });
    }
    
    

    calculateStabilityFromScene(scene) {

        this.calculateStability()

    }

    calculateStability(compartments = undefined) {
        
        // There is two ways to asses the stability:
        // First one is by giving the draft and calculate according
        // to that or giving an extra step of calculating the drafit

        if(compartments === undefined) {

            

        }

    }

}