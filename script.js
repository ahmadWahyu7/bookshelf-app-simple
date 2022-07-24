const bookshelf = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
    return +new Date();
}

function generateBookshelfObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId){
    for(bookItem of bookshelf){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId) {
    for(index in bookshelf){
        if(bookshelf[index].id === bookId){
            return index
        }
    }
    return -1
}

function isStorageExist(){
   if(typeof(Storage) === undefined){
       alert("Browser kamu tidak mendukung local storage");
       return false
   } 
   return true;
}

function saveData() {
   if(isStorageExist()){
       const parsed = JSON.stringify(bookshelf);
       localStorage.setItem(STORAGE_KEY, parsed);
       document.dispatchEvent(new Event(SAVED_EVENT));
       
   }
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   
   let data = JSON.parse(serializedData);
   
   if(data !== null){
       for(book of data){
           bookshelf.push(book);
       }
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
}

function inputBook(bookObject) {

   const {id, title, author, year, isCompleted} = bookObject;

   const textTitle = document.createElement("h2");
   textTitle.innerText = title;

   const textAuthor = document.createElement("p");
   textAuthor.innerText = author;

   const textYear = document.createElement("p");
   textYear.innerText = year;

   const textContainer = document.createElement("div");
   textContainer.classList.add("inner")
   textContainer.append(textTitle, textAuthor, textYear);

   const container = document.createElement("div");
   container.classList.add("item")
   container.append(textContainer);
   container.setAttribute("id", `book-${id}`);
   
   if(isCompleted){

       const undoButton = document.createElement("button");
       undoButton.innerText = "belum dibaca";
       undoButton.classList.add("move-to");
       undoButton.addEventListener("click", function () {
           undoBookFromCompleted(id);
       });

       const trashButton = document.createElement("button");
       trashButton.innerText = "hapus";
       trashButton.classList.add("trash-button");
       trashButton.addEventListener("click", function () {
           if (confirm("Apakah anda yakin?")==true){
            removeBookFromCompleted(id);
           }
       });

       container.append(undoButton, trashButton);
   } else {

       const checkButton = document.createElement("button");
       checkButton.innerText = "sudah dibaca";
       checkButton.classList.add("move-to");
       checkButton.addEventListener("click", function () {
           addBookToCompleted(id);
       });

       const trashButton = document.createElement("button");
       trashButton.innerText = "hapus";
       trashButton.classList.add("trash-button");
       trashButton.addEventListener("click", function () {
        if (confirm("Apakah anda yakin?")==true){
            removeBookFromCompleted(id);
           }
       });

       container.append(checkButton, trashButton);
   }

   return container;
}

function addBook() {
   const titleBook = document.getElementById("inputJudul").value;
   const authorBook = document.getElementById("inputPenulis").value;
   const yearBook = document.getElementById("inputTahun").value;
   const checkBook = document.getElementById("checkboxBuku");
   const generatedID = generateId();

   if(checkBook.checked == true){
    const bookObject = generateBookshelfObject(generatedID, titleBook, authorBook, yearBook, true);
    bookshelf.push(bookObject);
   }else{
    const bookObject = generateBookshelfObject(generatedID, titleBook, authorBook, yearBook, false);
    bookshelf.push(bookObject);
   }
   
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function addBookToCompleted(bookId) {

   const bookTarget = findBook(bookId);
   if(bookTarget == null) return;

   bookTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function removeBookFromCompleted(bookId) {
   const bookTarget = findBookIndex(bookId);
   if(bookTarget === -1) return;
   bookshelf.splice(bookTarget, 1);
   
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function undoBookFromCompleted(bookId){

   const bookTarget = findBook(bookId);
   if(bookTarget == null) return;

   bookTarget.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

document.addEventListener("DOMContentLoaded", function () {

   const submitForm = document.getElementById("form");

   submitForm.addEventListener("submit", function (event) {
       event.preventDefault();
       addBook();
    //    alert('buku telah ditambahkan');
   });

   if(isStorageExist()){
       loadDataFromStorage();
   }
});

document.getElementById('searchButton').addEventListener('click', () => {
    const keyword = document.getElementById('searchInput').value;
    const filteredBook = bookshelf.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()));
    console.log(filteredBook);

    const uncompletedTODOList = document.getElementById("belumDibaca");
    const listCompleted = document.getElementById("sudahDibaca");

    // clearing list item
    uncompletedTODOList.innerHTML = ""
    listCompleted.innerHTML = ""

    for(bookItem of filteredBook){
        const bookElement = inputBook(bookItem);
        if(bookItem.isCompleted){
            listCompleted.append(bookElement);
        } else {
            uncompletedTODOList.append(bookElement);
        }
    }
})

document.addEventListener(SAVED_EVENT, () => {
   console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
   const uncompletedTODOList = document.getElementById("belumDibaca");
   const listCompleted = document.getElementById("sudahDibaca");

   // clearing list item
   uncompletedTODOList.innerHTML = ""
   listCompleted.innerHTML = ""

   for(bookItem of bookshelf){
       const bookElement = inputBook(bookItem);
       if(bookItem.isCompleted){
           listCompleted.append(bookElement);
       } else {
           uncompletedTODOList.append(bookElement);
       }
   }
})