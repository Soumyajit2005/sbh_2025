import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "./Firebase"; // Adjust the import path as necessary

export interface Feedback {
  id: string;
  userId: string;
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  timestamp: string;
  topics?: string[];
}

export const fetchUserFeedbacks = async (userId: string): Promise<Feedback[]> => {
  if (!userId) {
    console.warn("fetchUserFeedbacks: userId is undefined or empty");
    return []; // Return empty array instead of querying with invalid value
  }

  try {
    const feedbacksRef = collection(db, "interview-feedbacks");
    const q = query(feedbacksRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      score: doc.data().score,
      summary: doc.data().summary,
      strengths: doc.data().strengths || [],
      weaknesses: doc.data().weaknesses || [],
      timestamp: doc.data().timestamp,
      topics: doc.data().topics || [],
    }));
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};