// Reverse Researcher — POC with Fixed API Model and Styling
// Tech: React + Vite + TailwindCSS

import React, { useState, useEffect, useRef } from 'react';

const SONAR_API_URL = 'https://api.perplexity.ai/chat/completions';
const SONAR_API_KEY = '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';

export default function App() {
  const [conclusion, setConclusion] = useState('');
  const [angle, setAngle] = useState('balanced');
  const [results, setResults] = useState({ support: null, oppose: null });
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [followUpResult, setFollowUpResult] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (resultsRef.current && (results.support || results.oppose)) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  const formatResponse = (text, responseData) => {
    if (!text) return '';
    
    // First, normalize line endings and remove any extra spaces
    text = text.replace(/\r\n/g, '\n').trim();
    
    // Handle bold text first (before any other transformations)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle headers - both ## style and standalone
    text = text.replace(/^##?\s*(.+?)$/gm, '<h2 class="text-xl font-semibold mb-4 mt-6">$1</h2>');
    text = text.replace(/^#\s*(.+?)$/gm, '<h2 class="text-xl font-semibold mb-4 mt-6">$1</h2>');
    text = text.replace(/^(Approach|Findings|Evidence|Conclusion|Summary|Reliability Assessment|Source Reliability|Supporting Evidence|Opposing Evidence)$/gm, 
      '<h2 class="text-xl font-semibold mb-4 mt-6">$1</h2>'
    );
    
    // Format citations [1] into linked superscripts
    text = text.replace(/\[(\d+)\]/g, (match, num) => {
      const citations = responseData?.citations || [];
      const citation = citations[parseInt(num) - 1];
      
      if (citation) {
        return `<sup><a href="${citation}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">[${num}]</a></sup>`;
      }
      return `<sup>[${num}]</sup>`;
    });
    
    // Handle horizontal rules
    text = text.replace(/^---$/gm, '<hr class="my-6" />');
    
    // Remove any class="mb-4"> artifacts that might have been added
    text = text.replace(/class="mb-4">/g, '');
    
    // Handle bullet points and paragraphs
    text = text
      // Convert numbered lists (1., 2., etc.)
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      // Convert bullet points to list items
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      // Wrap consecutive list items in appropriate list tags
      .replace(/(<li>.*?<\/li>(\n|$))+/g, (match) => {
        if (match.includes('1.')) {
          return `<ol class="list-decimal pl-6 mb-4">${match}</ol>`;
        }
        return `<ul class="list-disc pl-6 mb-4">${match}</ul>`;
      })
      // Handle paragraph breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4"><\/p>/g, '')
      // Ensure proper spacing between elements
      .replace(/(<\/[uo]l>)(?!\s*<[uo]l>)/g, '$1<p class="mb-4">');
    
    // Ensure content starts with a paragraph if needed
    if (!text.startsWith('<h2') && !text.startsWith('<p')) {
      text = '<p class="mb-4">' + text;
    }
    
    // Final cleanup
    text = text
      // Remove any extra newlines
      .replace(/\n+/g, '\n')
      // Clean up any double spaces
      .replace(/\s{2,}/g, ' ')
      // Clean up any empty paragraphs
      .replace(/<p[^>]*>\s*<\/p>/g, '')
      // Ensure proper spacing around horizontal rules
      .replace(/<hr class="my-6" \/>/g, '</p><hr class="my-6" /><p class="mb-4">');
    
    return text;
  };

  const fetchEvidence = async (prompt) => {
    try {
      const response = await fetch(SONAR_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SONAR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: `You are a helpful research assistant that provides well-reasoned, academically-styled responses. Follow these steps:

1. Begin with an "Approach" section that outlines your methodology
2. Present your findings in a clear, academic prose style
3. End with a concise conclusion

Format guidelines:
- Use clear section headers (Approach, Findings, Conclusion)
- Include citations in [1] format
- Write in clear paragraphs with topic sentences
- Only use bullet points for truly list-worthy items
- Use proper academic tone and structure
- Double line breaks between sections
- Include a reliability assessment for sources

Your response should read like a well-structured academic analysis, not a bullet-point summary.`
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults({ support: null, oppose: null });

    let supportData = null, opposeData = null;
    if (angle === 'balanced' || angle === 'support') {
      supportData = await fetchEvidence(`Find evidence supporting the conclusion: ${conclusion}. Provide citations and explain why the sources are reliable.`);
    }
    if (angle === 'balanced' || angle === 'oppose') {
      opposeData = await fetchEvidence(`Find evidence opposing the conclusion: ${conclusion}. Provide citations and explain why the sources are reliable.`);
    }

    setResults({ support: supportData, oppose: opposeData });
    setLoading(false);
  };

  const handleFollowUp = async () => {
    if (!followUp.trim()) return;
    
    setLoading(true);
    const followUpData = await fetchEvidence(`Follow-up question about "${conclusion}": ${followUp}`);
    setFollowUpResult(followUpData);
    setLoading(false);
    setFollowUp(''); // Clear the input after submission
  };

  const handleExportPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get all the response content
    const supportingContent = results.support?.choices?.[0]?.message?.content;
    const opposingContent = results.oppose?.choices?.[0]?.message?.content;
    const followUpContent = followUpResult?.choices?.[0]?.message?.content;
    
    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Research Results</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              max-width: 800px;
              margin: 2rem auto;
              padding: 0 1rem;
            }
            h1 { font-size: 2rem; font-weight: bold; margin: 2rem 0 1rem; }
            h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 1rem; }
            p { margin-bottom: 1rem; }
            ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
            li { margin-bottom: 0.5rem; }
            .conclusion { font-size: 1.1rem; margin-top: 2rem; padding-top: 1rem; border-top: 2px solid #eee; }
            sup a { color: #2563eb; text-decoration: none; }
            @media print {
              body { margin: 1rem; }
              a { text-decoration: none; }
            }
          </style>
        </head>
        <body>
          <h1>Research Results: "${conclusion}"</h1>
          ${supportingContent ? `
            <div class="evidence-section">
              <h2>Supporting Evidence</h2>
              <div class="content">
                ${formatResponse(supportingContent, results.support)}
              </div>
            </div>
          ` : ''}
          ${opposingContent ? `
            <div class="evidence-section">
              <h2>Opposing Evidence</h2>
              <div class="content">
                ${formatResponse(opposingContent, results.oppose)}
              </div>
            </div>
          ` : ''}
          ${followUpContent ? `
            <div class="followup-section">
              <h2>Follow-up Response</h2>
              <div class="content">
                ${formatResponse(followUpContent, followUpResult)}
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `);
    
    // Wait for content to load then print
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      // Don't close the window after print to allow for multiple prints
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Reverse Researcher
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="text-red-700 font-medium">{error}</div>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="conclusion">
            Enter your conclusion
          </label>
          <textarea
            id="conclusion"
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
            rows={3}
            placeholder="e.g., 'Remote work improves productivity'"
            value={conclusion}
            onChange={e => setConclusion(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {['support', 'oppose', 'balanced'].map(opt => (
            <button
              key={opt}
              onClick={() => setAngle(opt)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                angle === opt 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform -translate-y-0.5' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'
              }`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)} Only
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Researching...
              </span>
            ) : 'Research'}
          </button>
        </div>

        <div ref={resultsRef} className="grid grid-cols-1 gap-6 mb-8">
          {results.support && (
            <div className="w-full border-2 border-green-200 rounded-xl p-8 shadow-lg bg-white">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Supporting Evidence</h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatResponse(results.support.choices?.[0]?.message?.content, results.support) 
                }}
              />
            </div>
          )}
          {results.oppose && (
            <div className="w-full border-2 border-red-200 rounded-xl p-8 shadow-lg bg-white">
              <h2 className="text-2xl font-bold mb-6 text-red-700">Opposing Evidence</h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatResponse(results.oppose.choices?.[0]?.message?.content, results.oppose) 
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="followUp">
              Follow-up Question
            </label>
            <div className="flex gap-4">
              <input
                id="followUp"
                type="text"
                className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                placeholder="Ask a follow-up question..."
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
              />
              <button
                onClick={handleFollowUp}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Researching...
                  </span>
                ) : 'Ask Follow-Up'}
              </button>
            </div>
          </div>

          {followUpResult && (
            <div className="w-full border-2 border-blue-200 rounded-xl p-8 shadow-lg bg-white mb-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Follow-up Response</h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatResponse(followUpResult.choices?.[0]?.message?.content, followUpResult) 
                }}
              />
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}