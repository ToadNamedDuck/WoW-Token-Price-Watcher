import { getTokenPrices } from "./modules/API-Manager";

chrome.runtime.onInstalled.addListener(async ({reason}) => {
    if(reason !== "install"){
        return;
    }

    //The following always happens when the extension is installed.

    //We make initial values for our extension's storage.

    await chrome.storage.local.create({"goldCap": 280000});//Default gold cap will be 280000
    await chrome.storage.local.create({"wowRegion": "us"});//Default region is US

    //Now we create the actual alarm, which works kind of like a cycling event.
    //Here we want to create the alarm, and every x minutes (later I will make an option to change this value) we fetch the token prices and compare.
    await chrome.alarms.create('WoW-Token-Fetch', {
        periodInMinutes: 5
    })
})
//The above function only really does anything if the app is being installed.
//Now we want to add some functionality for when the alarm goes off.

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if(alarm.name === "WoW-Token-Fetch"){
        const tokenPriceJson = await getTokenPrices();
        let desiredRegion;
        let goldLimit;
        let selectedRegionCurrentPrice = null;

        await chrome.storage.local.get("wowRegion").then((obj) => desiredRegion = obj.wowRegion)
        .then(() => chrome.storage.local.get("goldCap").then((obj) => goldLimit = obj.goldCap))
        .then(() => {
            if(tokenPriceJson.hasOwnProperty(desiredRegion)){
                selectedRegionCurrentPrice = tokenPriceJson[desiredRegion].current_price;
            }
        })
        
        if(selectedRegionCurrentPrice !== null){
            //Compare price, add our alert
            if(parseInt(selectedRegionCurrentPrice) <= parseInt(goldLimit)){
                chrome.notifications.create("PocketWatcherTokenNotification", {
                    title: "Token Price Below Threshold",
                    message: `Current WoW Token Prices in Region "${desiredRegion}" is ${selectedRegionCurrentPrice} gold.`,
                    priority: 2,
                    silent: false,
                    type: "basic",
                    eventTime: Date.now()
                })
            }

        }

    }
})