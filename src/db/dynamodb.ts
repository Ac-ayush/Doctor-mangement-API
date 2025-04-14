import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  UpdateCommand, 
  DeleteCommand 
} from "@aws-sdk/lib-dynamodb";
import { Doctor, DoctorInput, DoctorUpdateInput } from "../models/Doctor";
import { v4 as uuidv4 } from "uuid";

// Set up DynamoDB client
const client = new DynamoDBClient({
  region: "us-east-1",
  // For local development with DynamoDB local
  endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "fakeAccessKeyId",
        secretAccessKey: "fakeSecretAccessKey"
    }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "doctors";

// DynamoDB operations
export const createDoctor = async (doctorInput: DoctorInput): Promise<Doctor> => {
  const timestamp = new Date().toISOString();
  const doctor: Doctor = {
    id: uuidv4(),
    ...doctorInput,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: doctor,
    })
  );

  return doctor;
};

export const getDoctor = async (id: string): Promise<Doctor | null> => {
  const response = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );

  return (response.Item as Doctor) || null;
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );

  return (response.Items as Doctor[]) || [];
};

export const updateDoctor = async (
  doctorUpdate: DoctorUpdateInput
): Promise<Doctor | null> => {
  const { id, ...updateData } = doctorUpdate;
  
  // First check if the doctor exists
  const existingDoctor = await getDoctor(id);
  if (!existingDoctor) {
    return null;
  }

  // Build update expression and attribute values
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpressionParts.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  // Add updatedAt field
  updateExpressionParts.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = new Date().toISOString();

  // If there's nothing to update
  if (updateExpressionParts.length === 0) {
    return existingDoctor;
  }

  const updateExpression = `SET ${updateExpressionParts.join(", ")}`;

  const response = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return response.Attributes as Doctor;
};

export const deleteDoctor = async (id: string): Promise<boolean> => {
  // First check if the doctor exists
  const existingDoctor = await getDoctor(id);
  if (!existingDoctor) {
    return false;
  }

  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );

  return true;
};