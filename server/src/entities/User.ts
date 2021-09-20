import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { AccountInfo } from "./AccountInfo";
import { Post } from "./Post";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  // will use this later
  //   @Column({ unique: true })
  //   @Field()
  //   phone_no!: string;

  @Column({ unique: true })
  @Field()
  username!: string;

  // , nullable: true
  @Column({ unique: true })
  @Field()
  email!: string;

  //   Client can't query for pass word it will and hashed
  @Column()
  password!: string;

  @OneToMany((type) => Post, (post) => post.creator)
  posts: Post[];
  // .posts have to be matched what in the Post.ts

  @OneToMany((type) => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  // relatioship with account starts
  @OneToOne((type) => AccountInfo, (accountInfo) => accountInfo.user)
  @JoinColumn()
  accountInfo: AccountInfo;

  // relatioship with account ends

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
