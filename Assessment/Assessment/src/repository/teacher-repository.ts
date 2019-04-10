import { StudentEntity } from "../entity/Student";
import { getManager, getConnection } from "typeorm";
import { TeacherEntity } from "../entity/Teacher";
export class TeacherRepo {
    checkTeacher(emailval) {

        // get Employee repository and find all employees

        /*return getManager().getRepository(StudentEntity).createQueryBuilder("student")
        .where('student.email= :email', { name: email})
        .getCount();*/
        return getManager()
            .getRepository(TeacherEntity).createQueryBuilder("teacher")
            .select("count(*) as count")
            .where("teacher.email = :email", { email: emailval })
            .getRawOne();
      

    }

}