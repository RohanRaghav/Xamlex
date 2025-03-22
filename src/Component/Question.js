import React, { useState, useEffect } from "react";
const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Get user from localStorage and extract username/email
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.displayName || user.email || "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    const checkSubmissionStatus = async () => {
      if (!username) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/check-submission?username=${encodeURIComponent(username)}`
        );
        const data = await response.json();
        if (data.submitted) {
          setSubmitted(true);
          setResponses(data.responses || {});
        }
      } catch (error) {
        console.error("Error checking submission status:", error);
      }
    };

    fetchQuestions();
    checkSubmissionStatus();
  }, [username]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!username) {
      alert("Error: User information is missing.");
      return;
    }

    const finalData = { username, responses };

    try {
      const response = await fetch("http://localhost:3001/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        console.log("Responses submitted successfully");
        localStorage.setItem("submittedResponses", JSON.stringify(responses));
        setSubmitted(true);
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Question Paper</h1>

      {submitted ? (
        <div className="success-message">
          <h2>Thank you for your submission, {username}!</h2>
          {questions.map((q, index) => (
            <div key={q._id} className="question-box submitted-box">
              <h3>Q{index + 1}: {q.text}</h3>
              <p><strong>Response:</strong> {responses[q._id] || "Not answered"}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {questions.length > 0 && questions[currentIndex] && (
            <div className="question-box">
              <h2>Q{currentIndex + 1}: {questions[currentIndex].text}</h2>

              {questions[currentIndex].type === "MCQ" ? (
                <div className="options-container">
                  {questions[currentIndex].options.map((option, idx) => (
                    <label key={idx} className="option-label">
                      <input
                        type="radio"
                        name={`question-${questions[currentIndex]._id}`}
                        value={option}
                        checked={responses[questions[currentIndex]._id] === option}
                        onChange={() => handleResponseChange(questions[currentIndex]._id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  className="text-area"
                  value={responses[questions[currentIndex]._id] || ""}
                  onChange={(e) =>
                    handleResponseChange(questions[currentIndex]._id, e.target.value)
                  }
                  placeholder="Type your answer here..."
                />
              )}

              <div className="navigation-buttons">
                <button
                  className="nav-btn"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                >
                  Previous
                </button>
                <button
                  className="nav-btn"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>

              {currentIndex === questions.length - 1 && (
                <button className="submit-btn" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Question;
