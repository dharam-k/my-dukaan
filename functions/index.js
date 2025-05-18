const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createSeller = onCall(async (request) => {
  const { email, password, name, phone, address, gstn, isActive, loginActive } = request.data;

  // You can access request.auth to check auth status
  if (!request.auth) {
    throw new Error("unauthenticated");
  }

  if (!email || !password || !name) {
    throw new Error("Missing required fields: email, password and name");
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      name,
      phone: phone || null,
      address: address || null,
      email,
      gstn: gstn || null,
      userType: "seller",
      isActive: isActive !== undefined ? isActive : true,
      loginActive: loginActive !== undefined ? loginActive : true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid };
  } catch (error) {
    console.error("Error creating seller: ", error);
    throw new Error(error.message);
  }
});