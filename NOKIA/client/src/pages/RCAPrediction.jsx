import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPredictionsStart, fetchPredictionsSuccess, submitFeedbackStart, submitFeedbackSuccess } from '../store/slices/rcaSlice';

export default function RCAPrediction() {
  const dispatch = useDispatch();
  const { predictions, loading } = useSelector((state) => state.rca);
  const [selectedLog, setSelectedLog] = useState(null);
  const [feedback, setFeedback] = useState({ isCorrect: null, comment: '' });

  useEffect(() => {
    // Simulate fetching predictions
    const dummyPredictions = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      timestamp: new Date(Date.now() - i * 86400000),
      prediction: ['Network Congestion', 'Hardware Failure', 'Configuration Error', 'Software Bug'][Math.floor(Math.random() * 4)],
      confidence: Math.random() * 0.5 + 0.5,
      logId: i,
      logDetails: {
        severity: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'][Math.floor(Math.random() * 4)],
        component: ['Network', 'Database', 'API', 'Security', 'Storage'][Math.floor(Math.random() * 5)],
        message: `Sample log message ${i}`,
      },
    }));

    dispatch(fetchPredictionsSuccess(dummyPredictions));
  }, [dispatch]);

  const handleLogSelect = (prediction) => {
    setSelectedLog(prediction);
    setFeedback({ isCorrect: null, comment: '' });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!selectedLog) return;

    dispatch(submitFeedbackStart());
    // Simulate API call
    setTimeout(() => {
      dispatch(submitFeedbackSuccess({
        ...selectedLog,
        feedback: {
          isCorrect: feedback.isCorrect,
          comment: feedback.comment,
          timestamp: new Date(),
        },
      }));
      setSelectedLog(null);
      setFeedback({ isCorrect: null, comment: '' });
    }, 500);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">RCA Predictions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((prediction) => (
                <tr key={prediction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(prediction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prediction.prediction}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getConfidenceColor(prediction.confidence)}>
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>Severity: {prediction.logDetails.severity}</div>
                    <div>Component: {prediction.logDetails.component}</div>
                    <div>Message: {prediction.logDetails.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleLogSelect(prediction)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Provide Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Provide Feedback</h3>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Is the prediction correct?</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isCorrect"
                    value="true"
                    checked={feedback.isCorrect === true}
                    onChange={() => setFeedback({ ...feedback, isCorrect: true })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isCorrect"
                    value="false"
                    checked={feedback.isCorrect === false}
                    onChange={() => setFeedback({ ...feedback, isCorrect: false })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Add any additional comments..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={feedback.isCorrect === null}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 