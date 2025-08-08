const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then((res)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    const updatedData = initData.data.map((obj) => ({
      ...obj,
      owner: "6892046301b38dd95adb6370"
    }));
    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
  };
initDB();
