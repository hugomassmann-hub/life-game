let xp = Number(localStorage.getItem("xp")) || 0;

const items = [
    {
        id: "beanie",
        name: "Beanie",
        image: "beanie.png",
        unlockLevel: 2,

        homeWidth: 24,
        homeTop: -4,

        customizeWidth: 24,
        customizeTop: -4
    },

    {
        id: "glasses",
        name: "Cool Glasses",
        image: "glasses.png",
        unlockLevel: 3,

        homeWidth: 20,
        homeTop: 14,

        customizeWidth: 20,
        customizeTop: 14
    },

    {
        id: "sword",
        name: "Sword",
        image: "sword.png",
        unlockLevel: 4,
        homeWidth: 61,
        homeTop: 47,

        customizeWidth: 61,
        customizeTop: 47
    }
];
const itemsContainer =
    document.getElementById("itemsContainer");


const customizeCharacter =
    document.querySelector(".customize-character");


const homeCharacter =
    document.getElementById("character");


let equippedItems =
    JSON.parse(
        localStorage.getItem("equippedItems")
    ) || [];
    
async function saveEquippedItemsToCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) {
        return;
    }

    try {

        await window.firebaseSetDoc(
            window.firebaseDoc(
                window.firebaseDB,
                "users",
                user.uid
            ),
            {
                equippedItems: equippedItems
            },
            { merge: true }
        );

    } catch (error) {

        console.error("ITEM SAVE ERROR:", error);

    }
}
    
function createEquippedItem(
    item,
    character,
    isHome
) {

    const image =
        document.createElement("img");

    image.src =
        item.image;

    image.className =
        "equipped-item";

        if (item.id === "sword") {
    image.style.transform =
        "translateX(-44%) rotate(180deg)";
}

    image.dataset.itemId =
        item.id;

    const imageWrap =
        character.querySelector(".character-image-wrap");

    if (!imageWrap) return;

    if (isHome) {

        image.style.width =
            item.homeWidth + "%";

        image.style.top =
            item.homeTop + "%";

    } else {

        image.style.width =
            item.customizeWidth + "%";

        image.style.top =
            item.customizeTop + "%";

    }

    imageWrap.appendChild(image);
}

function renderEquippedItems() {

    document
        .querySelectorAll(".equipped-item")
        .forEach(function(image) {

            image.remove();

        });

    const mapTargets = document.querySelectorAll(".home-character-target");

    equippedItems.forEach(
        function(itemId) {

            const item =
                items.find(
                    function(item) {
                        return item.id === itemId;
                    }
                );


            if (!item) {
                return;
            }


           createEquippedItem(
    item,
    customizeCharacter,
    false
);

createEquippedItem(
    item,
    homeCharacter,
    true
);

mapTargets.forEach(function(target) {
    createEquippedItem(item, target, true);
});

        }
    );
}

function renderItemsList() {

itemsContainer.innerHTML = "";

items.forEach(function(item) {

    const itemElement =

        document.createElement("div");

    itemElement.className = "item";

        const level = getLevelFromXP(xp);


    if (level >= item.unlockLevel) {

        itemElement.innerHTML =
            "🧢 " +
            item.name +
            "<span></span>";


        const status =
            itemElement.querySelector("span");


        if (
            equippedItems.includes(
                item.id
            )
        ) {

            status.textContent =
                "Unequip";

        } else {

            status.textContent =
                "Equip";
        }


        itemElement.addEventListener(
            "click",
            function() {

                const index =
                    equippedItems.indexOf(
                        item.id
                    );


                if (index !== -1) {

                    equippedItems.splice(
                        index,
                        1
                    );

                    status.textContent =
                        "Equip";

                } else {

                    equippedItems.push(
                        item.id
                    );

                    status.textContent =
                        "Unequip";
                }


                localStorage.setItem(
                    "equippedItems",
                    JSON.stringify(
                        equippedItems
                    )
                );

                saveEquippedItemsToCloud();

                    renderEquippedItems();

            }
        );

    } else {

        itemElement.innerHTML =
            "🧢 " +
            item.name +
            "<span>🔒 Level " +
            item.unlockLevel +
            "</span>";
    }


        itemsContainer.appendChild(
        itemElement
    );

});

}

renderItemsList();


renderEquippedItems();

let savedDate = localStorage.getItem("questDate");
let today = new Date().toDateString();

let completedQuests = [];

if (savedDate === today) {

    completedQuests =
        JSON.parse(localStorage.getItem("completedQuests")) || [];

} else {

    localStorage.setItem("questDate", today);

    localStorage.setItem(
        "completedQuests",
        JSON.stringify([])
    );

    localStorage.removeItem("todaysQuests");
}

let streak =
    Number(localStorage.getItem("streak")) || 0;

let lastStreakDate =
    localStorage.getItem("lastStreakDate");


const xpText =
    document.getElementById("xpText");

const xpBar =
    document.querySelector(".xp-bar");

const levelText =
    document.getElementById("levelText");

const streakText =
    document.getElementById("streakText");

const commonQuest =
    document.getElementById("commonQuest");

const uncommonQuest =
    document.getElementById("uncommonQuest");

const rareQuest =
    document.getElementById("rareQuest");


const quests = {

    common: [

        { name: "Read for 20 minutes", emoji: "📚", xp: 75 },

        { name: "Make your bed", emoji: "🛏️", xp: 50 },

        {
            name: "Have a real conversation with a friend",
            emoji: "💬",
            xp: 75
        },

        { name: "Clean part of your room", emoji: "🧹", xp: 75 },

        {
            name: "Spend 15 minutes outside",
            emoji: "🌿",
            xp: 75
        },

        {
            name: "Draw or create something",
            emoji: "🎨",
            xp: 75
        }

    ],


    uncommon: [

        {
            name: "Go for a bike ride",
            emoji: "🚴",
            xp: 150
        },

        {
            name: "Go for a 30-minute walk or run",
            emoji: "🏃",
            xp: 125
        },

        {
            name: "Play a sport for 30 minutes",
            emoji: "🏀",
            xp: 150
        },

        {
            name: "Explore a new trail",
            emoji: "🌳",
            xp: 150
        },

        {
            name: "Spend 30 minutes without your phone",
            emoji: "📵",
            xp: 125
        },

        {
            name: "Practice an instrument for 30 minutes",
            emoji: "🎸",
            xp: 125
        }

    ],


    rare: [

        {
            name: "Watch a sunset",
            emoji: "🌅",
            xp: 200
        },

        {
            name: "Watch a sunrise",
            emoji: "🌄",
            xp: 250
        },

        {
            name: "Visit somewhere you've never been",
            emoji: "🗺️",
            xp: 250
        },

        {
            name: "Go on a bigger outdoor adventure",
            emoji: "🏔️",
            xp: 250
        },

        {
            name: "Create something you're proud of",
            emoji: "🎨",
            xp: 200
        },

        {
            name: "Spend an hour doing something you love without your phone",
            emoji: "📵",
            xp: 200
        }

    ]

};


function getRandomQuest(category) {

    let questList =
        quests[category];

    let randomIndex =
        Math.floor(
            Math.random() * questList.length
        );

    return questList[randomIndex];
}

let savedQuests =
    localStorage.getItem("todaysQuests");

let todaysQuests;


if (savedQuests) {

    todaysQuests =
        JSON.parse(savedQuests);

} else {

    todaysQuests = {

        common:
            getRandomQuest("common"),

        uncommon:
            getRandomQuest("uncommon"),

        rare:
            getRandomQuest("rare")

    };

    localStorage.setItem(
        "todaysQuests",
        JSON.stringify(todaysQuests)
    );
}


function displayQuest(
    element,
    quest,
    rarity
) {

    element.classList.add(rarity);

    let questName =
        rarity + "-" + quest.name;


    if (completedQuests.includes(questName)) {

       element.innerHTML =
    "✅ Quest completed! +" +
    quest.xp +
    " XP";

element.classList.add(
    "completed"
);
        return;
    }


    element.innerHTML =
        "<strong>" +
        rarity.toUpperCase() +
        "</strong><br>" +
        quest.emoji +
        " " +
        quest.name +
        "<span class='xp-text'> +" +
        quest.xp +
        " XP</span>";
}


displayQuest(
    commonQuest,
    todaysQuests.common,
    "common"
);

displayQuest(
    uncommonQuest,
    todaysQuests.uncommon,
    "uncommon"
);

displayQuest(
    rareQuest,
    todaysQuests.rare,
    "rare"
);

displayQuest(
    document.getElementById("pageCommonQuest"),
    todaysQuests.common,
    "common"
);

displayQuest(
    document.getElementById("pageUncommonQuest"),
    todaysQuests.uncommon,
    "uncommon"
);

displayQuest(
    document.getElementById("pageRareQuest"),
    todaysQuests.rare,
    "rare"
);

    function updateGame() {

    let level = 1;
    let xpNeeded = 350;
    let xpIntoLevel = xp;

    while (xpIntoLevel >= xpNeeded) {

        xpIntoLevel -= xpNeeded;
        level++;

        xpNeeded += 150;
    }

    let percentage =
        (xpIntoLevel / xpNeeded) * 100;


    levelText.textContent =
        "Level " + level;

xpText.textContent =
    "XP: " +
    xpIntoLevel +
    " / " +
    xpNeeded;

        document.getElementById("mobileLevel").textContent =
    "Level " + level;

document.getElementById("mobileXP").textContent =
    "XP: " + xpIntoLevel + " / " + xpNeeded;

    xpBar.style.width =
        percentage + "%";


    streakText.textContent =
        "🔥 " +
        streak +
        " Day Streak";

        document.getElementById("characterStreak").textContent =
    
    "🔥 " + streak + " Day Streak";

    renderItemsList();
}

function updateStreak() {

    const todayDate =
        new Date().toDateString();

    if (lastStreakDate === todayDate) {
        return;
    }

    if (lastStreakDate) {

        const yesterday =
            new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        if (
            lastStreakDate ===
            yesterday.toDateString()
        ) {

            streak =
                streak + 1;

        } else {

            streak = 1;

        }

    } else {

        streak = 1;

    }

    lastStreakDate =
        todayDate;

    localStorage.setItem(
        "streak",
        streak
    );

        localStorage.setItem(
        "lastStreakDate",
        lastStreakDate
    );

    saveStreakToCloud();

    updateGame();
}

function completeQuest(
    element,
    quest,
    questName,
    bossInfo
) {
    if (
        !bossInfo &&
        completedQuests.includes(
            questName
        )
    ) {
        return;
    }

    document.getElementById("questDescription").value = "";
    document.getElementById("questPhoto").value = "";
    document.getElementById("photoPreview").innerHTML = "";

    document.getElementById("questPopup").style.display =
        "flex";

    document.getElementById("popupQuestName").textContent =
        quest.emoji + " " + quest.name;

    document.getElementById("questPopup").dataset.questName =
        questName;

    document.getElementById("questPopup").dataset.questXP =
        quest.xp;

    document.getElementById("questPopup").dataset.elementId =
        element ? element.id : "";

    document.getElementById("questPopup").dataset.questTitle =
        quest.name;

    document.getElementById("questPopup").dataset.questEmoji =
        quest.emoji;

    document.getElementById("questPopup").dataset.questRarity =
        bossInfo ? "boss" : questName.split("-")[0];

    document.getElementById("questPopup").dataset.questType =
        bossInfo ? "boss" : "daily";

    if (bossInfo) {
        document.getElementById("questPopup").dataset.bossId = bossInfo.bossId;
        document.getElementById("questPopup").dataset.bossStepIndex = bossInfo.stepIndex;
    } else {
        delete document.getElementById("questPopup").dataset.bossId;
        delete document.getElementById("questPopup").dataset.bossStepIndex;
    }
}

commonQuest.addEventListener(
    "click",
    function() {

        completeQuest(
            commonQuest,
            todaysQuests.common,
            "common-" +
            todaysQuests.common.name
        );
    }
);

uncommonQuest.addEventListener(
    "click",
    function() {

        completeQuest(
            uncommonQuest,
            todaysQuests.uncommon,
            "uncommon-" +
            todaysQuests.uncommon.name
        );

    }
);


rareQuest.addEventListener(
    "click",
    function() {

        completeQuest(
            rareQuest,
            todaysQuests.rare,
            "rare-" +
            todaysQuests.rare.name
        );

    }
);


// OPEN CUSTOMIZE PAGE

function openCustomize() {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("accountPage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";

    document.getElementById("customizePage").style.display =
        "block";
}


// CLOSE CUSTOMIZE PAGE

function closeCustomize() {

    document.getElementById("customizePage").style.display =
        "none";

    document.getElementById("homePage").style.display =
        "block";

    setActiveTab("tabHomeButton");
}

document.getElementById("tabCustomizeButton").addEventListener(
    "click",
    function() {
        openCustomize();
        setActiveTab("tabCustomizeButton");
    }
);

// START GAME

updateGame();

// NOTE: MapLibre uses [longitude, latitude] (the reverse of Leaflet)
const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [-122.4194, 37.7749],
    zoom: 14,
    pitch: 55,
    bearing: -15,
    maxPitch: 70
});

map.addControl(new maplibregl.NavigationControl(), "bottom-right");

// DARK GREEN FANTASY MAP COLORS
function applyFantasyColors() {

    const layers = map.getStyle().layers;

    layers.forEach(function(layer) {

        const id = layer.id.toLowerCase();

        try {

            if (layer.type === "background") {
                map.setPaintProperty(layer.id, "background-color", "#24452f");
            }

            else if (layer.type === "fill") {

                let color = "#2a4d33"; // default land

                if (id.includes("water")) color = "#1f5560";
                else if (id.includes("wood") || id.includes("forest")) color = "#2c5e37";
                else if (id.includes("park") || id.includes("grass") || id.includes("landcover")) color = "#356b3f";
                else if (id.includes("sand") || id.includes("beach")) color = "#8a7a4a";
                else if (id.includes("building")) color = "#4a4636";

                map.setPaintProperty(layer.id, "fill-color", color);
            }

            else if (layer.type === "fill-extrusion") {
                map.setPaintProperty(layer.id, "fill-extrusion-color", "#4a4636");
            }

            else if (layer.type === "line") {

                if (id.includes("waterway") || id.includes("water")) {
                    map.setPaintProperty(layer.id, "line-color", "#2a6f7a");
                }
                else if (id.includes("road") || id.includes("bridge") || id.includes("tunnel") || id.includes("path") || id.includes("street")) {
                    map.setPaintProperty(layer.id, "line-color", "#e2d3a8");
                }
            }

            else if (layer.type === "symbol") {
                map.setPaintProperty(layer.id, "text-color", "#f0e4bd");
                map.setPaintProperty(layer.id, "text-halo-color", "#12261a");
                map.setPaintProperty(layer.id, "text-halo-width", 1.5);
            }

        } catch (e) {
            // Some layers don't support a property. Skip them.
        }
    });
}

map.on("load", applyFantasyColors);

// ===== TREES =====

function makeTreeImage(kind) {

    const W = 128;
    const H = 160;

    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");

    // Seeded random: each tree type always looks the same
    let seed = 1;
    for (let i = 0; i < kind.length; i++) {
        seed = (seed * 31 + kind.charCodeAt(i)) % 2147483646 + 1;
    }
    function rand() {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    }

    // Ground shadow
    g.fillStyle = "rgba(0,0,0,0.3)";
    g.beginPath();
    g.ellipse(64, 150, 32, 8, 0, 0, Math.PI * 2);
    g.fill();

    function trunk(topY, wBottom, wTop) {
        g.fillStyle = "#3b2616";
        g.beginPath();
        g.moveTo(64 - wBottom / 2, 152);
        g.lineTo(64 - wTop / 2, topY);
        g.lineTo(64 + wTop / 2, topY);
        g.lineTo(64 + wBottom / 2, 152);
        g.closePath();
        g.fill();

        // lighter left side
        g.fillStyle = "#5a3d24";
        g.beginPath();
        g.moveTo(64 - wBottom / 2, 152);
        g.lineTo(64 - wTop / 2, topY);
        g.lineTo(64 - wTop / 2 + wTop * 0.35, topY);
        g.lineTo(64 - wBottom / 2 + wBottom * 0.35, 152);
        g.closePath();
        g.fill();
    }

    // Tiny glowing specks, for the fantasy feel
    function sparkles(cx, cy, spread, count) {
        for (let i = 0; i < count; i++) {
            const angle = rand() * Math.PI * 2;
            const dist = Math.sqrt(rand()) * spread;
            g.fillStyle = "rgba(190,255,210,0.85)";
            g.beginPath();
            g.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist * 0.85, 1.6 + rand() * 1.2, 0, Math.PI * 2);
            g.fill();
        }
    }

    // ===== OAK =====
    if (kind.indexOf("oak") === 0) {

        const wide = kind === "oak-b";
        const cy = wide ? 62 : 66;
        const s = wide ? 1.12 : 1;

        function blobs(color, count, bx, by, spread, rMin, rMax) {
            g.fillStyle = color;
            for (let i = 0; i < count; i++) {
                const angle = rand() * Math.PI * 2;
                const dist = Math.sqrt(rand()) * spread * s;
                const x = bx + Math.cos(angle) * dist * 1.1;
                const y = by + Math.sin(angle) * dist * 0.85;
                const r = rMin + rand() * (rMax - rMin);
                g.beginPath();
                g.arc(x, y, r, 0, Math.PI * 2);
                g.fill();
            }
        }

        trunk(100, 16, 10);

        blobs("#0d2a19", 16, 64, cy + 4, 34, 16, 24);
        blobs("#17442a", 13, 62, cy, 28, 12, 18);
        blobs("#26653a", 10, 57, cy - 6, 21, 8, 13);
        blobs("#3f8f52", 7, 51, cy - 12, 14, 4, 8);

    }

    // ===== PINE =====
    else {

        const tall = kind === "pine-b";

        const widths  = tall ? [38, 34, 29, 23, 17] : [48, 42, 35, 26];
        const bottoms = tall ? [130, 108, 86, 64, 42] : [128, 102, 78, 54];
        const heights = tall ? 34 : 40;
        const colors  = ["#0b2a1a", "#0f3221", "#133b26", "#184530", "#1d5136"];

        trunk(bottoms[0], 10, 7);

        widths.forEach(function(halfW, i) {

            const cy = bottoms[i];
            const h = heights + 8;
            const apexY = cy - h;
            const steps = 4;

            const left = [];
            const right = [];

            for (let n = 1; n <= steps; n++) {
                const t = n / steps;
                const yy = apexY + h * t;
                const ww = halfW * t;

                left.push([64 - ww, yy]);
                right.push([64 + ww, yy]);

                if (n < steps) {
                    const inner = ww * 0.72;
                    const iy = yy + (h / steps) * 0.28;
                    left.push([64 - inner, iy]);
                    right.push([64 + inner, iy]);
                }
            }

            function tierPath() {
                g.beginPath();
                g.moveTo(64, apexY);
                left.forEach(function(p) { g.lineTo(p[0], p[1]); });
                g.lineTo(64, cy + 5);
                for (let k = right.length - 1; k >= 0; k--) {
                    g.lineTo(right[k][0], right[k][1]);
                }
                g.closePath();
            }

            // dark base
            tierPath();
            g.fillStyle = colors[i];
            g.fill();

            // lighter left side, fading toward the middle
            g.save();
            tierPath();
            g.clip();
            const grad = g.createLinearGradient(64 - halfW, 0, 70, 0);
            grad.addColorStop(0, "rgba(70,170,110,0.55)");
            grad.addColorStop(1, "rgba(70,170,110,0)");
            g.fillStyle = grad;
            g.fillRect(0, 0, W, H);
            g.restore();
        });

    }

    return g.getImageData(0, 0, W, H);
}

// Same input always gives the same number between 0 and 1,
// so trees stay put instead of jumping around
function treeHash(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
    return n - Math.floor(n);
}

let treeQueryLayers = [];
let waterQueryLayers = [];
let treesNeedUpdate = true;

const emptyTrees = { type: "FeatureCollection", features: [] };

function setupTrees() {

    map.addImage("tree-pine-a", makeTreeImage("pine-a"), { pixelRatio: 4 });
map.addImage("tree-pine-b", makeTreeImage("pine-b"), { pixelRatio: 4 });
map.addImage("tree-oak-a", makeTreeImage("oak-a"), { pixelRatio: 4 });
map.addImage("tree-oak-b", makeTreeImage("oak-b"), { pixelRatio: 4 });

    map.addSource("trees", { type: "geojson", data: emptyTrees });

    // Put trees under the text labels
    const firstSymbol = map.getStyle().layers.find(function(l) {
        return l.type === "symbol";
    });

    map.addLayer({
        id: "trees-layer",
        type: "symbol",
        source: "trees",
        layout: {
            "icon-image": ["get", "kind"],
            "icon-anchor": "bottom",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-sort-key": ["get", "sortKey"],
            "icon-size": [
    "interpolate", ["linear"], ["zoom"],
    9, 0.6,
    12, 0.9,
    14, 1.2,
    16, 1.7,
    18, 2.3,
    19, 3
]
        }
    }, firstSymbol ? firstSymbol.id : undefined);

    // Which map layers count as "green areas" where trees can grow
    treeQueryLayers = map.getStyle().layers.filter(function(l) {
        const id = l.id.toLowerCase();
        return l.type === "fill" &&
            (id.includes("wood") || id.includes("forest") ||
             id.includes("park") || id.includes("grass"));
    }).map(function(l) { return l.id; });

waterQueryLayers = map.getStyle().layers.filter(function(l) {
    const id = l.id.toLowerCase();
    return l.type === "fill" && id.includes("water") && !id.includes("waterway");
}).map(function(l) { return l.id; });

    console.log("Tree layers:", treeQueryLayers);
}

function updateTrees() {

    const source = map.getSource("trees");

    if (!source || treeQueryLayers.length === 0) return;

    const zoom = map.getZoom();

    if (zoom < 7) {
        source.setData(emptyTrees);
        return;
    }

    // Grid cell is about 30 pixels wide at the current whole zoom level
    const cell = (360 / (256 * Math.pow(2, zoom))) * 20;

    const canvas = map.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const seen = {};
    const features = [];

    // Skip the top of the screen (sky/horizon when tilted)
    for (let sy = height; sy > height * 0.1; sy -= 10) {

        for (let sx = 0; sx < width; sx += 10) {

            const ll = map.unproject([sx, sy]);

            const ix = Math.floor(ll.lng / cell);
            const iy = Math.floor(ll.lat / cell);
            const key = ix + "_" + iy;

            if (seen[key]) continue;
            seen[key] = true;

            const lng = (ix + 0.15 + treeHash(ix, iy, 1) * 0.7) * cell;
            const lat = (iy + 0.15 + treeHash(ix, iy, 2) * 0.7) * cell;

            const pt = map.project([lng, lat]);

            const hits = map.queryRenderedFeatures(pt, { layers: treeQueryLayers });

            if (hits.length === 0) continue;

            // Skip spots that are actually water
if (waterQueryLayers.length > 0 &&
    map.queryRenderedFeatures(pt, { layers: waterQueryLayers }).length > 0) continue;

            // Forests get lots of trees, parks and grass get fewer
            const id = hits[0].layer.id.toLowerCase();
            const isForest = id.includes("wood") || id.includes("forest");
            const chance = isForest ? 1 : 0.75;

            if (treeHash(ix, iy, 3) > chance) continue;

            features.push({
                type: "Feature",
                geometry: { type: "Point", coordinates: [lng, lat] },
                properties: {
                    kind: ["tree-pine-a", "tree-pine-b", "tree-oak-a", "tree-oak-b"][Math.floor(treeHash(ix, iy, 4) * 4)],
                    sortKey: -lat * 100000
                }
            });

            if (features.length > 5000) break;
        }
    }

    source.setData({ type: "FeatureCollection", features: features });
}

map.on("load", setupTrees);

map.on("moveend", function() {
    treesNeedUpdate = true;
});

map.on("idle", function() {
    if (treesNeedUpdate) {
        treesNeedUpdate = false;
        updateTrees();
    }
});

let characterMarker = null;

function placeCharacterOnMap(lat, lng) {

    if (characterMarker) {
        characterMarker.setLngLat([lng, lat]);
        return;
    }

    const CHAR_W = 80;              // character width in pixels (was 50)
const CHAR_H = CHAR_W * 1.4;    // height follows the width

const el = document.createElement("div");
el.className = "map-character-marker";
el.style.width = (CHAR_W + 20) + "px";
el.style.height = (CHAR_H + 20) + "px";
el.innerHTML =
    '<div class="home-character-target map-character-icon">' +
    '<div class="character-image-wrap"><img src="Level 1.png" alt="You"></div>' +
    '</div>';

// The inner box must match the marker size, or the feet float above the ground
const icon = el.querySelector(".map-character-icon");
const wrap = el.querySelector(".character-image-wrap");
const img = el.querySelector(".character-image-wrap img");

icon.style.width = el.style.width;
icon.style.height = el.style.height;

wrap.style.width = CHAR_W + "px";
wrap.style.height = CHAR_H + "px";
wrap.style.position = "absolute";
wrap.style.bottom = "0";
wrap.style.left = "50%";
wrap.style.transform = "translateX(-50%)";

img.style.width = CHAR_W + "px";
img.style.height = "auto";
img.style.display = "block";

    characterMarker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);

    renderEquippedItems();
}

// Show the character right away, then move it to your real location
placeCharacterOnMap(37.7749, -122.4194);

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            placeCharacterOnMap(lat, lng);
            map.flyTo({ center: [lng, lat], zoom: 16 });
        },

        function(error) {
            // Temporary, so we can see why location fails. We'll remove it later.
            alert("Location problem: " + error.message);
        },

        { enableHighAccuracy: true, timeout: 10000 }

    );
}

function closeQuests() {
    document.getElementById("questPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
    setActiveTab("tabHomeButton");
}

document.getElementById("pageCommonQuest").addEventListener(
    "click",
    function() {
        completeQuest(
            document.getElementById("pageCommonQuest"),
            todaysQuests.common,
            "common-" + todaysQuests.common.name
        );
    }
);

document.getElementById("pageUncommonQuest").addEventListener(
    "click",
    function() {
        completeQuest(
            document.getElementById("pageUncommonQuest"),
            todaysQuests.uncommon,
            "uncommon-" + todaysQuests.uncommon.name
        );
    }
);

document.getElementById("pageRareQuest").addEventListener(
    "click",
    function() {
        completeQuest(
            document.getElementById("pageRareQuest"),
            todaysQuests.rare,
            "rare-" + todaysQuests.rare.name
        );
    }
);

document.getElementById("closeQuestPopup").onclick = function() {
    document.getElementById("questPopup").style.display = "none";
};

document.getElementById("pastQuestsPage").style.display = "none";
document.getElementById("feedPage").style.display = "none";

document.getElementById("pastQuestsButton").onclick = function() {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "block";

    loadPastQuests();

};

document.getElementById("tabFeedButton").onclick = function() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("accountPage").style.display = "none";
    document.getElementById("feedPage").style.display = "block";
    loadFeed();
    setActiveTab("tabFeedButton");
};

document.getElementById("feedTabEveryone").onclick = function() {
    feedFilter = "everyone";
    document.getElementById("feedTabEveryone").classList.add("active");
    document.getElementById("feedTabFollowing").classList.remove("active");
    loadFeed();
};

document.getElementById("feedTabFollowing").onclick = function() {
    feedFilter = "following";
    document.getElementById("feedTabFollowing").classList.add("active");
    document.getElementById("feedTabEveryone").classList.remove("active");
    loadFeed();
};

// FRIENDS PAGE

document.getElementById("friendsPage").style.display = "none";

document.getElementById("accountFriendsButton").onclick = function() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("accountPage").style.display = "none";
    document.getElementById("friendsPage").style.display = "block";
    searchUsers();
};

document.getElementById("friendsBackButton").onclick = function() {
    document.getElementById("friendsPage").style.display = "none";
    document.getElementById("accountPage").style.display = "block";
};

// FRIEND SEARCH

async function searchUsers() {

    const container = document.getElementById("friendsContainer");
    const searchText = document.getElementById("friendSearchInput").value.trim().toLowerCase();
    const user = window.firebaseAuth.currentUser;

    if (!user) {
        container.innerHTML = "<p>Please sign in to search for players.</p>";
        return;
    }

        if (!searchText) {
        loadFollowingList();
        return;
    }

    container.innerHTML = "<p>Searching...</p>";

    try {

        const snapshot = await window.firebaseGetDocs(
            window.firebaseQuery(
                window.firebaseCollection(window.firebaseDB, "users"),
                window.firebaseWhere("usernameLower", ">=", searchText),
                window.firebaseWhere("usernameLower", "<=", searchText + "\uf8ff"),
                window.firebaseLimit(10)
            )
        );

        container.innerHTML = "";

        let found = 0;

        snapshot.forEach(function(userDoc) {

            if (userDoc.id === user.uid) return;

            found++;

            const card = document.createElement("div");
            card.className = "friend-result";
                        card.textContent = "👤 " + userDoc.data().username;

            card.onclick = function() {
                openProfile(userDoc.id);
            };

            container.appendChild(card);
        });

        if (found === 0) {
            container.innerHTML = "<p>No players found.</p>";
        }

    } catch (error) {

        console.error("SEARCH ERROR:", error);
        container.innerHTML = "<p>Search failed: " + error.message + "</p>";
    }
}

document.getElementById("friendSearchButton").onclick = searchUsers;

let searchTimer;

document.getElementById("friendSearchInput").addEventListener("input", function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchUsers, 300);
});

document.getElementById("friendSearchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        clearTimeout(searchTimer);
        searchUsers();
    }
});

document.getElementById("questPhoto").addEventListener(
    "change",
    function() {

        if (this.files.length > 0) {

            console.log(
                "Photo selected:",
                this.files[0].name
            );

        }

    }
);

document.getElementById("pastQuestsBackButton").onclick = function() {

    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("questPage").style.display = "block";

};

function handleQuestCompletion(shouldPost) {

    const popup =
        document.getElementById("questPopup");

    const questName =
        popup.dataset.questName;

    const questXP =
        Number(popup.dataset.questXP);

    const elementId =
        popup.dataset.elementId;

    const description =
        document.getElementById("questDescription").value;

    const photo =
        document.getElementById("questPhoto").files[0];

        const element =
        elementId ? document.getElementById(elementId) : null;

    const bossId = popup.dataset.bossId;
    const bossStepIndex = popup.dataset.bossStepIndex !== undefined
        ? Number(popup.dataset.bossStepIndex)
        : undefined;

    const pastQuests =
        JSON.parse(localStorage.getItem("pastQuests")) || [];


        function finishQuest(photoData) {

                if (bossId !== undefined && bossStepIndex !== undefined) {
            finishBossStep(bossId, bossStepIndex, questXP, popup, photoData, description, shouldPost);
            return;
        }

        const newQuest = {
            quest: popup.dataset.questTitle || questName,
            emoji: popup.dataset.questEmoji || "",
            rarity: popup.dataset.questRarity || "common",
            type: popup.dataset.questType || "daily",
            description: description,
            date: new Date().toLocaleString(),
            photo: photoData
        };

        pastQuests.push(newQuest);

        saveQuestToCloud(newQuest);

        if (shouldPost) {
            saveFeedPostToCloud(newQuest);
        }

        xp = xp + questXP;

        saveXPToCloud();

        completedQuests.push(
            questName
        );

        saveCompletedQuestsToCloud();

        localStorage.setItem(
            "xp",
            xp
        );

        localStorage.setItem(
            "completedQuests",
            JSON.stringify(
                completedQuests
            )
        );

        updateStreak();
        updateGame();

        element.innerHTML =
            "✅ Quest completed! +" +
            questXP +
            " XP";

        element.classList.add(
            "completed"
        );

        displayQuest(
            document.getElementById("pageCommonQuest"),
            todaysQuests.common,
            "common"
        );

        displayQuest(
            document.getElementById("pageUncommonQuest"),
            todaysQuests.uncommon,
            "uncommon"
        );

        displayQuest(
            document.getElementById("pageRareQuest"),
            todaysQuests.rare,
            "rare"
        );

        popup.style.display = "none";
    }


    if (photo) {

        const reader =
            new FileReader();

        reader.onload = function() {

            const img =
                new Image();

            img.onload = function() {

                const canvas =
                    document.createElement("canvas");

                const maxSize = 600;

                let width = img.width;
                let height = img.height;

                if (width > height) {

                    if (width > maxSize) {

                        height =
                            height * (maxSize / width);

                        width = maxSize;

                    }

                } else {

                    if (height > maxSize) {

                        width =
                            width * (maxSize / height);

                        height = maxSize;

                    }

                }

                canvas.width = width;
                canvas.height = height;

                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                const compressedPhoto =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.7
                    );

                finishQuest(compressedPhoto);

            };

            img.src = reader.result;

        };

        reader.readAsDataURL(photo);

    } else {

        finishQuest("");

    }

}
document.getElementById("questPhoto").addEventListener(
    "change",
    function() {

        const file =
            this.files[0];

        const preview =
            document.getElementById("photoPreview");

        if (!file) {

            preview.innerHTML = "";

            return;
        }

        const image =
            document.createElement("img");

        image.src =
            URL.createObjectURL(file);

        image.className =
            "quest-photo-preview";

        preview.innerHTML = "";

        preview.appendChild(image);

    }
);

document.getElementById("completeQuestButton").onclick =
    function() {

        handleQuestCompletion(false);

    };


document.getElementById("completeAndPostButton").onclick =
    function() {

        handleQuestCompletion(true);

    };

async function loadPastQuests() {

    const container =
        document.getElementById("pastQuestsContainer");

    const user =
        window.firebaseAuth.currentUser;

    if (!user) {
        container.innerHTML =
            "<p>Please sign in to view your past quests.</p>";
        return;
    }

    const snapshot = await window.firebaseGetDocs(
        window.firebaseCollection(
            window.firebaseDB,
            "users",
            user.uid,
            "pastQuests"
        )
    );

    container.innerHTML = "";

    const quests = [];

    snapshot.forEach(function(doc) {
        quests.push(doc.data());
    });

    quests.reverse().forEach(function(quest) {

        const questElement =
            document.createElement("div");

        questElement.className = "past-quest";

        questElement.innerHTML =
            "<strong>" + escapeHTML(cleanQuestName(quest.quest)) + "</strong><br>" +
            (quest.photo
                ? "<div class='past-quest-photo'><img src='" + escapeHTML(quest.photo) + "'></div><br>"
                : "") +
            escapeHTML(quest.description) + "<br>" +
            "<small>" + escapeHTML(quest.date) + "</small>";

        container.appendChild(questElement);

    });

}

let feedFilter = "everyone";
let feedLastDoc = null;
let feedHasMore = true;
let feedIsLoading = false;
let feedLeftoverPosts = { common: [], uncommon: [] };
const FEED_PAGE_SIZE = 10;

async function loadFeed() {

    feedLastDoc = null;
    feedHasMore = true;
    feedLeftoverPosts = { common: [], uncommon: [] };

    document.getElementById("feedContainer").innerHTML = "<p>Loading...</p>";

    await loadMoreFeedPosts(true);
}

async function loadMoreFeedPosts(isFirstLoad) {

    if (feedIsLoading) return;
    feedIsLoading = true;

    await waitForFirebaseAuth();

    const container = document.getElementById("feedContainer");
    const user = window.firebaseAuth.currentUser;

        if (!user) {
        container.innerHTML = "<p>Please sign in to view the Feed.</p>";
        feedIsLoading = false;
        return;
    }

    const currentUserId = user.uid;

    if (!feedHasMore) {
        feedIsLoading = false;
        return;
    }

    const queryParts = [];

        if (feedFilter === "following") {

        const mySnapshot = await window.firebaseGetDoc(
            window.firebaseDoc(window.firebaseDB, "users", currentUserId)
        );

        let followingIds = mySnapshot.exists() ? (mySnapshot.data().following || []) : [];
        followingIds = followingIds.slice(0, 30);

        if (followingIds.length === 0) {
            followingIds = ["__none__"];
        }

        queryParts.push(window.firebaseWhere("uid", "in", followingIds));
    }

    queryParts.push(window.firebaseOrderBy(window.firebaseDocumentId(), "desc"));

    if (feedLastDoc) {
        queryParts.push(window.firebaseStartAfter(feedLastDoc));
    }

    queryParts.push(window.firebaseLimit(FEED_PAGE_SIZE));

    let snapshot;

    try {

        snapshot = await window.firebaseGetDocs(
            window.firebaseQuery(
                window.firebaseCollection(window.firebaseDB, "feedPosts"),
                ...queryParts
            )
        );

        } catch (error) {

        console.error("FEED LOAD ERROR:", error);

        if (isFirstLoad) {
            container.innerHTML = "<p>Couldn't load the Feed: " + error.message + "</p>";
        }

        feedIsLoading = false;
        return;
    }

        const posts = [];

    snapshot.forEach(function(doc) {
        const post = doc.data();
        post.id = doc.id;

        if (post.uid !== currentUserId) {
            posts.push(post);
        }
    });

    if (snapshot.docs.length > 0) {
        feedLastDoc = snapshot.docs[snapshot.docs.length - 1];
    }

    if (posts.length < FEED_PAGE_SIZE) {
        feedHasMore = false;
    }

    if (isFirstLoad) {

        container.innerHTML = "";

        if (posts.length === 0) {
            container.innerHTML = feedFilter === "following"
                ? "<p>Nobody you follow has posted yet. Try Everyone, or follow more players!</p>"
                : "<p>No posts yet. Complete a quest and tap Complete & Post!</p>";
            return;
        }
    }

        const oldSentinel = document.getElementById("feedSentinel");
    if (oldSentinel) oldSentinel.remove();

    if (window.feedObserver) {
        window.feedObserver.disconnect();
    }

   const result = buildFeedSlides(posts, !feedHasMore, feedLeftoverPosts);

    feedLeftoverPosts = result.leftover;

    const myFollowing = await getMyFollowingList(currentUserId);

    result.slides.forEach(function(slide) {
        container.appendChild(renderFeedSlide(slide, currentUserId, myFollowing));
    });

        if (feedHasMore) {

        const sentinel = document.createElement("div");
        sentinel.id = "feedSentinel";
        sentinel.style.height = "1px";

        container.appendChild(sentinel);

        window.feedObserver = new IntersectionObserver(function(entries) {

            if (entries[0].isIntersecting) {

                window.feedObserver.disconnect();
                loadMoreFeedPosts(false);
            }

        }, {
            root: document.getElementById("feedContainer"),
            rootMargin: "400px"
        });

        window.feedObserver.observe(sentinel);

    } else {

        const endMessage = document.createElement("p");
        endMessage.className = "feed-end-message";
        endMessage.textContent = "You're all caught up 🎉";

        container.appendChild(endMessage);
    }

        feedIsLoading = false;
}

function createFeedPostElement(post, currentUserId, layout, myFollowing) {

    const rarity = getPostRarity(post);

    const postElement = document.createElement("div");

    postElement.className =
        "feed-post post-" + rarity + " layout-" + layout;

    const isMyPost = post.uid === currentUserId;
    const alreadyFollowing = myFollowing.includes(post.uid);

    postElement.innerHTML =
        "<div class='feed-post-header'>" +
        "<div class='feed-poster-row'>" +
        "<span class='feed-poster-name' data-uid='" + escapeHTML(post.uid || "") + "'>👤 " + escapeHTML(post.username) + "</span>" +
        (!isMyPost && post.uid
            ? "<button class='feed-follow-button" + (alreadyFollowing ? " following" : "") + "' data-uid='" + escapeHTML(post.uid) + "'>" +
              (alreadyFollowing ? "✓ Following" : "➕ Follow") +
              "</button>"
            : "") +
        "</div>" +
        "<span class='rarity-badge'>" + escapeHTML(getRarityLabel(rarity)) + "</span><br>" +
        "<strong>" + escapeHTML((post.emoji ? post.emoji + " " : "") + cleanQuestName(post.quest)) + "</strong>" +
        "</div>" +
        (post.photo
            ? "<div class='feed-photo'><img src='" + escapeHTML(post.photo) + "'></div>"
            : "") +
        "<div class='feed-post-body'>" +
        "<p>" + escapeHTML(post.description) + "</p>" +
        "<small>" + escapeHTML(post.date) + "</small>" +
        "</div>";

    const likedBy = post.likedBy || [];
    const startedLiked = likedBy.includes(currentUserId);

    const likeButton = document.createElement("button");

    likeButton.className = "like-button" + (startedLiked ? " liked" : "");
    likeButton.textContent = (startedLiked ? "❤️ " : "🤍 ") + (post.likes || 0);

    likeButton.onclick = async function() {

        const currentLikedBy = post.likedBy || [];
        const alreadyLiked = currentLikedBy.includes(currentUserId);

        const newLikes = alreadyLiked
            ? Math.max((post.likes || 0) - 1, 0)
            : (post.likes || 0) + 1;

        likeButton.className = "like-button" + (alreadyLiked ? "" : " liked");
        likeButton.textContent = (alreadyLiked ? "🤍 " : "❤️ ") + newLikes;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "feedPosts", post.id),
            {
                likes: newLikes,
                likedBy: alreadyLiked
                    ? window.firebaseArrayRemove(currentUserId)
                    : window.firebaseArrayUnion(currentUserId)
            },
            { merge: true }
        );

        post.likes = newLikes;

        post.likedBy = alreadyLiked
            ? currentLikedBy.filter(function(id) { return id !== currentUserId; })
            : currentLikedBy.concat(currentUserId);
    };

    postElement.appendChild(likeButton);

    const nameEl = postElement.querySelector(".feed-poster-name");

    if (nameEl && post.uid) {
        nameEl.onclick = function() {
            openProfile(post.uid);
        };
    }

    const followBtn = postElement.querySelector(".feed-follow-button");

    if (followBtn) {

        let isFollowing = alreadyFollowing;

        followBtn.onclick = async function() {

            followBtn.disabled = true;

            try {

                await window.firebaseSetDoc(
                    window.firebaseDoc(window.firebaseDB, "users", currentUserId),
                    {
                        following: isFollowing
                            ? window.firebaseArrayRemove(post.uid)
                            : window.firebaseArrayUnion(post.uid)
                    },
                    { merge: true }
                );

                isFollowing = !isFollowing;

                followBtn.textContent = isFollowing ? "✓ Following" : "➕ Follow";
                followBtn.className = "feed-follow-button" + (isFollowing ? " following" : "");

            } catch (error) {
                console.error("FEED FOLLOW ERROR:", error);
            }

            followBtn.disabled = false;
        };
    }

    return postElement;
}

function resetQuests() {

    localStorage.removeItem("completedQuests");
    localStorage.removeItem("todaysQuests");

    completedQuests = [];

    todaysQuests = {

    common: getRandomQuest("common"),

    uncommon: getRandomQuest("uncommon"),

    rare: getRandomQuest("rare")

};

saveTodaysQuestsToCloud();

    localStorage.setItem(
        "todaysQuests",
        JSON.stringify(todaysQuests)
    );

    commonQuest.classList.remove("completed");
uncommonQuest.classList.remove("completed");
rareQuest.classList.remove("completed");

document.getElementById("pageCommonQuest").classList.remove("completed");
document.getElementById("pageUncommonQuest").classList.remove("completed");
document.getElementById("pageRareQuest").classList.remove("completed");

    displayQuest(
        commonQuest,
        todaysQuests.common,
        "common"
    );

    displayQuest(
        uncommonQuest,
        todaysQuests.uncommon,
        "uncommon"
    );

    displayQuest(
        rareQuest,
        todaysQuests.rare,
        "rare"
    );

    displayQuest(
        document.getElementById("pageCommonQuest"),
        todaysQuests.common,
        "common"
    );

    displayQuest(
        document.getElementById("pageUncommonQuest"),
        todaysQuests.uncommon,
        "uncommon"
    );

    displayQuest(
        document.getElementById("pageRareQuest"),
        todaysQuests.rare,
        "rare"
    );

}

document.getElementById("resetQuestsButton").onclick = function() {
    resetQuests();
};

document.getElementById("tabAccountButton").onclick = function() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("accountPage").style.display = "block";
    setActiveTab("tabAccountButton");
};

document.getElementById("createAccountButton").onclick = async function() {

    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const message = document.getElementById("accountMessage");

    try {

        await createUserWithEmailAndPassword(
            window.firebaseAuth,
            email,
            password
        );

        message.textContent = "Account created! 🎉";

    } catch (error) {

        message.textContent = error.message;

    }

};
async function saveXPToCloud() {
    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    await window.firebaseSetDoc(
        window.firebaseDoc(window.firebaseDB, "users", user.uid),
        {
            xp: xp
        },
        { merge: true }
    );
}
async function saveQuestToCloud(questData) {
    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    await window.firebaseSetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid,
            "pastQuests",
            Date.now().toString()
        ),
        questData
    );
}

async function saveFeedPostToCloud(postData) {

    const user =
        window.firebaseAuth.currentUser;

    if (!user) return;

    await window.firebaseSetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "feedPosts",
            Date.now().toString()
        ),
        {
            quest: postData.quest,
            emoji: postData.emoji || "",
            rarity: postData.rarity || "common",
            type: postData.type || "daily",
            description: postData.description,
            date: postData.date,
            photo: postData.photo || "",
            username: user.displayName || "Player",
            uid: user.uid
        }
    );
}

async function loadStreakFromCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const userSnapshot = await window.firebaseGetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        )
    );

    if (userSnapshot.exists()) {

        const data = userSnapshot.data();

        if (data.streak !== undefined) {
            streak = data.streak;
        }

        if (data.lastStreakDate !== undefined) {
            lastStreakDate = data.lastStreakDate;
        }

        updateGame();
    }
}

window.loadXPFromCloud = async function() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const userSnapshot = await window.firebaseGetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        )
    );

    if (userSnapshot.exists()) {

        const data = userSnapshot.data();

        if (data.xp !== undefined) {
            xp = data.xp;
        }

        updateGame();
    }
}

async function saveCompletedQuestsToCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    await window.firebaseSetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        ),
        {
            completedQuests: completedQuests
        },
        { merge: true }
    );
}
async function loadCompletedQuestsFromCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const userSnapshot = await window.firebaseGetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        )
    );

    if (userSnapshot.exists()) {

        const data = userSnapshot.data();

        if (data.completedQuests !== undefined) {
            completedQuests = data.completedQuests;
            
        }

        
    }
}
async function saveTodaysQuestsToCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    await window.firebaseSetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        ),
        {
            todaysQuests: todaysQuests,
            questDate: today
        },
        { merge: true }
    );
}
async function loadTodaysQuestsFromCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const userSnapshot = await window.firebaseGetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        )
    );

    if (userSnapshot.exists()) {

        const data = userSnapshot.data();

       if (
    data.todaysQuests !== undefined &&
    data.questDate === today
) {

    todaysQuests = data.todaysQuests;

} else {

    saveTodaysQuestsToCloud();

}

        displayQuest(
            commonQuest,
            todaysQuests.common,
            "common"
        );

        displayQuest(
            uncommonQuest,
            todaysQuests.uncommon,
            "uncommon"
        );

        displayQuest(
            rareQuest,
            todaysQuests.rare,
            "rare"
        );

        displayQuest(
            document.getElementById("pageCommonQuest"),
            todaysQuests.common,
            "common"
        );

        displayQuest(
            document.getElementById("pageUncommonQuest"),
            todaysQuests.uncommon,
            "uncommon"
        );

        displayQuest(
            document.getElementById("pageRareQuest"),
            todaysQuests.rare,
            "rare"
        );
    }
}
async function loadEquippedItemsFromCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const userSnapshot = await window.firebaseGetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        )
    );

    if (userSnapshot.exists()) {

        const data = userSnapshot.data();

        if (data.equippedItems !== undefined) {

                        equippedItems = data.equippedItems;

            renderEquippedItems();
            renderItemsList();

        }
    }
}

// PROFILE PAGE

document.getElementById("profilePage").style.display = "none";

function getLevelFromXP(totalXP) {

    let level = 1;
    let xpNeeded = 350;
    let xpLeft = totalXP;

    while (xpLeft >= xpNeeded) {
        xpLeft -= xpNeeded;
        level++;
        xpNeeded += 150;
    }

    return level;
}

async function openProfile(uid) {

    const container = document.getElementById("profileContainer");

    document.getElementById("friendsPage").style.display = "none";
    document.getElementById("profilePage").style.display = "block";
    document.getElementById("profileUsername").textContent = "Loading...";
    container.innerHTML = "";

    try {

        const snapshot = await window.firebaseGetDoc(
            window.firebaseDoc(window.firebaseDB, "users", uid)
        );

        if (!snapshot.exists()) {
            document.getElementById("profileUsername").textContent = "Player";
            container.innerHTML = "<p>Player not found.</p>";
            return;
        }

        const data = snapshot.data();

        const level = getLevelFromXP(data.xp || 0);
        const streakCount = Number(data.streak) || 0;
        const equipped = data.equippedItems || [];

        document.getElementById("profileUsername").textContent =
            data.username || "Player";

        // Character with their equipped items
        const characterBox = document.createElement("div");
        characterBox.className = "customize-character";
        characterBox.innerHTML =
            '<div class="character-image-wrap">' +
            '<img src="Level 1.png" alt="Player character">' +
            '</div>';

        container.appendChild(characterBox);

        equipped.forEach(function(itemId) {

            const item = items.find(function(i) {
                return i.id === itemId;
            });

            if (item) {
                createEquippedItem(item, characterBox, false);
            }
        });

        // Stats
        const stats = document.createElement("div");
        stats.className = "profile-stats";
        stats.innerHTML =
            "<p>⭐ Level " + level + "</p>" +
            "<p>🔥 " + streakCount + " Day Streak</p>";

        container.appendChild(stats);

        // FOLLOW BUTTON

        const me = window.firebaseAuth.currentUser;

        if (me && me.uid !== uid) {

            const mySnapshot = await window.firebaseGetDoc(
                window.firebaseDoc(window.firebaseDB, "users", me.uid)
            );

            let isFollowing = false;

            if (mySnapshot.exists()) {
                isFollowing = (mySnapshot.data().following || []).includes(uid);
            }

            const followButton = document.createElement("button");
            followButton.id = "followButton";

            const updateFollowButton = function() {
                followButton.textContent = isFollowing ? "✓ Following" : "➕ Follow";
                followButton.className = isFollowing ? "following" : "";
            };

            updateFollowButton();

            followButton.onclick = async function() {

                followButton.disabled = true;

                try {

                    await window.firebaseSetDoc(
                        window.firebaseDoc(window.firebaseDB, "users", me.uid),
                        {
                            following: isFollowing
                                ? window.firebaseArrayRemove(uid)
                                : window.firebaseArrayUnion(uid)
                        },
                        { merge: true }
                    );

                    isFollowing = !isFollowing;
                    updateFollowButton();

                } catch (error) {
                    console.error("FOLLOW ERROR:", error);
                }

                followButton.disabled = false;
            };

            container.appendChild(followButton);
        }

    } catch (error) {

        console.error("PROFILE ERROR:", error);
        container.innerHTML = "<p>Couldn't load profile: " + error.message + "</p>";
    }
}

document.getElementById("profileBackButton").onclick = function() {
    document.getElementById("profilePage").style.display = "none";
    document.getElementById("friendsPage").style.display = "block";
    searchUsers();
};
async function saveStreakToCloud() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    await window.firebaseSetDoc(
        window.firebaseDoc(
            window.firebaseDB,
            "users",
            user.uid
        ),
        {
            streak: streak,
            lastStreakDate: lastStreakDate
        },
        { merge: true }
    );
}
// FOLLOWING LIST

async function loadFollowingList() {

    const container = document.getElementById("friendsContainer");
    const me = window.firebaseAuth.currentUser;

    if (!me) {
        container.innerHTML = "<p>Please sign in to see who you follow.</p>";
        return;
    }

    container.innerHTML = "<p>Loading...</p>";

    try {

        const mySnapshot = await window.firebaseGetDoc(
            window.firebaseDoc(window.firebaseDB, "users", me.uid)
        );

        const following = mySnapshot.exists()
            ? (mySnapshot.data().following || [])
            : [];

        // If you started typing while this loaded, don't overwrite the search results
        if (document.getElementById("friendSearchInput").value.trim()) return;

        if (following.length === 0) {
            container.innerHTML =
                "<p>You're not following anyone yet. Search above to find players!</p>";
            return;
        }

        const friendDocs = await Promise.all(
            following.map(function(uid) {
                return window.firebaseGetDoc(
                    window.firebaseDoc(window.firebaseDB, "users", uid)
                );
            })
        );

        if (document.getElementById("friendSearchInput").value.trim()) return;

        container.innerHTML = "<h2>Following (" + following.length + ")</h2>";

        friendDocs.forEach(function(friendDoc) {

            if (!friendDoc.exists()) return;

            const card = document.createElement("div");
            card.className = "friend-result";
            card.textContent = "👤 " + (friendDoc.data().username || "Player");

            card.onclick = function() {
                openProfile(friendDoc.id);
            };

            container.appendChild(card);
        });

    } catch (error) {

        console.error("FOLLOWING LIST ERROR:", error);
        container.innerHTML = "<p>Couldn't load your list: " + error.message + "</p>";
    }
}
// HTML SAFETY

function escapeHTML(text) {
    return String(text === undefined || text === null ? "" : text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// QUEST HELPERS

function cleanQuestName(name) {
    return String(name || "").replace(/^(common|uncommon|rare|boss)-/, "");
}

function getPostRarity(post) {
    if (post.rarity) return post.rarity;

    const prefix = String(post.quest || "").split("-")[0];

    return ["common", "uncommon", "rare", "boss"].includes(prefix)
        ? prefix
        : "common";
}

// BOSS QUESTS

const bossQuests = [
    {
        id: "summit-seeker",
        name: "Summit Seeker",
        emoji: "🏔️",
        category: "adventure",
        description: "Hike a trail you've never done that takes at least 2 hours, and reach the top or the end.",
        trophyName: "The Summit",
        rewardXP: 500,
        deadlineDays: null,
        steps: [
            { label: "Pick your trail and start hiking", xp: 100 },
            { label: "Reach the halfway point", xp: 150 },
            { label: "Reach the top or the end", xp: 250 }
        ]
    },
    {
        id: "century-ride",
        name: "Century Ride",
        emoji: "🚴",
        category: "fitness",
        description: "Bike 100 miles total within one week.",
        trophyName: "The Century",
        rewardXP: 600,
        deadlineDays: 7,
        steps: [
            { label: "Bike 25 miles total", xp: 100 },
            { label: "Bike 50 miles total", xp: 150 },
            { label: "Bike 75 miles total", xp: 150 },
            { label: "Bike 100 miles total, finish!", xp: 200 }
        ]
    },
    {
        id: "the-gathering",
        name: "The Gathering",
        emoji: "🎉",
        category: "social",
        description: "Organize a hangout for 4 or more people, like a game night, picnic, or movie night.",
        trophyName: "The Host",
        rewardXP: 500,
        deadlineDays: 14,
        steps: [
            { label: "Plan it and invite everyone", xp: 100 },
            { label: "Host the hangout", xp: 250 },
            { label: "Post a photo with the group", xp: 150 }
        ]
    },
    {
        id: "bookworm",
        name: "Bookworm",
        emoji: "📖",
        category: "mind",
        description: "Finish an entire book, then write what it made you think about.",
        trophyName: "The Scholar",
        rewardXP: 500,
        deadlineDays: null,
        steps: [
            { label: "Start the book", xp: 50 },
            { label: "Reach the halfway point", xp: 100 },
            { label: "Finish the book", xp: 150 },
            { label: "Write your reflection", xp: 200 }
        ]
    },
    {
        id: "fresh-start",
        name: "Fresh Start",
        emoji: "🧹",
        category: "lifestyle",
        description: "Fully reset your room or workspace: declutter, deep clean, and reorganize.",
        trophyName: "The Reset",
        rewardXP: 450,
        deadlineDays: 7,
        steps: [
            { label: "Declutter everything", xp: 150 },
            { label: "Deep clean the space", xp: 150 },
            { label: "Post a before and after", xp: 150 }
        ]
    }
];

document.getElementById("bossQuestsPage").style.display = "none";

document.getElementById("bossQuestsPageButton").onclick = function() {
    document.getElementById("questPage").style.display = "none";
    document.getElementById("bossQuestsPage").style.display = "block";
    loadBossQuestsPage();
};

document.getElementById("bossQuestsBackButton").onclick = function() {
    document.getElementById("bossQuestsPage").style.display = "none";
    document.getElementById("questPage").style.display = "block";
};

function isBossExpired(accepted, bossData) {

    if (!bossData.deadlineDays) return false;

    const acceptedTime = new Date(accepted.acceptedDate).getTime();
    const deadlineMs = bossData.deadlineDays * 24 * 60 * 60 * 1000;

    return (Date.now() - acceptedTime) > deadlineMs;
}

async function loadBossQuestsPage() {

    const container = document.getElementById("bossQuestsContainer");
    const user = window.firebaseAuth.currentUser;

    if (!user) {
        container.innerHTML = "<p>Please sign in to view Boss Quests.</p>";
        return;
    }

    container.innerHTML = "<p>Loading...</p>";

    const snapshot = await window.firebaseGetDoc(
        window.firebaseDoc(window.firebaseDB, "users", user.uid)
    );

    const data = snapshot.exists() ? snapshot.data() : {};
    const accepted = data.acceptedBoss || null;
    const trophies = data.trophies || [];
    const bossCooldowns = data.bossCooldowns || {};

    container.innerHTML = "";

    if (accepted) {

        const bossData = bossQuests.find(function(b) { return b.id === accepted.id; });

        if (!bossData) {
            container.innerHTML = "<p>That boss quest no longer exists.</p>";
            return;
        }

        renderActiveBoss(container, accepted, bossData, user.uid);

    } else {

        renderBossList(container, user.uid, trophies, bossCooldowns);
    }
}

const BOSS_COMMITMENT_DAYS = 3;
const BOSS_RETRY_COOLDOWN_DAYS = 14;

function renderBossList(container, uid, trophies, bossCooldowns) {

    const heading = document.createElement("p");
    heading.textContent = "Pick a Boss Quest to begin. Accepting one locks you in for " + BOSS_COMMITMENT_DAYS + " days.";
    container.appendChild(heading);

    bossQuests.forEach(function(boss) {

        const alreadyEarned = trophies.some(function(t) { return t.id === boss.id; });
        const cooldownStart = bossCooldowns[boss.id];

        let locked = false;
        let lockLabel = "";

        if (boss.oneTime && alreadyEarned) {

            locked = true;
            lockLabel = "✅ Completed (one-time)";

        } else if (cooldownStart) {

            const cooldownMs = BOSS_RETRY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
            const elapsed = Date.now() - new Date(cooldownStart).getTime();

            if (elapsed < cooldownMs) {
                locked = true;
                const daysLeft = Math.ceil((cooldownMs - elapsed) / (24 * 60 * 60 * 1000));
                lockLabel = "🔒 Do Again in " + daysLeft + "d";
            }
        }

        const card = document.createElement("div");
        card.className = "boss-card";

        card.innerHTML =
            "<h3>" + boss.emoji + " " + escapeHTML(boss.name) +
            (alreadyEarned ? " <span class='boss-earned-badge'>🏆 Completed</span>" : "") +
            "</h3>" +
            "<p>" + escapeHTML(boss.description) + "</p>" +
            "<p>🏆 Reward: " + boss.rewardXP + " XP + \"" + escapeHTML(boss.trophyName) + "\" trophy</p>" +
            (boss.deadlineDays
                ? "<p class='boss-deadline'>⏳ " + boss.deadlineDays + "-day deadline</p>"
                : "<p class='boss-deadline'>No deadline</p>");

        const acceptButton = document.createElement("button");
        acceptButton.className = "boss-accept-button";

        if (locked) {

            acceptButton.textContent = lockLabel;
            acceptButton.disabled = true;

        } else {

            acceptButton.textContent = alreadyEarned ? "Do Again" : "Accept Quest";

            acceptButton.onclick = async function() {

                await window.firebaseSetDoc(
                    window.firebaseDoc(window.firebaseDB, "users", uid),
                    {
                        acceptedBoss: {
                            id: boss.id,
                            acceptedDate: new Date().toISOString(),
                            completedSteps: []
                        }
                    },
                    { merge: true }
                );

                loadBossQuestsPage();
            };
        }

        card.appendChild(acceptButton);
        container.appendChild(card);
    });
}

function renderActiveBoss(container, accepted, bossData, uid) {

    const expired = isBossExpired(accepted, bossData);

    const completedCount = (accepted.completedSteps || []).length;
    const percent = Math.round((completedCount / bossData.steps.length) * 100);

    const acceptedTime = new Date(accepted.acceptedDate).getTime();
    const commitmentMs = BOSS_COMMITMENT_DAYS * 24 * 60 * 60 * 1000;
    const commitmentMsLeft = commitmentMs - (Date.now() - acceptedTime);
    const isCommitted = !expired && commitmentMsLeft > 0;
    const commitmentCountdownText = formatCountdown(commitmentMsLeft);

    const card = document.createElement("div");
    card.className = "boss-card";

      card.innerHTML =
        "<h3>" + bossData.emoji + " " + escapeHTML(bossData.name) + "</h3>" +
        "<p>" + escapeHTML(bossData.description) + "</p>" +
        (expired ? "<p class='boss-deadline'>⏳ This quest's deadline has passed.</p>" : "") +
        (isCommitted ? "<div class='boss-commitment-countdown' id='bossCommitCountdown'>🔒 Locked in for " + commitmentCountdownText + "</div>" : "") +
        "<div class='boss-progress-bar'><div class='boss-progress-fill' style='width:" + percent + "%'></div></div>" +
        "<p>" + completedCount + " / " + bossData.steps.length + " steps complete</p>";

        container.appendChild(card);

    if (isCommitted) {

        clearInterval(window.bossCountdownTimer);

        window.bossCountdownTimer = setInterval(function() {

            const msLeft = commitmentMs - (Date.now() - acceptedTime);
            const el = document.getElementById("bossCommitCountdown");

            if (!el || msLeft <= 0) {
                clearInterval(window.bossCountdownTimer);
                return;
            }

            el.textContent = "🔒 Locked in for " + formatCountdown(msLeft);

        }, 60000);
    }

    bossData.steps.forEach(function(step, index) {

        const stepRow = document.createElement("div");
        const done = (accepted.completedSteps || []).includes(index);

        stepRow.className = "boss-step" + (done ? " done" : "");
        stepRow.textContent = (done ? "✅ " : "⬜ ") + step.label + " (+" + step.xp + " XP)";

        if (!done && !expired) {

            stepRow.style.cursor = "pointer";

            stepRow.onclick = function() {

                completeQuest(
                    null,
                    { name: step.label, emoji: bossData.emoji, xp: step.xp },
                    "boss-" + bossData.id + "-" + index,
                    { bossId: bossData.id, stepIndex: index }
                );
            };
        }

        card.appendChild(stepRow);
    });

    if (expired) {

        const resetButton = document.createElement("button");
        resetButton.className = "boss-reset-button";
        resetButton.textContent = "Reset Quest";

        resetButton.onclick = async function() {

            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", uid),
                { acceptedBoss: null },
                { merge: true }
            );

            loadBossQuestsPage();
        };

        card.appendChild(resetButton);

    } else if (!isCommitted) {

        const giveUpButton = document.createElement("button");
        giveUpButton.className = "boss-reset-button";
        giveUpButton.textContent = "Give Up";

        giveUpButton.onclick = async function() {

            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", uid),
                { acceptedBoss: null },
                { merge: true }
            );

            loadBossQuestsPage();
        };

        card.appendChild(giveUpButton);
    }
}

async function finishBossStep(bossId, stepIndex, stepXP, popup, photoData, description, shouldPost) {

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const bossData = bossQuests.find(function(b) { return b.id === bossId; });

    const snapshot = await window.firebaseGetDoc(
        window.firebaseDoc(window.firebaseDB, "users", user.uid)
    );

    const data = snapshot.exists() ? snapshot.data() : {};
    const accepted = data.acceptedBoss;

    if (!accepted || accepted.id !== bossId) {
        popup.style.display = "none";
        return;
    }

    const completedSteps = accepted.completedSteps || [];

    if (completedSteps.includes(stepIndex)) {
        popup.style.display = "none";
        return;
    }

    completedSteps.push(stepIndex);

    xp = xp + stepXP;

    const isFinalStep = completedSteps.length >= bossData.steps.length;

    const update = {
        xp: xp,
        acceptedBoss: isFinalStep ? null : {
            id: bossId,
            acceptedDate: accepted.acceptedDate,
            completedSteps: completedSteps
        }
    };

    if (isFinalStep) {

        xp = xp + bossData.rewardXP;
        update.xp = xp;

        update["bossCooldowns." + bossId] = new Date().toISOString();

        update.trophies = window.firebaseArrayUnion({
            id: bossData.id,
            name: bossData.trophyName,
            emoji: bossData.emoji,
            description: bossData.description,
            dateEarned: new Date().toISOString()
        });
    }

    await window.firebaseSetDoc(
        window.firebaseDoc(window.firebaseDB, "users", user.uid),
        update,
        { merge: true }
    );

    const questData = {
        quest: bossData.name + ": " + bossData.steps[stepIndex].label,
        emoji: bossData.emoji,
        rarity: isFinalStep ? "bosscomplete" : "boss",
        type: "boss",
        description: description,
        date: new Date().toLocaleString(),
        photo: photoData || ""
    };

    await saveQuestToCloud(questData);

    if (shouldPost) {
        saveFeedPostToCloud(questData);
    }

    updateGame();

    popup.style.display = "none";

    if (isFinalStep) {
        alert("👑 BOSS QUEST COMPLETE!\n\nYou earned the \"" + bossData.trophyName + "\" trophy and " + bossData.rewardXP + " bonus XP!");
    }

    loadBossQuestsPage();
}

function getRarityLabel(rarity) {
    return rarity === "bosscomplete" ? "BOSS COMPLETE!" : String(rarity || "common").toUpperCase();
}

// TROPHY CASE

document.getElementById("trophyCasePage").style.display = "none";
document.getElementById("trophyDetailPopup").style.display = "none";

document.getElementById("trophyCaseButton").onclick = function() {
    document.getElementById("questPage").style.display = "none";
    document.getElementById("trophyCasePage").style.display = "block";
    loadTrophyCase();
};

document.getElementById("trophyCaseBackButton").onclick = function() {
    document.getElementById("trophyCasePage").style.display = "none";
    document.getElementById("questPage").style.display = "block";
};

async function loadTrophyCase() {

    const container = document.getElementById("trophyCaseContainer");
    const user = window.firebaseAuth.currentUser;

    if (!user) {
        container.innerHTML = "<p>Please sign in to view your Trophy Case.</p>";
        return;
    }

    container.innerHTML = "<p>Loading...</p>";

    const snapshot = await window.firebaseGetDoc(
        window.firebaseDoc(window.firebaseDB, "users", user.uid)
    );

    const trophies = snapshot.exists() ? (snapshot.data().trophies || []) : [];

    container.innerHTML = "";

    if (trophies.length === 0) {
        container.innerHTML = "<p>No trophies yet. Complete a Boss Quest to earn one!</p>";
        return;
    }

    trophies.forEach(function(trophy) {

        const card = document.createElement("div");
        card.className = "trophy-card";

        const shortDescription = (trophy.description || "").slice(0, 60) +
            (trophy.description && trophy.description.length > 60 ? "..." : "");

        card.innerHTML =
            "<div class='trophy-emoji'>" + escapeHTML(trophy.emoji || "🏆") + "</div>" +
            "<h3>" + escapeHTML(trophy.name) + "</h3>" +
            "<p>" + escapeHTML(shortDescription) + "</p>";

        card.onclick = function() {
            openTrophyDetail(trophy);
        };

        container.appendChild(card);
    });
}

function openTrophyDetail(trophy) {

    document.getElementById("trophyDetailEmoji").textContent = trophy.emoji || "🏆";
    document.getElementById("trophyDetailName").textContent = trophy.name;
    document.getElementById("trophyDetailDescription").textContent = trophy.description || "";
    document.getElementById("trophyDetailDate").textContent =
        trophy.dateEarned ? "Earned " + new Date(trophy.dateEarned).toLocaleDateString() : "";

    document.getElementById("trophyDetailPopup").style.display = "flex";
}

document.getElementById("closeTrophyDetail").onclick = function() {
    document.getElementById("trophyDetailPopup").style.display = "none";
};

function formatCountdown(msLeft) {

    if (msLeft <= 0) return "0m";

    const totalMinutes = Math.ceil(msLeft / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return days + "d " + hours + "h";
    if (hours > 0) return hours + "h " + minutes + "m";
    return minutes + "m";
}

function waitForFirebaseAuth() {

    return new Promise(function(resolve) {

        if (window.firebaseAuth) {
            resolve();
            return;
        }

        const check = setInterval(function() {

            if (window.firebaseAuth) {
                clearInterval(check);
                resolve();
            }

        }, 50);
    });
}

// FEED SLIDES

function buildFeedSlides(posts, isEndOfFeed, leftover) {

    const slides = [];

    const commonBuffer = leftover.common.slice();
    const uncommonBuffer = leftover.uncommon.slice();

    posts.forEach(function(post) {

        const rarity = getPostRarity(post);

        if (rarity === "common") {

            commonBuffer.push(post);

            if (commonBuffer.length === 4) {
                slides.push({ layout: "grid", posts: commonBuffer.splice(0, 4) });
            }

        } else if (rarity === "uncommon") {

            uncommonBuffer.push(post);

            if (uncommonBuffer.length === 2) {
                slides.push({ layout: "stack", posts: uncommonBuffer.splice(0, 2) });
            }

        } else {

            slides.push({ layout: "full", posts: [post] });
        }
    });

    if (isEndOfFeed) {

        if (commonBuffer.length > 0) {
            slides.push({ layout: "grid", posts: commonBuffer.splice(0) });
        }

        if (uncommonBuffer.length > 0) {
            slides.push({ layout: "stack", posts: uncommonBuffer.splice(0) });
        }
    }

    return {
        slides: slides,
        leftover: { common: commonBuffer, uncommon: uncommonBuffer }
    };
}

function renderFeedSlide(slide, currentUserId, myFollowing) {

    const slideElement = document.createElement("div");
    slideElement.className = "feed-slide slide-" + slide.layout;

    slide.posts.forEach(function(post) {
        slideElement.appendChild(createFeedPostElement(post, currentUserId, slide.layout, myFollowing));
    });

    return slideElement;
}

async function getMyFollowingList(uid) {

    try {

        const snapshot = await window.firebaseGetDoc(
            window.firebaseDoc(window.firebaseDB, "users", uid)
        );

        return snapshot.exists() ? (snapshot.data().following || []) : [];

    } catch (error) {

        console.error("FOLLOWING FETCH ERROR:", error);
        return [];
    }
}

// SKILLS SYSTEM

const skillDefinitions = [
    {
        id: "biking",
        name: "Biking",
        emoji: "🚴",
        components: [
            { id: "miles", type: "cumulative", unit: "miles", label: "Miles", thresholds: [0, 50, 150, 300, 600, 1000, 1600, 2500, 4000, 6000] },
            { id: "hours", type: "cumulative", unit: "hours", label: "Hours", thresholds: [0, 5, 15, 30, 60, 100, 150, 225, 325, 450] }
        ]
    },
    {
        id: "hiking",
        name: "Hiking",
        emoji: "🥾",
        components: [
            { id: "miles", type: "cumulative", unit: "miles", label: "Miles", thresholds: [0, 20, 50, 100, 200, 350, 550, 800, 1150, 1600] },
            { id: "hours", type: "cumulative", unit: "hours", label: "Hours", thresholds: [0, 5, 15, 30, 60, 100, 150, 225, 325, 450] }
        ]
    },
    {
        id: "running",
        name: "Running",
        emoji: "🏃",
        components: [
            { id: "frequency", type: "frequency", unit: "runs/mo", label: "Consistency", windowDays: 30, thresholds: [0, 2, 4, 7, 10, 14, 18, 22, 26, 30] },
            { id: "pace", type: "performance", unit: "best mile", label: "Best Mile Time", lowerIsBetter: true, thresholds: [900, 780, 660, 600, 540, 480, 420, 390, 360, 330] }
        ]
    },
    {
        id: "reading",
        name: "Reading",
        emoji: "📖",
        components: [
            { id: "books", type: "cumulative", unit: "books", label: "Books", thresholds: [0, 1, 3, 6, 10, 15, 21, 28, 36, 45] },
            { id: "pages", type: "cumulative", unit: "pages", label: "Pages", thresholds: [0, 200, 600, 1200, 2200, 3500, 5200, 7500, 10500, 14500] }
        ]
    }
];

const MAX_SKILL_LEVEL = 10;

function levelFromCumulative(total, thresholds) {
    let level = 1;
    for (let i = 1; i < thresholds.length; i++) {
        if (total >= thresholds[i]) level = i + 1;
    }
    return level;
}

function levelFromPerformance(value, thresholds, lowerIsBetter) {
    let level = 1;
    for (let i = 1; i < thresholds.length; i++) {
        const passed = lowerIsBetter ? value <= thresholds[i] : value >= thresholds[i];
        if (passed) level = i + 1;
    }
    return level;
}

function getComponentLevel(component, statValue) {

    if (statValue === undefined || statValue === null) return 1;

    if (component.type === "cumulative" || component.type === "frequency") {
        return levelFromCumulative(statValue, component.thresholds);
    }

    if (component.type === "performance") {
        return levelFromPerformance(statValue, component.thresholds, component.lowerIsBetter);
    }

    return 1;
}

function getRawComponentValue(component, skillData) {

    if (component.id === "frequency") {

        const runLog = skillData.runLog || [];
        const cutoff = Date.now() - (component.windowDays * 24 * 60 * 60 * 1000);

        return runLog.filter(function(dateStr) {
            return new Date(dateStr).getTime() >= cutoff;
        }).length;
    }

    if (component.id === "pace") {
        return skillData.bestMileSeconds;
    }

    const fieldMap = { miles: "totalMiles", hours: "totalHours", books: "totalBooks", pages: "totalPages" };

    return skillData[fieldMap[component.id] || component.id] || 0;
}

function getSkillLevelInfo(skillDef, skillData) {

    skillData = skillData || {};

    const componentInfo = skillDef.components.map(function(component) {

        const rawValue = getRawComponentValue(component, skillData);
        const level = getComponentLevel(component, rawValue);

        return { component: component, rawValue: rawValue, level: level };
    });

    const overallLevel = Math.round(
        componentInfo.reduce(function(sum, c) { return sum + c.level; }, 0) / componentInfo.length
    );

    return { componentInfo: componentInfo, overallLevel: overallLevel };
}

function formatMileTime(seconds) {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function parseMileTime(text) {
    const parts = String(text).split(":");
    if (parts.length !== 2) return null;
    const mins = Number(parts[0]);
    const secs = Number(parts[1]);
    if (isNaN(mins) || isNaN(secs)) return null;
    return (mins * 60) + secs;
}

// STATS PAGE NAVIGATION

document.getElementById("questPage").style.display = "none";
document.getElementById("statsPage").style.display = "none";
document.getElementById("skillDetailPage").style.display = "none";
document.getElementById("skillLogPopup").style.display = "none";

document.getElementById("statsPageButton").onclick = function() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("friendsPage").style.display = "none";
    document.getElementById("accountPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("skillDetailPage").style.display = "none";
    document.getElementById("statsPage").style.display = "block";
    loadStatsPage();
};

document.getElementById("statsBackButton").onclick = function() {
    document.getElementById("statsPage").style.display = "none";
    document.getElementById("questPage").style.display = "block";
};

document.getElementById("skillDetailBackButton").onclick = function() {
    document.getElementById("skillDetailPage").style.display = "none";
    document.getElementById("statsPage").style.display = "block";
    loadStatsPage();
};

document.getElementById("closeSkillLogPopup").onclick = function() {
    document.getElementById("skillLogPopup").style.display = "none";
};

async function getMySkillStats() {

    const user = window.firebaseAuth.currentUser;

    if (!user) return {};

    const snapshot = await window.firebaseGetDoc(
        window.firebaseDoc(window.firebaseDB, "users", user.uid)
    );

    return snapshot.exists() ? (snapshot.data().skillStats || {}) : {};
}

async function loadStatsPage() {

    const container = document.getElementById("statsContainer");
    container.innerHTML = "<p>Loading...</p>";

    const skillStats = await getMySkillStats();

    container.innerHTML = "";

    skillDefinitions.forEach(function(skillDef) {

        const info = getSkillLevelInfo(skillDef, skillStats[skillDef.id]);

        const card = document.createElement("div");
        card.className = "skill-card";

        card.innerHTML =
            "<div class='skill-card-emoji'>" + skillDef.emoji + "</div>" +
            "<div class='skill-card-info'>" +
            "<h3>" + escapeHTML(skillDef.name) + "</h3>" +
            "<p>Level " + info.overallLevel + "</p>" +
            "</div>";

        card.onclick = function() {
            openSkillDetail(skillDef.id);
        };

        container.appendChild(card);
    });

    multiSkillDefinitions.forEach(function(skillDef) {

        const level = getOverallLevelForSkill(skillDef.id, skillStats);

        const card = document.createElement("div");
        card.className = "skill-card";

        card.innerHTML =
            "<div class='skill-card-emoji'>" + skillDef.emoji + "</div>" +
            "<div class='skill-card-info'>" +
            "<h3>" + escapeHTML(skillDef.name) + "</h3>" +
            "<p>Level " + level + "</p>" +
            "</div>";

        card.onclick = function() {
            openSkillDetail(skillDef.id);
        };

        container.appendChild(card);
    });
}

async function openSkillDetail(skillId) {

    document.getElementById("statsPage").style.display = "none";
    document.getElementById("skillDetailPage").style.display = "block";

    const container = document.getElementById("skillDetailContainer");
    container.innerHTML = "<p>Loading...</p>";

    const skillStats = await getMySkillStats();

    if (skillId === "gym") {
        document.getElementById("skillDetailTitle").textContent = "🏋️ Gym";
        renderGymDetail(container, skillStats.gym || {});
        return;
    }

    if (skillId === "music") {
        document.getElementById("skillDetailTitle").textContent = "🎸 Music";
        renderMusicDetail(container, skillStats.music || {});
        return;
    }

    const skillDef = skillDefinitions.find(function(s) { return s.id === skillId; });
    const skillData = skillStats[skillId] || {};
    const info = getSkillLevelInfo(skillDef, skillData);

    document.getElementById("skillDetailTitle").textContent = skillDef.emoji + " " + skillDef.name;

    container.innerHTML = "";

    const overallCard = document.createElement("div");
    overallCard.className = "skill-overall-card";
    overallCard.innerHTML = "<h2>Level " + info.overallLevel + "</h2>";
    container.appendChild(overallCard);

    info.componentInfo.forEach(function(c) {

        const barWrap = document.createElement("div");
        barWrap.className = "skill-bar-wrap";

        const displayValue = c.component.id === "pace"
            ? formatMileTime(c.rawValue)
            : c.rawValue + " " + c.component.unit;

        const percent = Math.min(100, Math.round((c.level / MAX_SKILL_LEVEL) * 100));

        barWrap.innerHTML =
            "<p>" + escapeHTML(c.component.label) + ": Level " + c.level + " (" + escapeHTML(String(displayValue)) + ")</p>" +
            "<div class='skill-progress-bar'><div class='skill-progress-fill' style='width:" + percent + "%'></div></div>";

        container.appendChild(barWrap);
    });

    if (skillId === "running" && (skillData.totalMiles || skillData.totalHours)) {

        const runStats = document.createElement("div");
        runStats.className = "skill-book-list";
        runStats.innerHTML =
            "<h3>Running Totals</h3>" +
            "<p>🏃 " + (skillData.totalMiles || 0).toFixed(1) + " miles</p>" +
            "<p>⏱️ " + (skillData.totalHours || 0).toFixed(1) + " hours</p>";

        container.appendChild(runStats);
    }

    if (skillId === "reading" && (skillData.books || []).length > 0) {

        const bookList = document.createElement("div");
        bookList.className = "skill-book-list";
        bookList.innerHTML = "<h3>Books Read</h3>";

        skillData.books.slice().reverse().forEach(function(book) {
            const row = document.createElement("p");
            row.textContent = "📖 " + escapeHTML(book.title) + " (" + book.pages + " pages)";
            bookList.appendChild(row);
        });

        container.appendChild(bookList);
    }

    const logButton = document.createElement("button");
    logButton.className = "skill-log-button";
    logButton.textContent = "+ Log Entry";
    logButton.onclick = function() {
        openSkillLogPopup(skillId);
    };

    container.appendChild(logButton);
}

function openSkillLogPopup(skillId) {

    const skillDef = skillDefinitions.find(function(s) { return s.id === skillId; });
    const fieldsContainer = document.getElementById("skillLogFields");

    document.getElementById("skillLogTitle").textContent = "Log " + skillDef.name;
    document.getElementById("skillLogPopup").dataset.mode = "skill";
    document.getElementById("skillLogPopup").dataset.skillId = skillId;
    document.getElementById("skillLogPopup").dataset.subId = "";

    fieldsContainer.innerHTML = "";

    if (skillId === "biking" || skillId === "hiking") {

        fieldsContainer.innerHTML =
            "<label>Miles</label>" +
            "<input type='number' id='logMiles' placeholder='0' min='0' step='0.1'>" +
            "<label>Hours</label>" +
            "<input type='number' id='logHours' placeholder='0' min='0' step='0.1'>";

    } else if (skillId === "running") {

        fieldsContainer.innerHTML =
            "<label>Log today's run</label>" +
            "<p style='color:#aaa;font-size:14px;margin:0;'>This counts toward your consistency.</p>" +
            "<label>Miles</label>" +
            "<input type='number' id='logRunMiles' placeholder='0' min='0' step='0.1'>" +
            "<label>Duration (hours)</label>" +
            "<input type='number' id='logRunHours' placeholder='0' min='0' step='0.1'>" +
            "<label>Mile time (optional, only if you timed a mile, format m:ss)</label>" +
            "<input type='text' id='logMileTime' placeholder='7:30'>";

    } else if (skillId === "reading") {

        fieldsContainer.innerHTML =
            "<label>Book title</label>" +
            "<input type='text' id='logBookTitle' placeholder='Book title'>" +
            "<label>Pages</label>" +
            "<input type='number' id='logPages' placeholder='0' min='0'>";
    }

    document.getElementById("skillLogPopup").style.display = "flex";
}

document.getElementById("skillLogSaveButton").onclick = async function() {

    const popup = document.getElementById("skillLogPopup");
    const mode = popup.dataset.mode || "skill";
    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const skillStats = await getMySkillStats();

    if (mode === "skill") {

        const skillId = popup.dataset.skillId;
        const skillData = skillStats[skillId] || {};

        if (skillId === "biking" || skillId === "hiking") {

            const miles = Number(document.getElementById("logMiles").value) || 0;
            const hours = Number(document.getElementById("logHours").value) || 0;

            skillData.totalMiles = (skillData.totalMiles || 0) + miles;
            skillData.totalHours = (skillData.totalHours || 0) + hours;

        } else if (skillId === "running") {

            const runMiles = Number(document.getElementById("logRunMiles").value) || 0;
            const runHours = Number(document.getElementById("logRunHours").value) || 0;
            const mileTimeText = document.getElementById("logMileTime").value.trim();
            const runLog = skillData.runLog || [];

            runLog.push(new Date().toISOString());

            skillData.runLog = runLog;
            skillData.totalMiles = (skillData.totalMiles || 0) + runMiles;
            skillData.totalHours = (skillData.totalHours || 0) + runHours;

            if (mileTimeText) {

                const seconds = parseMileTime(mileTimeText);

                if (seconds && (!skillData.bestMileSeconds || seconds < skillData.bestMileSeconds)) {
                    skillData.bestMileSeconds = seconds;
                }
            }

        } else if (skillId === "reading") {

            const title = document.getElementById("logBookTitle").value.trim();
            const pages = Number(document.getElementById("logPages").value) || 0;

            if (!title || pages <= 0) {
                alert("Please enter a book title and page count.");
                return;
            }

            const books = skillData.books || [];
            books.push({ title: title, pages: pages, date: new Date().toISOString() });

            skillData.books = books;
            skillData.totalBooks = (skillData.totalBooks || 0) + 1;
            skillData.totalPages = (skillData.totalPages || 0) + pages;
        }

        skillStats[skillId] = skillData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail(skillId);
        loadTopSkillsWidget();
        return;
    }

    if (mode === "gymTime") {

        const hours = Number(document.getElementById("logGymHours").value) || 0;
        const gymData = skillStats.gym || {};

        gymData.totalHours = (gymData.totalHours || 0) + hours;

        skillStats.gym = gymData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("gym");
        loadTopSkillsWidget();
        return;
    }

        if (mode === "gymSession") {

        const hours = Number(document.getElementById("logSessionHours").value) || 0;
        const gymData = skillStats.gym || {};
        const exercises = gymData.exercises || {};
        const loggedSets = [];

        Object.keys(exercises).forEach(function(exerciseId) {

            const exercise = exercises[exerciseId];
            const repsInput = document.getElementById("sessionReps_" + exerciseId);

            if (!repsInput) return;

            const reps = Number(repsInput.value) || 0;

            if (reps <= 0) return;

            if (exercise.bodyweight) {

                if (!exercise.startingReps) {
                    exercise.startingReps = reps;
                }

                if (reps > (exercise.bestReps || 0)) {
                    exercise.bestReps = reps;
                }

                exercises[exerciseId] = exercise;

                loggedSets.push({ exerciseName: exercise.name, weight: null, reps: reps });

            } else {

                const weightInput = document.getElementById("sessionWeight_" + exerciseId);
                const weight = weightInput ? (Number(weightInput.value) || 0) : 0;

                if (weight <= 0) return;

                const estimatedOneRM = estimateOneRepMax(weight, reps);

                if (!exercise.startingOneRM) {
                    exercise.startingOneRM = estimatedOneRM;
                }

                if (estimatedOneRM > (exercise.bestOneRM || 0)) {
                    exercise.bestOneRM = estimatedOneRM;
                }

                exercises[exerciseId] = exercise;

                loggedSets.push({ exerciseName: exercise.name, weight: weight, reps: reps });
            }
        });

        gymData.totalHours = (gymData.totalHours || 0) + hours;
        gymData.exercises = exercises;

        const sessions = gymData.sessions || [];
        sessions.push({ date: new Date().toISOString(), hours: hours, sets: loggedSets });
        gymData.sessions = sessions;

        skillStats.gym = gymData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("gym");
        loadTopSkillsWidget();
        return;
    }

    if (mode === "gymAddExercise") {

        const name = document.getElementById("logExerciseName").value.trim();

        if (!name) {
            alert("Please enter an exercise name.");
            return;
        }

        const gymData = skillStats.gym || {};
        const exercises = gymData.exercises || {};

        const exerciseId = "ex_" + Date.now();

               const isBodyweight = document.getElementById("logExerciseBodyweight").checked;

        exercises[exerciseId] = {
            name: name,
            bodyweight: isBodyweight,
            startingOneRM: 0,
            bestOneRM: 0,
            startingReps: 0,
            bestReps: 0
        };

        gymData.exercises = exercises;
        skillStats.gym = gymData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("gym");
        return;
    }

       if (mode === "gymLogSet") {

        const exerciseId = popup.dataset.subId;
        const gymData = skillStats.gym || {};
        const exercises = gymData.exercises || {};
        const exercise = exercises[exerciseId];

        if (!exercise) {
            popup.style.display = "none";
            return;
        }

        const reps = Number(document.getElementById("logSetReps").value) || 0;

        if (reps <= 0) {
            alert("Please enter a rep count.");
            return;
        }

        if (exercise.bodyweight) {

            if (!exercise.startingReps) {
                exercise.startingReps = reps;
            }

            if (reps > (exercise.bestReps || 0)) {
                exercise.bestReps = reps;
            }

        } else {

            const weight = Number(document.getElementById("logSetWeight").value) || 0;

            if (weight <= 0) {
                alert("Please enter a weight.");
                return;
            }

            const estimatedOneRM = estimateOneRepMax(weight, reps);

            if (!exercise.startingOneRM) {
                exercise.startingOneRM = estimatedOneRM;
            }

            if (estimatedOneRM > (exercise.bestOneRM || 0)) {
                exercise.bestOneRM = estimatedOneRM;
            }
        }

        exercises[exerciseId] = exercise;
        gymData.exercises = exercises;
        skillStats.gym = gymData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("gym");
        loadTopSkillsWidget();
        return;
    }

    if (mode === "musicAddInstrument") {

        const name = document.getElementById("logInstrumentName").value.trim();

        if (!name) {
            alert("Please enter an instrument name.");
            return;
        }

        const musicData = skillStats.music || {};
        const instruments = musicData.instruments || {};

        const instrumentId = "inst_" + Date.now();

        instruments[instrumentId] = {
            name: name,
            totalHours: 0,
            songs: []
        };

        musicData.instruments = instruments;
        skillStats.music = musicData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("music");
        return;
    }

    if (mode === "musicPractice") {

        const instrumentId = popup.dataset.subId;
        const hours = Number(document.getElementById("logPracticeHours").value) || 0;

        const musicData = skillStats.music || {};
        const instruments = musicData.instruments || {};
        const instrument = instruments[instrumentId];

        if (!instrument) {
            popup.style.display = "none";
            return;
        }

        instrument.totalHours = (instrument.totalHours || 0) + hours;

        instruments[instrumentId] = instrument;
        musicData.instruments = instruments;
        skillStats.music = musicData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("music");
        loadTopSkillsWidget();
        return;
    }

    if (mode === "musicAddSong") {

        const instrumentId = popup.dataset.subId;
        const title = document.getElementById("logSongTitle").value.trim();

        if (!title) {
            alert("Please enter a song title.");
            return;
        }

        const musicData = skillStats.music || {};
        const instruments = musicData.instruments || {};
        const instrument = instruments[instrumentId];

        if (!instrument) {
            popup.style.display = "none";
            return;
        }

        const songs = instrument.songs || [];
        songs.push({ title: title, date: new Date().toISOString() });

        instrument.songs = songs;
        instruments[instrumentId] = instrument;
        musicData.instruments = instruments;
        skillStats.music = musicData;

        await window.firebaseSetDoc(
            window.firebaseDoc(window.firebaseDB, "users", user.uid),
            { skillStats: skillStats },
            { merge: true }
        );

        popup.style.display = "none";
        openSkillDetail("music");
        loadTopSkillsWidget();
        return;
    }
};

async function loadTopSkillsWidget() {

    const widget = document.getElementById("topSkillsWidget");

    if (!widget) return;

    await waitForFirebaseAuth();

    const user = window.firebaseAuth.currentUser;

    if (!user) return;

    const skillStats = await getMySkillStats();

    const allLevels = skillDefinitions.concat(multiSkillDefinitions).map(function(skillDef) {
        return { emoji: skillDef.emoji, name: skillDef.name, level: getOverallLevelForSkill(skillDef.id, skillStats) };
    });

    allLevels.sort(function(a, b) { return b.level - a.level; });

    widget.innerHTML = allLevels.slice(0, 4).map(function(s) {

        const percent = Math.min(100, Math.round((s.level / MAX_SKILL_LEVEL) * 100));

        return "<div class='top-skill-bar'>" +
            "<span class='ts-label'>" + s.emoji + " " + escapeHTML(s.name) + " " + s.level + "</span>" +
            "<div class='ts-track'><div class='ts-fill' style='width:" + percent + "%'></div></div>" +
            "</div>";

    }).join("");
}

// GYM & MUSIC (SUB-SKILLS)

const multiSkillDefinitions = [
    { id: "gym", name: "Gym", emoji: "🏋️" },
    { id: "music", name: "Music", emoji: "🎸" }
];

const GYM_TIME_THRESHOLDS = [0, 5, 15, 30, 60, 100, 150, 225, 325, 450];
const EXERCISE_IMPROVEMENT_THRESHOLDS = [0, 10, 25, 45, 70, 100, 140, 190, 250, 320];
const INSTRUMENT_HOURS_THRESHOLDS = [0, 5, 15, 30, 60, 100, 150, 225, 325, 450];
const INSTRUMENT_SONGS_THRESHOLDS = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45];

function estimateOneRepMax(weight, reps) {
    if (!weight || !reps) return 0;
    return weight * (1 + (reps / 30));
}

function getExerciseLevel(exercise) {

    if (!exercise) return 1;

    if (exercise.bodyweight) {

        if (!exercise.startingReps) return 1;

        const improvementPercent = ((exercise.bestReps - exercise.startingReps) / exercise.startingReps) * 100;
        return levelFromCumulative(Math.max(0, improvementPercent), EXERCISE_IMPROVEMENT_THRESHOLDS);
    }

    if (!exercise.startingOneRM) return 1;

    const improvementPercent = ((exercise.bestOneRM - exercise.startingOneRM) / exercise.startingOneRM) * 100;
    return levelFromCumulative(Math.max(0, improvementPercent), EXERCISE_IMPROVEMENT_THRESHOLDS);
}

function getGymLevelInfo(gymData) {

    gymData = gymData || {};
    const exercises = gymData.exercises || {};
    const exerciseIds = Object.keys(exercises);

    const exerciseLevels = exerciseIds.map(function(id) {
        return getExerciseLevel(exercises[id]);
    });

    const avgExerciseLevel = exerciseLevels.length > 0
        ? exerciseLevels.reduce(function(a, b) { return a + b; }, 0) / exerciseLevels.length
        : 1;

    const timeLevel = levelFromCumulative(gymData.totalHours || 0, GYM_TIME_THRESHOLDS);

    const overallLevel = Math.round((avgExerciseLevel + timeLevel) / 2);

    return { timeLevel: timeLevel, avgExerciseLevel: avgExerciseLevel, overallLevel: overallLevel };
}

function getInstrumentLevel(instrument) {
    const hoursLevel = levelFromCumulative(instrument.totalHours || 0, INSTRUMENT_HOURS_THRESHOLDS);
    const songsLevel = levelFromCumulative((instrument.songs || []).length, INSTRUMENT_SONGS_THRESHOLDS);
    return Math.round((hoursLevel + songsLevel) / 2);
}

function getMusicLevelInfo(musicData) {

    musicData = musicData || {};
    const instruments = musicData.instruments || {};
    const instrumentIds = Object.keys(instruments);

    const instrumentLevels = instrumentIds.map(function(id) {
        return getInstrumentLevel(instruments[id]);
    });

    const overallLevel = instrumentLevels.length > 0
        ? Math.round(instrumentLevels.reduce(function(a, b) { return a + b; }, 0) / instrumentLevels.length)
        : 1;

    return { instrumentLevels: instrumentLevels, overallLevel: overallLevel };
}

function getOverallLevelForSkill(skillId, skillStats) {

    if (skillId === "gym") {
        return getGymLevelInfo(skillStats.gym).overallLevel;
    }

    if (skillId === "music") {
        return getMusicLevelInfo(skillStats.music).overallLevel;
    }

    const skillDef = skillDefinitions.find(function(s) { return s.id === skillId; });
    return getSkillLevelInfo(skillDef, skillStats[skillId]).overallLevel;
}

function renderGymDetail(container, gymData) {

    const info = getGymLevelInfo(gymData);
    const exercises = gymData.exercises || {};
    const sessions = gymData.sessions || [];

    container.innerHTML = "";

    const overallCard = document.createElement("div");
    overallCard.className = "skill-overall-card";
    overallCard.innerHTML = "<h2>Level " + info.overallLevel + "</h2>";
    container.appendChild(overallCard);

    const timePercent = Math.min(100, Math.round((info.timeLevel / MAX_SKILL_LEVEL) * 100));

    const timeBar = document.createElement("div");
    timeBar.className = "skill-bar-wrap";
    timeBar.innerHTML =
        "<p>Time at Gym: Level " + info.timeLevel + " (" + (gymData.totalHours || 0).toFixed(1) + " hours)</p>" +
        "<div class='skill-progress-bar'><div class='skill-progress-fill' style='width:" + timePercent + "%'></div></div>";
    container.appendChild(timeBar);

    const logSessionButton = document.createElement("button");
    logSessionButton.className = "skill-log-button";
    logSessionButton.textContent = "+ Log Gym Session";
    logSessionButton.onclick = function() {

        const exerciseList = Object.keys(exercises).map(function(id) {
            return { id: id, name: exercises[id].name, bodyweight: exercises[id].bodyweight };
        });

        openLogPopup({ mode: "gymSession", title: "Log Gym Session", exercises: exerciseList });
    };
    container.appendChild(logSessionButton);

    const exerciseHeading = document.createElement("h3");
    exerciseHeading.textContent = "Exercises";
    exerciseHeading.style.marginTop = "24px";
    container.appendChild(exerciseHeading);

    const exerciseIds = Object.keys(exercises);

    if (exerciseIds.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.style.color = "#aaa";
        emptyMsg.textContent = "No exercises yet. Add one below!";
        container.appendChild(emptyMsg);
    }

    exerciseIds.forEach(function(exerciseId) {

        const exercise = exercises[exerciseId];
        const level = getExerciseLevel(exercise);

        const card = document.createElement("div");
        card.className = "subskill-card";

        const statLine = exercise.bodyweight
            ? "Best: " + (exercise.bestReps || 0) + " reps"
            : "Best: " + Math.round(exercise.bestOneRM || 0) + " lb est. 1-rep max";

                card.innerHTML =
            "<div class='subskill-header'>" +
            "<strong>" + escapeHTML(exercise.name) + "</strong>" +
            "<span class='subskill-level'>Level " + level + "</span>" +
            "</div>" +
            "<p>" + statLine + "</p>";

        const deleteButton = document.createElement("button");
        deleteButton.className = "subskill-delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = async function() {

            if (!confirm("Delete " + exercise.name + "? This can't be undone.")) return;

            const user = window.firebaseAuth.currentUser;

            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", user.uid),
                { skillStats: { gym: { exercises: { [exerciseId]: window.firebaseDeleteField() } } } },
                { merge: true }
            );

            openSkillDetail("gym");
        };

        card.appendChild(deleteButton);
        container.appendChild(card);
    });

    const addExerciseButton = document.createElement("button");
    addExerciseButton.className = "skill-log-button";
    addExerciseButton.textContent = "+ Add Exercise";
    addExerciseButton.onclick = function() {
        openLogPopup({ mode: "gymAddExercise", title: "Add Exercise" });
    };

    container.appendChild(addExerciseButton);

    const historyHeading = document.createElement("h3");
    historyHeading.textContent = "Session History";
    historyHeading.style.marginTop = "24px";
    container.appendChild(historyHeading);

    if (sessions.length === 0) {

        const emptyMsg = document.createElement("p");
        emptyMsg.style.color = "#aaa";
        emptyMsg.textContent = "No sessions logged yet.";
        container.appendChild(emptyMsg);

    } else {

        sessions.slice().reverse().forEach(function(session) {

            const sessionCard = document.createElement("div");
            sessionCard.className = "skill-book-list";

            const dateStr = new Date(session.date).toLocaleDateString();
            let html = "<h3>" + dateStr + " — " + session.hours.toFixed(1) + " hrs</h3>";

            if (session.sets && session.sets.length > 0) {
                session.sets.forEach(function(set) {
                    const setLine = set.weight
                        ? set.weight + " lb × " + set.reps
                        : set.reps + " reps";
                    html += "<p>🏋️ " + escapeHTML(set.exerciseName) + ": " + setLine + "</p>";
                });
            } else {
                html += "<p style='color:#888;'>No exercises logged this session.</p>";
            }

            sessionCard.innerHTML = html;
            container.appendChild(sessionCard);
        });
    }
}

function renderMusicDetail(container, musicData) {

    const info = getMusicLevelInfo(musicData);
    const instruments = musicData.instruments || {};

    container.innerHTML = "";

    const overallCard = document.createElement("div");
    overallCard.className = "skill-overall-card";
    overallCard.innerHTML = "<h2>Level " + info.overallLevel + "</h2>";
    container.appendChild(overallCard);

    const instrumentIds = Object.keys(instruments);

    if (instrumentIds.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.style.color = "#aaa";
        emptyMsg.textContent = "No instruments yet. Add one below!";
        container.appendChild(emptyMsg);
    }

    instrumentIds.forEach(function(instrumentId) {

        const instrument = instruments[instrumentId];
        const level = getInstrumentLevel(instrument);
        const songs = instrument.songs || [];

        const card = document.createElement("div");
        card.className = "subskill-card";

        card.innerHTML =
            "<div class='subskill-header'>" +
            "<strong>" + escapeHTML(instrument.name) + "</strong>" +
            "<span class='subskill-level'>Level " + level + "</span>" +
            "</div>" +
            "<p>" + (instrument.totalHours || 0).toFixed(1) + " hours practiced &middot; " + songs.length + " songs learned</p>";

        if (songs.length > 0) {
            const songList = document.createElement("p");
            songList.className = "subskill-songs";
            songList.textContent = "🎵 " + songs.map(function(s) { return s.title; }).join(", ");
            card.appendChild(songList);
        }

        const buttonRow = document.createElement("div");
        buttonRow.className = "subskill-button-row";

        const logPracticeButton = document.createElement("button");
        logPracticeButton.className = "subskill-log-button";
        logPracticeButton.textContent = "+ Log Practice";
        logPracticeButton.onclick = function() {
            openLogPopup({ mode: "musicPractice", subId: instrumentId, title: "Log Practice: " + instrument.name });
        };

        const addSongButton = document.createElement("button");
        addSongButton.className = "subskill-log-button";
        addSongButton.textContent = "+ Add Song";
        addSongButton.onclick = function() {
            openLogPopup({ mode: "musicAddSong", subId: instrumentId, title: "Add Song: " + instrument.name });
        };

                buttonRow.appendChild(logPracticeButton);
        buttonRow.appendChild(addSongButton);
        card.appendChild(buttonRow);

        const deleteButton = document.createElement("button");
        deleteButton.className = "subskill-delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = async function() {

            if (!confirm("Delete " + instrument.name + "? This can't be undone.")) return;

            const user = window.firebaseAuth.currentUser;

            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", user.uid),
                { skillStats: { music: { instruments: { [instrumentId]: window.firebaseDeleteField() } } } },
                { merge: true }
            );

            openSkillDetail("music");
        };

        card.appendChild(deleteButton);
        container.appendChild(card);
    });

    const addInstrumentButton = document.createElement("button");
    addInstrumentButton.className = "skill-log-button";
    addInstrumentButton.textContent = "+ Add Instrument";
    addInstrumentButton.onclick = function() {
        openLogPopup({ mode: "musicAddInstrument", title: "Add Instrument" });
    };

    container.appendChild(addInstrumentButton);
}

function openLogPopup(options) {

    const fieldsContainer = document.getElementById("skillLogFields");
    fieldsContainer.innerHTML = "";

    document.getElementById("skillLogTitle").textContent = options.title;
    document.getElementById("skillLogPopup").dataset.mode = options.mode;
    document.getElementById("skillLogPopup").dataset.subId = options.subId || "";

    if (options.mode === "gymTime") {

        fieldsContainer.innerHTML =
            "<label>Hours at the gym</label>" +
            "<input type='number' id='logGymHours' placeholder='0' min='0' step='0.1'>";

        } else if (options.mode === "gymAddExercise") {

        fieldsContainer.innerHTML =
            "<label>Exercise name</label>" +
            "<input type='text' id='logExerciseName' placeholder='Bench Press'>" +
            "<label style='display:flex;align-items:center;gap:8px;margin-top:14px;'>" +
            "<input type='checkbox' id='logExerciseBodyweight' style='width:auto;'> This is a bodyweight exercise (no added weight)" +
            "</label>";

        } else if (options.mode === "gymLogSet") {

        fieldsContainer.innerHTML = options.bodyweight
            ? "<label>Reps</label>" +
              "<input type='number' id='logSetReps' placeholder='0' min='1' step='1'>"
            : "<label>Weight (lbs)</label>" +
              "<input type='number' id='logSetWeight' placeholder='0' min='0' step='0.5'>" +
              "<label>Reps</label>" +
              "<input type='number' id='logSetReps' placeholder='0' min='1' step='1'>";

    } else if (options.mode === "gymSession") {

        let html = "<label>Total time at the gym (hours)</label>" +
            "<input type='number' id='logSessionHours' placeholder='0' min='0' step='0.1'>" +
            "<p style='color:#aaa;font-size:13px;margin:14px 0 4px;'>Log any exercises you did (leave blank to skip)</p>";

        options.exercises.forEach(function(ex) {

            if (ex.bodyweight) {

                html += "<label>" + escapeHTML(ex.name) + " — reps</label>" +
                    "<input type='number' id='sessionReps_" + ex.id + "' placeholder='Reps' min='0' step='1'>";

            } else {

                html += "<label>" + escapeHTML(ex.name) + " — weight (lbs) &amp; reps</label>" +
                    "<div style='display:flex;gap:8px;'>" +
                    "<input type='number' id='sessionWeight_" + ex.id + "' placeholder='Weight' min='0' step='0.5' style='flex:1;'>" +
                    "<input type='number' id='sessionReps_" + ex.id + "' placeholder='Reps' min='0' step='1' style='flex:1;'>" +
                    "</div>";
            }
        });

        fieldsContainer.innerHTML = html;

    } else if (options.mode === "musicAddInstrument") {

        fieldsContainer.innerHTML =
            "<label>Instrument name</label>" +
            "<input type='text' id='logInstrumentName' placeholder='Guitar'>";

    } else if (options.mode === "musicPractice") {

        fieldsContainer.innerHTML =
            "<label>Hours practiced</label>" +
            "<input type='number' id='logPracticeHours' placeholder='0' min='0' step='0.1'>";

    } else if (options.mode === "musicAddSong") {

        fieldsContainer.innerHTML =
            "<label>Song title</label>" +
            "<input type='text' id='logSongTitle' placeholder='Song title'>";
    }

    document.getElementById("skillLogPopup").style.display = "flex";
}

// BOTTOM TAB BAR

function setActiveTab(activeId) {
    document.querySelectorAll(".tab-bar-button").forEach(function(btn) {
        btn.classList.remove("active");
    });
    document.getElementById(activeId).classList.add("active");
}

document.getElementById("tabHomeButton").onclick = function() {
    document.getElementById("questPage").style.display = "none";
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("accountPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
    setActiveTab("tabHomeButton");
};

document.getElementById("tabQuestsButton").onclick = openQuests;