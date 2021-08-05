const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const app = express()
const {router} = require("./routes/workOutRoute")

mongoose.connect(`mongodb+srv://pgturn68:Koengrey@0726@cluster0.72e6x.mongodb.net/fitnesTracker?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => { 
    console.log("My DB is running")
 })
 .catch((err) => { 
     console.log(`An error occurred: ${err}`)
  })

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

app.use("/",router)

app.get("/exercise",(req,res) =>{
 res.sendFile(path.join(__dirname +"/public/exercise.html"))   
})

app.get("/stats",(req,res) =>{
    res.sendFile(path.join(__dirname +"/public/stats.html"))   
   })

app.get("/test",(req,res) => {
res.send("hello world")
})


app.listen(process.env.PORT || 3005,() =>{
    console.log("server is running on 3005")
}) 
