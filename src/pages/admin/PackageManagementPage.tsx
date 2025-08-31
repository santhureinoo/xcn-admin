import React, { useState, useEffect } from 'react';
import { MarkupOption, Package, PackageFilters } from '../../types/package';
import PackageManagementHeader from '../../components/admin/packages/PackageManagementHeader';
import PackageStatsCards from '../../components/admin/packages/PackageStatsCards';
import PackageFiltersComponent from '../../components/admin/packages/PackageFilters';
import PackageTable from '../../components/admin/packages/PackageTable';
import PackageDetailModal from '../../components/admin/packages/PackageDetailModal';
import AddEditPackageModal from '../../components/admin/packages/AddEditPackageModal';
import packageService from '../../services/packageService';
import markupService from '../../services/markupService';

const PackageManagementPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    inactivePackages: 0,
    outOfStockPackages: 0,
    totalStock: 0,
    averagePrice: 0,
    topRegions: [],
    topGames: [],
    topVendors: []
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);
  const pageSize = 50;

  // Modal states
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<PackageFilters>({
    region: 'all',
    gameName: 'all',
    vendor: 'all',
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Static data for filters
  const [regions] = useState<string[]>(['Malaysia', 'Myanmar', 'Brazil', 'Singapore', 'Thailand']);
  const [games] = useState<string[]>(['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact']);
  const [vendorNames] = useState<string[]>(['Razor Gold', 'Smile', 'Garena', 'Tencent']);
  const [vendors, setVendors] = useState<any[]>([]);
  const [markups, setMarkups] = useState<MarkupOption[]>([]);

  // Load packages from API
  const loadPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.getPackages(filters, currentPage, pageSize);
      setPackages(response.packages);
      setFilteredPackages(response.packages);
      setTotalPages(response.pagination.totalPages);
      setTotalPackages(response.pagination.total);
    } catch (error: any) {
      console.error('Failed to load packages:', error);
      setError(error.message || 'Failed to load packages');
      setPackages([]);
      setFilteredPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Load stats from API
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await packageService.getPackageStats();
      setStats(response);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on component mount and when filters/page change
  useEffect(() => {
    loadPackages();
  }, [filters, currentPage]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Load markups
  useEffect(() => {
    const loadMarkups = async () => {
      try {
        const response = await markupService.getActiveMarkups();
        setMarkups(response.markups || []);
      } catch (error) {
        console.error('Failed to load markups:', error);
      }
    };
    
    loadMarkups();
  }, []);

  // Initialize vendors data
  useEffect(() => {
    setVendors([
      {
        id: '1',
        name: 'Razor Gold',
        region: 'Malaysia',
        gameName: 'Mobile Legends',
        packages: []
      },
      {
        id: '2',
        name: 'Smile',
        region: 'Myanmar',
        gameName: 'Free Fire',
        packages: []
      },
      {
        id: '3',
        name: 'Garena',
        region: 'Singapore',
        gameName: 'PUBG Mobile',
        packages: []
      },
      {
        id: '4',
        name: 'Tencent',
        region: 'Thailand',
        gameName: 'Genshin Impact',
        packages: []
      }
    ]);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<PackageFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    const clearedFilters: PackageFilters = {
      region: 'all',
      gameName: 'all',
      vendor: 'all',
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  // Handle package actions
  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowAddEditModal(true);
    setShowDetailModal(false);
  };

  const handleDeletePackage = async (pkg: Package) => {
    if (window.confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
      try {
        await packageService.deletePackage(pkg.id);
        setShowDetailModal(false);
        // Reload packages and stats
        await loadPackages();
        await loadStats();
        // Show success message
        alert('Package deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete package:', error);
        alert(error.message || 'Failed to delete package');
      }
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    const action = pkg.packageStatus === 1 ? 'deactivate' : 'activate';

    if (window.confirm(`Are you sure you want to ${action} "${pkg.name}"?`)) {
      try {
        const response = await packageService.togglePackageStatus(pkg.id);

        // Update the package in the list
        const updatedPackages = packages.map(p =>
          p.id === pkg.id ? { ...p, packageStatus: response.package.packageStatus } : p
        );
        setPackages(updatedPackages);
        setFilteredPackages(updatedPackages);

        // Update selected package if it's the same one
        if (selectedPackage?.id === pkg.id) {
          setSelectedPackage(prev => prev ? { ...prev, packageStatus: response.package.packageStatus } : null);
        }

        // Reload stats
        await loadStats();

        // Show success message
        alert(response.message);
      } catch (error: any) {
        console.error(`Failed to ${action} package:`, error);
        alert(error.message || `Failed to ${action} package`);
      }
    }
  };

  // Handle package updates (including stock updates)
  const handlePackageUpdated = (updatedPackage: Package) => {
    // Update the package in the list
    const updatedPackages = packages.map(p =>
      p.id === updatedPackage.id ? updatedPackage : p
    );

    setPackages(updatedPackages);
    setFilteredPackages(updatedPackages);

    // Update selected package if it's the same one
    if (selectedPackage?.id === updatedPackage.id) {
      setSelectedPackage(updatedPackage);
    }

    // Reload stats to reflect changes
    loadStats();
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setShowAddEditModal(true);
  };

  const handleSavePackage = async (packageData: Partial<Package>) => {
    setSaveLoading(true);
    try {
      if (editingPackage) {
        // Update existing package
        const response = await packageService.updatePackage(editingPackage.id, packageData);

        // Update the package in the list
        const updatedPackages = packages.map(p =>
          p.id === editingPackage.id ? response.package : p
        );

        setPackages(updatedPackages);
        setFilteredPackages(updatedPackages);

        alert(response.message);
      } else {
        // Add new package
        const response = await packageService.createPackage(packageData as any);

        // Add new package to the list
        setPackages(prev => [response, ...prev]);
        setFilteredPackages(prev => [response.package, ...prev]);

        alert("Package added successfully");
      }

      setShowAddEditModal(false);
      setEditingPackage(null);

      // Reload stats
      await loadStats();
    } catch (error: any) {
      console.error('Failed to save package:', error);
      alert(error.message || 'Failed to save package');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExportPackages = async () => {
    try {
      const response = await packageService.exportPackages(filters);

      // Create CSV content
      const headers = ['Name', 'Region', 'Game', 'Vendor', 'Vendor Code', 'Selling Price', 'Vendor Price', 'Currency', 'Status', 'Stock', 'Type', 'Amount', 'Created', 'Updated'];
      const csvContent = [
        headers.join(','),
        ...response.data.map(pkg => [
          `"${pkg.Name}"`,
          pkg.Region,
          pkg.Game,
          pkg.Vendor,
          pkg['Vendor Code'],
          pkg['Selling Price'],
          pkg['Vendor Price'],
          pkg.Currency,
          pkg.Status,
          pkg.Stock,
          pkg.Type,
          pkg.Amount,
          pkg.Created,
          pkg.Updated
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `packages-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to export packages:', error);
      alert(error.message || 'Failed to export packages');
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <PackageManagementHeader
        onAddPackage={handleAddPackage}
        onExportPackages={handleExportPackages}
        totalPackages={filteredPackages.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <PackageStatsCards stats={stats} loading={statsLoading} />

        {/* Filters */}
        <div className="mb-6">
          <PackageFiltersComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            regions={regions}
            games={games}
            vendors={vendorNames}
            loading={false}
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
                  Error loading packages
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadPackages}
                    className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Packages Table */}
        <PackageTable
          packages={filteredPackages}
          loading={loading}
          onPackageClick={handlePackageClick}
          onEditPackage={handleEditPackage}
          onDeletePackage={handleDeletePackage}
          onToggleStatus={handleToggleStatus}
        />

        {!loading && filteredPackages.length === 0 && packages.length > 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No packages found
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

        {/* No packages at all */}
        {!loading && packages.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No packages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first package.
            </p>
            <button
              onClick={handleAddPackage}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Package
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
                    {Math.min(currentPage * pageSize, totalPackages)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{totalPackages}</span>
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
      <PackageDetailModal
        package={selectedPackage}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPackage(null);
          loadPackages();
          loadStats();
        }}
        onEdit={handleEditPackage}
        onDelete={handleDeletePackage}
        onToggleStatus={handleToggleStatus}
        onPackageUpdated={handlePackageUpdated}
      />

      <AddEditPackageModal
        package={editingPackage}
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setEditingPackage(null);
          loadPackages();
          loadStats();
        }}
        onSave={handleSavePackage}
        loading={saveLoading}
        vendors={vendors}
        // regions={regions}
        // games={games}
        // vendorNames={vendorNames}
      />
    </div>
  );
};

export default PackageManagementPage;