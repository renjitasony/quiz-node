var express = require('express');
var bodyparser = require('body-parser');
var mongoose =require('mongoose');
const path = require('path');

var question = require("./model/question");
var qrouter = require("./route/questionrouter");
var urouter = require("./route/userrouter");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
var url = "mongodb+srv://sonyrenjita:mangoHONET@cluster0-sbret.mongodb.net/Quiz?retryWrites=true&w=majority";
//var url = "mongodb://localhost/mydb1";
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true},(err)=>{
    if(err) throw err;
    else{
        console.log("connected");
    }
})
app.use(function (req, res, next) {   
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');  
    res.setHeader('Access-Control-Allow-Credentials', true);   

    next();
});
app.use(express.static(path.join(__dirname,"/public")));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use("/user",urouter);
app.use("/question",qrouter);

app.listen(process.env.PORT || 8000,(req,res)=>{
    console.log("server listening at 8000");
});
app.post("/questionnaire",(req,res)=>{
    var catfilter = req.body.category;
    var textFilter = req.body.search;
    var difFilter = req.body.difficulty;
    var queryParam = {};
        
    if(catfilter != "All"){
        queryParam["category"] = catfilter;
    }
    if(difFilter != ""){
        queryParam["difficulty"] = difFilter;
    }
    if(textFilter != ""){
        var searchFields = ["question","op1","op2","op3"];
        var wrapper = [];
        searchFields.forEach((field)=>{
            var textQuery = {};
            textQuery[field] = new RegExp(textFilter,'i');
            wrapper.push(textQuery);  
        })
        queryParam["$or"] = wrapper;
    }    
    question.find(queryParam).exec((err,result)=>{
        if(err) throw err;
        else{
            res.send(result);
        }
    })
});
app.get("/view/:image",(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/uploads/',req.params.image));
});
