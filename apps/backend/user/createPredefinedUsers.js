const admin = require("firebase-admin");
const serviceAccount = require("../../../secret/fir-secret.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const predefinedUsers = [
  { email: "user1@example.com", password: "test1234", displayName: "User One" },
  { email: "user2@example.com", password: "test5678", displayName: "User Two" },
  // add more
];

async function createUsers() {
  for (const user of predefinedUsers) {
    try {
      const createdUser = await admin.auth().createUser(user);
      console.log(`Created: ${createdUser.email}`);
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        console.log(`User already exists: ${user.email}`);
      } else {
        console.error(err);
      }
    }
  }
}

createUsers();
