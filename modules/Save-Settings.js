//We want to set the user's desired gold-maximum when we click the little save button.
document.addEventListener("click", e => {
    if(e.target.id === "pw-save-gold-max"){
        e.preventDefault();
        e.stopPropagation();
        const oldValue = chrome.storage.local.get("gold-cap");
        const oldRegion = chrome.storage.local.get("wow-region");

            chrome.storage.local.set({"gold-cap": document.getElementById("pw-gold-input-field").value})
            chrome.storage.local.set({"wow-region": document.getElementById("pw-preferred-region-select").value})
            console.log(`The user will now be notified when the price of a WoW Token is at or below ${chrome.storage.local.get("gold-cap")}.`)
            console.log(`Previous value was ${oldValue}`);
            console.log(`------------`);
            console.log(`Saved region is: ${chrome.storage.local.get("wow-region")}. Old region was ${oldRegion}`);
    }
})