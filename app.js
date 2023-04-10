import { MongoClient } from 'mongodb';
import express from 'express';

const app = express();

const databaseUrl = 'mongodb+srv://admin:admin@cluster0.tthq04f.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(databaseUrl);

const db = client.db('tasks-app')
const todoCollection = db.collection('todo_tasks')
const doneCollection = db.collection('done_tasks');


try{
  await client.connect()
  console.log("conectou")
} catch{
  console.log("algum erro")
}

app.get('/addTodo',async (req,res)=>{  
  const query = req.query;
  try{
    await todoCollection.insertOne(query)
    res.send({res: "success"})
  }catch(e){
    req.send(e);
  }
  
});

app.get('/deleteTodo',async (req,res)=>{
  const query = req.query;
  try{
    const task = await todoCollection.findOne(query)
    await todoCollection.deleteOne(query)
      
    const doneCollection = db.collection('done_tasks');
    await doneCollection.insertOne(task);

    res.send({res: "success"})
  }catch(e){
    req.send(e);
  }
});

app.get('/deleteDone',async (req,res)=>{
  const query = req.query;
  try{
    await doneCollection.deleteOne(query);
    res.send({res: "success"})
  }catch(e){
    req.send(e);
  }
});

app.listen(3000,()=>{
  console.log('rodando');
})
