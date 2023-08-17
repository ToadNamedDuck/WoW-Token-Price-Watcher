//async for creating the timer with initialized values
async function initialTimerCreate() {
    console.log("creating a timer")
    await chrome.alarms.get("WoW-Token-Fetch").then(async (alarm) => {
        if (alarm === undefined) {
            await chrome.storage.local.get("refreshPeriodInMinutes").then(async obj => {
                console.log(obj)
                await chrome.alarms.create('WoW-Token-Fetch', {
                    periodInMinutes: parseInt(obj.refreshPeriodInMinutes)
                }
                )
            }).then(async () => await chrome.alarms.get("WoW-Token-Fetch").then((alarm) => console.log(alarm)))
        }
    })
}

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== "install") {
        return;
    }

    //The following always happens when the extension is installed.

    //We make initial values for our extension's storage.
    //Default gold cap will be 280000
    //Default region is US
    //Set the default refresh period to 10 minutes
    console.log("initializing");
    await chrome.storage.local.set({ "goldCap": 280000 })
        .then(async () => await chrome.storage.local.set({ "wowRegion": "us" }))
        .then(async () => await chrome.storage.local.set({ "refreshPeriodInMinutes": 10 }))
        .then(async () => await initialTimerCreate())
})
//The above function only really does anything if the app is being installed.
//Now we want to add some functionality for when the alarm goes off.

//Now we create the actual alarm, which works kind of like a cycling event.
//Here we want to create the alarm, and every x minutes (later I will make an option to change this value) we fetch the token prices and compare.

//Make an alarm on startup, only if there isn't one with the same name. (which means we don't immediately replace the alarm if this is ran during install. lol)

chrome.runtime.onStartup.addListener(async () => {
    await chrome.alarms.get("WoW-Token-Fetch").then(async(alarm) => {
        if(alarm !== undefined){
            return;
        }
        
        await chrome.storage.local.get("refreshPeriodInMinutes").then(async (obj) => {
            if(obj !== undefined){
                const timeInMinutes = obj.refreshPeriodInMinutes
                
                await chrome.alarms.create("WoW-Token-Fetch", {
                    periodInMinutes: timeInMinutes
                }).then((alarm) => console.log(alarm));
            }
        })
    })
})

chrome.runtime.onMessage.addListener(async (message) => {
    if (!message.event) {
        return; //We return here because obviously this isn't the message that we sent.
    }
    if (message.event === "Token-Price-Watcher-Setting-Changes") {
        console.log("received message");
        chrome.alarms.clear("WoW-Token-Fetch");
        //Make the new alarm with updated settings.
        console.log("Alarm deleted");
        chrome.alarms.create('WoW-Token-Fetch', {
            periodInMinutes: parseInt(await chrome.storage.local.get("refreshPeriodInMinutes").then((obj) => obj.refreshPeriodInMinutes))
        }).then(() => chrome.alarms.get("WoW-Token-Fetch").then((alarm) => console.log(alarm)))
        console.log("new alarm created.")
    }
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "WoW-Token-Fetch") {
        const tokenPriceJson = await fetch("https://wowtokenprices.com/current_prices.json", {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache"
            }
        }).then(resp => resp.json())

        let desiredRegion;
        let goldLimit;
        let selectedRegionCurrentPrice = null;

        await chrome.storage.local.get("wowRegion").then((obj) => desiredRegion = obj.wowRegion)
            .then(async () => await chrome.storage.local.get("goldCap").then((obj) => goldLimit = obj.goldCap))
            .then(() => {
                if (tokenPriceJson.hasOwnProperty(desiredRegion)) {
                    selectedRegionCurrentPrice = tokenPriceJson[desiredRegion].current_price;
                }
            }).then(async () => {
                if (selectedRegionCurrentPrice !== null) {
                    //Compare price, add our alert
                    if (parseInt(selectedRegionCurrentPrice) <= parseInt(goldLimit)) {
                        await chrome.notifications.create("PocketWatcherTokenNotification", {
                            title: "Token Price Below Threshold",
                            message: `Current WoW Token Prices in Region "${desiredRegion}" is ${selectedRegionCurrentPrice} gold.`,
                            priority: 2,
                            silent: false,
                            type: "basic",
                            eventTime: Date.now(),
                            iconUrl: "pictures/icon128.png"
                        })
                    }
                }
            })
    }
})