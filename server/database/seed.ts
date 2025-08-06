import { db } from './supabase';
import { companies, routes, stops, buses } from './schema';

// Seed data for Ethiopian bus companies
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert bus companies
    await db.insert(companies).values([
      {
        id: 'anbessa',
        nameEn: 'Anbessa City Bus',
        nameAm: 'አንበሳ የከተማ አውቶብስ',
        nameOm: 'Anbessa Awtoobusii Magaalaa',
        color: '#009639', // Ethiopian green
        contactPhone: '+251911123456',
        contactEmail: 'info@anbessa.gov.et'
      },
      {
        id: 'sheger',
        nameEn: 'Sheger Bus',
        nameAm: 'ሸገር አውቶብስ',
        nameOm: 'Sheger Awtoobusii',
        color: '#DA020E', // Ethiopian red
        contactPhone: '+251911654321',
        contactEmail: 'info@sheger.gov.et'
      }
    ]).onConflictDoNothing();

    // Insert routes for Anbessa
    await db.insert(routes).values([
      {
        id: 'anbessa-01',
        companyId: 'anbessa',
        nameEn: 'Mercato - Bole',
        nameAm: 'መርካቶ - ቦሌ',
        nameOm: 'Merkato - Bole',
        startPointName: 'Mercato',
        startPointNameAm: 'መርካቶ',
        startPointCoords: '(38.7469,9.0157)', 
        endPointName: 'Bole Airport',
        endPointNameAm: 'ቦሌ አውሮፕላን ማረፊያ',
        endPointCoords: '(38.7990,8.9789)',
        distance: '15.2',
        estimatedDuration: 45,
        price: '8.50',
        frequency: 15,
        startTime: '05:30',
        endTime: '23:00',
        color: '#009639'
      },
      {
        id: 'anbessa-02',
        companyId: 'anbessa',
        nameEn: 'Gotera - Kaliti',
        nameAm: 'ጎተራ - ቃሊቲ',
        nameOm: 'Gotera - Kaliti',
        startPointName: 'Gotera',
        startPointNameAm: 'ጎተራ',
        startPointCoords: '(38.7025,9.0542)',
        endPointName: 'Kaliti',
        endPointNameAm: 'ቃሊቲ',
        endPointCoords: '(38.7234,8.9456)',
        distance: '12.8',
        estimatedDuration: 35,
        price: '7.00',
        frequency: 20,
        startTime: '06:00',
        endTime: '22:30',
        color: '#FFDE00'
      },
      {
        id: 'anbessa-03',
        companyId: 'anbessa',
        nameEn: 'Entoto - Lebu',
        nameAm: 'እንጦጦ - ልቡ',
        nameOm: 'Entoto - Lebu',
        startPointName: 'Entoto',
        startPointNameAm: 'እንጦጦ',
        startPointCoords: '(38.7456,9.0989)',
        endPointName: 'Lebu',
        endPointNameAm: 'ልቡ',
        endPointCoords: '(38.6789,8.8567)',
        distance: '18.5',
        estimatedDuration: 55,
        price: '6.50',
        frequency: 30,
        startTime: '06:30',
        endTime: '21:30',
        color: '#32CD32'
      }
    ]).onConflictDoNothing();

    // Insert routes for Sheger
    await db.insert(routes).values([
      {
        id: 'sheger-01',
        companyId: 'sheger',
        nameEn: 'Lafto - CMC',
        nameAm: 'ላፍቶ - ሲኤምሲ',
        nameOm: 'Lafto - CMC',
        startPointName: 'Lafto',
        startPointNameAm: 'ላፍቶ',
        startPointCoords: '(38.8234,8.9234)',
        endPointName: 'CMC',
        endPointNameAm: 'ሲኤምሲ',
        endPointCoords: '(38.6789,9.0456)',
        distance: '16.7',
        estimatedDuration: 50,
        price: '9.00',
        frequency: 18,
        startTime: '05:45',
        endTime: '22:45',
        color: '#DA020E'
      },
      {
        id: 'sheger-02',
        companyId: 'sheger',
        nameEn: 'Gerji - Tor Hailoch',
        nameAm: 'ገርጂ - ቶር ሃይሎች',
        nameOm: 'Gerji - Tor Hailoch',
        startPointName: 'Gerji',
        startPointNameAm: 'ገርጂ',
        startPointCoords: '(38.8456,9.0789)',
        endPointName: 'Tor Hailoch',
        endPointNameAm: 'ቶር ሃይሎች',
        endPointCoords: '(38.6234,8.9123)',
        distance: '14.3',
        estimatedDuration: 40,
        price: '8.00',
        frequency: 25,
        startTime: '06:15',
        endTime: '22:15',
        color: '#4169E1'
      }
    ]).onConflictDoNothing();

    // Insert some bus stops for the first route
    await db.insert(stops).values([
      // Mercato - Bole route stops
      {
        routeId: 'anbessa-01',
        name: 'Mercato',
        nameAm: 'መርካቶ',
        nameOm: 'Merkato',
        coordinates: '(38.7469,9.0157)',
        order: 1,
        landmarks: ['Grand Market', 'Mercato Bus Station'],
        facilities: ['shelter', 'lighting', 'security']
      },
      {
        routeId: 'anbessa-01',
        name: 'Piazza',
        nameAm: 'ፒያሳ',
        nameOm: 'Piazza',
        coordinates: '(38.7578,9.0343)',
        order: 2,
        landmarks: ['Red Terror Martyrs Memorial', 'Piazza'],
        facilities: ['shelter', 'bench']
      },
      {
        routeId: 'anbessa-01',
        name: 'Arat Kilo',
        nameAm: 'አራት ኪሎ',
        nameOm: 'Arat Kilo',
        coordinates: '(38.7614,9.0411)',
        order: 3,
        landmarks: ['Addis Ababa University', 'Ministry of Education'],
        facilities: ['shelter', 'lighting']
      },
      {
        routeId: 'anbessa-01',
        name: 'Mexico',
        nameAm: 'ሜክሲኮ',
        nameOm: 'Mexico',
        coordinates: '(38.7654,9.0298)',
        order: 4,
        landmarks: ['Mexico Square', 'Telecommunications'],
        facilities: ['shelter', 'bench', 'lighting']
      },
      {
        routeId: 'anbessa-01',
        name: 'Meskel Square',
        nameAm: 'መስቀል አደባባይ',
        nameOm: 'Meskel Square',
        coordinates: '(38.7578,9.0125)',
        order: 5,
        landmarks: ['Meskel Square', 'Monument'],
        facilities: ['shelter', 'bench', 'lighting', 'security']
      },
      {
        routeId: 'anbessa-01',
        name: 'Bole',
        nameAm: 'ቦሌ',
        nameOm: 'Bole',
        coordinates: '(38.7890,8.9889)',
        order: 6,
        landmarks: ['Bole Road', 'Shopping Centers'],
        facilities: ['shelter', 'lighting']
      },
      {
        routeId: 'anbessa-01',
        name: 'Bole Airport',
        nameAm: 'ቦሌ አውሮፕላን ማረፊያ',
        nameOm: 'Bole Airport',
        coordinates: '(38.7990,8.9789)',
        order: 7,
        landmarks: ['Bole International Airport'],
        facilities: ['shelter', 'bench', 'lighting', 'security', 'parking']
      }
    ]).onConflictDoNothing();

    // Insert some buses
    await db.insert(buses).values([
      {
        routeId: 'anbessa-01',
        plateNumber: 'ET-ANB-1234',
        capacity: 50,
        currentCapacity: 32,
        currentLocation: '(38.7578,9.0125)', // Meskel Square
        speed: '25.5',
        heading: 90,
        estimatedArrival: 5,
        status: 'active',
        driverName: 'አበበ ከበደ',
        driverPhone: '+251911223344'
      },
      {
        routeId: 'anbessa-01',
        plateNumber: 'ET-ANB-5678',
        capacity: 50,
        currentCapacity: 28,
        currentLocation: '(38.7890,8.9889)', // Bole
        speed: '30.0',
        heading: 180,
        estimatedArrival: 8,
        status: 'active',
        driverName: 'መስፍን ሃይሉ',
        driverPhone: '+251911445566'
      },
      {
        routeId: 'sheger-01',
        plateNumber: 'ET-SHG-9012',
        capacity: 45,
        currentCapacity: 20,
        currentLocation: '(38.8089,8.9567)', // Megenagna
        speed: '28.0',
        heading: 270,
        estimatedArrival: 12,
        status: 'active',
        driverName: 'ታደሰ አለሙ',
        driverPhone: '+251911667788'
      }
    ]).onConflictDoNothing();

    console.log('✅ Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}