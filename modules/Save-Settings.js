//We want to set the user's desired gold-maximum when we click the little save button.
document.addEventListener("click", e => {
    if(e.target.id === "pw-save-gold-max"){
        e.preventDefault();
        e.stopPropagation();

            chrome.storage.local.set({"goldCap": document.getElementById("pw-gold-input-field").value})
            .then(() => chrome.storage.local.set({"wowRegion": document.getElementById("pw-preferred-region-select").value}))
            .then(() => {
                const setValue = goldValueGetter();
                const setRegion = regionValueGetter();
                console.log(`User will be notified when WoW Token Price in "${setRegion}" region is at or below ${setValue} gold.`)
            })
    }
})

async function goldValueGetter(){
    const currentGoldValue = await chrome.storage.local.get("goldCap");
    return currentGoldValue;
}

async function regionValueGetter(){
    const currentRegion = await chrome.storage.local.get("wowRegion");
    return currentRegion;
}