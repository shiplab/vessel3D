

export class HullStability {
    // NOTE: (@Ferrari212) Hull stability will need the ship in this case
    // That assumption was chosen because of the multitude of variables 
    // involved. 

    constructor(ship) {

        this.lightWeight = this.calculateLightWeight(hull)

    }

    calculateLightWeight(hull) {
        // Calculates the lightweight (displacement weight) of the hull.
        // This function first checks if a design draft is specified in the hull attributes.
        // If the design draft is not available or is invalid (negative), it estimates the 
        // total weight displaced by matching it with the corresponding volume to determine
        // an approximate operational draft.

    }

}

class WeightsAndCenters {
    // Class ot store all the centers and weights from the ship

    constructor(ship) {

        this.lightWeight = this.calculateLightWeight(ship)
        this.deadWeight = this.calculateDeadWeight(ship)

    }

    /**
     * Calculates the lightship weight of the ship.
     * The lightship weight includes the weight of the hull, engine, equipment, 
     * and any permanent structures.
     * @returns {number} The lightship weight in metric tons.
     */
    calculateLightshipWeight() {

        let weight = 0.0

        const structureWeight = ship.hull.hasAttribute("hullWeight") ? ship.hull.structureWeight : 0;
        weight += structureWeight

        // TODO: Make the application of the equipment weight
        // const equipmentWeight = ship.equipments.reduce((e, currentValue) => e.weight + currentValue)
        
        // TODO: Make the application of the equipment weight
        // const engineWeight = ship.engine.reduce((e, currentValue) => e.weight + currentValue)

        // Calculate compartments weight
        const compartmentWeight = ship.compartments.reduce((c, currentValue) => c.weight + currentValue)

        return structureWeight + compartmentWeight

    }

    /**
     * Calculates the deadweight of the ship.
     * Deadweight is the difference between the fully loaded displacement 
     * and the lightship weight, representing the ship's carrying capacity.
     * @returns {number} The deadweight in metric tons.
     */
    calculateDeadWeight() {

        const cargoWeight = this.sumWeight(ship.cargoCompartments)
        const fuelWeight = this.sumWeight(ship.fuelCompartments)
        const freshWaterWeight = this.sumWeight(ship.freshWater)

        return cargoWeight + fuelWeight + freshWaterWeight
    
    }

    /**
     * Calculates the total displacement of the ship.
     * Displacement is the sum of the lightship weight and deadweight.
     * @param {number} lightshipWeight - The lightship weight in metric tons.
     * @param {number} deadweight - The deadweight in metric tons.
     * @returns {number} The displacement in metric tons.
     */
    calculateDisplacement() {
        
    }

    /**
     * Calculates the weight of the cargo.
     * This may involve using the cargo manifest data or calculating based 
     * on cargo volume and density.
     * @param {number} volume - The volume of the cargo in cubic meters.
     * @param {number} density - The density of the cargo in metric tons per cubic meter.
     * @returns {number} The cargo weight in metric tons.
     */
    calculateCargoWeight() {

    }

    /**
     * Calculates the fuel weight based on the tank volume and fuel density.
     * @param {number} tankVolume - The volume of the fuel tank in cubic meters.
     * @param {number} fuelDensity - The density of the fuel in metric tons per cubic meter.
     * @returns {number} The fuel weight in metric tons.
     */
    calculateFuelWeight() {

    }

    /**
     * Calculates the total weight of the ship.
     * This is the sum of lightship weight, cargo weight, fuel weight, and ballast weight.
     * @param {number} lightshipWeight - The lightship weight in metric tons.
     * @param {number} cargoWeight - The cargo weight in metric tons.
     * @param {number} fuelWeight - The fuel weight in metric tons.
     * @param {number} ballastWeight - The ballast weight in metric tons.
     * @returns {number} The total weight of the ship in metric tons.
     */
    calculateTotalWeight() {

    }

    sumWeight(array) {
        // Sum the weight of an array of objects, in which the object weight is defined
        return array.reduce((arr, currentValue) => arr.weight + currentValue)
    }

}