import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Package } from '../types/package';
import PackageService from '../services/packageService';
import { usePackageFiltering } from '../hooks/usePackageFiltering';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import PackageCard from '../components/packages/PackageCard';
import PackageDetailModal from '../components/packages/PackageDetailModal';
import PackageFilters from '../components/packages/PackageFilters';
import EmptyPackageState from '../components/packages/EmptyPackageState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PackageGrid from '../components/packages/PackageGrid';

const PackagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { packageId } = useParams<{ packageId?: string }>();
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 8;

  // Load all packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packages = await PackageService.getAllPackages();
        setAllPackages(packages);

        // If packageId is provided in URL, open that package's details
        if (packageId) {
          const pkg = packages.find(p => p.id === packageId);
          if (pkg) {
            setSelectedPackage(pkg);
            setShowDetailModal(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPackages();
  }, [packageId]);

  // Use our custom hooks
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    sortOption,
    setSortOption,
    filteredPackages,
    visiblePackages,
    hasMore,
    loading,
    loadMorePackages,
    resetFilters
  } = usePackageFiltering({
    packages: allPackages,
    itemsPerPage: ITEMS_PER_PAGE
  });

  useEffect(() => {
    console.log('rendering');
    console.log(filteredPackages)
  }, [filteredPackages])

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMorePackages
  });

  // Handle package detail view - modified to redirect to order page
  const openPackageDetail = useCallback((pkg: Package) => {
    // Navigate to order page with package info
    navigate('/order', {
      state: {
        selectedPackage: pkg,
        // orderCommand: `${pkg.id} ZONE ${pkg.code}` // Pre-fill the command
      }
    });
  }, [navigate]);

  // Handle package purchase - modified to redirect to order page
  const handlePurchase = useCallback((pkg: Package) => {
    // Navigate to order page with package info
    navigate('/order', {
      state: {
        selectedPackage: pkg,
        // orderCommand: `${pkg.id} ZONE ${pkg.code}` // Pre-fill the command
      }
    });
  }, [navigate]);

  // Show loading state while initially fetching packages
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('packages.title', 'Game Packages')}
          </h1>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {t('common.backToHome', 'Back to Home')}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        {/* <PackageFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalResults={filteredPackages.length}
        /> */}

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <PackageGrid
            packages={visiblePackages}
            onViewDetails={openPackageDetail}
            onPurchase={handlePurchase}
            lastElementRef={lastElementRef}
          />
        ) : (
          <EmptyPackageState onResetFilters={resetFilters} />
        )}

        {/* Loading indicator */}
        {loading && <LoadingSpinner />}
      </div>

      {/* Package Detail Modal */}
      {showDetailModal && selectedPackage && (
        <PackageDetailModal
          pkg={selectedPackage}
          onClose={() => setShowDetailModal(false)}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default PackagesPage;