import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./submodules/Firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface Feedback {
  finalAssessment: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  createdAt: string;
}

const InterviewFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = "mV4X4iCDZ6Y6GwuCua4ZviCtdJc2"; // Replace with actual userId

  useEffect(() => {
    const fetchFeedbackByUserId = async () => {
      try {
        const feedbackQuery = query(
          collection(db, "feedback"),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(feedbackQuery);

        if (querySnapshot.empty) {
          setError("No feedback found for this user.");
        } else {
          const allFeedbacks: Feedback[] = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          })) as Feedback[];

          allFeedbacks.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          setFeedbackList(allFeedbacks);
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("An error occurred while fetching feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackByUserId();
  }, [userId]);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p>{error}</p>;
  if (feedbackList.length === 0) return <p>No feedback found.</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Interview Feedback Summary</h1>

      <h2>Progress Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={feedbackList}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="createdAt"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalScore"
            stroke="#82ca9d"
            name="Total Score"
          />
        </LineChart>
      </ResponsiveContainer>

      {feedbackList.map((feedback, index) => (
        <div key={index} style={{ marginTop: "40px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <h2>Interview #{index + 1}</h2>
          <p><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
          <p><strong>Final Assessment:</strong> {feedback.finalAssessment}</p>
          <p><strong>Total Score:</strong> {feedback.totalScore}</p>

          <h3>Category Scores</h3>
          {feedback.categoryScores?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={feedback.categoryScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No category scores to display.</p>
          )}

          <h3>Strengths</h3>
          <ul>
            {feedback.strengths?.length > 0 ? (
              feedback.strengths.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li>No strengths listed.</li>
            )}
          </ul>

          <h3>Areas for Improvement</h3>
          <ul>
            {feedback.areasForImprovement?.length > 0 ? (
              feedback.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)
            ) : (
              <li>No suggestions listed.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default InterviewFeedback;