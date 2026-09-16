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

        }
    );
}


items.forEach(function(item) {

    const itemElement =
        document.createElement("div");

    itemElement.className = "item";


    const level =
        Math.floor(xp / 350) + 1;


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
            "✅ Quest completed!";

        element.classList.add("completed");

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

    let level =
        Math.floor(xp / 350) + 1;


    let xpIntoLevel =
        xp % 350;


    let percentage =
        (xpIntoLevel / 350) * 100;


    levelText.textContent =
        "Level " + level;


    xpText.textContent =
        "XP: " +
        xpIntoLevel +
        " / 350";

        document.getElementById("mobileLevel").textContent =
    "Level " + level;

    document.getElementById("mobileXP").textContent =
    "XP: " + xpIntoLevel + " / 350";


    xpBar.style.width =
        percentage + "%";


    streakText.textContent =
        "🔥 " +
        streak +
        " Day Streak";

        document.getElementById("characterStreak").textContent =
    "🔥 " + streak + " Day Streak";
}


function updateStreak() {

    if (lastStreakDate === today) {
        return;
    }


    if (lastStreakDate) {

        let yesterday =
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


    localStorage.setItem(
        "streak",
        streak
    );


    localStorage.setItem(
        "lastStreakDate",
        today
    );


    updateGame();
}


function completeQuest(
    element,
    quest,
    questName
) {

    if (
        completedQuests.includes(
            questName
        )
    ) {
        return;
    }


    let oldLevel =
        Math.floor(xp / 350) + 1;


    xp =
        xp + quest.xp;


    completedQuests.push(
        questName
    );


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
        quest.xp +
        " XP";


    element.classList.add(
        "completed"
    );


    let newLevel =
        Math.floor(xp / 350) + 1;


    if (newLevel > oldLevel) {

        alert(
            "🎉 LEVEL UP! You reached Level " +
            newLevel +
            "!"
        );
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

    document.getElementById("homePage").style.display =
        "none";

    document.getElementById("questPage").style.display =
        "none";

    document.getElementById("customizePage").style.display =
        "block";
}


// CLOSE CUSTOMIZE PAGE

function closeCustomize() {

    document.getElementById("customizePage").style.display =
        "none";

    document.getElementById("homePage").style.display =
        "block";
}

document.getElementById("customizeButton").addEventListener(
    "click",
    openCustomize
);

// START GAME

updateGame();

const map = L.map("map").setView([37.7749, -122.4194], 13);

if (navigator.geolocation) {

    navigator.permissions.query({ name: "geolocation" }).then(function(permission) {

        if (permission.state === "granted") {

            navigator.geolocation.getCurrentPosition(function(position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                map.setView([latitude, longitude], 15);

                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup("You are here")
                    .openPopup();

            });

        } else if (permission.state === "prompt") {

            navigator.geolocation.getCurrentPosition(function(position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                map.setView([latitude, longitude], 15);

                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup("You are here")
                    .openPopup();

            });

        }

    });

}

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

function openQuests() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("questPage").style.display = "block";
}
function closeQuests() {
    document.getElementById("questPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
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