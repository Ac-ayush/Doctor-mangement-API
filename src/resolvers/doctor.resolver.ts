import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Doctor, DoctorInput, DoctorUpdateInput } from "../models/Doctor";
import { 
  createDoctor, 
  getDoctor, 
  getAllDoctors, 
  updateDoctor, 
  deleteDoctor 
} from "../db/dynamodb";

@Resolver(Doctor)
export class DoctorResolver {
  @Query(() => [Doctor])
  async doctors(): Promise<Doctor[]> {
    return await getAllDoctors();
  }

  @Query(() => Doctor, { nullable: true })
  async doctor(@Arg("id") id: string): Promise<Doctor | null> {
    return await getDoctor(id);
  }

  @Mutation(() => Doctor)
  async createDoctor(@Arg("input") input: DoctorInput): Promise<Doctor> {
    return await createDoctor(input);
  }

  @Mutation(() => Doctor, { nullable: true })
  async updateDoctor(
    @Arg("input") input: DoctorUpdateInput
  ): Promise<Doctor | null> {
    return await updateDoctor(input);
  }

  @Mutation(() => Boolean)
  async deleteDoctor(@Arg("id") id: string): Promise<boolean> {
    return await deleteDoctor(id);
  }
}