import React, { useState, useEffect, useCallback } from 'react';
import { Package, Vendor, VendorPackage } from '../../../types/package';
import currencyService from '../../../services/currencyService';
import markupService from '../../../services/markupService';
import packageService from '../../../services/packageService';
import RegionGameVendorService from '../../../services/regionGameVendorService';
import { MarkupOption, PriceCalculation } from '../../../types/package';

interface AddEditPackageModalProps {
    package: Package | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (packageData: Partial<Package>) => void;
    loading: boolean;
    vendors: Vendor[];
}

interface FilterOptions {
    regions: string[];
    games: string[];
    vendors: string[];
}

const AddEditPackageModal: React.FC<AddEditPackageModalProps> = ({
    package: pkg,
    isOpen,
    onClose,
    onSave,
    loading,
    vendors
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        region: '',
        gameName: '',
        vendor: '',
        vendorPackageCodes: [] as string[],
        vendorPrice: 0,
        baseVendorCost: 0,
        currency: 'coin',
        status: 'active' as Package['status'],
        resellKeyword: '',
        stock: undefined as number | undefined,
        discount: 0,
        isPriceLocked: false,
        markupId: '',
        basePrice: 0
    });

    // Filter options state
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        regions: [],
        games: [],
        vendors: []
    });

    const [availableVendorPackages, setAvailableVendorPackages] = useState<any[]>([]);
    const [selectedVendorPackages, setSelectedVendorPackages] = useState<any[]>([]);
    const [availableMarkups, setAvailableMarkups] = useState<MarkupOption[]>([]);
    const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);
    // smileOneProducts state removed

    // Initialize form data when modal opens or package changes
    useEffect(() => {
        if (isOpen) {
            if (pkg) {
                // Edit mode - populate with existing package data
                setFormData({
                    name: pkg.name,
                    description: pkg.description,
                    price: pkg.price,
                    imageUrl: pkg.imageUrl,
                    region: pkg.region,
                    gameName: pkg.gameName,
                    vendor: pkg.vendor,
                    markupId: pkg.markupId || '',
                    basePrice: pkg.basePrice || 0,
                    vendorPackageCodes: pkg.vendorPackageCode.split(','),
                    vendorPrice: pkg.vendorPrice,
                    baseVendorCost: pkg.baseVendorCost || 0,
                    currency: pkg.currency,
                    status: pkg.status,
                    resellKeyword: pkg.resellKeyword || '',
                    stock: pkg.stock || 0,
                    discount: pkg.discount || 0,
                    isPriceLocked: pkg.isPriceLocked || false
                });
            } else {
                // Add mode - reset form
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    imageUrl: '',
                    region: '',
                    gameName: '',
                    vendor: '',
                    vendorPackageCodes: [],
                    markupId: '',
                    basePrice: 0,
                    vendorPrice: 0,
                    baseVendorCost: 0,
                    resellKeyword: '',
                    currency: 'coin',
                    status: 'active',
                    stock: 0,
                    discount: 0,
                    isPriceLocked: false
                });
            }
            
            // Reset other states
            setSelectedVendorPackages([]);
            setAvailableVendorPackages([]);
            setPriceCalculation(null);
        }
    }, [isOpen, pkg]);

    // Load initial data when modal opens
    useEffect(() => {
        const loadInitialData = async () => {
            if (!isOpen) return;

            try {
                setIsLoadingFilters(true);
                
                // Load markups
                const markups = await markupService.getActiveMarkups();
                setAvailableMarkups(markups.markups || []);

                if (pkg) {
                    // For edit mode, load filtered data based on existing package
                    await loadFilteredOptions(pkg.region, pkg.gameName, pkg.vendor);
                } else {
                    // For new packages, start with all regions and empty games/vendors
                    const regions = await RegionGameVendorService.getRegions({ isActive: true });
                    setFilterOptions({
                        regions,
                        games: [],
                        vendors: []
                    });
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
                setFilterOptions({
                    regions: [],
                    games: [],
                    vendors: []
                });
            } finally {
                setIsLoadingFilters(false);
            }
        };

        loadInitialData();
    }, [isOpen, pkg]);

    // Cascading filter logic - Priority: Region → Game → Vendor
    const loadFilteredOptions = useCallback(async (region?: string, gameName?: string, vendorName?: string) => {
        try {
            setIsLoadingFilters(true);

            // Use the cascade data endpoint for proper cascading logic
            const cascadeResponse = await RegionGameVendorService.getCascadeData({
                region: region && region !== 'all' ? region : undefined,
                gameName: gameName && gameName !== 'all' ? gameName : undefined,
                vendorName: vendorName && vendorName !== 'all' ? vendorName : undefined,
                isActive: true
            });

            if (cascadeResponse.success) {
                setFilterOptions({
                    regions: cascadeResponse.data.regions,
                    games: cascadeResponse.data.games,
                    vendors: cascadeResponse.data.vendors
                });

                // Handle SmileOne integration if present
                if (cascadeResponse.data.smileOneProducts) {
                    // const products = cascadeResponse.data.smileOneProducts.product?.map((p: any) => ({
                    //     id: p.id ?? 'dummy-id',
                    //     code: p.id ?? 'dummy-code',
                    //     name: p.spu ?? 'dummy-name',
                    //     price: parseFloat(p.price ?? '0'),
                    //     cost_price: p.cost_price ?? '0',
                    //     discount: p.discount ?? '0',
                    //     // Add other VendorPackage fields as needed, with dummy values if missing
                    // })) ?? [];
                    setAvailableVendorPackages(cascadeResponse.data.smileOneProducts.product);
                }
            } else {
                // Fallback to individual calls if cascade fails
                const regions = await RegionGameVendorService.getRegions({ isActive: true });
                let games: string[] = [];
                let vendors: string[] = [];

                if (region && region !== 'all') {
                    games = await RegionGameVendorService.getGames({ region, isActive: true });
                    
                    if (gameName && gameName !== 'all') {
                        const vendorResponse = await RegionGameVendorService.getVendorNames({ 
                            region, 
                            gameName, 
                            isActive: true 
                        });
                        vendors = vendorResponse.data;
                        
                        // Handle SmileOne products
                        if (vendorResponse.smileOneProducts) {
                            setAvailableVendorPackages(vendorResponse.smileOneProducts.product);
                        }
                    }
                }

                setFilterOptions({
                    regions,
                    games,
                    vendors
                });
            }

        } catch (error) {
            console.error('Error loading filtered options:', error);
            // Fallback to basic regions
            try {
                const regions = await RegionGameVendorService.getRegions({ isActive: true });
                setFilterOptions({
                    regions,
                    games: [],
                    vendors: []
                });
            } catch (fallbackError) {
                console.error('Error loading fallback regions:', fallbackError);
                setFilterOptions({
                    regions: [],
                    games: [],
                    vendors: []
                });
            }
        } finally {
            setIsLoadingFilters(false);
        }
    }, []);

    // Handle vendor change - Priority 3
    const handleVendorChange = useCallback(async (newVendor: string) => {
      setFormData(prev => ({
        ...prev,
        vendor: newVendor,
        vendorPackageCodes: [], // Clear dependent fields
        vendorPrice: 0,
        baseVendorCost: 0
      }));
  
      setSelectedVendorPackages([]);
      
      // Load vendor packages
      if (newVendor && formData.region && formData.gameName) {
        const vendor = vendors.find(v =>
          v.region === formData.region &&
          v.gameName === formData.gameName &&
          v.name === newVendor
        );
  
        if (vendor) {
          setAvailableVendorPackages(vendor.packages);
        } else {
          setAvailableVendorPackages([]);
        }

        await loadFilteredOptions(formData.region, formData.gameName, newVendor);
      } else {
        setAvailableVendorPackages([]);
      }
    }, [formData.region, formData.gameName, vendors]);

    // Handle region change - Priority 1
    const handleRegionChange = useCallback(async (newRegion: string) => {
        setFormData(prev => ({
            ...prev,
            region: newRegion,
            gameName: '', // Clear dependent fields
            vendor: '',
            vendorPackageCodes: [],
            vendorPrice: 0,
            baseVendorCost: 0
        }));

        setSelectedVendorPackages([]);
        setAvailableVendorPackages([]);

        await loadFilteredOptions(newRegion);
    }, [loadFilteredOptions]);

    // Handle game change - Priority 2
    const handleGameChange = useCallback(async (newGame: string) => {
        setFormData(prev => ({
            ...prev,
            gameName: newGame,
            vendor: '', // Clear dependent fields
            vendorPackageCodes: [],
            vendorPrice: 0,
            baseVendorCost: 0
        }));

        setSelectedVendorPackages([]);
        setAvailableVendorPackages([]);

        await loadFilteredOptions(formData.region, newGame);
    }, [formData.region, loadFilteredOptions]);

    // Load vendor packages when editing existing package
    useEffect(() => {
        if (pkg && formData.region && formData.gameName && formData.vendor && formData.vendorPackageCodes.length > 0) {
            const vendor = vendors.find(v =>
                v.region === formData.region &&
                v.gameName === formData.gameName &&
                v.name === formData.vendor
            );

            if (vendor) {
                setAvailableVendorPackages(vendor.packages);
                
                // Restore selected packages
                const selectedPackages = vendor.packages.filter(p =>
                    formData.vendorPackageCodes.includes(p.code)
                );
                setSelectedVendorPackages(selectedPackages);
            }
        }
    }, [pkg, formData.region, formData.gameName, formData.vendor, formData.vendorPackageCodes, vendors]);

    // Handle input changes for other fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // Handle special cascading fields
        if (name === 'region') {
            handleRegionChange(value);
            return;
        }
        if (name === 'gameName') {
            handleGameChange(value);
            return;
        }
        if (name === 'vendor') {
            handleVendorChange(value);
            return;
        }
        
        // Handle checkbox inputs
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            // Handle other inputs
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value
            }));
        }
    };

    // Handle vendor package selection
    const handleVendorPackageToggle = (packageId: string) => {
        const vendorPackage = availableVendorPackages.find(p => p.id === packageId);
        if (!vendorPackage) return;

        const isSelected = formData.vendorPackageCodes.includes(packageId);

        if (isSelected) {
            // Remove package
            const newCodes = formData.vendorPackageCodes.filter(code => code !== packageId);
            const newSelected = selectedVendorPackages.filter(pkg => pkg.id !== packageId);

            setFormData(prev => ({ 
                ...prev, 
                vendorPackageCodes: newCodes, 
                baseVendorCost: prev.baseVendorCost - vendorPackage.price
            }));
            setSelectedVendorPackages(newSelected);
        } else {
            // Add package
            const newCodes = [...formData.vendorPackageCodes, packageId];
            const newSelected = [...selectedVendorPackages, vendorPackage];

            setFormData(prev => ({ 
                ...prev, 
                vendorPackageCodes: newCodes, 
                baseVendorCost: prev.baseVendorCost + vendorPackage.price
            }));
            setSelectedVendorPackages(newSelected);
        }
    };

    // Auto-calculate prices when vendor packages are selected (only for new packages)
    // Removed calculated price logic. Vendor price and selling price must be entered manually.

    // Handle markup calculations
    useEffect(() => {
        if (formData.basePrice && formData.markupId) {
            const selectedMarkup = availableMarkups.find(m => m.id === formData.markupId);
            if (selectedMarkup) {
                const calculation = packageService.calculatePriceWithMarkup(formData.basePrice, selectedMarkup);
                setPriceCalculation(calculation);
                setFormData(prev => ({ ...prev, price: calculation.finalPrice }));
            }
        } else if (formData.basePrice && !formData.markupId) {
            setFormData(prev => ({ ...prev, price: formData.basePrice }));
            setPriceCalculation(null);
        }
    }, [formData.basePrice, formData.markupId, availableMarkups]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.region || !formData.gameName || !formData.vendor) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.vendorPackageCodes.length === 0) {
            alert('Please select at least one vendor package');
            return;
        }

        onSave({
            ...formData,
            vendorPackageCode: formData.vendorPackageCodes.join(',')
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {pkg ? 'Edit Package' : 'Add New Package'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

                                {/* Region Selection - Priority 1 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Region * <span className="text-xs text-blue-600">(Step 1)</span>
                                    </label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoadingFilters}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                    >
                                        <option value="">Select Region</option>
                                        {filterOptions.regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                    {isLoadingFilters && (
                                        <div className="text-xs text-blue-600 mt-1">Loading regions...</div>
                                    )}
                                </div>

                                {/* Game Selection - Priority 2 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Game * <span className="text-xs text-blue-600">(Step 2)</span>
                                    </label>
                                    <select
                                        name="gameName"
                                        value={formData.gameName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!formData.region || isLoadingFilters}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                    >
                                        <option value="">
                                            {!formData.region ? 'Select Region First' : 'Select Game'}
                                        </option>
                                        {filterOptions.games.map(game => (
                                            <option key={game} value={game}>{game}</option>
                                        ))}
                                    </select>
                                    {formData.region && filterOptions.games.length === 0 && !isLoadingFilters && (
                                        <div className="text-xs text-amber-600 mt-1">No games available for selected region</div>
                                    )}
                                </div>

                                {/* Vendor Selection - Priority 3 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Vendor * <span className="text-xs text-blue-600">(Step 3)</span>
                                    </label>
                                    <select
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!formData.gameName || isLoadingFilters}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                    >
                                        <option value="">
                                            {!formData.gameName ? 'Select Game First' : 'Select Vendor'}
                                        </option>
                                        {filterOptions.vendors.map(vendor => (
                                            <option key={vendor} value={vendor}>{vendor}</option>
                                        ))}
                                    </select>
                                    {formData.gameName && filterOptions.vendors.length === 0 && !isLoadingFilters && (
                                        <div className="text-xs text-amber-600 mt-1">No vendors available for selected region and game</div>
                                    )}
                                </div>



                                {/* Vendor Package Selection */}
                                {availableVendorPackages.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Vendor Packages * <span className="text-xs text-blue-600">(Step 4 - Select one or more)</span>
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 space-y-2">
                                            {availableVendorPackages.map(vendorPkg => {
                                                const isSelected = formData.vendorPackageCodes.includes(vendorPkg.id || vendorPkg.code);
                                                return (
                                                    <div key={vendorPkg.id || vendorPkg.code} className="border-b last:border-b-0 pb-2 mb-2">
                                                        <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleVendorPackageToggle(vendorPkg.id)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {/* Find the longest string in all string attributes of vendorPkg */}
                                                                    {(() => {
                                                                        const values = Object.values(vendorPkg).filter(v => typeof v === 'string');
                                                                        const longestStr = values.reduce((a, b) => b.length > a.length ? b : a, '');
                                                                        return longestStr || vendorPkg.code || vendorPkg.name || vendorPkg.id;
                                                                    })()}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {formData.currency} {vendorPkg.price}
                                                                    {vendorPkg.diamonds && ` • ${vendorPkg.diamonds} diamonds`}
                                                                </div>
                                                            </div>
                                                        </label>
                                                        {isSelected && (
                                                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/20 rounded-md">
                                                                <div className="space-y-1">
                                                                    {Object.entries(vendorPkg).map(([key, value]) => (
                                                                        <div key={key} className="flex flex-wrap items-center">
                                                                            <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{key}:</span>
                                                                            <span className="text-gray-900 dark:text-gray-100 break-all">{String(value)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {formData.vendorPackageCodes.length > 0 && (
                                            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                                    <div className="flex justify-between">
                                                        <span>Selected packages:</span>
                                                        <span className="font-medium">{formData.vendorPackageCodes.length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Package Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Package Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Package Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Resell Keyword
                                    </label>
                                    <input
                                        type="text"
                                        name="resellKeyword"
                                        value={formData.resellKeyword}
                                        onChange={handleInputChange}
                                        placeholder="Enter keyword for resellers"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {formData.vendor === 'Smile' ? 'Smile Coin Price' : 'Vendor Price'}
                                        </label>
                                        <input
                                            type="number"
                                            name="vendorPrice"
                                            value={formData.vendorPrice}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Selling Price *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Stock
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>

                                {/* Price Lock Checkbox */}
                                <div className="mt-4">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="isPriceLocked"
                                            name="isPriceLocked"
                                            checked={formData.isPriceLocked}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="isPriceLocked" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                            🔒 Lock Price (Prevent automatic updates when exchange rates change)
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        When enabled, this package price will not be automatically updated when vendor exchange rates change.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Markup (Optional)
                                    </label>
                                    <select
                                        name="markupId"
                                        value={formData.markupId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">No Markup</option>
                                        {availableMarkups.map(markup => (
                                            <option key={markup.id} value={markup.id}>
                                                {markup.name} ({markup.displayValue})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || isLoadingFilters}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (pkg ? 'Update Package' : 'Create Package')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEditPackageModal;