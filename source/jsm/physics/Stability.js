import {WeightsAndCenters} from "./WeightsAndCenters.js";
import {HullHydrostatics} from "./Hydrostatic.js";
import {bisectionSearch, lerp} from "../math/interpolation.js";

export class HullStability extends HullHydrostatics {
    // NOTE: (@Ferrari212) Hull stability will need the ship in this case
    // That assumption was chosen because of the multitude of variables
    // involved.

    constructor(ship) {
        const DRAFT_BYPASS = ship.hull.attributes.Depth / 2;

        super(ship.hull, DRAFT_BYPASS, false);

        this.ship = ship;
        this.weightsAndCenters = new WeightsAndCenters(this.ship);
        this.lightWeight = this.weightsAndCenters.lightWeight;
        this.calculatedDraft = this.findDraft();
        this._updateCenters();
    }

    _updateStability() {
        this.weightsAndCenters._calculateWeights(this.ship);
        this.weightsAndCenters._calculateCG(this.ship);

        this.calculatedDraft = this.findDraft();

        this._updateCenters();
    }

    _updateCenters() {
        this.updateHydrostatic(this.calculatedDraft);

        this.LCG = this.weightsAndCenters.cg.x;
        this.TCG = this.weightsAndCenters.cg.y;
        this.KG = this.weightsAndCenters.cg.z;

        const BG = this.KB - this.KG;
        this.GM = this.BM - BG; // this.KB + this.BM - this.KG; the traditional equation (Birian eq. 2.20)
        this.GML = this.BML - BG;
    }

    findDraft() {
        const hydrostaticTable = this.retrieveHydrostaticCurves();

        const draftArrays = [];
        const displacementsArray = [];

        for (const table of hydrostaticTable) {
            draftArrays.push(table.draft);
            displacementsArray.push(table.disp);
        }

        const DISP = this.weightsAndCenters.displacement;

        const {index, mu} = bisectionSearch(displacementsArray, DISP);

        if (index == undefined)
            throw new Error("Index from bisection section is undefined, potentially mean that the total weight will be to LOW for a draft search");

        const draft = lerp(draftArrays[index], draftArrays[index + 1], mu);

        return draft;
    }

    calculateStaticalStability() {
        // Obs: Only small angles implemented.
        // TODO: Implement the case for large angles.
        let heel = Math.atan(-this.TCG / this.GM);
        let trim = Math.atan((this.LCG - this.LCB) / this.GML);

        heel = Math.abs(heel) < 0.001 ? 0 : parseFloat(heel.toFixed(3));
        trim = Math.abs(trim) < 0.001 ? 0 : parseFloat(trim.toFixed(3));

        return {heel, trim};
    }
}
