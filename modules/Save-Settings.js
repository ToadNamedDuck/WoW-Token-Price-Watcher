//We want to set the user's desired gold-maximum when we click the little save button.
document.addEventListener("click", e => {
    if(e.target.id === "pw-save-gold-max"){
        e.preventDefault();
        e.stopPropagation();

        let setValue;
        let setRegion;

            chrome.storage.local.set({"goldCap": document.getElementById("pw-gold-input-field").value})
            .then(() => chrome.storage.local.set({"wowRegion": document.getElementById("pw-preferred-region-select").value}))
            .then(async() => {
                setValue = await goldValueGetter();
                setRegion = await regionValueGetter();
            })
            .then(() => console.log(`User will be notified when WoW Token Price in "${setRegion}" region is at or below ${setValue} gold.`))
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