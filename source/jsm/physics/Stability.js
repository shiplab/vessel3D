
import { WeightsAndCenters } from "./WeightsAndCenters.js"
import { HullHydrostatics } from "./Hydrostatic.js"
import { bisectionSearch, lerp } from "../math/interpolation.js"

export class HullStability extends HullHydrostatics{
    // NOTE: (@Ferrari212) Hull stability will need the ship in this case
    // That assumption was chosen because of the multitude of variables 
    // involved. 

    constructor(ship) {

        const hull = ship.hull
        const DRAFT_BYPASS = hull.attributes.Depth / 2

        super(ship.hull, DRAFT_BYPASS, false)

        this.weightsAndCenters = new WeightsAndCenters(ship)
        this.lightWeight = this.weightsAndCenters.lightWeight
        this.calculatedDraft = this.findDraft()
        this.updateHydrostatic(this.calculatedDraft)

        this.LCG = this.weightsAndCenters.cg.x
        this.KG = this.weightsAndCenters.cg.z
        this.GM = this.KB + this.BM - this.KG

    }

    findDraft() {

        const hydrostaticTable = this.retrieveHydrostaticCurves()

        const draftArrays = []
        const displacementsArray = []
        
        for(const table of hydrostaticTable) {

            draftArrays.push(table.draft)
            displacementsArray.push(table.disp)
        
        }

        const DISP = this.weightsAndCenters.displacement

        const { index, mu } = bisectionSearch(displacementsArray, DISP)

        if (index == undefined) throw new Error("Index from bisection section is undefined, potentially mean that the total weight will be to LOW for a draft search")

        const draft = lerp(draftArrays[index], draftArrays[index + 1], mu)

        return draft

    }

}
