const fs = require('fs');

console.log('reading file')
let rawdata = fs.readFileSync('data.json')
console.log('parsing file')
let items = JSON.parse(rawdata)
console.log('file parsed')

const result = {}

const rareFrrMap = {
    "Drakestone": 14,
    "Archivist Cape": 15,
    "Elemental Plate Girdle": 10,
    "Gyth's Skull": 14,
    "Atal'ai Spaulders": 19,
    "Atal'ai Gloves": 19,
    "Phasing Boots": 18,
    "Archaedic Stone": 16,
    "Charged Gear": 13,
    "Flameweave Cuffs": 15,
    "Fluctuating Cloak": 15,
    "Tearfall Bracers": 15,
    "Vice Grips": 17,
    "Dimly Opalescent Ring": 17,
    "Tribal War Feathers": 14,
    "Drakeclaw Band": 19,
    "Dragonskin Cowl": 14,
    "Dragoneye Coif": 14,
    "Atal'ai Breastplate": 25,
    "Cinderhide Armsplints": 15,
    "Fervent Helm": 14,
    "Darkwater Bracers": 14,
    "Pyremail Wristguards": 15,
    "Foresight Girdle": 20,
}

const slotMods = {
    Head: 1,
    Chest: 1,
    Legs: 1,
    Shoulder: 1.35,
    Hands: 1.35,
    Waist: 1.35,
    Feet: 1.35,
    Finger: 1.85,
    Back: 1.85,
    Wrist: 1.85,
    Neck: 1.85,
    Ranged: 3.33,
    Shield: 1.92,
    'Held In Off-hand': 1.92,
}

const qualityMultipliers = {
    Uncommon: 1.21,
    Rare: 1.42,
}

const qualitySubtractors = {
    Uncommon: 9.8,
    Rare: 4.2,
}

items.forEach(item => {
    if (item['class'] !== 'Armor' && item['class'] !== 'Weapon' && item['class'] !== 'Trade Goods') {
        return
    }
    let frr = 0
    let ilvl = -9999999
    let random = false
    const {quality, slot, name} = item
    item.tooltip.forEach(line => {
        if (line.label == '<Random enchantment>') {
            if (quality == 'Uncommon' && item['class'] === 'Armor') {
                const slotMod = slotMods[slot]
                const statMod = slot === 'Finger' ? 170 : 230
                const qualityMultiplier = qualityMultipliers[quality]
                const qualitySubtractor = qualitySubtractors[quality]
                frr = Math.round(((qualityMultiplier * ilvl - qualitySubtractor) * 100) / (statMod*slotMod))
                random = true
            } else if (quality == 'Rare') {
                frr = rareFrrMap[name]
                random = true
            }
        }

        const words = line.label.split(' ')
        if (words[1] == 'Frost' && words[2] == 'Resistance') {
            frr = +words[0]
        } else if (words[0] = 'Item' && words[1] == 'Level') {
            ilvl = +words[2]
        }
    })
    if (frr > 0) {
        console.log(`${item.name} - ${frr}`)
        result[item.itemId] = {frr, quality: item.quality, name}
        if (random) {
            result[item.itemId].random = true
        }
    }
})

fs.writeFileSync('frr-data.json', JSON.stringify(result));
console.log('results saved')

