// Reverse Researcher — Minimal POC
// Tech: React + Vite + TailwindCSS
// Features: Balanced view, support/oppose toggle, Sonar API integration, CoT, citations, export to PDF

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SONAR_API_URL = 'https://api.perplexity.ai/sonar'; // Replace with actual Sonar endpoint
const SONAR_API_KEY = 'YOUR_API_KEY'; // Secure this in prod

export default function App() {
  const [conclusion, setConclusion] = useState('');
  const [angle, setAngle] = useState('balanced');
  const [results, setResults] = useState({ support: null, oppose: null });
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');

  const fetchEvidence = async (prompt) => {
    const response = await fetch(SONAR_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SONAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-research-pro',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data;
  };

  const handleSubmit = async () => {
    setLoading(true);
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
    const followUpData = await fetchEvidence(`Follow-up question based on: ${conclusion}. ${followUp}`);
    alert(followUpData.choices?.[0]?.message?.content || 'No response');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Reverse Researcher</h1>
      <textarea
        className="w-full p-2 border mb-2"
        rows={3}
        placeholder="Enter a conclusion..."
        value={conclusion}
        onChange={e => setConclusion(e.target.value)}
      />
      <div className="flex gap-2 mb-4">
        {['support', 'oppose', 'balanced'].map(opt => (
          <Button key={opt} onClick={() => setAngle(opt)} variant={angle === opt ? 'default' : 'outline'}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)} Only
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {results.support && (
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Supporting Evidence</h2>
              <pre className="whitespace-pre-wrap">{results.support.choices?.[0]?.message?.content}</pre>
            </CardContent>
          </Card>
        )}
        {results.oppose && (
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Opposing Evidence</h2>
              <pre className="whitespace-pre-wrap">{results.oppose.choices?.[0]?.message?.content}</pre>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="my-4">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Ask a follow-up question..."
          value={followUp}
          onChange={e => setFollowUp(e.target.value)}
        />
        <Button onClick={handleFollowUp}>Ask Follow-Up</Button>
      </div>

      <Button variant="outline" onClick={handleExportPDF}>Export to PDF</Button>
    </div>
  );
}
