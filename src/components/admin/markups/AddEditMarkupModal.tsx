import React, { useState, useEffect } from 'react';
import { Markup } from '../../../types/markup';

interface AddEditMarkupModalProps {
  markup: Markup | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (markupData: Partial<Markup>) => void;
  loading: boolean;
}

const AddEditMarkupModal: React.FC<AddEditMarkupModalProps> = ({
  markup,
  isOpen,
  onClose,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    markupType: 'percentage' as 'percentage' | 'flat',
    percentageAdd: '',
    flatAmountAdd: '',
    isActive: true,
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (markup) {
      setFormData({
        name: markup.name || '',
        description: markup.description || '',
        markupType: markup.markupType || 'percentage',
        percentageAdd: markup.percentageAdd?.toString() || '',
        flatAmountAdd: markup.flatAmountAdd?.toString() || '',
        isActive: markup.isActive ?? true,
        startDate: markup.startDate ? markup.startDate.split('T')[0] : '',
        endDate: markup.endDate ? markup.endDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        markupType: 'percentage',
        percentageAdd: '',
        flatAmountAdd: '',
        isActive: true,
        startDate: '',
        endDate: ''
      });
    }
    setErrors({});
  }, [markup, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.markupType === 'percentage') {
      if (!formData.percentageAdd || isNaN(Number(formData.percentageAdd))) {
        newErrors.percentageAdd = 'Valid percentage is required';
      } else if (Number(formData.percentageAdd) < 0) {
        newErrors.percentageAdd = 'Percentage cannot be negative';
      } else if (Number(formData.percentageAdd) > 1000) {
        newErrors.percentageAdd = 'Percentage cannot exceed 1000%';
      }
    } else {
      if (!formData.flatAmountAdd || isNaN(Number(formData.flatAmountAdd))) {
        newErrors.flatAmountAdd = 'Valid amount is required';
      } else if (Number(formData.flatAmountAdd) < 0) {
        newErrors.flatAmountAdd = 'Amount cannot be negative';
      }
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null
    };

    if (formData.markupType === 'percentage') {
      submitData.percentageAdd = Number(formData.percentageAdd);
      submitData.flatAmountAdd = null;
    } else {
      submitData.flatAmountAdd = Number(formData.flatAmountAdd);
      submitData.percentageAdd = null;
    }

    onSave(submitData);
  };

  const handleMarkupTypeChange = (type: 'percentage' | 'flat') => {
    setFormData(prev => ({
      ...prev,
      markupType: type,
      percentageAdd: type === 'percentage' ? prev.percentageAdd : '',
      flatAmountAdd: type === 'flat' ? prev.flatAmountAdd : ''
    }));
    setErrors(prev => ({
      ...prev,
      percentageAdd: '',
      flatAmountAdd: ''
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {markup ? 'Edit Markup' : 'Add New Markup'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Markup Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter markup name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter markup description"
              />
            </div>

            {/* Markup Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Markup Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handleMarkupTypeChange('percentage')}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-colors ${
                    formData.markupType === 'percentage'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.markupType === 'percentage'}
                      onChange={() => handleMarkupTypeChange('percentage')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        📊 Percentage Markup
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Add percentage to base price
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleMarkupTypeChange('flat')}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-colors ${
                    formData.markupType === 'flat'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.markupType === 'flat'}
                      onChange={() => handleMarkupTypeChange('flat')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        💰 Flat Amount
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Add fixed amount to price
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Markup Value */}
            <div className="grid grid-cols-2 gap-4">
              {formData.markupType === 'percentage' ? (
                <div className="col-span-2">
                  <label htmlFor="percentageAdd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Percentage Markup *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="percentageAdd"
                      step="0.01"
                      min="0"
                      max="1000"
                      value={formData.percentageAdd}
                      onChange={(e) => setFormData(prev => ({ ...prev, percentageAdd: e.target.value }))}
                      className={`block w-full px-3 py-2 pr-8 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                        errors.percentageAdd 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="15.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                    </div>
                  </div>
                  {errors.percentageAdd && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.percentageAdd}</p>}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Example: 15% markup on $100 = $115
                  </p>
                </div>
              ) : (
                <div className="col-span-2">
                  <label htmlFor="flatAmountAdd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Flat Amount Markup *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="flatAmountAdd"
                      step="0.01"
                      min="0"
                      value={formData.flatAmountAdd}
                      onChange={(e) => setFormData(prev => ({ ...prev, flatAmountAdd: e.target.value }))}
                      className={`block w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                        errors.flatAmountAdd 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="5.00"
                    />
                  </div>
                  {errors.flatAmountAdd && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.flatAmountAdd}</p>}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Example: $5 markup on $100 = $105
                  </p>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                    errors.endDate 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Active (markup will be applied immediately)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {markup ? 'Update Markup' : 'Create Markup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditMarkupModal;