chrome.runtime.onInstalled.addListener(async ({reason}) => {
    if(reason !== "install"){
        return;
    }

    //The following always happens when the extension is installed.

    //We make initial values for our extension's storage.

    await chrome.storage.local.create({"gold-cap": 280000});//Default gold cap will be 280000
    await chrome.storage.local.create({"wow-region": "us"});//Default region is US

    //Now we create the actual alarm, which works kind of like a cycling event.
    //Here we want to create the alarm, and every x minutes (later I will make an option to change this value) we fetch the token prices and compare.
    await chrome.alarms.create('WoW-Token-Fetch', {
        periodInMinutes: 5
    })
})
//The above function only really does anything if the app is being installed.
//Now we want to add some functionality for when the alarm goes off.