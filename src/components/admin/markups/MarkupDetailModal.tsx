import React from 'react';
import { Markup } from '../../../types/markup';

interface MarkupDetailModalProps {
  markup: Markup | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (markup: Markup) => void;
  onDelete: (markup: Markup) => void;
  onToggleStatus: (markup: Markup) => void;
}

const MarkupDetailModal: React.FC<MarkupDetailModalProps> = ({
  markup,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (!isOpen || !markup) return null;

  const formatMarkupValue = () => {
    if (markup.percentageAdd) {
      return `${markup.percentageAdd}%`;
    } else if (markup.flatAmountAdd) {
      return `$${markup.flatAmountAdd}`;
    }
    return 'N/A';
  };

  const getStatusBadge = () => {
    if (markup.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          ✅ Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          ⏸️ Inactive
        </span>
      );
    }
  };

  const canDelete = markup.packageCount === 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">
                  {markup.markupType === 'percentage' ? '📊' : '💰'}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {markup.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge()}
                  {markup.isExpired && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      ⚠️ Expired
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{markup.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                    {markup.markupType} Markup
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {markup.description || 'No description provided'}
                  </dd>
                </div>
              </div>
            </div>

            {/* Markup Details */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Markup Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Markup Value</dt>
                  <dd className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {formatMarkupValue()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied To</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {markup.packageCount} package{markup.packageCount !== 1 ? 's' : ''}
                  </dd>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700">
                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Example Calculation
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {markup.markupType === 'percentage' ? (
                    <>Base Price: $100 → Final Price: ${(100 * (1 + (markup.percentageAdd || 0) / 100)).toFixed(2)}</>
                  ) : (
                    <>Base Price: $100 → Final Price: ${(100 + (markup.flatAmountAdd || 0)).toFixed(2)}</>
                  )}
                </dd>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Duration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {markup.startDate ? new Date(markup.startDate).toLocaleDateString() : 'No start date'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {markup.endDate ? new Date(markup.endDate).toLocaleDateString() : 'No end date'}
                  </dd>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Metadata</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(markup.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(markup.updatedAt).toLocaleString()}
                  </dd>
                </div>
                {markup.createdBy && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{markup.createdBy}</dd>
                  </div>
                )}
                {markup.updatedBy && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated By</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{markup.updatedBy}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600 mt-6">
            <button
              onClick={() => onEdit(markup)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>

            <button
              onClick={() => onToggleStatus(markup)}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                markup.isActive
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              {markup.isActive ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Deactivate
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Activate
                </>
              )}
            </button>

            {canDelete && (
              <button
                onClick={() => onDelete(markup)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}

            {!canDelete && (
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Cannot delete: In use by {markup.packageCount} package{markup.packageCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkupDetailModal;