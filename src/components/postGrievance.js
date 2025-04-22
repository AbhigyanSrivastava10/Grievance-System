import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const postGrievance = async (userId, title, description) => {
  try {
    await addDoc(collection(db, "grievances"), {
      userId,               
      title,                
      description,          
      status: "Unassigned",    
      createdAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error posting grievance:", error);
    return { success: false, error: error.message };
  }
};
