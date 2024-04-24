const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function addBook(){
    const textBook = document.getElementById('title').value;
    const penulis = document.getElementById('penulis').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, penulis, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, name, penulis, isCompleted){
    return{
        id,
        name,
        penulis,
        isCompleted
    }
}


document.addEventListener(RENDER_EVENT, function(){
    console.log(books);

    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML= '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
     
      if(!bookItem.isCompleted)
        uncompletedBOOKList.append(bookElement);
      else
        completedBOOKList.append(bookElement);
    }

});

function makeBook(bookObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.name;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = bookObject.penulis;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textPenulis);

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(){
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function(){
            addBookToCompleted(bookObject.id);
        });

        container.append(checkButton)
    }
    return container;
}

function addBookToCompleted (bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for (const bookItem of books) {
        if(bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index
        }
    }

    return -1;
}


function saveData() {
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined){
        alert('browser kamu tidak support');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));  
});


function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

