import mongoose from 'mongoose';

export const db_connect = () => {
    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database connected: ${conn.connection.host}`)
        })
        .catch((err) => {
            console.log(`Database failed connected: ${err}`)
        })
}