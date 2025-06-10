import React, { useState, useEffect } from 'react';
import { Package, Vendor, VendorPackage } from '../../../types/package';

interface AddEditPackageModalProps {
    package: Package | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (packageData: Partial<Package>) => void;
    loading: boolean;
    vendors: Vendor[];
    regions: string[];
    games: string[];
    vendorNames: string[];
}

const AddEditPackageModal: React.FC<AddEditPackageModalProps> = ({
    package: pkg,
    isOpen,
    onClose,
    onSave,
    loading,
    vendors,
    regions,
    games,
    vendorNames
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        region: '',
        gameName: '',
        vendor: '',
        vendorPackageCodes: [] as string[], // Changed to array
        vendorPrice: 0,
        currency: 'R$',
        status: 'active' as Package['status'],
        stock: undefined as number | undefined, // Made optional
        discount: 0
    });

    const [availableVendorPackages, setAvailableVendorPackages] = useState<VendorPackage[]>([]);
    const [selectedVendorPackages, setSelectedVendorPackages] = useState<VendorPackage[]>([]);
    // Reset form when modal opens/closes or package changes
    useEffect(() => {
        if (isOpen) {
            if (pkg) {
                // Edit mode
                setFormData({
                    name: pkg.name,
                    description: pkg.description,
                    price: pkg.price,
                    imageUrl: pkg.imageUrl,
                    region: pkg.region,
                    gameName: pkg.gameName,
                    vendor: pkg.vendor,
                    vendorPackageCodes: [],
                    vendorPrice: pkg.vendorPrice,
                    currency: pkg.currency,
                    status: pkg.status,
                    stock: pkg.stock || 0,
                    discount: pkg.discount || 0
                });
            } else {
                // Add mode
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    imageUrl: '',
                    region: '',
                    gameName: '',
                    vendor: '',
                    vendorPackageCodes: [],
                    vendorPrice: 0,
                    currency: 'R$',
                    status: 'active',
                    stock: 0,
                    discount: 0
                });
            }
        }
    }, [isOpen, pkg]);

    // Update available vendor packages when region, game, or vendor changes
    useEffect(() => {
        if (formData.region && formData.gameName && formData.vendor) {
            const vendor = vendors.find(v =>
                v.region === formData.region &&
                v.gameName === formData.gameName &&
                v.name === formData.vendor
            );

            if (vendor) {
                setAvailableVendorPackages(vendor.packages);
            } else {
                setAvailableVendorPackages([]);
            }
        } else {
            setAvailableVendorPackages([]);
        }
        // Reset selected packages when vendor changes
        setSelectedVendorPackages([]);
        setFormData(prev => ({ ...prev, vendorPackageCodes: [] }));
    }, [formData.region, formData.gameName, formData.vendor, vendors]);

    // Update form when vendor packages are selected
    useEffect(() => {
        if (selectedVendorPackages.length > 0) {
            // Calculate average price and total amount
            const totalPrice = selectedVendorPackages.reduce((sum, pkg) => sum + pkg.price, 0);
            const avgPrice = totalPrice / selectedVendorPackages.length;
            const totalAmount = selectedVendorPackages.reduce((sum, pkg) => sum + (pkg.diamonds || 0), 0);

            // Use the first package's currency
            const currency = selectedVendorPackages[0]?.currency || 'RM';

            // Generate name from selected packages
            const packageNames = selectedVendorPackages.map(pkg => pkg.name).join(' + ');

            setFormData(prev => ({
                ...prev,
                vendorPrice: avgPrice,
                currency: currency,
                amount: totalAmount,
                name: `${prev.gameName} ${packageNames} - ${prev.region}`,
                description: `Bundle: ${packageNames} for ${prev.gameName} in ${prev.region}`,
                price: avgPrice * 1.15 // Add 15% markup as default
            }));
        }
    }, [selectedVendorPackages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleVendorPackageToggle = (packageCode: string) => {
        const vendorPackage = availableVendorPackages.find(p => p.code === packageCode);
        if (!vendorPackage) return;

        const isSelected = formData.vendorPackageCodes.includes(packageCode);

        if (isSelected) {
            // Remove package
            const newCodes = formData.vendorPackageCodes.filter(code => code !== packageCode);
            const newSelected = selectedVendorPackages.filter(pkg => pkg.code !== packageCode);

            setFormData(prev => ({ ...prev, vendorPackageCodes: newCodes }));
            setSelectedVendorPackages(newSelected);
        } else {
            // Add package
            const newCodes = [...formData.vendorPackageCodes, packageCode];
            const newSelected = [...selectedVendorPackages, vendorPackage];

            setFormData(prev => ({ ...prev, vendorPackageCodes: newCodes }));
            setSelectedVendorPackages(newSelected);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.region || !formData.gameName || !formData.vendor) {
            alert('Please fill in all required fields');
            return;
        }

        onSave(formData);
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Region *
                                    </label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Game *
                                    </label>
                                    <select
                                        name="gameName"
                                        value={formData.gameName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Game</option>
                                        {games.map(game => (
                                            <option key={game} value={game}>{game}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Vendor *
                                    </label>
                                    <select
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendorNames.map(vendor => (
                                            <option key={vendor} value={vendor}>{vendor}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Vendor Package Selection */}
                                {availableVendorPackages.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Vendor Packages * (Select one or more)
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 space-y-2">
                                            {availableVendorPackages.map(vendorPkg => (
                                                <label key={vendorPkg.code} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.vendorPackageCodes.includes(vendorPkg.code)}
                                                        onChange={() => handleVendorPackageToggle(vendorPkg.code)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {vendorPkg.code} - {vendorPkg.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {vendorPkg.currency} {vendorPkg.price}
                                                            {vendorPkg.diamonds && ` • ${vendorPkg.diamonds} diamonds`}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {formData.vendorPackageCodes.length > 0 && (
                                            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                                                Selected: {formData.vendorPackageCodes.length} package(s)
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Package Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Package Details</h3>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="diamond">Diamond</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="special">Special</option>
                                        <option value="subscription">Subscription</option>
                                    </select>
                                </div> */}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Vendor Price
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                                                {formData.currency}
                                            </span>
                                            <input
                                                type="number"
                                                name="vendorPrice"
                                                value={formData.vendorPrice}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Selling Price *
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                required
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Amount/Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div> */}

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
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                                disabled={loading}
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