const packages = [
  /* =========================
     KERALA
  ========================= */
  {
    id: 1,
    destination: "Kerala",
    location: "Munnar",
    title: "Munnar Tea Garden Escape",
    image: "https://images.unsplash.com/photo-1672219386269-486cbbe9a50f?auto=format&fit=crop&w=800&q=75",
    duration: 3,
    price: 9500,
    category: "Nature",
    rating: 4.8,
    description:
      "Relax among misty hills, tea gardens and peaceful mountain scenery in Munnar.",
    itinerary: [
      "Day 1: Arrival in Munnar and hotel check-in",
      "Day 2: Explore tea gardens and Eravikulam National Park",
      "Day 3: Visit Mattupetty Dam and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Local sightseeing",
      "Transportation for scheduled sightseeing"
    ],
    exclusions: [
      "Travel tickets to Munnar",
      "Entry fees",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 2,
    destination: "Kerala",
    location: "Alleppey",
    title: "Alleppey Backwater Retreat",
    duration: 4,
    price: 11000,
    category: "Nature",
    rating: 4.9,
    description:
      "Experience Kerala's famous backwaters, peaceful villages and beautiful waterways.",
    itinerary: [
      "Day 1: Arrival in Alleppey and hotel check-in",
      "Day 2: Backwater cruise and village experience",
      "Day 3: Explore Alleppey beach and local markets",
      "Day 4: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Backwater sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets to Kerala",
      "Optional boat activities",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 3,
    destination: "Kerala",
    location: "Wayanad",
    title: "Wayanad Nature Explorer",
    duration: 4,
    price: 10500,
    category: "Adventure",
    rating: 4.7,
    description:
      "Discover waterfalls, forests, viewpoints and the natural beauty of Wayanad.",
    itinerary: [
      "Day 1: Arrival and hotel check-in",
      "Day 2: Visit Soochipara Falls and nearby attractions",
      "Day 3: Explore Edakkal Caves and viewpoints",
      "Day 4: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Sightseeing as mentioned",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Entry fees",
      "Adventure activity charges",
      "Personal expenses"
    ]
  },
  {
    id: 4,
    destination: "Kerala",
    location: "Kochi",
    title: "Kochi Heritage & Culture Tour",
    duration: 3,
    price: 8500,
    category: "Heritage",
    rating: 4.6,
    description:
      "Explore Fort Kochi, historic streets, local culture and Kerala's coastal heritage.",
    itinerary: [
      "Day 1: Arrival and Fort Kochi exploration",
      "Day 2: Visit Mattancherry Palace and local attractions",
      "Day 3: Explore local markets and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Heritage sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Entry fees",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 5,
    destination: "Kerala",
    location: "Thekkady",
    title: "Thekkady Wildlife Getaway",
    duration: 3,
    price: 9800,
    category: "Adventure",
    rating: 4.7,
    description:
      "Enjoy forest scenery, wildlife experiences and the peaceful surroundings of Thekkady.",
    itinerary: [
      "Day 1: Arrival and hotel check-in",
      "Day 2: Wildlife and nature experience",
      "Day 3: Local sightseeing and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Local sightseeing",
      "Scheduled transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Wildlife activity charges",
      "Personal expenses",
      "Travel insurance"
    ]
  },

  /* =========================
     GOA
  ========================= */
  {
    id: 6,
    destination: "Goa",
    location: "Baga Beach",
    title: "Goa Beach Holiday",
    duration: 4,
    price: 12000,
    category: "Beach",
    rating: 4.8,
    description:
      "Enjoy beautiful beaches, water sports and relaxing evenings in Goa.",
    itinerary: [
      "Day 1: Arrival in Goa and hotel check-in",
      "Day 2: Visit Baga Beach and enjoy water activities",
      "Day 3: Explore Fort Aguada and nearby attractions",
      "Day 4: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Local sightseeing",
      "Airport or railway station transfer"
    ],
    exclusions: [
      "Flight or train tickets",
      "Water sports charges",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 7,
    destination: "Goa",
    location: "Calangute",
    title: "Calangute Coastal Escape",
    duration: 3,
    price: 10000,
    category: "Beach",
    rating: 4.6,
    description:
      "Spend a relaxing holiday near Calangute with beaches, local food and evening walks.",
    itinerary: [
      "Day 1: Arrival and Calangute beach visit",
      "Day 2: Explore nearby beaches and local markets",
      "Day 3: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Beach sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Water sports",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 8,
    destination: "Goa",
    location: "Panaji",
    title: "Panaji Culture & Beach Tour",
    duration: 3,
    price: 10500,
    category: "Culture",
    rating: 4.7,
    description:
      "Discover Panaji's colourful streets, heritage attractions and nearby beaches.",
    itinerary: [
      "Day 1: Arrival and Panaji city tour",
      "Day 2: Visit heritage attractions and nearby beach",
      "Day 3: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "City sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Entry fees",
      "Personal expenses",
      "Travel insurance"
    ]
  },

  /* =========================
     MANALI
  ========================= */
  {
    id: 9,
    destination: "Manali",
    location: "Solang Valley",
    title: "Manali Mountain Adventure",
    duration: 5,
    price: 15000,
    category: "Adventure",
    rating: 4.7,
    description:
      "Explore the mountains, valleys and beautiful landscapes of Manali.",
    itinerary: [
      "Day 1: Arrival in Manali and hotel check-in",
      "Day 2: Visit Solang Valley",
      "Day 3: Explore Manali town and Hadimba Temple",
      "Day 4: Visit nearby mountain attractions",
      "Day 5: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Local sightseeing",
      "Transportation for scheduled sightseeing"
    ],
    exclusions: [
      "Travel tickets to Manali",
      "Adventure activity charges",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 10,
    destination: "Manali",
    location: "Old Manali",
    title: "Old Manali Scenic Retreat",
    duration: 4,
    price: 13500,
    category: "Nature",
    rating: 4.6,
    description:
      "Enjoy mountain views, peaceful walks and the relaxed atmosphere of Old Manali.",
    itinerary: [
      "Day 1: Arrival and hotel check-in",
      "Day 2: Explore Old Manali and nearby cafés",
      "Day 3: Visit local viewpoints and nature spots",
      "Day 4: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Local sightseeing",
      "Scheduled transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Optional activities",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 11,
    destination: "Manali",
    location: "Rohtang Region",
    title: "Manali Snow Experience",
    duration: 5,
    price: 17500,
    category: "Adventure",
    rating: 4.8,
    description:
      "Experience mountain scenery and seasonal snow activities around Manali.",
    itinerary: [
      "Day 1: Arrival and hotel check-in",
      "Day 2: Local Manali sightseeing",
      "Day 3: Mountain and snow-region excursion",
      "Day 4: Leisure day and local shopping",
      "Day 5: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Mountain sightseeing",
      "Scheduled transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Seasonal activity charges",
      "Personal expenses",
      "Travel insurance"
    ]
  },

  /* =========================
     JAIPUR
  ========================= */
  {
    id: 12,
    destination: "Jaipur",
    location: "Amber Fort",
    title: "Royal Jaipur Tour",
    duration: 3,
    price: 9000,
    category: "Heritage",
    rating: 4.6,
    description:
      "Visit magnificent forts, palaces and historical places in Jaipur.",
    itinerary: [
      "Day 1: Arrival and visit City Palace",
      "Day 2: Explore Amber Fort and Hawa Mahal",
      "Day 3: Visit local attractions and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Heritage sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets to Jaipur",
      "Monument entry fees",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 13,
    destination: "Jaipur",
    location: "City Palace",
    title: "Jaipur Palace & Culture Escape",
    duration: 3,
    price: 9500,
    category: "Culture",
    rating: 4.7,
    description:
      "Experience Jaipur's royal heritage, colourful markets and traditional culture.",
    itinerary: [
      "Day 1: Arrival and City Palace visit",
      "Day 2: Explore local markets and heritage streets",
      "Day 3: Visit Hawa Mahal and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Heritage sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Monument entry fees",
      "Shopping expenses",
      "Travel insurance"
    ]
  },
  {
    id: 14,
    destination: "Jaipur",
    location: "Hawa Mahal",
    title: "Pink City Weekend",
    duration: 2,
    price: 7500,
    category: "Heritage",
    rating: 4.5,
    description:
      "Enjoy a short heritage getaway through the famous landmarks of the Pink City.",
    itinerary: [
      "Day 1: Arrival and Hawa Mahal sightseeing",
      "Day 2: Visit local markets and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "City sightseeing"
    ],
    exclusions: [
      "Travel tickets",
      "Entry fees",
      "Shopping expenses",
      "Personal expenses"
    ]
  },

  /* =========================
     OOTY
  ========================= */
  {
    id: 15,
    destination: "Ooty",
    location: "Ooty Lake",
    title: "Ooty Hill Station",
    duration: 3,
    price: 8000,
    category: "Nature",
    rating: 4.5,
    description:
      "Enjoy the cool climate, gardens and scenic beauty of Ooty.",
    itinerary: [
      "Day 1: Arrival and hotel check-in",
      "Day 2: Visit Ooty Botanical Garden and Ooty Lake",
      "Day 3: Explore nearby attractions and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Local sightseeing",
      "Scheduled transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Entry fees",
      "Personal expenses",
      "Travel insurance"
    ]
  },
  {
    id: 16,
    destination: "Ooty",
    location: "Coonoor",
    title: "Ooty & Coonoor Scenic Escape",
    duration: 4,
    price: 10500,
    category: "Nature",
    rating: 4.7,
    description:
      "Explore the green hills, gardens and peaceful scenery around Ooty and Coonoor.",
    itinerary: [
      "Day 1: Arrival in Ooty and hotel check-in",
      "Day 2: Explore Ooty gardens and lake",
      "Day 3: Visit Coonoor and scenic viewpoints",
      "Day 4: Breakfast and departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "Daily breakfast",
      "Hill-station sightseeing",
      "Local transportation"
    ],
    exclusions: [
      "Travel tickets",
      "Entry fees",
      "Personal expenses",
      "Travel insurance"
    ]
  }
,

  /* =========================
     MORE KERALA
  ========================= */
  {
    id: 17,
    destination: "Kerala",
    location: "Varkala",
    title: "Varkala Cliff & Beach Escape",
    duration: 3,
    price: 9200,
    category: "Beach",
    rating: 4.7,
    description: "Relax beside Varkala's famous cliffs, beaches and peaceful coastal views.",
    itinerary: [
      "Day 1: Arrival and Varkala beach visit",
      "Day 2: Explore the cliff and local attractions",
      "Day 3: Breakfast and departure"
    ],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Local sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Water activities", "Personal expenses", "Travel insurance"]
  },
  {
    id: 18,
    destination: "Kerala",
    location: "Kovalam",
    title: "Kovalam Coastal Holiday",
    duration: 3,
    price: 8800,
    category: "Beach",
    rating: 4.6,
    description: "Enjoy a relaxing coastal trip with beaches, sunsets and local Kerala experiences.",
    itinerary: [
      "Day 1: Arrival and Kovalam beach",
      "Day 2: Explore Lighthouse Beach and nearby attractions",
      "Day 3: Breakfast and departure"
    ],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Beach sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Water activities", "Personal expenses", "Travel insurance"]
  },
  {
    id: 19,
    destination: "Kerala",
    location: "Vagamon",
    title: "Vagamon Hills Retreat",
    duration: 3,
    price: 9000,
    category: "Nature",
    rating: 4.7,
    description: "Discover green meadows, misty hills and peaceful landscapes in Vagamon.",
    itinerary: [
      "Day 1: Arrival and hill-view sightseeing",
      "Day 2: Explore meadows and pine forest",
      "Day 3: Breakfast and departure"
    ],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Nature sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Adventure activities", "Personal expenses", "Travel insurance"]
  },

  /* =========================
     TAMIL NADU
  ========================= */
  {
    id: 20,
    destination: "Tamil Nadu",
    location: "Kodaikanal",
    title: "Kodaikanal Misty Hills",
    duration: 3,
    price: 8500,
    category: "Nature",
    rating: 4.7,
    description: "Enjoy cool weather, lakes and scenic hill views in Kodaikanal.",
    itinerary: ["Day 1: Arrival and Kodaikanal Lake", "Day 2: Explore Coaker's Walk and viewpoints", "Day 3: Breakfast and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Local sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Entry fees", "Personal expenses", "Travel insurance"]
  },
  {
    id: 21,
    destination: "Tamil Nadu",
    location: "Mahabalipuram",
    title: "Mahabalipuram Heritage Trail",
    duration: 2,
    price: 7000,
    category: "Heritage",
    rating: 4.6,
    description: "Explore ancient temples, shore monuments and the coastal heritage of Mahabalipuram.",
    itinerary: ["Day 1: Arrival and Shore Temple visit", "Day 2: Explore monuments and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Heritage sightseeing"],
    exclusions: ["Travel tickets", "Entry fees", "Personal expenses", "Travel insurance"]
  },
  {
    id: 22,
    destination: "Tamil Nadu",
    location: "Rameswaram",
    title: "Rameswaram Spiritual Journey",
    duration: 3,
    price: 7800,
    category: "Culture",
    rating: 4.6,
    description: "Visit important temples and coastal landmarks around Rameswaram.",
    itinerary: ["Day 1: Arrival and temple visit", "Day 2: Explore coastal landmarks", "Day 3: Breakfast and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Local sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Entry fees", "Personal expenses", "Travel insurance"]
  },
  {
    id: 23,
    destination: "Tamil Nadu",
    location: "Pondicherry",
    title: "Pondicherry French Quarter Escape",
    duration: 3,
    price: 8200,
    category: "Culture",
    rating: 4.7,
    description: "Enjoy the French Quarter, promenade, cafés and relaxed coastal atmosphere of Pondicherry.",
    itinerary: ["Day 1: Arrival and French Quarter", "Day 2: Explore Promenade Beach and local cafés", "Day 3: Breakfast and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Local sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Personal expenses", "Optional activities", "Travel insurance"]
  },

  /* =========================
     KARNATAKA
  ========================= */
  {
    id: 24,
    destination: "Karnataka",
    location: "Coorg",
    title: "Coorg Coffee Hills Retreat",
    duration: 3,
    price: 9500,
    category: "Nature",
    rating: 4.8,
    description: "Explore coffee plantations, waterfalls and green hills in Coorg.",
    itinerary: ["Day 1: Arrival and plantation visit", "Day 2: Explore waterfalls and viewpoints", "Day 3: Breakfast and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Nature sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Entry fees", "Personal expenses", "Travel insurance"]
  },
  {
    id: 25,
    destination: "Karnataka",
    location: "Mysore",
    title: "Mysore Palace & Culture Tour",
    duration: 2,
    price: 7200,
    category: "Heritage",
    rating: 4.7,
    description: "Discover Mysore Palace, local markets and the cultural heritage of Mysore.",
    itinerary: ["Day 1: Arrival and Mysore Palace", "Day 2: Explore markets and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Heritage sightseeing"],
    exclusions: ["Travel tickets", "Entry fees", "Shopping expenses", "Travel insurance"]
  },
  {
    id: 26,
    destination: "Karnataka",
    location: "Hampi",
    title: "Hampi Ancient Ruins Explorer",
    duration: 3,
    price: 8900,
    category: "Heritage",
    rating: 4.8,
    description: "Explore the remarkable ruins, temples and landscapes of historic Hampi.",
    itinerary: ["Day 1: Arrival and local ruins", "Day 2: Explore temples and heritage sites", "Day 3: Breakfast and departure"],
    inclusions: ["Hotel accommodation", "Daily breakfast", "Heritage sightseeing", "Local transportation"],
    exclusions: ["Travel tickets", "Entry fees", "Personal expenses", "Travel insurance"]
  }
];

const packageImages = {
  1: "https://images.unsplash.com/photo-1672219386269-486cbbe9a50f?auto=format&fit=crop&w=800&q=75", // Munnar tea hills
  2: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=75", // Alleppey backwaters
  3: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=75", // Wayanad waterfalls
  4: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=75", // Kochi coast
  5: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=75", // Thekkady wildlife
  6: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75", // Baga beach
  7: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=75", // Calangute coast
  8: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=75", // Panaji coast
  9: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=75", // Solang Valley
  10: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=75", // Old Manali scenery
  11: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=75", // Rohtang mountains
  12: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=75", // Amber Fort
  13: "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=800&q=75", // Jaipur palace
  14: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=75", // Hawa Mahal
  15: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=75", // Ooty lake and hills
  16: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=75", // Coonoor hills
  17: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75", // Varkala beach
  18: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=75", // Kovalam beach
  19: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=75", // Vagamon hills
  20: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=75", // Kodaikanal hills
  21: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=75", // Mahabalipuram heritage
  22: "https://images.unsplash.com/photo-1741798234436-5f2ab79da88a?auto=format&fit=crop&w=800&q=75", // Rameswaram temple
  23: "https://www.pelago.com/img/products/IN-India/stroll-through-the-french-quarters-of-pondicherry/96456462-4fdd-4889-97f6-e84ff421c893_stroll-through-the-french-quarters-of-pondicherry-xlarge.jpg", // Pondicherry French Quarter
  24: "https://www.tripplannersindia.com/assets/blog/images/thingstodoincoorg/Coffee_Plantation_Tour.webp", // Coorg coffee plantation
  25: "https://images.unsplash.com/photo-1657856855186-7cf4909a4f78?auto=format&fit=crop&w=800&q=75", // Mysore Palace
  26: "https://images.unsplash.com/photo-1667115788157-72f063f2a7a3?auto=format&fit=crop&w=800&q=75" // Hampi ruins
};

export const packagesWithImages = packages.map((pkg) => ({
  ...pkg,
  image: pkg.image || packageImages[pkg.id]
}));

export { packagesWithImages as packages };

