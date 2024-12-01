
export class WeightsAndCenters {
    // Class ot store all the centers and weights from the ship

    constructor(ship) {

        // Weights

        this.lightWeight = this.calculateLightWeight(ship)
        // TODO: Make the function for the Dead Weight
        // this.deadWeight = this.calculateDeadWeight(ship)

        
        // Displacement is the sum of the lightship weight and deadweight.
        // this.displacement = this.lightWeight + this.deadWeight
        this.displacement = this.lightWeight * 9.81 // Newtons
        
        // Centers
        this.cg = this._updateCG(ship)

        
    }

    _updateCG(ship) {
        const attributes = ship.hull.attributes

        // Approximating ship center as the half depth, beam and length
        const cgShip = {
            x: attributes.LOA / 2,
            y: 0, // No acentric
            z: attributes.Depth / 2
        }

        // TODO: Generalize function to non homogenous compartments
        const cgCompartments = this.calculateCenter(ship.compartments, this.compartmentWeight)
        
        const cgResult = {
            x: (cgShip.x * this.structureWeight + cgCompartments.x * this.compartmentWeight) / this.lightWeight,
            y: (cgShip.y * this.structureWeight + cgCompartments.y * this.compartmentWeight) / this.lightWeight,
            z: (cgShip.z * this.structureWeight + cgCompartments.z * this.compartmentWeight) / this.lightWeight
        };

        return cgResult

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

        this.structureWeight = ship.hull.structureWeight
        // weight += this.structureWeight

        // TODO: Make the application of the equipment weight
        // const equipmentWeight = ship.equipments.reduce((e, currentValue) => e.weight + currentValue)
        
        // TODO: Make the application of the equipment weight
        // const engineWeight = ship.engine.reduce((e, currentValue) => e.weight + currentValue)

        // Calculate compartments weight
        this.compartmentWeight = this.sumWeight(ship.compartments)
        return this.structureWeight + this.compartmentWeight

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
        return array.reduce((currentValue, arr) => currentValue + arr.weight, 0)
    }

    calculateCenter(compartmentsArray, total_weight) {

        if(total_weight === 0.0) {
            return {x: 0.0, y: 0.0, z: 0.0}
        }
                
        const x = compartmentsArray.reduce((currentValue, arr) => currentValue + arr.xpos * arr.weight, 0) / total_weight
        const y = compartmentsArray.reduce((currentValue, arr) => currentValue + arr.ypos * arr.weight, 0) / total_weight
        const z = compartmentsArray.reduce((currentValue, arr) => currentValue + arr.zpos * arr.weight, 0) / total_weight

        return {x, y, z}

    }

}