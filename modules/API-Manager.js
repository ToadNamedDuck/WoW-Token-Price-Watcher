export function getTokenPrices(){
    return fetch("https://wowtokenprices.com/current_prices.json", {
        method: "GET"
    }).then(resp => resp.json())
}