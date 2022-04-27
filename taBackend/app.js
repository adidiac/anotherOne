var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var textAnalytics=require('./textAnalytics')
var User=require('./user');
var Service=require('./service');
var mongoose = require('mongoose');
var multer=require('multer');
const file = require('fs');



const storage=multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null,"./")
  },
  filename:function(req,file,cb)
  {
    cb(null,file.originalname)
  }
})


const upload=multer({storage:storage})




let mongooseUrl="mongodb+srv://student:student@cluster0.vjw3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



mongoose.connect(mongooseUrl, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log('DB online');
    //
    // var service1={
    //     name:"Sentiment result",
    //     price:200,
    //     numberAbonati:0,
    // }
    // var service2={
    //     name:"Language detection",
    //     price:100,
    //     numberAbonati:0,
    // }
    // var service3={
    //     name:"Entity detection",
    //     price:100,
    //     numberAbonati:0,
    // }
    // var service4={
    //     name:"Opinion mining",
    //     price:100,
    //     numberAbonati:0,
    // }
    // //save all services in database
    // Service.create(service1,service2,service3,service4).then(result=>{
    //     console.log("Services saved");
    // }).catch(err=>{
    //     console.log(err);
    // })
    // var userAdmin={
    //     name:"Admin",
    //     email:"admin@gmail.com",
    //     password:"admin",
    //     role:"admin",
    //     tiles:[],
    //     history:[]
    // }
    // //save admin in database
    // User.create(userAdmin).then(result=>{
    //     console.log("Admin saved");
    // }).catch(err=>{
    //     console.log(err);
    // })
  //   var userIonut={
  //   name:"Ionut",
  //  email:"ionut@gmail.com",
  //  password:"ionut",
  //   role:"user",
  //   tiles:[ "Sentiment result", "Language detection", "Entity detection", "Opinion mining"],
  //   history:[]
  // }
  // //save user in database
  //     User.create(userIonut).then(result=>{
  //           console.log("User saved");
  //         }).catch(err=>{
  //           console.log(err);
  //         })
})
  .catch((error) => {
    console.log('error:', error.message)
  })




var app = express();

// view engine setup
const cors = require('cors')

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sqlServer=require('./sqlServer');
const blobStorage=require('./blobStorage');


app.post('/addFile',upload.single('file'),async function(req, res, next) {
  console.log(req.file.path)

  //read file from path
  const text = await file.readFileSync(req.file.path);
  //get sentiment result
  console.log(text.toString());
  const sentimentResult = await textAnalytics.determineSentiment(text.toString());
  const blobName=await blobStorage.uploadText(text);
  console.log(sentimentResult);
  console.log(blobName);
  sqlServer.insertIntoDatabase(req.file.path,blobName,new Date(),sentimentResult);
  sqlServer.selectAllData(res);
  
})
//get all data from sql server
app.get('/getAllData',async function(req, res, next) {
 sqlServer.selectAllData(res);
})




// catch 404 and forward to error handler
app.post('/add',async function(req, res, next) {
  console.log(req.body.data)
  textAnalytics.textAnalytics(res,req.body.data);
})

app.post('/login',async function(req, res, next) {
  User.findOne({email:req.body.email,password:req.body.password}).then(result=>{
    if(result){
      res.send(result);
    }
    else{
      res.send("User not found");
    }
  }).catch(err=>{
    res.send(err);
  }
  )
})

//register
app.post('/register',async function(req, res, next) {
  User.findOne({email:req.body.email}).then(result=>{
    if(result){
      res.send("User already exists");
    }
    else{
      var user={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:"user",
        tiles:req.body.tiles,
        history:[]
      }
      User.create(user).then(result=>{
        //for every tile add to service number of abonati +1
        for(var i=0;i<req.body.tiles.length;i++){
          Service.findOne({name:req.body.tiles[i]}).then(result=>{
            result.numberAbonati++;
            result.save();
          }).catch(err=>{
            console.log(err);
          })
        }
        res.send(result);

      }).catch(err=>{
        res.send(err);
      })
    }
  }
  ).catch(err=>{
    res.send(err);
  }
  )
})

//get all users
app.get('/users',async function(req, res, next) {
  User.find().then(result=>{
    res.send(result);
  }
  ).catch(err=>{
    res.send(err);
  }
  )
})

//get all services
app.get('/services',async function(req, res, next) {
  Service.find().then(result=>{
    res.send(result);
  }
  ).catch(err=>{
    res.send(err);
  }
  )
})

//update price of service
app.post('/updatePrice',async function(req, res, next) {
  Service.findOneAndUpdate({name:req.body.name},{price:req.body.price}).then(result=>{
    res.send(result);
  }
  ).catch(err=>{
    res.send(err);
  }
  )
})

//delete users
app.post('/deleteUser',async function(req, res, next) {
  User.findOneAndDelete({email:req.body.email}).then(result=>{
    res.send(result);
  }
  ).catch(err=>{
    res.send(err);
  }
  )
})

//update history of user
app.post('/updateHistory',async function(req, res, next) {
  //add to history array of user
  let email=req.body.email;
  User.findOneAndUpdate({email:email},{history:req.body.history}).then(result=>{
    res.send(result);
  }
  ).catch(err=>{
    res.send(err);
  }
  )
})

//get history of user
app.post('/getHistory',async function(req, res, next) {
  User.findOne({email:req.body.email}).then(result=>{
    res.send(result.history);
  }).catch(err=>{
    res.send(err);
  }
  )
})


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;