
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { getAIInsight } from '../services/geminiService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { AIInsight } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BrainCircuit } from 'lucide-react';

const InsightChart: React.FC<{ data: AIInsight }> = ({ data }) => {
    if (!data.chartData || !data.chartType) return null;
    const COLORS = ['#6A3FF8', '#00F5A0', '#F7049A', '#3498db', '#f1c40f'];

    switch (data.chartType) {
        case 'bar':
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1D23" />
                        <XAxis dataKey="name" stroke="#E0E0E0" />
                        <YAxis stroke="#E0E0E0" />
                        <Tooltip contentStyle={{ backgroundColor: '#13151A', border: '1px solid #1A1D23' }} />
                        <Bar dataKey="value" fill="#6A3FF8" />
                    </BarChart>
                </ResponsiveContainer>
            );
        case 'pie':
            return (
                <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie dataKey="value" nameKey="name" data={data.chartData} outerRadius={100} fill="#8884d8">
                            {data.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#13151A', border: '1px solid #1A1D23' }} />
                    </PieChart>
                </ResponsiveContainer>
            );
         case 'line':
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1D23" />
                        <XAxis dataKey="name" stroke="#E0E0E0" />
                        <YAxis stroke="#E0E0E0" />
                        <Tooltip contentStyle={{ backgroundColor: '#13151A', border: '1px solid #1A1D23' }} />
                        <Line type="monotone" dataKey="value" stroke="#00F5A0" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            );
        default:
            return null;
    }
};


const AIInsightsPage: React.FC = () => {
  const { products, sales } = useData();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setInsight(null);
    try {
      const result = await getAIInsight(query, products, sales);
      setInsight(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionQueries = [
    "What sold the most last weekend?",
    "What should I restock for Friday evenings?",
    "Which product category is most popular?",
    "Show me sales trend for this week.",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">AI Business Insights</h1>
      <p className="text-bolt-gray mb-6">Ask questions about your sales and inventory data in plain English.</p>
      
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'What are my top 3 selling items this month?'"
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !query.trim()} className="w-32">
          {isLoading ? <Spinner /> : 'Ask AI'}
        </Button>
      </form>
      
       <div className="flex flex-wrap gap-2 mb-8">
        {suggestionQueries.map(q => (
            <button key={q} onClick={() => handleSuggestionClick(q)} className="px-3 py-1 bg-bolt-dark-3 text-sm rounded-full hover:bg-bolt-accent transition-colors">
                {q}
            </button>
        ))}
      </div>


      {error && <Card className="border-red-500/50"><p className="text-red-400">{error}</p></Card>}

      {insight && (
        <Card>
          <h2 className="text-xl font-bold mb-4 text-bolt-accent">Insight</h2>
          <p className="text-lg mb-6">{insight.insight}</p>
          {insight.chartData && <InsightChart data={insight} />}
        </Card>
      )}

      {!insight && !isLoading && !error && (
        <Card className="text-center py-20">
            <BrainCircuit size={48} className="mx-auto text-bolt-gray mb-4"/>
            <h2 className="text-2xl font-bold">Unlock Your Data's Potential</h2>
            <p className="text-bolt-gray">Ask a question to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default AIInsightsPage;
