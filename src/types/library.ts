export type Book = {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  status: "Available" | "Borrowed" | "Reserved"
  description?: string
  publisher?: string
  publicationYear?: number
  location?: string
  addedAt: Date
  updatedAt: Date
}

export type BookCategory = {
  id: string
  name: string
  description?: string
  addedAt: Date
  updatedAt: Date
}

export type BookBorrowing = {
  id: string
  bookId: string
  userId: string
  borrowedAt: Date
  dueDate: Date
  returnedAt?: Date
  status: "Active" | "Overdue" | "Returned"
  notes?: string
}
