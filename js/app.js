// firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { url } from "./dataBase.js";
const dataUrl = url;
const appSettings = {
  databaseURL: dataUrl,
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// Element set up
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// functions

const addShoppingItem = () => {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
};

onValue(shoppingListInDB, function (snapshot) {
  // check if there is a snapshot exists
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingListEl();
    for (const item of itemsArray) {
      let currentItem = item;
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "";
  }
});

const clearShoppingListEl = () => {
  shoppingListEl.innerHTML = "";
};

const clearInputFieldEl = () => {
  inputFieldEl.value = "";
};

const appendItemToShoppingListEl = (item) => {
  let itemID = item[0];
  let itemValue = item[1];
  console.log(itemValue);
  let listEl = document.createElement("li");
  listEl.textContent = itemValue;

  listEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  shoppingListEl.append(listEl);
};

// Add Event Listeners
addButtonEl.addEventListener("click", addShoppingItem);
