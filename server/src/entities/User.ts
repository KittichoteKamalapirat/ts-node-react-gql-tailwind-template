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
import { Address } from "./Address";
import { CartItem } from "./CartItem";
import { Mealkit } from "./Mealkit";
import { Order } from "./Order";
import { Post } from "./Post";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column({ unique: true })
  @Field()
  username!: string;

  @Column({ unique: true })
  @Field()
  email!: string;

  @Column({ unique: true, nullable: true })
  @Field()
  phonenumber!: string;

  @Column("boolean", { default: false })
  @Field()
  isCreator!: boolean;

  @Column({ unique: true })
  @Field()
  avatar!: string;

  @Column({ unique: true, nullable: true })
  @Field()
  about!: string;

  //   Client can't query for pass word it will and hashed
  @Column()
  password!: string;

  @OneToMany((type) => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany((type) => Mealkit, (mealkit) => mealkit.creator)
  mealkits: Mealkit[];
  // .posts have to be matched what in the Post.ts

  @OneToMany((type) => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  // relatioship with profile starts
  @OneToOne((type) => Address, (address) => address.user)
  @JoinColumn()
  address: Address;
  // relatioship with account ends -> profileId

  //has many carts
  @OneToMany((type) => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  //One user can have many orders
  @OneToMany((type) => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
