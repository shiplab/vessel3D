
export class WeightsAndCenters {
    // Class ot store all the centers and weights from the ship

    constructor(ship) {

        this.lightWeight = this.calculateLightWeight(ship)
        // TODO: Make the function for the Dead Weight
        // this.deadWeight = this.calculateDeadWeight(ship)

        // Displacement is the sum of the lightship weight and deadweight.
        // this.displacement = this.lightWeight + this.deadWeight
        this.displacement = this.lightWeight * 9.81 // Newtons
        
    }

    /**
     * Calculates the lightship weight of the ship.
     * The lightship weight includes the weight of the hull, engine, equipment, 
     * and any permanent structures.
     * @returns {number} The lightship weight in metric tons.
     */
    calculateLightWeight(ship) {

        let weight = 0.0
        
        if(!ship.hull.hasOwnProperty("structureWeight")) {
            throw new Error("Attribute 'structureWeight' is not defined in the hull object. Please, insert attribute for the stability calculation.")
        }

        const structureWeight = ship.hull.structureWeight
        weight += structureWeight

        // TODO: Make the application of the equipment weight
        // const equipmentWeight = ship.equipments.reduce((e, currentValue) => e.weight + currentValue)
        
        // TODO: Make the application of the equipment weight
        // const engineWeight = ship.engine.reduce((e, currentValue) => e.weight + currentValue)

        // Calculate compartments weight
        const compartmentWeight = ship.compartments.reduce((currentValue, c) => currentValue + c.weight, 0)
        return structureWeight + compartmentWeight

    }

    /**
     * Calculates the deadweight of the ship.
     * Deadweight is the difference between the fully loaded displacement 
     * and the lightship weight, representing the ship's carrying capacity.
     * @returns {number} The deadweight in metric tons.
     */
    calculateDeadWeight(ship) {

        const cargoWeight = this.sumWeight(ship.cargoCompartments)
        const fuelWeight = this.sumWeight(ship.fuelCompartments)
        const freshWaterWeight = this.sumWeight(ship.freshWaterCompartments)

        return cargoWeight + fuelWeight + freshWaterWeight
    
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