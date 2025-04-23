import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { logger } from '../utils/logger';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [citations, setCitations] = useState([]);

  useEffect(() => {
    logger.log('MESSAGE_RECEIVED', {
      role: message?.role,
      content: message?.content?.substring(0, 100) + '...',
      citations: message?.choices?.[0]?.message?.citations
    });

    // Extract citations from the API response
    if (message?.choices?.[0]?.message?.citations) {
      setCitations(message.choices[0].message.citations);
    }
  }, [message]);

  const processContent = (content) => {
    if (!content) return '';

    logger.log('PROCESSING_CONTENT', { originalContent: content.substring(0, 100) + '...' });

    // First handle headers
    let processedContent = content
      .replace(/([^\n])#{1,3}\s/g, '$1\n\n## ')
      .replace(/^(Supporting Evidence|Opposing Evidence|Findings|Approach|Conclusion)$/gm, '## $1')
      .replace(/^(#{1,3})\s*/gm, '$1 ')
      .replace(/•\s/g, '- ');

    // Handle citations
    processedContent = processedContent.replace(/\[(\d+)\]/g, (match, num) => {
      const index = parseInt(num, 10) - 1;
      const citation = citations[index];
      if (citation) {
        return `[${num}](${citation})`;
      }
      return match;
    });

    logger.log('PROCESSED_CONTENT', { 
      processedContent: processedContent.substring(0, 100) + '...',
      citations: citations
    });

    return processedContent;
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-lg p-4 ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
      }`}>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
              h2: ({...props}) => <h2 className="text-xl font-semibold mb-3 mt-5" {...props} />,
              h3: ({...props}) => <h3 className="text-lg font-semibold mb-2 mt-4" {...props} />,
              a: ({href, children}) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {children}
                </a>
              ),
              p: ({...props}) => <p className="mb-4 leading-relaxed" {...props} />,
            }}
          >
            {processContent(message?.choices?.[0]?.message?.content || message.content)}
          </ReactMarkdown>

          {/* Citations list */}
          {citations.length > 0 && (
            <div className="text-xs text-gray-500 mt-4 border-t pt-2">
              <div className="font-semibold mb-1">Citations:</div>
              <ol className="list-decimal ml-4">
                {citations.map((url, index) => (
                  <li key={index}>
                    <a 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 