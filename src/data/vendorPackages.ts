import { Vendor, VendorPackage } from '../types/package';

// Sample vendor packages based on your list
export const VENDOR_PACKAGES: VendorPackage[] = [
  { code: 'svp', name: 'SVP Package', price: 39.00, currency: 'R$', diamonds: 50 },
  { code: '55', name: '55 Diamonds', price: 39.00, currency: 'R$', diamonds: 55 },
  { code: '86', name: '86 Diamonds', price: 61.50, currency: 'R$', diamonds: 86 },
  { code: 'wkp', name: 'Weekly Pass', price: 76.00, currency: 'R$', diamonds: 100 },
  { code: '165', name: '165 Diamonds', price: 116.90, currency: 'R$', diamonds: 165 },
  { code: '172', name: '172 Diamonds', price: 122.00, currency: 'R$', diamonds: 172 },
  { code: 'wkp2', name: 'Weekly Pass 2', price: 152.00, currency: 'R$', diamonds: 200 },
  { code: '257', name: '257 Diamonds', price: 177.50, currency: 'R$', diamonds: 257 },
  { code: '275', name: '275 Diamonds', price: 187.50, currency: 'R$', diamonds: 275 },
  { code: 'cpn', name: 'Champion Package', price: 219.40, currency: 'R$', diamonds: 300 },
  { code: 'wkp3', name: 'Weekly Pass 3', price: 228.00, currency: 'R$', diamonds: 350 },
  { code: '343', name: '343 Diamonds', price: 239.00, currency: 'R$', diamonds: 343 },
  { code: '344', name: '344 Diamonds', price: 244.00, currency: 'R$', diamonds: 344 },
  { code: '429', name: '429 Diamonds', price: 299.50, currency: 'R$', diamonds: 429 },
  { code: 'wkp4', name: 'Weekly Pass 4', price: 304.00, currency: 'R$', diamonds: 500 },
  { code: '430', name: '430 Diamonds', price: 305.50, currency: 'R$', diamonds: 430 },
  { code: '514', name: '514 Diamonds', price: 355.00, currency: 'R$', diamonds: 514 },
  { code: 'wkp5', name: 'Weekly Pass 5', price: 380.00, currency: 'R$', diamonds: 600 },
  { code: '565', name: '565 Diamonds', price: 385.00, currency: 'R$', diamonds: 565 },
  { code: 'twilight', name: 'Twilight Package', price: 402.50, currency: 'R$', diamonds: 700 },
  { code: '600', name: '600 Diamonds', price: 416.50, currency: 'R$', diamonds: 600 },
  { code: '706', name: '706 Diamonds', price: 480.00, currency: 'R$', diamonds: 706 },
  { code: '792', name: '792 Diamonds', price: 541.50, currency: 'R$', diamonds: 792 },
  { code: '878', name: '878 Diamonds', price: 602.00, currency: 'R$', diamonds: 878 },
  { code: '963', name: '963 Diamonds', price: 657.50, currency: 'R$', diamonds: 963 },
  { code: '1049', name: '1049 Diamonds', price: 719.00, currency: 'R$', diamonds: 1049 },
  { code: '1050', name: '1050 Diamonds', price: 724.00, currency: 'R$', diamonds: 1050 },
  { code: '1135', name: '1135 Diamonds', price: 779.50, currency: 'R$', diamonds: 1135 },
  { code: '1220', name: '1220 Diamonds', price: 835.00, currency: 'R$', diamonds: 1220 },
  { code: '1412', name: '1412 Diamonds', price: 960.00, currency: 'R$', diamonds: 1412 },
  { code: '1669', name: '1669 Diamonds', price: 1137.50, currency: 'R$', diamonds: 1669 },
  { code: '1841', name: '1841 Diamonds', price: 1259.50, currency: 'R$', diamonds: 1841 },
  { code: '2195', name: '2195 Diamonds', price: 1453.00, currency: 'R$', diamonds: 2195 },
  { code: '2901', name: '2901 Diamonds', price: 1940.00, currency: 'R$', diamonds: 2901 },
  { code: '3688', name: '3688 Diamonds', price: 2424.00, currency: 'R$', diamonds: 3688 },
  { code: '5532', name: '5532 Diamonds', price: 3660.00, currency: 'R$', diamonds: 5532 },
  { code: '9288', name: '9288 Diamonds', price: 6080.00, currency: 'R$', diamonds: 9288 }
];

export const VENDORS: Vendor[] = [
  {
    id: 'smile-ml-myanmar',
    name: 'Smile',
    region: 'Myanmar',
    gameName: 'Mobile Legends',
    packages: VENDOR_PACKAGES
  },
  {
    id: 'razorgold-ml-myanmar',
    name: 'Razor Gold',
    region: 'Myanmar',
    gameName: 'Mobile Legends',
    packages: VENDOR_PACKAGES.slice(0, 20) // Different packages for different vendors
  },
  {
    id: 'smile-ml-malaysia',
    name: 'Smile',
    region: 'Malaysia',
    gameName: 'Mobile Legends',
    packages: VENDOR_PACKAGES.slice(5, 25)
  },
  {
    id: 'razorgold-ff-myanmar',
    name: 'Razor Gold',
    region: 'Myanmar',
    gameName: 'Free Fire',
    packages: VENDOR_PACKAGES.slice(0, 15)
  }
];

export const REGIONS = ['Myanmar', 'Malaysia', 'Thailand', 'Singapore', 'Indonesia'];
export const GAMES = ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Call of Duty Mobile'];
export const VENDOR_NAMES = ['Smile', 'Razor Gold', 'UniPin', 'Codashop'];