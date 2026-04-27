import React, { useState } from 'react';

export const InlineResumeEditor = ({
  resumeUrl = null,
  resumeScore = null,
  scoreCard = null,
  onUpload,
  loading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept PDF and DOCX files
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      setUploadSuccess(false);
      await onUpload(file);
      setUploadedFileName(file.name);
      setUploadSuccess(true);
      // Don't auto-close - let user confirm
      setTimeout(() => {
        setUploadSuccess(false);
        setIsEditing(false);
      }, 2000); // Auto-close after 2 seconds
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary-dark">Resume</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800 text-sm font-semibold"
          >
            {resumeUrl ? 'Replace Resume' : 'Upload Resume'}
          </button>
        </div>

        {resumeUrl && resumeScore ? (
          <div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-slate-900">Current Resume</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Uploaded {resumeScore?.meta?.scored_at ? new Date(resumeScore.meta.scored_at).toLocaleDateString() : 'recently'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-dark">{resumeScore.final_score || 0}</div>
                  <p className="text-xs text-slate-500">/100</p>
                </div>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800 text-sm"
              >
                Download Resume
              </a>
            </div>

            {/* Resume Score */}
            {scoreCard && (
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-slate-700">Resume Score</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {Math.min(scoreCard.resume || 0, 30)}/30
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((scoreCard.resume || 0), 30) / 30 * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No resume uploaded yet. Click the button above to upload!</p>
          </div>
        )}
      </div>
    );
  }

  // Upload in progress or completed
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary-dark">
          {resumeUrl ? 'Replace Resume' : 'Upload Resume'}
        </h3>
        <button
          onClick={() => {
            setIsEditing(false);
            setUploadSuccess(false);
          }}
          className="text-slate-500 hover:text-slate-700 text-2xl"
        >
          ✕
        </button>
      </div>

      {uploadSuccess ? (
        <div className="py-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-semibold text-slate-900 mb-2">Resume uploaded successfully!</p>
          <p className="text-sm text-slate-600 mb-2">File: {uploadedFileName}</p>
          <p className="text-xs text-slate-500 mb-6">
            Your resume is being scored. This window will close automatically.
          </p>
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Upload your latest resume in PDF or DOCX format. It will be automatically scanned for ATS scoring.
          </p>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="font-semibold text-slate-900 mb-2">
              {resumeUrl ? 'Choose a new resume' : 'Upload your resume'}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Supported formats: PDF, DOCX. Max file size: 10MB.
            </p>
            <input
              type="file"
              accept=".pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleResumeUpload}
              disabled={uploading}
              className="mx-auto"
            />
            {uploading && (
              <div className="mt-4">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-dark"></div>
                </div>
                <p className="text-sm text-slate-600 mt-2">Uploading and scoring your resume...</p>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-4">
              Your resume will be re-scored immediately after upload.
            </p>
          </div>

          {resumeScore && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-500">
                Current resume score: {resumeScore.final_score || 0}/100
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {!uploadSuccess && (
        <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
