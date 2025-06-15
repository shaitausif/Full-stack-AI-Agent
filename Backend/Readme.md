# Here in the first part of this documentation I will talk about all the dependencies

- bcrypt: Used for hashing sensitive user data such as passwords before storing them in the database. Note that it performs hashing, not encryption, ensuring one-way protection of user credentials.

- cors: Helps configure CORS (Cross-Origin Resource Sharing) to allow the frontend (on a different origin) to securely access backend APIs.

- dotenv: Loads environment variables from a .env file into process.env, enabling safe management of sensitive credentials like API keys, database URIs, and secret tokens.

- express: A minimal and flexible Node.js web framework that simplifies server-side development by abstracting the complexity of raw Node.js HTTP handling.

- inngest: A powerful background worker that executes backend functions triggered by events — often coming from AI agents. It manages retries, scheduling, and status reporting, helping AI workflows run reliably.

- jsonwebtoken (JWT): Used for creating and verifying JSON Web Tokens. This is essential for implementing secure user authentication and access control.

- mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js, simplifying database queries and schema definitions with a clean API.

- nodemailer: Enables sending emails from a Node.js application — useful for features like account verification, password reset, and notifications.