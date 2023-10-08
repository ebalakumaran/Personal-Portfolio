const express = require('express');
const app=express()
const MongoClient = require("mongodb").MongoClient;
const uri="mongodb+srv://balakumaran:bala242002@cluster0.sdmvl2n.mongodb.net/PersonalPortfolio?retryWrites=true&w=majority"

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader('Access-Control-Allow-Origin', 'https://balakumarandeveloper.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.get('/portfolio',async (req, res) => {

  const client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
  const dbName = "PersonalPortfolio";
  const collectionName = "Skills";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  try {
    const cursor = await collection.find({}).toArray();
    res.json(cursor);
    } catch (err) {
        console.error(`Something went wrong trying to fetch the documents: ${err}\n`);
    } finally {
        client.close();
    }

})

app.get('/certifications',async (req, res) => {

    const client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = "PersonalPortfolio";
    const collectionName = "Certifications";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    try {
      var cursor = await collection.find({}).toArray();
      if(cursor.length==0){
        dummayData={}
        dummayData.url="";
        dummayData.title="";
        cursor.push(dummayData)
      }
      res.json(cursor);
      } catch (err) {
          console.error(`Something went wrong trying to fetch the documents: ${err}\n`);
      } finally {
          client.close();
      }
  
  })

  app.post('/admin',async(req,res)=>{
    var bodyData=req.body;
    const client = await MongoClient.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true});
    const dbName = "PersonalPortfolio";
    const collectionName = "Admin";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    try{
        var adminCred = await collection.find({username:bodyData.username}).toArray();
        responseSentFlag=0
        if(adminCred.length>0){
            for(let i=0;i<adminCred.length;i++){
                if(adminCred[i].username==bodyData.username && adminCred[i].password==bodyData.password){
                    console.log("Verified User");
                    res.status(200).json({msg:'User verified !'})
                    responseSentFlag=1
                }
            }
        }
        if(responseSentFlag==0){
        console.log("Not a Verified User");
        res.status(400).json({Error:'Unable to Login'})
        }
    }
    catch(err){
        console.log(err);
        res.json({Error:'An error occured! Unable to login !'})
    }
})


app.post("/certificationupload", async (req, res) => {
    const body = req.body;
    const client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = "PersonalPortfolio";
    const collectionName = "Certifications";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    if(body.url!="" && body.title!=""){
        try{
            const newImage = await collection.insertOne(body)
            res.json({ msg : "New image uploaded...!"})
        }catch(error){
            res.status(500).json({ message : error.message })
        }finally {
            client.close();
        }
    }
    else{
        console.log("Empty Field Found...!");
        res.json({ msg : "Empty Field Found...!"})
    }
})

app.post("/addskill", async (req, res) => {
    console.log(req.body);
    const body = req.body;
    const client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = "PersonalPortfolio";
    const collectionName = "Skills";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    if(body.skillname!="" && body.explevel!=""){
        try{
            const newImage = await collection.insertOne(body)
            res.json({ msg : "New Skill added...!"})
        }catch(error){
            res.status(500).json({ message : error.message })
        }finally {
            client.close();
        }
    }
    else{
        console.log("Empty Field Found...!");
        res.json({ msg : "Empty Field Found...!"})
    }
})

app.listen('5000',()=>{
    console.log("Server started to listen on the port ");
    })

  


 /********************************************** GET, POST , PUT, DELETE (Local Compass DB)******************************************/
// const MongoClient = require("mongodb").MongoClient;
// const url = 'mongodb://localhost:27017/';
// const databasename = "personal_portfolio"; 
//  app.get('/portfolio',async (req, res) => {
//     try {
//         const client = await MongoClient.connect(url);
//         const db = client.db(databasename);
//         const collection = db.collection("personal_portfolio");
//         const data = await collection.find({}).toArray();
//         res.json(data); 
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Server error' });
//     }
//   })

// app.post('/portfolio', async (req, res) => {
// try {
//     const client = await MongoClient.connect(url);
//     const db = client.db(databasename);
//     const collection = db.collection("personal_portfolio");
//     const newItem = req.body;
//     const result = await collection.insertOne(newItem);
//     res.json(result);
// } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
// }
// });

// app.put('/portfolio/:id', async (req, res) => {
// try {
//     const client = await MongoClient.connect(url);
//     const db = client.db(databasename);
//     const collection = db.collection("personal_portfolio");
//     const updatedItem = req.body;
//     const result = await collection.updateOne(
//     { _id: req.params.id },
//     { $set: updatedItem }
//     );
//     res.json({ message: 'Item updated' });
// } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
// }
// });

// app.delete('/portfolio/:id', async (req, res) => {
// try {
//     const client = await MongoClient.connect(url);
//     const db = client.db(databasename);
//     const collection = db.collection("personal_portfolio");
//     const result = await collection.deleteOne({ _id: req.params.id });
//     res.json({ message: 'Item deleted' });
// } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
// }
// });