var mongoose = require('mongoose');
var schema  = mongoose.Schema;


var qschema = new schema({
    question:{type:String,required:true},
    op1:{type:String,required:true},
    op2:{type:String,required:true},
    op3:{type:String,required:true},
    category:{type:String,required:true},
    difficulty:{type:String,required:true},
    qimage:{type:String},
    answer:{type:String,required:true,default:"0"}
});

var qmodel = mongoose.model("question",qschema,"questions");
module.exports = qmodel;