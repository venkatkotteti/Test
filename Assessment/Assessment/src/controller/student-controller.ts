import { Request, Response } from "express";

import { StudentRepo } from "../repository/student-repository";

import { StudentEntity } from "../entity/Student";

import { getConnection, MoreThan, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

import { TeacherEntity } from "../entity/Teacher";
import { TeacherRepo } from "../repository/teacher-repository";

 

export let getStudents = async (req: Request, res: Response) => {

    let studentRepo: StudentRepo = new StudentRepo();

       console.log("Received Student List ==> GET");

 
    studentRepo.getStudent().then((result: any) => {

        console.log("Result : " + result);

        res.send(result);

    });

 
};

 

export let registerStudent = async (req: Request, res: Response) => {

    let stuRepo: StudentRepo = new StudentRepo();
    let teacherRepo: TeacherRepo = new TeacherRepo();

     let registerObj,teacherEmail,studentsArray;

     
 // let urlString = "http://localhost:3000/registerStudent?teacher=teacher01@01.com";
  let urlSting = req.url;
  let urlParams = stuRepo.decodeURLParams(urlSting);

  console.log("url params"+JSON.stringify(urlParams));
  //return urlParams;
        teacherEmail = urlParams.teacher;
        studentsArray = req.body.students;
 
 

    console.log("Register Student  ==> POST");

    console.log(req.body);

    let teaacherentity:TeacherEntity = new TeacherEntity();
     let stuentity:StudentEntity = new StudentEntity();

    console.log("email" + req.body.email);
    let checkTeacher = await teacherRepo.checkTeacher(teacherEmail);

    console.log("student value"+JSON.stringify(checkTeacher));
    try{

      if(checkTeacher.count > 0){


        let result = await getConnection()
       .createQueryBuilder()
       .where("teaacherentity.email = :email", { email: req.body.email })
       .insert()
       .into(StudentEntity)
       .values(req.body.students)
       .execute();

       console.log("resulet"+result);
       res.send("Students Registerd successfully");

    }else{
       res.send("Teacher email does not exists");
    }

    } catch (e) {
      console.log(e);
      res.send("Error is inserting the data might be the duplicate entry or database error");
  }
    
};


export let getSuspendStudent = async (req: Request, res: Response) => {

    let stuRepo: StudentRepo = new StudentRepo();
   
    let student:StudentEntity = new StudentEntity();


  //  let urlString = "http://localhost:3000/suspendStudent?student=student01@01"
    let urlString = req.url;
    let urlParams = stuRepo.decodeURLParams(urlString);

 // checking student exist or not 
    let checkStudent = await stuRepo.checkStudent(urlParams.student);

    console.log("student value"+JSON.stringify(checkStudent));

    
    try{
      // if student exists, isSuspended flag is updated as false from student entity
      if(checkStudent.count > 0){

        var suspendstudent = await getConnection()
  
        .createQueryBuilder()
  
        .update(StudentEntity)
  
        .set({ isSuspend: false })
  
        .where("email = :email", { email: urlParams.student })
  
        .execute();
        
        res.send("Student supended successfully");
      }else{
       
  
        res.send("Student does not exist");
      }
    } catch (e) {
      console.log(e);
      res.send("There is issue with server");
  }
        
};


export let getCommonStudent = async (req: Request, res: Response) => {

    try{
    
    let stuRepo: StudentRepo = new StudentRepo();
    let teacherRepo: TeacherRepo = new TeacherRepo();
    let commonstudent = new StudentEntity();
    let teacherEmail;
  
    let urlSting = req.url;
    let urlParams = stuRepo.decodeURLParams(urlSting);

 console.log("url params"+JSON.stringify(urlParams));
 //return urlParams;
      teacherEmail = urlParams.teachers;
     //  studentsArray = req.body.students;

 let emailArray =  req.body.teachers;
 console.log("email "+emailArray);
 emailArray.forEach(async teacher => {

  let checkTeacher = await teacherRepo.checkTeacher(teacherEmail);
    
 });
 
 const user1 = await getConnection().createQueryBuilder(TeacherEntity,"teacher")
 .innerJoinAndSelect("teacher.students", "student")
 .where("teacher.email IN (:...email)",{email:emailArray})
 
 .select("student.id,student.email","email")
 .groupBy("student.email")
 .having ("COUNT(*) >="+emailArray.length)
 .getRawMany();
 console.dir("common list"+user1);
 console.log("common list"+JSON.stringify(user1));
 res.send(user1);
} catch (e) {
  console.log(e);
  res.send("There is issue with server");
}

};

export let sendNotifications = async (req: Request, res: Response) => {

  try{

    let stuRepo: StudentRepo = new StudentRepo();
    let commonstudent = new StudentEntity();
    let emailStudentArray,teacherVal;
    teacherVal = req.body.teacher;
    emailStudentArray = req.body.notification;
    
  
    console.log("teacher val"+req.body.teacher+"notificat"+req.body.notification);
  /*const user2 = await getConnection().createQueryBuilder(TeacherEntity,"teacher")
  .leftJoinAndSelect("teacher.students", "student")
  //.select("student.id,student.name","name")
  //.where("teacher.id = :id  OR student.email IN (:...email)= :id",{id:req.body.teacher,email:req.body.notification})
  //.select("teacher.name","name")
  //.orWhere("student.id IN (:...id)",{id:["6"]})
  .select("student.id,student.name","name")
  // .orWhere("student.id IN (:...id)",{id:["2"]})
  //.innerJoin("teacher", "student", "teacher.age = :age")
  // .where.innerJoin("fileGroup.users", "fileGroupUser", "fileGroupUser.id = :currentUserId")
  //.andWhere("teacher.students",{"teacher.id = student.id"})
  .where("teacher.email = :email", { email: req.body.teacher})
  .orWhere("student.email IN (:...email)",{email: emailStudentArray})
   //.orWhere("student.email IN (:...email)", {email: ["student003@003.com","student001@002.com"]})
  //.groupBy("student.id")
  //.having ("COUNT(*) >= 0")
  .getRawMany();
  res.send(user2);*/
  let teacherId = await stuRepo.getTeacherId(req.body.teacher);
  console.log("teacher id"+JSON.stringify(teacherId));
  const user2 = await getConnection().createQueryBuilder(TeacherEntity,"teacher")
    .leftJoinAndSelect("teacher.students", "student")
    
    .where("teacher.id = :id", { id:teacherId.teacher_id})
    .orWhere("student.email IN (:...email)",{email:emailStudentArray})
    .select("student.id,student.email","email")
    .groupBy("student.email")
 //.having ("COUNT(*) >="+emailArray.length)
    .getRawMany();
  
    res.send(user2);
  

  } catch(e) {
    console.log(e);
    res.send("There is issue with server");
  }

};




