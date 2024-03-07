const mongoose=require("mongoose")
const connectdb=()=>{
    mongoose.connect("mongodb://localhost:27017",{
        dbName:"EConnect"
    }).then(
        (data)=>{
            console.log("Connected to db ",data.connection.host)
        }
    )
}
module.exports=connectdb