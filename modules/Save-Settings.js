//We want to set the user's desired gold-maximum when we click the little save button.
document.addEventListener("click", e => {
    if(e.target.id === "pw-save-gold-max"){
        e.preventDefault();
        e.stopPropagation();

        let setValue;
        let setRegion;
        let setTimer;

            chrome.storage.local.set({"goldCap": document.getElementById("pw-gold-input-field").value})
            .then(() => chrome.storage.local.set({"wowRegion": document.getElementById("pw-preferred-region-select").value}))
            .then(() => chrome.storage.local.set({"refreshPeriodInMinutes": document.getElementById("refreshTimeSelect").value}))
            .then(async() => {
                setValue = await goldValueGetter();
                setRegion = await regionValueGetter();
                setTimer = await refreshTimerGetter();
            })
            .then(async () => await chrome.runtime.sendMessage({event: "Token-Price-Watcher-Setting-Changes"}))//Want to send out an event to update/build a new alarm.
            .then(() => window.alert(`Watching for WoW Tokens in "${setRegion}" region below ${setValue} gold. Prices will be checked every ${setTimer} minutes.`))
    }
})

async function goldValueGetter(){
    let goldValue;
    await chrome.storage.local.get("goldCap").then(value => {
        goldValue = value
    })
    return goldValue.goldCap;
}

async function regionValueGetter(){
    let selectedRegion;
    await chrome.storage.local.get("wowRegion").then(region => {
        selectedRegion = region
    })
    return selectedRegion.wowRegion
}

async function refreshTimerGetter(){
    let refreshTimer;
    await chrome.storage.local.get("refreshPeriodInMinutes").then((obj) => {
        refreshTimer = obj.refreshPeriodInMinutes
    });
    return refreshTimer;
}