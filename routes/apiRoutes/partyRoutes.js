const express = require('express')
const router = express.Router();
const db = require('../../db/connection.js')

//get all parties
router.get('/parties',(req,res)=>{
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
//get single party
router.get('/party/:id',(req,res)=>{
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
//delete a party
router.delete('/party/:id',(req, res)=>{
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

module.exports = router

