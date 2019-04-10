import { StudentEntity } from "../entity/Student";
import { getManager, getConnection } from "typeorm";
import { TeacherEntity } from "../entity/Teacher";
export class StudentRepo {
  [x: string]: any;
    

    getStudent() {

        return getManager().getRepository(StudentEntity).find();

    }

    registerStudent(student: StudentEntity) {

          return getManager().getRepository(StudentEntity).save(student);

    }


    suspendStudent(student: StudentEntity) {

        return getManager().getRepository(StudentEntity).save(student);

     }

    getSuspendStudent(){


        return getManager().getRepository(StudentEntity).findOne();

    }

    getCommonStudent() {
       // get Employee repository and find all employees

        return getManager().getRepository(StudentEntity).find();

    }
    checkStudent(emailval) {

        // get Employee repository and find all employees

        /*return getManager().getRepository(StudentEntity).createQueryBuilder("student")
        .where('student.email= :email', { name: email})
        .getCount();*/
        return getManager()
            .getRepository(StudentEntity).createQueryBuilder("student")
            .select("count(*) as count")
            .where("student.email = :email", { email: emailval })
            .getRawOne();
 
        

    }
    getTeacherId(emailval){
        return getManager()
            .getRepository(TeacherEntity).createQueryBuilder("teacher")
            .select("teacher.id")
            .where("teacher.email = :email", { email: emailval })
            .getRawOne();
    }

    decodeURLParams (search ){
        const hashes = search.slice(search.indexOf("?") + 1).split("&");
        return hashes.reduce((params, hash) => {
            const split = hash.indexOf("=");
    
            if (split < 0) {
                return Object.assign(params, {
                    [hash]: null
                });
            }
    
            const key = hash.slice(0, split);
            const val = hash.slice(split + 1);
    
            return Object.assign(params, { [key]: decodeURIComponent(val) });
        }, {});
    };
}