// Elements
const itemInput = document.querySelector('form input');
const itemForm = document.querySelector('form');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Functions
function displayItemsFromStorage(){
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    resetUI();
};

function onAddItem(e){
    e.preventDefault();
    const newItem = itemInput.value.charAt(0).toUpperCase() + itemInput.value.slice(1);
    newItem.trim();
    
    //Validate input
    if (newItem === '' || newItem === ' '){
        alert('Please add an item');
        return;
    } 

    //Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (duplicateItemChecker(newItem)) {
            alert('That item already exists!');
            return;
        } 
    }
    addItemToDOM(newItem);
    addItemToStorage(newItem);

    //Recheck and Reset UI
    resetUI();

};

function addItemToDOM(item){
    const li = document.createElement('li');
    let itemName = document.createTextNode(item);
    const delBtn = document.createElement('button');
    delBtn.className = 'remove-item btn-link text-red';
    const icon = document.createElement('icon');
    icon.className = 'fa-solid fa-xmark';
    
    delBtn.appendChild(icon);
    li.appendChild(itemName);
    li.appendChild(delBtn);
    itemList.appendChild(li);  
}

function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item);
    localStorage.setItem('listOfItems', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('listOfItems') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('listOfItems'));
    }
    return itemsFromStorage;
}
function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')){ //targets X button
        removeItem(e.target.parentElement.parentElement);
    } else if (e.target.parentElement){ //targets LI
        setItemToEdit(e.target);
    }
}

function duplicateItemChecker(item){
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li')
            .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    document.body.style.backgroundColor = 'lightgray';
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Change Item'
    formBtn.style.backgroundColor = '#228b22';
    itemInput.value = item.textContent;
}

function removeItem(item){
    if(confirm('Do you want to delete this item?')){
        //Remove item from DOM
        item.remove();
        resetUI();

        //Remove item from Storage
        removeItemFromStorage(item.textContent);
    }
}
function removeItemFromStorage(item){
    let itemsFromStorage = getItemFromStorage();
    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Re-set
    localStorage.setItem('listOfItems', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    if(confirm('Are you sure?')){
        while(itemList.firstChild){
            itemList.firstChild.remove();
        }
    }
    localStorage.clear();
    resetUI();
}

function resetUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = 'black';
    document.body.style.backgroundColor = 'white';
    isEditMode = false;
}

function searchItems(e){
    const filterText = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        
        if(itemName.indexOf(filterText)!= -1) {
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'
        }
    })
}

function cancelEditMode(){
    if(document.body){
        console.log('body is clicked');
    }
}

// Event Listeners
itemForm.addEventListener('submit', onAddItem);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', searchItems);
document.addEventListener('DOMContentLoaded', displayItemsFromStorage);

resetUI();
