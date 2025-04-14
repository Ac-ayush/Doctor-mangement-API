#### Technologies (Backend based)
- Apollo graphQL
- AWS DynamoDB
- Nodejs
- Typescript

#### Setup 
- install dependencies `npm i`
- start project `npm run dev`

##### setup local dynamoDB
- RUN the following commands in `dynamodb_local_latest` directory (download from net)
    - setup&start DB `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb` (port 8000)
    - start DB UI : `npx dynamodb-admin`


- Play with apollo graphql on `http://localhost:4000/graphql`
