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

document.getElementById("friendsButton").onclick = function() {
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
    document.getElementById("homePage").style.display = "block";
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
const FEED_PAGE_SIZE = 10;

async function loadFeed() {

    feedLastDoc = null;
    feedHasMore = true;

    document.getElementById("feedContainer").innerHTML = "<p>Loading...</p>";

    await loadMoreFeedPosts(true);
}

async function loadMoreFeedPosts(isFirstLoad) {

    await waitForFirebaseAuth();

    const container = document.getElementById("feedContainer");
    const user = window.firebaseAuth.currentUser;

    if (!user) {
        container.innerHTML = "<p>Please sign in to view the Feed.</p>";
        return;
    }

    const currentUserId = user.uid;

    if (!feedHasMore) return;

    const queryParts = [];

    if (feedFilter === "following") {

        const mySnapshot = await window.firebaseGetDoc(
            window.firebaseDoc(window.firebaseDB, "users", currentUserId)
        );

        let followingIds = mySnapshot.exists() ? (mySnapshot.data().following || []) : [];
        followingIds = followingIds.concat(currentUserId).slice(0, 30);

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

        return;
    }

    const posts = [];

    snapshot.forEach(function(doc) {
        const post = doc.data();
        post.id = doc.id;
        posts.push(post);
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

    let i = 0;

    while (i < posts.length) {

        const rarity = getPostRarity(posts[i]);

        const canPair =
            rarity === "common" &&
            i + 1 < posts.length &&
            getPostRarity(posts[i + 1]) === "common";

        if (canPair) {

            const pairRow = document.createElement("div");
            pairRow.className = "feed-pair";

            pairRow.appendChild(createFeedPostElement(posts[i], currentUserId, true));
            pairRow.appendChild(createFeedPostElement(posts[i + 1], currentUserId, true));

            container.appendChild(pairRow);

            i += 2;

        } else {

            const soloCompact = rarity === "common";

            container.appendChild(createFeedPostElement(posts[i], currentUserId, false, soloCompact));

            i += 1;
        }
    }

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

        });

        window.feedObserver.observe(sentinel);

    } else {

        const endMessage = document.createElement("p");
        endMessage.className = "feed-end-message";
        endMessage.textContent = "You're all caught up 🎉";

        container.appendChild(endMessage);
    }
}

function createFeedPostElement(post, currentUserId, isPaired, soloCompact) {

    const rarity = getPostRarity(post);

    const postElement = document.createElement("div");

    postElement.className =
        "feed-post post-" + rarity +
        (isPaired ? " paired" : "") +
        (soloCompact ? " compact-solo" : "");

    postElement.innerHTML =
        "<strong>" + escapeHTML(post.username) + "</strong><br>" +
                "<span class='rarity-badge'>" + escapeHTML(getRarityLabel(rarity)) + "</span><br>" +
        "<strong>" + escapeHTML((post.emoji ? post.emoji + " " : "") + cleanQuestName(post.quest)) + "</strong>" +
        (post.photo
            ? "<div class='feed-photo'><img src='" + escapeHTML(post.photo) + "'></div>"
            : "") +
        "<p>" + escapeHTML(post.description) + "</p>" +
        "<small>" + escapeHTML(post.date) + "</small>";

    const likeButton = document.createElement("button");

    likeButton.textContent = "❤️ " + (post.likes || 0);
    likeButton.className = "like-button";

    likeButton.onclick = async function() {

        const likedBy = post.likedBy || [];
        const alreadyLiked = likedBy.includes(currentUserId);

        const newLikes = alreadyLiked
            ? Math.max((post.likes || 0) - 1, 0)
            : (post.likes || 0) + 1;

        likeButton.textContent = "❤️ " + newLikes;

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
            ? likedBy.filter(function(id) { return id !== currentUserId; })
            : likedBy.concat(currentUserId);
    };

    postElement.appendChild(likeButton);

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
                (isCommitted ? "<div class='boss-commitment-countdown' id='bossCommitCountdown'>🔒 Locked in for " + commitmentCountdownText + "</div>" : "");
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