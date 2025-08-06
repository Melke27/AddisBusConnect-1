import { db } from './supabase';
import { busCompanies, busRoutes, busStops, routeStops, buses } from './schema';
import { eq } from 'drizzle-orm';

// Seed data for Ethiopian bus system
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert bus companies
    console.log('📊 Seeding bus companies...');
    const [anbessaCompany] = await db.insert(busCompanies)
      .values([
        {
          nameEn: 'Anbessa City Bus',
          nameAm: 'አንበሳ የከተማ አውቶብስ',
          nameOm: 'Anbessa Magaalaa Awtoobusii',
          brandColor: '#009639',
          contactPhone: '+251911123456',
          logoUrl: '/assets/anbessa-logo.svg',
          isActive: true
        },
        {
          nameEn: 'Sheger Bus',
          nameAm: 'ሸገር አውቶብስ',
          nameOm: 'Sheger Awtoobusii',
          brandColor: '#DA020E',
          contactPhone: '+251911654321',
          logoUrl: '/assets/sheger-logo.svg',
          isActive: true
        }
      ])
      .returning();

    // Get both companies
    const companies = await db.select().from(busCompanies);
    const anbessa = companies.find(c => c.nameEn === 'Anbessa City Bus');
    const sheger = companies.find(c => c.nameEn === 'Sheger Bus');

    // Insert bus stops
    console.log('🚌 Seeding bus stops...');
    const stopsData = [
      { nameEn: 'Mercato', nameAm: 'መርካቶ', nameOm: 'Merkato', lat: 9.0157, lng: 38.7469, isMajor: true },
      { nameEn: 'Piazza', nameAm: 'ፒያሳ', nameOm: 'Piiyaazaa', lat: 9.0343, lng: 38.7578, isMajor: true },
      { nameEn: 'Arat Kilo', nameAm: 'አራት ኪሎ', nameOm: 'Afur Kilo', lat: 9.0411, lng: 38.7614, isMajor: false },
      { nameEn: 'Mexico', nameAm: 'ሜክሲኮ', nameOm: 'Meksiko', lat: 9.0298, lng: 38.7654, isMajor: false },
      { nameEn: 'Meskel Square', nameAm: 'መስቀል አደባባይ', nameOm: 'Finfinnee Meskel', lat: 9.0125, lng: 38.7578, isMajor: true },
      { nameEn: 'Bole', nameAm: 'ቦሌ', nameOm: 'Bole', lat: 8.9889, lng: 38.7890, isMajor: false },
      { nameEn: 'Bole Airport', nameAm: 'ቦሌ አውሮፕላን ማረፊያ', nameOm: 'Bole Airport', lat: 8.9789, lng: 38.7990, isMajor: true },
      { nameEn: 'Gotera', nameAm: 'ጎተራ', nameOm: 'Gotera', lat: 9.0542, lng: 38.7025, isMajor: false },
      { nameEn: 'Addis Ketema', nameAm: 'አዲስ ከተማ', nameOm: 'Addis Ketema', lat: 9.0089, lng: 38.7389, isMajor: false },
      { nameEn: 'Lideta', nameAm: 'ልደታ', nameOm: 'Lideta', lat: 8.9978, lng: 38.7267, isMajor: false },
      { nameEn: 'Kaliti', nameAm: 'ቃሊቲ', nameOm: 'Kaliti', lat: 8.9456, lng: 38.7234, isMajor: false },
      { nameEn: 'Lafto', nameAm: 'ላፍቶ', nameOm: 'Lafto', lat: 8.9234, lng: 38.8234, isMajor: false },
      { nameEn: 'CMC', nameAm: 'ሲኤምሲ', nameOm: 'CMC', lat: 9.0456, lng: 38.6789, isMajor: true },
      { nameEn: 'Stadium', nameAm: 'ስታድየም', nameOm: 'Isiteediyaam', lat: 9.0012, lng: 38.7656, isMajor: true },
      { nameEn: '4 Kilo', nameAm: '4 ኪሎ', nameOm: '4 Kilo', lat: 9.0411, lng: 38.7614, isMajor: false }
    ];

    const insertedStops = await db.insert(busStops)
      .values(stopsData.map(stop => ({
        nameEn: stop.nameEn,
        nameAm: stop.nameAm,
        nameOm: stop.nameOm,
        coordinates: `(${stop.lng}, ${stop.lat})` as any,
        isMajorStop: stop.isMajor,
        addressAm: `${stop.nameAm} አካባቢ፣ አዲስ አበባ`,
        landmarksAm: `${stop.nameAm} ማቆሚያ አጠገብ`
      })))
      .returning();

    // Create a map for quick stop lookup
    const stopMap = new Map(insertedStops.map(stop => [stop.nameEn, stop]));

    // Insert bus routes
    console.log('🗺️ Seeding bus routes...');
    const routesData = [
      {
        companyId: anbessa!.id,
        routeCode: 'ANB-01',
        nameEn: 'Mercato - Bole Airport',
        nameAm: 'መርካቶ - ቦሌ አውሮፕላን ማረፊያ',
        nameOm: 'Merkato - Bole Airport',
        startPointNameEn: 'Mercato',
        startPointNameAm: 'መርካቶ',
        endPointNameEn: 'Bole Airport',
        endPointNameAm: 'ቦሌ አውሮፕላን ማረፊያ',
        startPointCoordinates: '(38.7469, 9.0157)' as any,
        endPointCoordinates: '(38.7990, 8.9789)' as any,
        price: '8.50',
        distanceKm: '12.5',
        estimatedDurationMinutes: 35,
        frequencyMinutes: 15,
        routeColor: '#009639'
      },
      {
        companyId: anbessa!.id,
        routeCode: 'ANB-02',
        nameEn: 'Gotera - Kaliti',
        nameAm: 'ጎተራ - ቃሊቲ',
        nameOm: 'Gotera - Kaliti',
        startPointNameEn: 'Gotera',
        startPointNameAm: 'ጎተራ',
        endPointNameEn: 'Kaliti',
        endPointNameAm: 'ቃሊቲ',
        startPointCoordinates: '(38.7025, 9.0542)' as any,
        endPointCoordinates: '(38.7234, 8.9456)' as any,
        price: '7.00',
        distanceKm: '8.7',
        estimatedDurationMinutes: 28,
        frequencyMinutes: 20,
        routeColor: '#FFDE00'
      },
      {
        companyId: sheger!.id,
        routeCode: 'SHG-01',
        nameEn: 'Lafto - CMC',
        nameAm: 'ላፍቶ - ሲኤምሲ',
        nameOm: 'Lafto - CMC',
        startPointNameEn: 'Lafto',
        startPointNameAm: 'ላፍቶ',
        endPointNameEn: 'CMC',
        endPointNameAm: 'ሲኤምሲ',
        startPointCoordinates: '(38.8234, 8.9234)' as any,
        endPointCoordinates: '(38.6789, 9.0456)' as any,
        price: '9.00',
        distanceKm: '15.2',
        estimatedDurationMinutes: 42,
        frequencyMinutes: 18,
        routeColor: '#DA020E'
      }
    ];

    const insertedRoutes = await db.insert(busRoutes)
      .values(routesData)
      .returning();

    // Insert route stops
    console.log('🛑 Seeding route stops...');
    const routeStopData = [
      // Anbessa Route 1: Mercato - Bole Airport
      { routeIndex: 0, stops: ['Mercato', 'Piazza', 'Arat Kilo', 'Mexico', 'Meskel Square', 'Bole', 'Bole Airport'] },
      // Anbessa Route 2: Gotera - Kaliti
      { routeIndex: 1, stops: ['Gotera', 'Mercato', 'Addis Ketema', 'Lideta', 'Kaliti'] },
      // Sheger Route 1: Lafto - CMC
      { routeIndex: 2, stops: ['Lafto', 'Stadium', '4 Kilo', 'CMC'] }
    ];

    for (const routeData of routeStopData) {
      const route = insertedRoutes[routeData.routeIndex];
      for (let i = 0; i < routeData.stops.length; i++) {
        const stopName = routeData.stops[i];
        const stop = stopMap.get(stopName);
        if (stop) {
          await db.insert(routeStops).values({
            routeId: route.id,
            stopId: stop.id,
            stopOrder: i + 1,
            travelTimeFromPrevious: i === 0 ? 0 : 5 + Math.floor(Math.random() * 8) // 5-12 minutes
          });
        }
      }
    }

    // Insert sample buses
    console.log('🚌 Seeding buses...');
    const busData = [];
    for (let i = 0; i < insertedRoutes.length; i++) {
      const route = insertedRoutes[i];
      // Add 2-3 buses per route
      for (let j = 0; j < (2 + Math.floor(Math.random() * 2)); j++) {
        busData.push({
          routeId: route.id,
          plateNumber: `ET-${route.routeCode}-${String(j + 1).padStart(3, '0')}`,
          busNumber: `${route.routeCode.split('-')[1]}${j + 1}`,
          capacity: 45 + Math.floor(Math.random() * 15), // 45-60 capacity
          accessibilityEnabled: Math.random() > 0.7,
          wifiEnabled: Math.random() > 0.5,
          airConditioning: Math.random() > 0.6,
          isActive: true,
          isInService: Math.random() > 0.3 // 70% in service
        });
      }
    }

    await db.insert(buses).values(busData);

    console.log('✅ Database seeding completed successfully!');
    console.log(`   - ${companies.length} bus companies`);
    console.log(`   - ${insertedStops.length} bus stops`);
    console.log(`   - ${insertedRoutes.length} bus routes`);
    console.log(`   - ${busData.length} buses`);

    return {
      success: true,
      message: 'Database seeded successfully',
      stats: {
        companies: companies.length,
        stops: insertedStops.length,
        routes: insertedRoutes.length,
        buses: busData.length
      }
    };

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Function to reset database (for development)
export async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  try {
    // Clear all data (in correct order due to foreign keys)
    await db.delete(routeStops);
    await db.delete(buses);
    await db.delete(busRoutes);
    await db.delete(busStops);
    await db.delete(busCompanies);
    
    console.log('✅ Database reset completed');
    return { success: true, message: 'Database reset successfully' };
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
}