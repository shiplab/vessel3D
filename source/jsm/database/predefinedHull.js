const wigleyConstants = wigley_formula();

function wigley_formula() {
    /*
    This is a partial and simplified approach to the water lines using
    the wrigley formulas.
    The main goal is to use the Tiago formula in: http://shiplab.hials.org/app/shiplines/
    However, this application would require more effort due to complex of the formulas used
    
    As a bypass for creating the features, the wigley formula as defined by:
    https://kth.diva-portal.org/smash/get/diva2:1236507/FULLTEXT01.pdf
    Chapter 2.5.1
    The formula was modified for an non dimensional format
    */

    const waterLineSteps = 20;
    const stationSteps = 40;

    const halfBreadths = {
        waterlines: [],
        stations: [],
        table: [],
    };

    for (let i = 0; i <= waterLineSteps; i++) {
        const wl = i / waterLineSteps;
        halfBreadths.waterlines.push(wl);

        const valuesArray = [];

        for (let j = 0; j <= stationSteps; j++) {
            const st = j / stationSteps;

            const y = (1 - (2 * (st - 0.5)) ** 2) * (1 - (wl - 1) ** 2);

            valuesArray.push(y);
        }

        halfBreadths.table.push(valuesArray);
    }

    halfBreadths.stations = Array.from({length: stationSteps + 1}, (_, j) => j / stationSteps);

    return halfBreadths;
}

export const PREDEFINED_HULLS = {
    // ----------------------------------------- //
    barge: {
        halfBreadths: {
            waterlines: [0, 0, 1],
            stations: [0, 1],
            table: [
                [0, 0],
                [1, 1],
                [1, 1],
            ],
        },
        attributes: {
            LOA: 20,
            BOA: 10,
            Depth: 5,
            APP: 0,
            structureWeight: 200000, //kg
        },
        style: {
            opacity: 0.5,
        },
        design_draft: 3,
    },
    // ----------------------------------------- //
    wigleyHull: {
        halfBreadths: {
            waterlines: wigleyConstants.waterlines,
            stations: wigleyConstants.stations,
            table: wigleyConstants.table,
        },
        attributes: {
            LOA: 20,
            BOA: 10,
            Depth: 4,
            APP: 0,
            structureWeight: 50000, //kg
        },
        style: {
            opacity: 0.5,
        },
    },
};
