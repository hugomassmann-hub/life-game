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

    document.getElementById("questPopup").style.display =
        "flex";

    document.getElementById("popupQuestName").textContent =
        quest.emoji + " " + quest.name;

    document.getElementById("questPopup").dataset.questName =
        questName;

    document.getElementById("questPopup").dataset.questXP =
        quest.xp;

    document.getElementById("questPopup").dataset.elementId =
        element.id;
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

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            map.setView([latitude, longitude], 15);

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("You are here")
                .openPopup();

        },

        function(error) {

            console.log(
                "Location permission or location error:",
                error.message
            );

        }

    );

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

document.getElementById("feedButton").onclick = function() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("feedPage").style.display = "block";
    loadFeed();
};

document.getElementById("feedBackButton").onclick = function() {
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
};

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
        document.getElementById(elementId);

    const pastQuests =
        JSON.parse(localStorage.getItem("pastQuests")) || [];


    function finishQuest(photoData) {

        const newQuest = {
            quest: questName,
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

        if (quest.photo) {

            questElement.innerHTML =
                "<strong>" + quest.quest + "</strong><br>" +
                "<div class='past-quest-photo'>" +
                "<img src='" + quest.photo + "'>" +
                "</div>" +
                "<br>" +
                quest.description + "<br>" +
                "<small>" + quest.date + "</small>";

        } else {

            questElement.innerHTML =
                "<strong>" + quest.quest + "</strong><br>" +
                quest.description + "<br>" +
                "<small>" + quest.date + "</small>";

        }

        container.appendChild(questElement);

    });

}

async function loadFeed() {

    const container =
        document.getElementById("feedContainer");

    const user =
        window.firebaseAuth.currentUser;

    if (!user) {

        container.innerHTML =
            "<p>Please sign in to view the Feed.</p>";

        return;
    }

    const snapshot =
        await window.firebaseGetDocs(
            window.firebaseCollection(
                window.firebaseDB,
                "feedPosts"
            )
        );

    container.innerHTML = "";

    const posts = [];

    snapshot.forEach(function(doc) {

        posts.push(doc.data());

    });

    posts.reverse().forEach(function(post) {

        const postElement =
            document.createElement("div");

        postElement.className =
            "feed-post";

        if (post.photo) {

            postElement.innerHTML =
                "<strong>" +
                post.username +
                "</strong><br>" +
                "<strong>" +
                post.quest +
                "</strong>" +
                "<div class='feed-photo'>" +
                "<img src='" +
                post.photo +
                "'>" +
                "</div>" +
                "<p>" +
                post.description +
                "</p>" +
                "<small>" +
                post.date +
                "</small>";

        } else {

            postElement.innerHTML =
                "<strong>" +
                post.username +
                "</strong><br>" +
                "<strong>" +
                post.quest +
                "</strong>" +
                "<p>" +
                post.description +
                "</p>" +
                "<small>" +
                post.date +
                "</small>";

        }

        container.appendChild(postElement);

        const likeButton =
    document.createElement("button");

likeButton.textContent = "❤️ 0";

likeButton.className =
    "like-button";

postElement.appendChild(likeButton);

    });

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
document.getElementById("accountButton").onclick = function() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("questPage").style.display = "none";
    document.getElementById("pastQuestsPage").style.display = "none";
    document.getElementById("feedPage").style.display = "none";
    document.getElementById("customizePage").style.display = "none";
    document.getElementById("accountPage").style.display = "block";
};
document.getElementById("accountBackButton").onclick = function() {
    document.getElementById("accountPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
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
            description: postData.description,
            date: postData.date,
            photo: postData.photo || "",
            username: user.displayName || "Player"
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
        }
    }
}