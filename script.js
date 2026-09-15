let xp = Number(localStorage.getItem("xp")) || 0;


const items = [
   {
    id: "beanie",
    name: "Beanie",
    image: "beanie.png",
    unlockLevel: 2,

    homeWidth: 28,
    homeTop: 3,

    customizeWidth: 28,
    customizeTop: 17
},


{
    id: "glasses",
    name: "Cool Glasses",
    image: "glasses.png",
    unlockLevel: 3,

    homeWidth: 28,
    homeTop: 50,

    customizeWidth: 28,
    customizeTop: 85
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


    image.dataset.itemId =
        item.id;


    if (isHome) {

        image.style.width =
            item.homeWidth + "px";

        image.style.top =
            item.homeTop + "px";

    } else {

        image.style.width =
            item.customizeWidth + "px";

        image.style.top =
            item.customizeTop + "px";

    }


    character.appendChild(
        image
    );
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


    xpBar.style.width =
        percentage + "%";


    streakText.textContent =
        "🔥 " +
        streak +
        " Day Streak";
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