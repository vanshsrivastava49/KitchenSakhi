import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Planner = () => {
  const [preference, setPreference] = useState('vegetarian');
  const [region, setRegion] = useState('North Indian');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    setPdfUrl('');
    setPlan('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/generate-plan', {
        preference,
        region,
        username: 'Ghapla49',
      });

      const result = res?.data?.plan;

      if (typeof result === 'string' && result.trim().length > 0) {
        setPlan(result);
      } else {
        throw new Error('Invalid plan data');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate plan. Please check backend or data format.');
    }

    setLoading(false);
  };

  const downloadPDF = async () => {
    try {
      const res = await axios.post('http://localhost:5000/download-pdf', { plan });
      if (res?.data?.url) {
        setPdfUrl(res.data.url);
      } else {
        throw new Error('No PDF URL in response');
      }
    } catch (err) {
      alert('PDF download failed.');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 border border-orange-300 max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-orange-700">Weekly Meal Planner</h2>
       <label className="block mb-1 font-medium text-gray-700">Select Diet Preference</label>
      <select
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="vegetarian">Vegetarian</option>
        <option value="non-vegetarian">Non-Vegetarian</option>
        <option value="eggetarian">Eggetarian</option>
        <option value="jain">Jain</option>
      </select>
      <label className="block mb-1 font-medium text-gray-700">Choose Indian Cuisine</label>
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="North Indian">North Indian</option>
        <option value="South Indian">South Indian</option>
        <option value="Gujarati">Gujarati</option>
        <option value="Rajasthani">Rajasthani</option>
        <option value="Maharashtrian">Maharashtrian</option>
        <option value="Bengali">Bengali</option>
        <option value="Kerala">Kerala</option>
        <option value="Kashmiri">Kashmiri</option>
        <option value="Assamese">Assamese</option>
      </select>

      <button
        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition"
        onClick={generatePlan}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Weekly Plan'}
      </button>

      <div className="mt-4 max-h-[240px] overflow-y-auto text-sm text-gray-800 bg-orange-50 p-4 rounded-md border border-orange-200 prose prose-sm">
  {loading ? (
    'Preparing weekly plan...'
  ) : error ? (
    <p className="text-red-600">{error}</p>
  ) : plan ? (
    <ReactMarkdown>{plan}</ReactMarkdown>
  ) : (
    <p>Meal plan neeche aaega.</p>
  )}
</div>
      {plan && !loading && !error && (
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          onClick={downloadPDF}
        >
          Download as PDF
        </button>
      )}

      {pdfUrl && (
        <a
          className="mt-2 block text-blue-700 underline"
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open PDF
        </a>
      )}
    </div>
  );
};

export default Planner;
