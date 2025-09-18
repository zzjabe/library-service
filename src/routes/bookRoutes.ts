import { Router, Request, Response } from "express";
import {
    getAllBooks,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getRecommendations,
} from "../controllers/bookController";
import { findBooks } from "../services/bookService";

const router: Router = Router();

/**
 * Define routes for book management
 */
router.get("/", getAllBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.post("/:id/borrow", borrowBook);
router.post("/:id/return", returnBook);
router.get("/recommendations", getRecommendations);

// Call findBooks function in the route
router.get("/", (req: Request, res: Response) => {
  const { title, author, genre } = req.query;
  const books = findBooks({
    title: title ? String(title) : undefined,
    author: author ? String(author) : undefined,
    genre: genre ? String(genre) : undefined,
  });
  res.json(books);
});

export default router;