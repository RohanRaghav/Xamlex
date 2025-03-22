import React, { useState, useEffect } from "react";

const Instructor = () => {
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [numOptions, setNumOptions] = useState(2);
  const [options, setOptions] = useState(["", ""]);
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

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
    fetchQuestions();
  }, []);

  const handleAddQuestion = async () => {
    const newQuestion = {
      type: questionType,
      text: questionText,
      options: questionType === "MCQ" ? options.slice(0, numOptions) : null,
      answer,
    };

    try {
      const response = await fetch("http://localhost:3001/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const savedQuestion = await response.json();
        setQuestions([...questions, savedQuestion]);
        resetFields();
      } else {
        console.error("Failed to save question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const resetFields = () => {
    setQuestionType("");
    setQuestionText("");
    setNumOptions(2);
    setOptions(["", ""]);
    setAnswer("");
  };

  const handleDeleteCurrentQuestion = async () => {
    if (questions.length === 0) return;

    const questionToDelete = questions[currentIndex];

    try {
      await fetch(`http://localhost:3001/api/questions/${questionToDelete._id}`, {
        method: "DELETE",
      });

      const updatedQuestions = questions.filter((_, index) => index !== currentIndex);
      setQuestions(updatedQuestions);
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questions),
      });

      const result = await response.json();
      alert("Questions saved successfully");

      if (response.ok) {
        setSubmitted(true);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error submitting questions:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Instructor Panel</h2>

      {submitted ? (
        <h3 className="success-message">Question paper submitted successfully!</h3>
      ) : (
        <>
          {questions.length > 0 && questions[currentIndex] && (
            <div className="question-box">
              <h3>Current Question</h3>
              <p><strong>Type:</strong> {questions[currentIndex].type}</p>
              <p><strong>Question:</strong> {questions[currentIndex].text}</p>
              {questions[currentIndex].options?.map((opt, idx) => (
                <p key={idx}>Option {idx + 1}: {opt}</p>
              ))}
              <p><strong>Answer:</strong> {questions[currentIndex].answer}</p>

              <div className="navigation-buttons">
                <button onClick={handlePreviousQuestion} disabled={currentIndex === 0}>
                  Previous
                </button>
                <button onClick={handleNextQuestion} disabled={currentIndex === questions.length - 1}>
                  Next
                </button>
              </div>

              <button className="delete-btn" onClick={handleDeleteCurrentQuestion}>
                Delete Current Question
              </button>
            </div>
          )}

          <h3 className="subtitle">Create a New Question</h3>
          <div className="input-group">
            <label>Select Question Type:</label>
            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
              <option value="">-- Choose --</option>
              <option value="MCQ">Multiple Choice</option>
              <option value="Text">Text</option>
            </select>
          </div>

          {questionType && (
            <>
              <div className="input-group">
                <label>Enter Question:</label>
                <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
              </div>

              {questionType === "MCQ" && (
                <div>
                  <label>Number of Options:</label>
                  <input
                    type="number"
                    value={numOptions}
                    min="2"
                    max="5"
                    onChange={(e) => {
                      const count = parseInt(e.target.value, 10);
                      setNumOptions(count);
                      setOptions([...options.slice(0, count), ...Array(Math.max(0, count - options.length)).fill("")]);
                    }}
                  />

                  {options.slice(0, numOptions).map((opt, index) => (
                    <div key={index} className="input-group">
                      <label>Option {index + 1}:</label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="input-group">
                <label>Enter Answer:</label>
                <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
              </div>

              <button className="add-btn" onClick={handleAddQuestion}>Add Question</button>
            </>
          )}

          {questions.length > 0 && (
            <button className="submit-btn" onClick={handleSubmit}>Submit Paper</button>
          )}
        </>
      )}
    </div>
  );
};

export default Instructor;
