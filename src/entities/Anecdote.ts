import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity("anecdotes")
@Index(["section"])
export class Anecdote {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", unique: true })
    externalId!: string;

    @Column({ type: "varchar", default: "general" })
    section!: string;

    @Column({ type: "text" })
    content!: string;

    @Column({ type: "int", default: 0 })
    views!: number;

    @CreateDateColumn()
    createdAt!: Date;
}