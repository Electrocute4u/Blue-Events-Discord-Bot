const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
/**
 * Convert an amount from USD to the selected currency.
 * @param {number|string} amount - The amount in listed currency.
 * @param {string} base - The base currency (default: "USD").
 * @param {string} target - The target currency (default: "USD").
 * @returns {Promise<string>} - The converted amount formatted with two decimals.
 */

async function convertCurrency(base = "USD", amount, target = "USD") {
    try {
        amount = parseFloat(amount);
        if (isNaN(amount)) throw new Error("Invalid amount");

        if (base.toUpperCase() === target.toUpperCase()) {
            return `${amount.toFixed(2)} ${target}`;
        }

        const url = `https://api.frankfurter.app/latest?from=${base.toUpperCase()}&to=${target.toUpperCase()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.rates || !data.rates[target.toUpperCase()]) throw new Error("Invalid conversion result");

        const convertedAmount = amount * data.rates[target.toUpperCase()];
        return `${convertedAmount.toFixed(2)} ${target}`;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        return `${amount.toFixed(2)} ${base}`;
    }
}

module.exports = { convertCurrency };