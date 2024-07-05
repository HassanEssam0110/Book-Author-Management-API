import { Schema, Types, model } from "mongoose";
import { Author } from './author.model.js';

export const bookSchema = new Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author: { type: Types.ObjectId, ref: 'Author', required: true },
    publishedDate: { type: Date, default: new Date() },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    versionKey: false,
});


// Mongoose middleware to add book in author before a document is saved to the database. 
bookSchema.pre('save', async function (next) {
    try {
        const author = await Author.findById(this.author);
        author.books.push(this._id);
        author.save();
        return next();
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// Pre middleware to handle findOneAndUpdate
bookSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        const bookId = this.getQuery()._id || this.getQuery().id;

        if (update.author) {
            const newAuthor = await Author.findById(update.author);
            if (newAuthor) {
                newAuthor.books.push(bookId);
                await newAuthor.save();
            }

            // Optional: If you want to remove the book from the previous author's books array
            const originalBook = await this.model.findOne(this.getQuery());
            if (originalBook && originalBook.author && originalBook.author.toString() !== update.author.toString()) {
                const oldAuthor = await Author.findById(originalBook.author);
                if (oldAuthor) {
                    oldAuthor.books.pull(bookId);
                    await oldAuthor.save();
                }
            }
        }
        next();
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// Pre middleware to handle findOneAndDelete
bookSchema.pre('findOneAndDelete', async function (next) {
    try {
        const bookId = this.getQuery()._id || this.getQuery().id;
        const bookToDelete = await this.model.findById(bookId);

        if (bookToDelete && bookToDelete.author) {
            const author = await Author.findById(bookToDelete.author);
            if (author) {
                author.books.pull(bookId);
                await author.save();
            }
        }
        next();
    } catch (error) {
        console.error(error);
        return next(error);
    }
});


export const Book = model('Book', bookSchema);