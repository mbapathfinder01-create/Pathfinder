import { FileDown, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { downloadReport } from '../../lib/report';
import type { StudentProfile } from '../../types';

interface DownloadReportButtonProps {
  profile: StudentProfile;
  label?: string;
  className?: string;
}

export function DownloadReportButton({
  profile,
  label = 'Download Full PDF',
  className = 'px-5 py-2.5 rounded-xl',
}: DownloadReportButtonProps) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await downloadReport(profile);
    } catch (err) {
      console.error('PDF generation failed', err);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={`btn-primary ${className} font-semibold flex items-center gap-2`}
      >
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <FileDown className="h-4 w-4" aria-hidden />}
        {busy ? 'Preparing…' : label}
      </button>
      {failed && (
        <span role="alert" className="text-xs text-rose-600">
          Couldn't create the PDF. Please try again.
        </span>
      )}
    </div>
  );
}
