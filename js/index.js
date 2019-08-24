//DOM ELEMENTS
const notes = document.getElementById('notes');
const title = document.getElementById('title');
const submit = document.querySelector('.btn-add');
const reset = document.querySelector('.btn-reset');
const DOMcategories = document.querySelector('.categories');

const withContent = document.querySelector('.with-content');
const noContent = document.querySelector('.no-content');

let categories = [];
let id = 0;

class Category {
  constructor(title, count) {
    this.id = id;
    this.title = title;
    this.count = count;
    id++;
  }
}

//NOTES AND LOCAL STORAGE ************************
const writeLocalStorage = function(){
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("notes", notes.value);
  } else {
    document.getElementById("err").innerHTML = "Localstorage not supported";
  }
};

const readLocalStorage = function() {
  if (typeof(Storage) !== "undefined") {
    let savedCategories = JSON.parse(localStorage.getItem("categories"));
    let savedId = localStorage.getItem("id");
    if (savedCategories !== null && savedId !== null) {
      categories = savedCategories;
      id = +savedId;
    }
    notes.value = localStorage.getItem("notes");
    // DOMcategories.innerHTML = localStorage.getItem("DOMcategories");

  } else {
    document.getElementById("err").innerHTML = "Localstorage not supported";
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", readLocalStorage);
} else {  // `DOMContentLoaded` already fired
  readLocalStorage();
}

notes.addEventListener('input', writeLocalStorage);


//RENDER A CATEGORY
const renderCategory = function (category) {
  withContent.style.display = 'block';
  noContent.style.display = 'none';
  let html = `
      <li class="category" id="${category.id}">
        <label class="category-name">${category.title}</label>
        <input class="count" type="number" oninput="updateCount(this);" value="${category.count}">
        <button class="inc" type="button" onclick="increaseCount(this)">+</button>
        <button class="delete" type="button" onclick="deleteElement(this)">Удалить категорию</button>
      </li>
    `;

  DOMcategories.innerHTML = DOMcategories.innerHTML + html;
};

//RENDER ALL CATEGORIES
const renderAllCategories = function(categories){

    DOMcategories.innerHTML = `
  
    `;

    for(let category of categories) {
      renderCategory(category);
    }
};

if (categories.length > 0) {
  renderAllCategories(categories);
}

//ADD NEW CATEGORY IN ARRAY*******************************
const addNewCategory = function(e){
  e.preventDefault();
  if (title.value) {
    let category = new Category(title.value,0);
    categories.push(category);

    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("id", id);

    title.value = '';

    renderCategory(category);

  } else {
    console.log('Empty title!');
  }
};

submit.addEventListener('click', addNewCategory);

//RESET ALL*******************************
const resetAll = function(e){
  e.preventDefault();
  withContent.style.display = 'none';
  noContent.style.display = 'block';
  notes.value = '';
  id = 0;
  categories = [];
  DOMcategories.innerHTML = `

  `;
  localStorage.clear();
};

reset.addEventListener('click', resetAll);

const increaseCount = function(element) {
  let elementId = +element.parentElement.id;

  let currCount = element.parentElement.querySelector('.count');
  currCount.value = (Number(currCount.value) + 1).toString();

  categories.forEach(category => {
    if(category.id === elementId) {
      category.count = +currCount.value;
    }
  });

  localStorage.setItem("categories", JSON.stringify(categories));
  renderAllCategories(categories);
};

const deleteElement = function (element) {
  let elementId = +element.parentElement.id;
  categories = categories.filter(category => category.id !== elementId);

  if (categories.length === 0) {
    id = 0;
    withContent.style.display = 'none';
    noContent.style.display = 'block';
  }
  localStorage.setItem("categories", JSON.stringify(categories));
  element.parentElement.remove();

};

const updateCount = function(element) {
  let elementId = +element.parentElement.id;
  let currCount = element.parentElement.querySelector('.count');

  categories.forEach(category => {
    if(category.id === elementId) {
      category.count = +currCount.value;
    }
  });

  localStorage.setItem("categories", JSON.stringify(categories));
  renderAllCategories(categories);

};

// function debounce(f, delay) {
//     let timerId;
//
//     return function wrapper(...args) {
//       clearTimeout(timerId);
//
//       timerId = setTimeout(() => {
//         f(...args);
//       }, delay);
//     };
// }
//