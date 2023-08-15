//We want to set the user's desired gold-maximum when we click the little save button.
document.addEventListener("click", e => {
    if(e.target.id === "pw-save-gold-max"){
        e.preventDefault();
        e.stopPropagation();
        const oldValue = chrome.storage.local.get("gold-cap");

        if(e.target.value === typeof("number")){
            chrome.storage.local.set({"gold-cap": e.target.value})
            console.log(`The user will now be notified when the price of a WoW Token is at or below ${chrome.storage.local.get("gold-cap")}.`)
            console.log(`Previous value was ${oldValue}`);
        }
    }
})