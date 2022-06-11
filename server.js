// import express
const { response } = require('express');
const express = require('express');
const { request } = require('http');
const inputCheck = require('./utils/inputCheck');
const db = require('./db/connection')
//  port setup for server
const PORT =  process.env.PORT|| 3001;
const app = express();

//  Express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());





// this line displays all the current data from candidates database
//  gets all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`; 
    
    
    db.query(sql, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          message: 'success',
          data: rows
        });
      });      
    });

//  get a single candidates 
app.get('/api/candidate/:id', (req, res) => {
    const sql = `Select candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties 
                ON candidates.party_id = parties.id
                where candidates.id =?`;
                
    const params = [req.params.id];    
    
    db.query(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        
        res.json({
          message: 'success',
          data: row
        });
      });      
    });

app.get('/api/parties',(req,res)=>{
    const sql =`SELECT * FROM parties`;
    
    db.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error: err.message});
            return
        }
        res.json({
            message:'success',
            data: rows
        })
    })
})
app.get('/api/party/:id',(req,res)=>{
    const sql =`SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id]
    
    db.query(sql,params,(err,rows)=>{
        if(err){
            res.status(400).json({error: err.message});
            return
        }
        res.json({
            message:'success',
            data: rows
        })
    })
})

//     // Get a single candidate
// app.get('/api/candidate/:id', (req, res) => {
//   const sql = `SELECT * FROM candidates WHERE id = ?`;
//   const params = [req.params.id];

//   db.query(sql, params, (err, row) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: row
//     });
//   });
// });


// Delete a candidate
 app.delete('/api/candidate/:id',(req, res)=>{
     const sql = `DELETE FROM  candidates WHERE id= ?`;
     const params = [req.params.id];

     db.query(sql,params, (err,result)=>{
         if (err){
             res.status(400).json({error: res.message});
         } else if(!result.affectedRows){
             res.json({
                 message: 'Candidate not found'
             });                    
         } else {
             res.json({
                 message: 'deleted',
                 changes: result.affectedRows,
                 id: req.params.id
             })
         }
     })
 })

 app.delete('/api/party/:id',(req, res)=>{
     const sql = `DELETE FROM  parties WHERE id= ?`;
     const params = [req.params.id];

     db.query(sql,params, (err,result)=>{
         if (err){
             res.status(400).json({error: res.message});
         } else if(!result.affectedRows){
             res.json({
                 message: 'Candidate not found'
             });                    
         } else {
             res.json({
                 message: 'deleted',
                 changes: result.affectedRows,
                 id: req.params.id
             })
         }
     })
 })


 

// create a candidate
 app.post('/api/candidate',({ body }, res)=>{
     const errors = inputCheck(
         body, 
         'first_name',
         'last_name',
         'industry_connected'
         );
    if(errors){
        res.status(400).json({error: errors});
        return;
    }

        
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err,result)=>{
        if (err){
            res.statusMessage(400).json({error: err.message});
            return;  
        }
        res.json({
            message: 'success',
            data: body
        })       
     })
 })

//update a candidate's party
app.put('/api/candidate/:id',(req,res)=>{
    const errors = inputCheck(req.body, 'party_id');

        if (errors) {
            res.status(400).json({ error: errors });
            return;
        }
    const sql = `UPDATE candidates SET party_id = ?  
                 WHERE id = ?`
    const params = [req.body.party_id, req.params.id]

    db.query(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
          // check if a record was found
        } else if (!result.affectedRows) {
          res.json({
            message: 'Candidate not found'
          });
        } else {
          res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
          });
        }
    })
})










// // get a single candidate
// db.query(`Select * From candidates where id =1`,(err,row)=>{
//     if(err){
//         console.log(err)
//     }
//     console.log(row)
// } );
// // delete a candidate
// db.query(`DELETE FROM candidates where id =?`, 1, (err,result) => {
//     if(err){
//         console.log(err)
//     }
//     console.log(result)
// } );

// //Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
// VALUES(?,?,?,?)`;

// const params =[1,'Ronald','Firbank',1];


// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });



//  this test the server to see if the connction is okay
// app.get("/",(req,res)=>{
//     res.json({
//         message: 'Hello World'
//     })

// });




// Default response for any other request (Not Found) 
//  must be after te get response so it doesnt override the other connection  
app.use((req,res)=>{
    res.status(404).end();
})

// server connection function
app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT} `)
});