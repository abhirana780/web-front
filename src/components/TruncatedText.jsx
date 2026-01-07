import React, { useState } from 'react';

const TruncatedText = ({ text, maxLength, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');

  return (
    <div className={className}>
      {displayText}
      {text.length > maxLength && (
        <button
          onClick={toggleExpanded}
          className="text-red-500 hover:text-red-700 ml-2 font-semibold"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default TruncatedText;
