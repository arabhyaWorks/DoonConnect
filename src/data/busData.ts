import { BusStop, BusRoute, LiveBus, Ticket } from '../types';

export const busStops: BusStop[] = [
  // Route 2A stops
  {
    id: 'isbt',
    name: 'ISBT',
    location: { lat: 30.3398, lng: 78.0664 },
    routes: ['R2A', 'R1', 'R3', 'R4', 'R6'],
    amenities: ['shelter', 'seating', 'cafe', 'restroom']
  },
  {
    id: 'shimla-bypass',
    name: 'Shimla Bypass',
    location: { lat: 30.3420, lng: 78.0680 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'majra',
    name: 'Majra',
    location: { lat: 30.3445, lng: 78.0695 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'iti-niranjanpur',
    name: 'ITI Niranjanpur',
    location: { lat: 30.3470, lng: 78.0710 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'sabji-mandi-chowk',
    name: 'Sabji Mandi Chowk',
    location: { lat: 30.3485, lng: 78.0720 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'patel-nagar-police-station',
    name: 'Patel Nagar Police Station',
    location: { lat: 30.3500, lng: 78.0735 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'lal-pul',
    name: 'Lal Pul',
    location: { lat: 30.3515, lng: 78.0750 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'pnb-patel-nagar',
    name: 'PNB Patel Nagar',
    location: { lat: 30.3530, lng: 78.0765 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'matawala-bagh',
    name: 'Matawala Bagh',
    location: { lat: 30.3545, lng: 78.0780 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'saharanpur-chowk',
    name: 'Saharanpur Chowk',
    location: { lat: 30.3560, lng: 78.0795 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'dehradun-railway-station',
    name: 'Railway Station',
    location: { lat: 30.3142, lng: 78.0347 },
    routes: ['R2A', 'R1', 'R6', 'R8'],
    amenities: ['shelter', 'seating', 'cafe', 'restroom', 'wifi']
  },
  {
    id: 'prince-chowk',
    name: 'Prince Chowk',
    location: { lat: 30.3155, lng: 78.0355 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'cyber-police-station',
    name: 'Cyber Police Station',
    location: { lat: 30.3160, lng: 78.0360 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'tehshil-chowk',
    name: 'Tehshil Chowk',
    location: { lat: 30.3162, lng: 78.0365 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'darshan-lal-chowk',
    name: 'Darshan Lal Chowk',
    location: { lat: 30.3164, lng: 78.0370 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'clocktower',
    name: 'Clock Tower',
    location: { lat: 30.3165, lng: 78.0322 },
    routes: ['R2A', 'R1', 'R2', 'R5'],
    amenities: ['shelter', 'seating', 'wifi']
  },
  {
    id: 'gandhi-park',
    name: 'Gandhi Park',
    location: { lat: 30.3170, lng: 78.0325 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'st-joseph-academy',
    name: 'St. Joseph Academy',
    location: { lat: 30.3175, lng: 78.0330 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'sachiwalaya',
    name: 'Sachiwalaya',
    location: { lat: 30.3180, lng: 78.0335 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'bhel-chowk',
    name: 'Bhel Chowk',
    location: { lat: 30.3185, lng: 78.0340 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'dilaram-chowk',
    name: 'Dilaram Chowk',
    location: { lat: 30.3190, lng: 78.0345 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'madhuban-hotel',
    name: 'Madhuban Hotel',
    location: { lat: 30.3195, lng: 78.0350 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'ajanta-chowk',
    name: 'Ajanta Chowk',
    location: { lat: 30.3200, lng: 78.0355 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'survey-of-india',
    name: 'Survey of India',
    location: { lat: 30.3205, lng: 78.0360 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'nivh-front-gate',
    name: 'NIVH Front Gate',
    location: { lat: 30.3210, lng: 78.0365 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'jakhan',
    name: 'Jakhan',
    location: { lat: 30.3215, lng: 78.0370 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'pacific-mall',
    name: 'Pacific Mall',
    location: { lat: 30.3220, lng: 78.0375 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating', 'cafe']
  },
  {
    id: 'inder-bawa-marg',
    name: 'Inder Bawa Marg',
    location: { lat: 30.3225, lng: 78.0380 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'mussoorie-diversion',
    name: 'Mussoorie Diversion',
    location: { lat: 30.4278, lng: 78.0447 },
    routes: ['R2A', 'R5', 'R9'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'sai-mandir',
    name: 'Sai Mandir',
    location: { lat: 30.4285, lng: 78.0450 },
    routes: ['R2A'],
    amenities: ['shelter']
  },
  {
    id: 'tehari-house-grd',
    name: 'Tehari House/GRD',
    location: { lat: 30.4290, lng: 78.0455 },
    routes: ['R2A'],
    amenities: ['shelter', 'seating']
  },
  {
    id: 'rajpur',
    name: 'Rajpur',
    location: { lat: 30.3293, lng: 78.0428 },
    routes: ['R2A', 'R2', 'R5', 'R7'],
    amenities: ['shelter', 'seating']
  },
  // Other existing stops
  {
    id: 'sahastradhara',
    name: 'Sahastradhara',
    location: { lat: 30.3734, lng: 78.0199 },
    routes: ['R3', 'R8'],
    amenities: ['shelter', 'seating', 'cafe']
  },
  {
    id: 'forest-research-institute',
    name: 'Forest Research Institute',
    location: { lat: 30.3350, lng: 77.9999 },
    routes: ['R4', 'R7'],
    amenities: ['shelter', 'seating', 'wifi']
  },
  {
    id: 'it-park',
    name: 'IT Park Sahastradhara Road',
    location: { lat: 30.3612, lng: 78.0156 },
    routes: ['R2', 'R3', 'R9'],
    amenities: ['shelter', 'seating', 'wifi', 'cafe']
  }
];

export const busRoutes: BusRoute[] = [
  {
    id: 'R2A',
    name: 'Doon Electric Bus Route 2A',
    color: '#10B981',
    stops: [
      'isbt', 'shimla-bypass', 'majra', 'iti-niranjanpur', 'sabji-mandi-chowk',
      'patel-nagar-police-station', 'lal-pul', 'pnb-patel-nagar', 'matawala-bagh',
      'saharanpur-chowk', 'dehradun-railway-station', 'prince-chowk', 'cyber-police-station',
      'tehshil-chowk', 'darshan-lal-chowk', 'clocktower', 'gandhi-park', 'st-joseph-academy',
      'sachiwalaya', 'bhel-chowk', 'dilaram-chowk', 'madhuban-hotel', 'ajanta-chowk',
      'survey-of-india', 'nivh-front-gate', 'jakhan', 'pacific-mall', 'inder-bawa-marg',
      'mussoorie-diversion', 'sai-mandir', 'tehari-house-grd', 'rajpur'
    ],
    fare: 25,
    frequency: 15
  },
  {
    id: 'R1',
    name: 'Clock Tower - ISBT - Railway Station',
    color: '#8B5CF6',
    stops: ['clocktower', 'isbt', 'dehradun-railway-station'],
    fare: 15,
    frequency: 10
  },
  {
    id: 'R2',
    name: 'Rajpur Road - IT Park',
    color: '#A855F7',
    stops: ['rajpur', 'clocktower', 'it-park'],
    fare: 20,
    frequency: 15
  },
  {
    id: 'R3',
    name: 'ISBT - Sahastradhara - IT Park',
    color: '#9333EA',
    stops: ['isbt', 'sahastradhara', 'it-park'],
    fare: 25,
    frequency: 20
  },
  {
    id: 'R4',
    name: 'ISBT - Forest Research Institute',
    color: '#7C3AED',
    stops: ['isbt', 'forest-research-institute'],
    fare: 18,
    frequency: 12
  },
  {
    id: 'R5',
    name: 'Clock Tower - Rajpur Road - Mussoorie Diversion',
    color: '#6D28D9',
    stops: ['clocktower', 'rajpur', 'mussoorie-diversion'],
    fare: 30,
    frequency: 25
  },
  {
    id: 'R6',
    name: 'ISBT - Railway Station',
    color: '#5B21B6',
    stops: ['isbt', 'dehradun-railway-station'],
    fare: 12,
    frequency: 8
  },
  {
    id: 'R7',
    name: 'Rajpur Road - Forest Research Institute',
    color: '#4C1D95',
    stops: ['rajpur', 'forest-research-institute'],
    fare: 22,
    frequency: 18
  },
  {
    id: 'R8',
    name: 'Sahastradhara - Railway Station',
    color: '#581C87',
    stops: ['sahastradhara', 'dehradun-railway-station'],
    fare: 28,
    frequency: 22
  },
  {
    id: 'R9',
    name: 'Mussoorie Diversion - IT Park',
    color: '#6B46C1',
    stops: ['mussoorie-diversion', 'it-park'],
    fare: 35,
    frequency: 30
  }
];

export const liveBuses: LiveBus[] = [
  {
    id: 'E001',
    routeId: 'R2A',
    currentStop: 'clocktower',
    nextStop: 'gandhi-park',
    estimatedArrival: 2,
    distance: 0.2,
    occupancy: 'medium'
  },
  {
    id: 'E002',
    routeId: 'R2A',
    currentStop: 'jakhan',
    nextStop: 'pacific-mall',
    estimatedArrival: 8,
    distance: 1.5,
    occupancy: 'low'
  },
  {
    id: 'B001',
    routeId: 'R1',
    currentStop: 'clocktower',
    nextStop: 'isbt',
    estimatedArrival: 3,
    distance: 0.45,
    occupancy: 'medium'
  },
  {
    id: 'B002',
    routeId: 'R2',
    currentStop: 'rajpur',
    nextStop: 'clocktower',
    estimatedArrival: 7,
    distance: 0.85,
    occupancy: 'low'
  },
  {
    id: 'B003',
    routeId: 'R3',
    currentStop: 'sahastradhara',
    nextStop: 'it-park',
    estimatedArrival: 12,
    distance: 1.2,
    occupancy: 'high'
  },
  {
    id: 'B004',
    routeId: 'R5',
    currentStop: 'rajpur',
    nextStop: 'mussoorie-diversion',
    estimatedArrival: 5,
    distance: 0.65,
    occupancy: 'medium'
  }
];

export const sampleTickets: Ticket[] = [
  {
    id: 'T001',
    routeId: 'R2A',
    fromStop: 'clocktower',
    toStop: 'rajpur',
    fare: 25,
    purchaseTime: new Date(Date.now() - 10 * 60 * 1000),
    validUntil: new Date(Date.now() + 50 * 60 * 1000),
    status: 'active',
    qrCode: 'QR001'
  },
  {
    id: 'T002',
    routeId: 'R2',
    fromStop: 'rajpur',
    toStop: 'it-park',
    fare: 20,
    purchaseTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() - 60 * 60 * 1000),
    status: 'used',
    qrCode: 'QR002'
  }
];