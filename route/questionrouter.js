var express = require('express');
var multer = require('multer');
const path = require('path');

var question = require('../model/question');
const router = express.Router();
module.exports = router;

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'/../public/uploads/'));
    },
    filename:function(req,file,cb){
        cb(null,req.params.id+".jpg");
    }
});
var upload = multer({storage:storage});

router.get("/get/:id",(req,res)=>{
    question.findOne({_id:req.params.id},(err,result)=>{
        if(err) throw err;
        else{
            res.send(result);
        }
    })
})
router.post("/add",(req,res)=>{
    var q1 = new question();
    q1.question = req.body.qquestion;
    q1.op1 = req.body.opt[0];
    q1.op2 = req.body.opt[1];
    q1.op3 = req.body.opt[2];
    q1.category = req.body.category;
    q1.difficulty = req.body.difficulty;
    q1.answer = req.body.answer;
    q1.save((err,result)=>{
        if(err) throw err;
        else{
            console.log("added question");
            res.send({qid:result._id});
        }
    })
});
router.post("/update/:id",(req,res)=>{
    question.updateOne({_id:req.params.id},{$set:{
        question : req.body.qquestion,
        op1 : req.body.opt[0],
        op2 :  req.body.opt[1],
        op3 : req.body.opt[2],
        category : req.body.category,
        difficulty : req.body.difficulty,
        answer:req.body.answer
    }},(err)=>{
        if(err) throw err;
        else{
            res.send({msg:"Updated"});
        }
    })
})
router.post("/upload/:id",upload.single('qimage'),(req,res)=>{
    var qimage = "";
    if(req.file){
        qimage = req.params.id+".jpg"
        question.updateOne({_id:req.params.id},{$set:{qimage:qimage}},(err)=>{
            if(err) throw err;
            else{
                res.send({msg:"Uploaded image"});
            }
        })
    }else{
        res.send({msg:"No image found"});
    }   
});
router.get("/delete/:id",(req,res)=>{
    question.deleteOne({_id:req.params.id},(err)=>{
        if(err) throw err;
        else{
            res.send({msg:"Deleted"});
        }
    })
});
router.get("/getquiz/:category/:limit",(req,res)=>{
//    question.find({}).limit(10).exec((err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
    var limit = parseInt(req.params.limit);
    var catFilter = req.params.category;
    var queryParam = [];
    if(catFilter != "misc"){
        var matchParam = {$match:{category:new RegExp(catFilter,'i')}};
        queryParam.push(matchParam);
    }
    queryParam.push({$sample:{size:limit}});
    question.aggregate(queryParam).exec((err,result)=>{
        if(err) throw err;
        else{
            res.send(result);   
        }
    })
    // question.aggregate([{$match:{category:req.params.category}},
    //                     {$sample:{size:10}}]).exec((err,result)=>{
    //     res.send(result);
    // });
});