import React, { useState, useEffect } from 'react';
import { Markup, MarkupFilters } from '../../types/markup';
import MarkupManagementHeader from '../../components/admin/markups/MarkupManagementHeader';
import MarkupStatsCards from '../../components/admin/markups/MarkupStatsCards';
import MarkupFiltersComponent from '../../components/admin/markups/MarkupFilters';
import MarkupTable from '../../components/admin/markups/MarkupTable';
import MarkupDetailModal from '../../components/admin/markups/MarkupDetailModal';
import AddEditMarkupModal from '../../components/admin/markups/AddEditMarkupModal';
import markupService from '../../services/markupService';

const MarkupManagementPage: React.FC = () => {
  const [markups, setMarkups] = useState<Markup[]>([]);
  const [filteredMarkups, setFilteredMarkups] = useState<Markup[]>([]);
  const [stats, setStats] = useState({
    totalMarkups: 0,
    activeMarkups: 0,
    inactiveMarkups: 0,
    percentageMarkups: 0,
    flatMarkups: 0,
    markupsWithPackages: 0,
    unusedMarkups: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMarkups, setTotalMarkups] = useState(0);
  const pageSize = 50;

  // Modal states
  const [selectedMarkup, setSelectedMarkup] = useState<Markup | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingMarkup, setEditingMarkup] = useState<Markup | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<MarkupFilters>({
    isActive: 'all',
    markupType: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load markups from API
  const loadMarkups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await markupService.getMarkups(filters, currentPage, pageSize);
      setMarkups(response.markups);
      setFilteredMarkups(response.markups);
      setTotalPages(response.pagination.totalPages);
      setTotalMarkups(response.pagination.total);
    } catch (error: any) {
      console.error('Failed to load markups:', error);
      setError(error.message || 'Failed to load markups');
      setMarkups([]);
      setFilteredMarkups([]);
    } finally {
      setLoading(false);
    }
  };

  // Load stats from API
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await markupService.getMarkupStats();
      setStats(response.stats);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on component mount and when filters/page change
  useEffect(() => {
    loadMarkups();
  }, [filters, currentPage]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<MarkupFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      isActive: 'all',
      markupType: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  // Handle markup actions
  const handleMarkupClick = (markup: Markup) => {
    setSelectedMarkup(markup);
    setShowDetailModal(true);
  };

  const handleEditMarkup = (markup: Markup) => {
    setEditingMarkup(markup);
    setShowAddEditModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteMarkup = async (markup: Markup) => {
    if (markup.packageCount > 0) {
      alert(`Cannot delete markup "${markup.name}" because it is being used by ${markup.packageCount} package(s).`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${markup.name}"?`)) {
      try {
        await markupService.deleteMarkup(markup.id);
        setShowDetailModal(false);
        // Reload markups and stats
        await loadMarkups();
        await loadStats();
        // Show success message
        alert('Markup deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete markup:', error);
        alert(error.message || 'Failed to delete markup');
      }
    }
  };

  const handleToggleStatus = async (markup: Markup) => {
    const newStatus = markup.isActive ? 'deactivate' : 'activate';
    const action = newStatus === 'activate' ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} "${markup.name}"?`)) {
      try {
        const response = await markupService.toggleMarkupStatus(markup.id);

        // Update the markup in the list
        const updatedMarkups = markups.map(m =>
          m.id === markup.id ? { ...m, isActive: response.markup.isActive } : m
        );
        setMarkups(updatedMarkups);
        setFilteredMarkups(updatedMarkups);

        // Update selected markup if it's the same one
        if (selectedMarkup?.id === markup.id) {
          setSelectedMarkup(prev => prev ? { ...prev, isActive: response.markup.isActive } : null);
        }

        // Reload stats
        await loadStats();

        // Show success message
        alert(response.message);
      } catch (error: any) {
        console.error(`Failed to ${action} markup:`, error);
        alert(error.message || `Failed to ${action} markup`);
      }
    }
  };

  const handleAddMarkup = () => {
    setEditingMarkup(null);
    setShowAddEditModal(true);
  };

  const handleSaveMarkup = async (markupData: Partial<Markup>) => {
    setSaveLoading(true);
    try {
      if (editingMarkup) {
        // Update existing markup
        const response = await markupService.updateMarkup(editingMarkup.id, markupData);

        // Update the markup in the list
        const updatedMarkups = markups.map(m =>
          m.id === editingMarkup.id ? response.markup : m
        );

        setMarkups(updatedMarkups);
        setFilteredMarkups(updatedMarkups);

        alert(response.message);
      } else {
        // Add new markup
        const response = await markupService.createMarkup(markupData as any);

        // Add new markup to the list
        setMarkups(prev => [response.markup, ...prev]);
        setFilteredMarkups(prev => [response.markup, ...prev]);

        alert(response.message);
      }

      setShowAddEditModal(false);
      setEditingMarkup(null);

      // Reload stats
      await loadStats();
    } catch (error: any) {
      console.error('Failed to save markup:', error);
      alert(error.message || 'Failed to save markup');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExportMarkups = async () => {
    try {
      const response = await markupService.exportMarkups(filters);

      // Create CSV content
      const headers = ['Name', 'Type', 'Value', 'Status', 'Packages', 'Start Date', 'End Date', 'Created', 'Updated'];
      const csvContent = [
        headers.join(','),
        ...response.data.map(markup => [
          `"${markup.Name}"`,
          markup.Type,
          markup.Value,
          markup.Status,
          markup.Packages,
          markup['Start Date'],
          markup['End Date'],
          markup.Created,
          markup.Updated
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `markups-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to export markups:', error);
      alert(error.message || 'Failed to export markups');
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <MarkupManagementHeader
        onAddMarkup={handleAddMarkup}
        onExportMarkups={handleExportMarkups}
        totalMarkups={filteredMarkups.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <MarkupStatsCards stats={stats} loading={statsLoading} />

        {/* Filters */}
        <div className="mb-6">
          <MarkupFiltersComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading markups
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadMarkups}
                    className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Markups Table */}
        <MarkupTable
          markups={filteredMarkups}
          loading={loading}
          onMarkupClick={handleMarkupClick}
          onEditMarkup={handleEditMarkup}
          onDeleteMarkup={handleDeleteMarkup}
          onToggleStatus={handleToggleStatus}
        />

        {!loading && filteredMarkups.length === 0 && markups.length > 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No markups found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* No markups at all */}
        {!loading && markups.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No markups yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first markup rule.
            </p>
            <button
              onClick={handleAddMarkup}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Markup
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalMarkups)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{totalMarkups}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: any;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MarkupDetailModal
        markup={selectedMarkup}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMarkup(null);
        }}
        onEdit={handleEditMarkup}
        onDelete={handleDeleteMarkup}
        onToggleStatus={handleToggleStatus}
      />

      <AddEditMarkupModal
        markup={editingMarkup}
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setEditingMarkup(null);
        }}
        onSave={handleSaveMarkup}
        loading={saveLoading}
      />
    </div>
  );
};

export default MarkupManagementPage;