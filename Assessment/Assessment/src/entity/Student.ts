import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class StudentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar", unique:true})
    email:string

    @Column()
    name: string;

    @Column({ default: false })
    isSuspend: boolean;

}
