import React from 'react';

// Wrapper components for each page with dynamic imports
export const TemplatesPage = () => {
  const Templates = React.lazy(() => import('./templates'));
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading Templates...</div>}>
      <Templates />
    </React.Suspense>
  );
};

export const SettingsPage = () => {
  const Settings = React.lazy(() => import('./settings'));
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading Settings...</div>}>
      <Settings />
    </React.Suspense>
  );
};

export const HistoryPage = () => {
  const History = React.lazy(() => import('./history'));
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading History...</div>}>
      <History />
    </React.Suspense>
  );
};

export const SavedContentPage = () => {
  const SavedContent = React.lazy(() => import('./saved-content'));
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading Saved Content...</div>}>
      <SavedContent />
    </React.Suspense>
  );
};