import { simpsonIntegratorDiscrete, trapezoidalIntegratorCoefficients } from "../math/integration.js"
import { lerp, bisectionSearch } from "../math/interpolation.js"
import { geometricCenter } from "../math/arrayOperations.js"

export default class HullHydrostatics {

    constructor(hull) {

        const h = hull.design_draft / hull.attributes.Depth


        const { x, z, submerged_table, waterline_row } = this.interpolateWaterline(hull, h) 
        
        
        const { volume,
                disp,
                KB,
                LCB, 
                AWL,
                LCF, 
                IT,
                Iy,
                IL,
                TPC } = this.computeHydrostatics(x, z, submerged_table, waterline_row)

        // Assigning computed hydrostatic values to the instance
        this.volume = volume;
        this.displacement = disp;
        this.KB = KB;
        this.LCB = LCB;
        this.AWL = AWL;
        this.LCF = LCF;
        this.IT = IT;
        this.Iy = Iy;
        this.IL = IL;
        this.TPC = TPC;
        
    }

    interpolateWaterline(hull, h = 1) {

        // Get the hull geometry's port side surface
        const sideSurface = hull.getObjectByName("HullPortSide");
        const geometry = sideSurface.geometry;
        
        // Extract the geometry tables and hull dimensions
        const tables = geometry.table;
        const LOA = hull.attributes.LOA;  // Length Overall
        const Depth = hull.attributes.Depth;  // Depth
        const BOA = hull.attributes.Depth; // BOAl
        
        // Compute the station positions scaled by LOA (Length Overall)
        const stationPositions = geometry.stations.map((station) => station * LOA);
        
        // Find the index and interpolation factor 'mu' for waterline height 'h'
        const { index, mu } = bisectionSearch(geometry.waterlines, h);
        
        // Get waterlines up to the found index, scaled by the hull's Depth
        const scaledWaterlines = geometry.waterlines.slice(0, index).map((waterline) => waterline * Depth);
        
        // Slice the corresponding part of the tables up to the scaled waterlines
        const slicedTables = tables.slice(0, scaledWaterlines.length).map((row) => {

            return row.map(value => value * BOA);

        });
        
        // Identify the last and the next lines in the table for interpolation
        const lastTableLine = slicedTables[slicedTables.length - 1];
        const nextTableLine = tables[scaledWaterlines.length].map(value => value * BOA);
        
        // Interpolate the values between the last and next table lines
        const interpolatedWaterlineRow = lastTableLine.map((value, i) => {

            return lerp(nextTableLine[i], value, mu);
        
        });
        
        // Append the hull's design draft to the scaled waterlines
        scaledWaterlines.push(hull.design_draft);
        
        // Add the interpolated waterline row to the sliced table
        slicedTables.push(interpolatedWaterlineRow);
        
        return {
            "x": stationPositions,
            "z": scaledWaterlines,
            "submerged_table": slicedTables,
            "waterline_row": interpolatedWaterlineRow
        };

    }

    computeHydrostatics(x, z, submerged_table, waterline_row) {

        // Cross-section areas
        const cs_area = submerged_table[0].map( (_, i) => {
            
            const yi = submerged_table.map(row => row[i]);
            
            return 2 * simpsonIntegratorDiscrete(z, yi);

        });
        
        // Waterline areas
        const wl_area = submerged_table.map( row => {
            
            return 2 * simpsonIntegratorDiscrete(x, row);
            
        });

        const volume = simpsonIntegratorDiscrete(z, wl_area)
        const disp = 1025 * volume * 9.81

        const KB = geometricCenter(wl_area, z)
        const LCB = geometricCenter(cs_area, x)
        
        const { AWL, LCF, IT, Iy, IL } = trapezoidalIntegratorCoefficients(x, waterline_row)
        
        const TPC = AWL * 1.025 / 100

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
            "TPC": TPC
        }

    }

}