import React, { useState } from 'react';

const HistoryBox = ({ history, setHistory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="history-container">
      <div className="history-box">
        {isOpen && (
          <div className="history-items-container">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={toggleOpen}>
        {isOpen ? 'Hide History' : 'Show History'}
      </button>
      {isOpen && (
        <button onClick={clearHistory}>
          Clear History
        </button>
      )}
    </div>
  );
};

export default HistoryBox;