// import express
const express = require('express')
//  port setup for server
const PORT =  process.env.PORT|| 3001;
const app = express();

//  Express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use((req,res)=>{
    res.status(404).end();
})

//  this test the server to see if the connction is okay
app.get("/",(req,res)=>{
    res.json({
        message: 'Hello World'
    })

});
// server connection function
app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT} `)
});