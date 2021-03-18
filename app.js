// Book class : represent a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

// UI class: to handle UI tasks
class UI{
    static displayBooks(){
       

        const books = Store.getBooks();

        books.forEach((book) => {
            UI.addBookToList(book);
        })
    }

    static addBookToList(book) {
        const tbodyNode = document.querySelector('#booklist');

        const trow = document.createElement('tr');

        trow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button class="btn btn-danger btn-sm delete">X</button</td>
        `;

        tbodyNode.appendChild(trow);

    }

    static deleteBook(ele) {
        if(ele.classList.contains('delete')){
            ele.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, classname){
        //
        const isAlertVisble = document.querySelector('.alert');
        if(isAlertVisble){
            isAlertVisble.remove();
        }

        const alertdiv = document.createElement('div');
        alertdiv.classList = `alert alert-${classname}`;
        const alertTextNode = document.createElement('span');
        alertTextNode.innerText = message;
        alertdiv.appendChild(alertTextNode);

        const msgContainer = document.querySelector('.form-wrapper');
        const formDiv = document.querySelector('#book-form');
        msgContainer.insertBefore(alertdiv, formDiv);
    }


    static clearFields(){
        document.querySelector('#booktitle').value = '';
        document.querySelector('#bookauthor').value = '';
        document.querySelector('#bookisbn').value = '';
    }
}

//Store class: handle storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) { 
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }
}

//Event: Display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event : ADD a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent default form submission
    e.preventDefault();

    //get values from the form fields on submit
    const titleVal = document.querySelector('#booktitle').value;
    const authorVal = document.querySelector('#bookauthor').value;
    const isbnVal = document.querySelector('#bookisbn').value;

    //validate adding a book
    if(titleVal === '' || authorVal === '' || isbnVal === ''){
        UI.showAlert('Please fill in all the fields', 'danger');
    }else{

        //instantiate the book class and pass the values
        const book = new Book(titleVal, authorVal, isbnVal);
        //console.log(book);

        //add book to list 
        UI.addBookToList(book);

        //add book to localstore
        Store.addBook(book);

        //SHow success
        UI.showAlert('New Book Added', 'success');

        //clear input fields on submission
        UI.clearFields();
    }    
})


//Event : remove a book
document.querySelector('#booklist').addEventListener('click', (e) =>{
    //console.log(e.target);
    UI.deleteBook(e.target);

    //Remove book from localstore
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //SHow success
    UI.showAlert('Book Removed', 'info');
})