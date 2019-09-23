var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema;
var userschema = new schema({ 
    name:{type:String,required:true}, 
    mob:{type:String,required:true}, 
    username:{type:String,required:true,unique:true},     
    mail:String,
    password:{type:String,required:true},
    role:{type:String,required:true,default:"client"},
    totalscore:{type:Number,default:0}    
});
//userschema.plugin(uniqueValidator);
var umodel = mongoose.model("user",userschema,"user");
module.exports = umodel;