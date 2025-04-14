import { Field, ID, ObjectType, InputType } from "type-graphql";

@ObjectType()
export class Doctor {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  specialization: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  hospital?: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt?: string;
}

@InputType()
export class DoctorInput {
  @Field()
  name: string;

  @Field()
  specialization: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  hospital?: string;
}

@InputType()
export class DoctorUpdateInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  specialization?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  hospital?: string;
  
}


//auth, logger service, .env, config