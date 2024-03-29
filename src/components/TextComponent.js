import React from 'react';

const TextComponent = ({ history }) => {
  return (
    <div>
      <h2>Timer Usage History:</h2>
      {history.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
};

export default TextComponent;