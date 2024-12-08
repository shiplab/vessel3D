import {sumArray} from "./arrayOperations.js";

export function trapezoidalIntegratorCoefficients(x, y) {
    // From table 4.1 Birian
    // Different from the example on Birian, the half breadth is already scaled
    const N = x.length;

    if (N < 2) {
        throw new Error("At least two data points are required.");
    }

    let h = x[1] - x[0]; // Assuming equally spaced points

    let multiplier = Array(N).fill(1.0);
    multiplier[0] = multiplier[N - 1] = 0.5;

    // Create the storage of coefficients
    let func_areas = [],
        func_moments = [],
        fm_long = [],
        fm_trans = [];

    for (let i = 0; i < N; i++) {
        const fa = multiplier[i] * y[i];
        const fm = fa * x[i];
        const fm_l = fm * x[i];
        const fm_t = multiplier[i] * y[i] * y[i] * y[i];

        func_areas.push(fa);
        func_moments.push(fm);
        fm_long.push(fm_l);
        fm_trans.push(fm_t);
    }

    const func_of_areas = sumArray(func_areas);
    const func_of_moments = sumArray(func_moments);
    const func_of_ix = sumArray(fm_long);
    const func_of_it = sumArray(fm_trans);

    const AWL = 2 * h * func_of_areas;
    const LCF = func_of_moments / func_of_areas;
    const IT = (2 / 3) * func_of_it * h;
    const Iy = 2 * func_of_ix * h;
    const IL = Iy - Math.pow(LCF, 2) * AWL;

    return {
        AWL: AWL,
        LCF: LCF,
        IT: IT,
        Iy: Iy,
        IL: IL,
    };
}

function trapezoidalIntegrator(x, y) {}

export function simpsonIntegrator(func, a, b, n) {
    // Ensure n is even for Simpson's rule, but allow odd to use 3/8 rule
    if (n % 2 !== 0) {
        console.log("Number of intervals is odd, applying Simpson's 3/8 rule to the last three intervals.");
        n -= 3; // Reduce by 3 to handle the last 3 intervals separately
    }

    let h = (b - a) / n;
    let sum = func(a) + func(b);

    // Apply Simpson's 1/3 rule to the first (n-3) intervals
    for (let i = 1; i < n; i += 2) {
        sum += 4 * func(a + i * h);
    }

    for (let i = 2; i < n - 1; i += 2) {
        sum += 2 * func(a + i * h);
    }

    sum *= h / 3;

    // If n was odd, apply Simpson's 3/8 rule to the last three intervals
    if ((n + 3) % 2 !== 0) {
        let h38 = (b - (a + n * h)) / 3;
        let x1 = a + n * h;
        let x2 = x1 + h38;
        let x3 = x2 + h38;

        sum += ((3 * h38) / 8) * (func(x1) + 3 * func(x2) + 3 * func(x3) + func(b));
    }

    return sum;
}

export function simpsonIntegratorDiscrete(x, y) {
    // Equivalent from the Composite Simpson's rule for irregularly spaced data
    // "https://en.wikipedia.org/wiki/Simpson's_rule" for python

    const n = x.length - 1;

    if (n < 1) {
        throw new Error("At least two data points are required.");
    }

    if (n != y.length - 1) {
        throw new Error("x and y must be from the same size");
    }

    if (n === 1) {
        // If there's only one interval, just use the trapezoidal rule
        const h = x[1] - x[0];
        return (h * (y[0] + y[1])) / 2;
    }

    // Calculate h as the difference between consecutive x values
    let h = [];
    for (let i = 0; i < n; i++) {
        h.push(x[i + 1] - x[i]);
    }

    let result = 0.0;

    for (let i = 1; i < n; i += 2) {
        let h0 = h[i - 1];
        let h1 = h[i];

        // If any interval have 0 verify which of the m have numeric value different than 0 and apply trapezoidal integration
        if (h0 === 0.0 || h1 === 0.0) {
            result += (h0 * (y[i] + y[i - 1])) / 2;
            result += (h1 * (y[i + 1] + y[i])) / 2;

            continue;
        }

        let hph = h1 + h0;
        let hdh = h1 / h0;
        let hmh = h1 * h0;

        result += (hph / 6) * ((2 - hdh) * y[i - 1] + (hph ** 2 / hmh) * y[i] + (2 - 1 / hdh) * y[i + 1]);
    }

    if (n % 2 === 1) {
        let h0 = h[n - 2];
        let h1 = h[n - 1];

        // Skip the last interval if any difference is zero
        if (h0 !== 0 && h1 !== 0) {
            result += (y[n] * (2 * h1 ** 2 + 3 * h0 * h1)) / (6 * (h0 + h1));
            result += (y[n - 1] * (h1 ** 2 + 3 * h1 * h0)) / (6 * h0);
            result -= (y[n - 2] * h1 ** 3) / (6 * h0 * (h0 + h1));
        }
    }

    return result;
}

function linspace(a, b, n) {
    // Function adopted from numeric.js
    // Retunr an array with n-elements linearly spaced between a and b

    if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
    if (n < 2) {
        return n === 1 ? [a] : [];
    }
    let i,
        ret = Array(n);
    n--;
    for (i = n; i >= 0; i--) {
        ret[i] = (i * b + (n - i) * a) / n;
    }
    return ret;
}
