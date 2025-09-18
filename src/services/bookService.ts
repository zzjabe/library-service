import { Book } from "../models/bookModel";

const books: Book[] = [
    {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        isBorrowed: false,
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        isBorrowed: false,
    },
    {
        id: "3",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        isBorrowed: false,
    },
];

export const getAllBooks = (): Book[] => {
    return structuredClone(books);
};

/**
 * Adds a new book to the library system.
 *
 * The function uses Omit<Book, 'id' | 'isBorrowed' | 'borrowerId' | 'dueDate'> as its parameter type.
 * This means it creates a new type from the Book interface that excludes those specific fields:
 * - 'id' because we generate it automatically
 * - 'isBorrowed' because all new books start as not borrowed
 * - 'borrowerId' and 'dueDate' because they're only used when a book is borrowed
 *
 * @param bookData - The book information. Must include title, author, and genre.
 * @throws {Error} When required fields (title, author, genre) are missing
 * @returns {Book} The newly created book with generated ID and isBorrowed set to false
 *
 * @example
 * const newBook = addBook({
 *     title: "The Great Gatsby",
 *     author: "F. Scott Fitzgerald",
 *     genre: "Fiction"
 * });
 */
export const addBook = (
    bookData: Omit<Book, "id" | "isBorrowed" | "borrowerId" | "dueDate">
): Book => {
    if (!bookData.title || !bookData.author || !bookData.genre) {
        throw new Error(
            "Missing required fields: title, author, and genre are required"
        );
    }

    const newBook: Book = {
        id: (Math.random() * 10000).toFixed(0),
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        isBorrowed: false,
    };

    books.push(newBook);
    return newBook;
};

/**
 * Updates an existing book's information. Certain fields (id, isBorrowed, borrowerId, dueDate)
 * cannot be modified through this function as they are managed by other operations.
 *
 * The Partial<Book> type means all Book fields are optional in the update data.
 * This allows updating only specific fields while leaving others unchanged.
 *
 * @param id - The ID of the book to update
 * @param bookData - Partial book data containing fields to update
 * @throws {Error} When book with given ID is not found
 * @returns {Book} The updated book
 *
 * @example
 * const updatedBook = updateBook("123", {
 *     title: "New Title",
 *     genre: "New Genre"
 * });
 */
export const updateBook = (
    id: string,
    bookData: Partial<Book>
): Book | null => {
    const book = books.find((b) => b.id === id);

    if (!book) {
        return null;
    }

    // Create a safe version of bookData without protected fields
    const safeUpdate = { ...bookData };

    // The following are the protected fields:
    // Prevent ID changes
    delete safeUpdate.id;
    // These fields should only be modified through borrowBook/returnBook
    delete safeUpdate.isBorrowed;
    delete safeUpdate.borrowerId;
    delete safeUpdate.dueDate;

    Object.assign(book, safeUpdate);
    return structuredClone(book);
};

/**
 * Removes a book from the library system.
 *
 * @param id - The ID of the book to delete
 * @returns {boolean} True if book was found and deleted, false if book was not found
 *
 * @example
 * const wasDeleted = deleteBook("123");
 * if (wasDeleted) {
 *     console.log("Book was successfully deleted");
 * }
 */
export const deleteBook = (id: string): boolean => {
    const index = books.findIndex((b) => b.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        return true;
    }
    return false;
};

/**
 * Marks a book as borrowed by a user and sets a due date 14 days from now.
 *
 * @param id - The ID of the book to borrow
 * @param borrowerId - The ID of the user borrowing the book
 * @throws {Error} When book is not found or is already borrowed
 * @returns {Book} The updated book with borrowing information
 *
 * @example
 * const borrowedBook = borrowBook("123", "user456");
 * console.log(borrowedBook.dueDate);
 */
export const borrowBook = (id: string, borrowerId: string): Book | null => {
    const book = books.find((b) => b.id === id);

    if (!book) {
        return null;
    }

    if (book.isBorrowed) {
        return null;
    }

    book.isBorrowed = true;
    book.borrowerId = borrowerId;

    // 14 days from now
    book.dueDate = new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString();

    return structuredClone(book);
};

/**
 * Marks a book as returned, removing borrower information and due date.
 *
 * @param id - The ID of the book to return
 * @throws {Error} When book is not found or is not currently borrowed
 * @returns {Book} The updated book with borrowing information removed
 *
 * @example
 * const returnedBook = returnBook("123");
 * console.log(returnedBook.isBorrowed); // false
 */
export const returnBook = (id: string): Book | null => {
    const book = books.find((b) => b.id === id);

    if (!book) {
        return null;
    }

    if (!book.isBorrowed) {
        return null;
    }

    book.isBorrowed = false;
    delete book.borrowerId;
    delete book.dueDate;

    return structuredClone(book);
};

/**
 * Gets a list of recommended books from the library.
 * Right now it returns the first 3 books in the system.
 *
 * @returns {Book[]} Array of up to 3 recommended books
 *
 * @example
 * const recommendations = getRecommendations();
 * console.log(`Got ${recommendations.length} recommendations`);
 */
export const getRecommendations = (): Book[] => {
    return structuredClone(books.slice(0, 3));
};