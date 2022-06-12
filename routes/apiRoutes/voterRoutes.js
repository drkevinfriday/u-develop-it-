const express = require('express')
const router = express.Router();
const db = require('../../db/connection.js')

const inputCheck = require('../../utils/inputCheck');


router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows,
      });
    });
  });

//   get single voter

router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql,params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows,
      });
    });
  });

  router.delete('/voter/:id',(req, res)=>{
    const sql = `DELETE FROM  voters WHERE id= ?`;
    const params = [req.params.id];

    db.query(sql,params, (err,result)=>{
        if (err){
            res.status(400).json({error: res.message});
        } else if(!result.affectedRows){
            res.json({
                message: 'voter not found'
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

// create a voter
router.post('/voter',({ body }, res)=>{
    const errors = inputCheck(
        body, 
        'first_name',
        'last_name',
        'body.email'
        );
   if(errors){
       res.status(400).json({error: errors});
       return;
   }

       
   const sql = `INSERT INTO voters (first_name, last_name, body.email)
   VALUES(?,?,?)`;
   const params = [body.first_name, body.last_name, body.body.email];

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

//update a voter's party
router.put('/voter/:id',(req,res)=>{
   const errors = inputCheck(req.body, 'email');

       if (errors) {
           res.status(400).json({ error: errors });
           return;
       }
   const sql = `UPDATE voters SET email = ?  
                WHERE id = ?`
   const params = [req.body.email, req.params.id]

   db.query(sql, params, (err, result) => {
       if (err) {
         res.status(400).json({ error: err.message });
         // check if a record was found
       } else if (!result.affectedRows) {
         res.json({
           message: 'voter not found'
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

 module.exports = router