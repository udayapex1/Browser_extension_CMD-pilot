import mongoose from "mongoose";

const conncetDatabase = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}`);
        if (conncetDatabase) {
            console.log(` Connected To MongoDb : ${connectionInstance.connection.host}`)

        }

    } catch (error) {
        console.log("Failed to Connect database ", error);
    }

}

export default conncetDatabase;