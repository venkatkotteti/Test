import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import *as express from "express";
import * as bodyParser from "body-parser";
import "reflect-metadata";

 

import { StudentEntity } from "./entity/Student";

import * as studentController from "./controller/student-controller"


const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

 

app.listen(3000, () =>{

console.log("server is running on 3000");

});

 

app.get('/getList',(request,responce) =>{

 

responce.send("resonce received");

});

 

app.get("/getStudents", studentController.getStudents);

app.post("/registerStudent", studentController.registerStudent);

app.post("/suspendStudent", studentController.getSuspendStudent);

app.post("/commonstudentlist", studentController.getCommonStudent)

app.post("/sendNotifications", studentController.sendNotifications)


createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
   // await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
