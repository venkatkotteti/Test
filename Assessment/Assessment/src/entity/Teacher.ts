import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { StudentEntity } from "./Student";

@Entity()
export class TeacherEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar", unique:true})
    email:string

    @Column()
    name: string;

    @ManyToMany(() => StudentEntity)
    @JoinTable({ name: "students" })

    students: StudentEntity[];

}
