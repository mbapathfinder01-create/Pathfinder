import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AssessmentRequired() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="card p-8 fade-in">
        <TriangleAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" aria-hidden />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Assessment required</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Please complete the assessment first to see your recommendations.
        </p>
        <Link to="/assessment" className="btn-primary inline-flex mt-5 px-5 py-2.5 rounded-xl font-semibold">
          Start Assessment
        </Link>
      </div>
    </div>
  );
}
