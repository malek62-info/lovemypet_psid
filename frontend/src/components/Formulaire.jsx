import React, { useState } from "react";
import { Sparkles } from "lucide-react";

const Formulaire = () => {
  const [formData, setFormData] = useState({
    Type: 0,
    Age: 0,
    PureBreed: 0,
    Breed1: 0,
    Breed2: 0,
    Color1: 0,
    Color2: 0,
    MaturitySize: 0,
    FurLength: 0,
    Vaccinated: 0,
    Dewormed: 0,
    Sterilized: 0,
    PhotoAmt: 0,
    VideoAmt: 0,
    Fee: 0,
    Health: 0,
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const cat = [
    {
      "id": 241,
      "name": "Abyssinian",
      "type": 2
    },
    {
      "id": 242,
      "name": "American Curl",
      "type": 2
    },
    {
      "id": 243,
      "name": "American Shorthair",
      "type": 2
    },
    {
      "id": 244,
      "name": "American Wirehair",
      "type": 2
    },
    {
      "id": 245,
      "name": "Applehead Siamese",
      "type": 2
    },
    {
      "id": 246,
      "name": "Balinese",
      "type": 2
    },
    {
      "id": 247,
      "name": "Bengal",
      "type": 2
    },
    {
      "id": 248,
      "name": "Birman",
      "type": 2
    },
    {
      "id": 249,
      "name": "Bobtail",
      "type": 2
    },
    {
      "id": 250,
      "name": "Bombay",
      "type": 2
    },
    {
      "id": 251,
      "name": "British Shorthair",
      "type": 2
    },
    {
      "id": 252,
      "name": "Burmese",
      "type": 2
    },
    {
      "id": 253,
      "name": "Burmilla",
      "type": 2
    },
    {
      "id": 254,
      "name": "Calico",
      "type": 2
    },
    {
      "id": 255,
      "name": "Canadian Hairless",
      "type": 2
    },
    {
      "id": 256,
      "name": "Chartreux",
      "type": 2
    },
    {
      "id": 257,
      "name": "Chausie",
      "type": 2
    },
    {
      "id": 258,
      "name": "Chinchilla",
      "type": 2
    },
    {
      "id": 259,
      "name": "Cornish Rex",
      "type": 2
    },
    {
      "id": 260,
      "name": "Cymric",
      "type": 2
    },
    {
      "id": 261,
      "name": "Devon Rex",
      "type": 2
    },
    {
      "id": 262,
      "name": "Dilute Calico",
      "type": 2
    },
    {
      "id": 263,
      "name": "Dilute Tortoiseshell",
      "type": 2
    },
    {
      "id": 264,
      "name": "Domestic Long Hair",
      "type": 2
    },
    {
      "id": 265,
      "name": "Domestic Medium Hair",
      "type": 2
    },
    {
      "id": 266,
      "name": "Domestic Short Hair",
      "type": 2
    },
    {
      "id": 267,
      "name": "Egyptian Mau",
      "type": 2
    },
    {
      "id": 268,
      "name": "Exotic Shorthair",
      "type": 2
    },
    {
      "id": 269,
      "name": "Extra-Toes Cat (Hemingway Polydactyl)",
      "type": 2
    },
    {
      "id": 270,
      "name": "Havana",
      "type": 2
    },
    {
      "id": 271,
      "name": "Himalayan",
      "type": 2
    },
    {
      "id": 272,
      "name": "Japanese Bobtail",
      "type": 2
    },
    {
      "id": 273,
      "name": "Javanese",
      "type": 2
    },
    {
      "id": 274,
      "name": "Korat",
      "type": 2
    },
    {
      "id": 275,
      "name": "LaPerm",
      "type": 2
    },
    {
      "id": 276,
      "name": "Maine Coon",
      "type": 2
    },
    {
      "id": 277,
      "name": "Manx",
      "type": 2
    },
    {
      "id": 278,
      "name": "Munchkin",
      "type": 2
    },
    {
      "id": 279,
      "name": "Nebelung",
      "type": 2
    },
    {
      "id": 280,
      "name": "Norwegian Forest Cat",
      "type": 2
    },
    {
      "id": 281,
      "name": "Ocicat",
      "type": 2
    },
    {
      "id": 282,
      "name": "Oriental Long Hair",
      "type": 2
    },
    {
      "id": 283,
      "name": "Oriental Short Hair",
      "type": 2
    },
    {
      "id": 284,
      "name": "Oriental Tabby",
      "type": 2
    },
    {
      "id": 285,
      "name": "Persian",
      "type": 2
    },
    {
      "id": 286,
      "name": "Pixie-Bob",
      "type": 2
    },
    {
      "id": 287,
      "name": "Ragamuffin",
      "type": 2
    },
    {
      "id": 288,
      "name": "Ragdoll",
      "type": 2
    },
    {
      "id": 289,
      "name": "Russian Blue",
      "type": 2
    },
    {
      "id": 290,
      "name": "Scottish Fold",
      "type": 2
    },
    {
      "id": 291,
      "name": "Selkirk Rex",
      "type": 2
    },
    {
      "id": 292,
      "name": "Siamese",
      "type": 2
    },
    {
      "id": 293,
      "name": "Siberian",
      "type": 2
    },
    {
      "id": 294,
      "name": "Silver",
      "type": 2
    },
    {
      "id": 295,
      "name": "Singapura",
      "type": 2
    },
    {
      "id": 296,
      "name": "Snowshoe",
      "type": 2
    },
    {
      "id": 297,
      "name": "Somali",
      "type": 2
    },
    {
      "id": 298,
      "name": "Sphynx (hairless cat)",
      "type": 2
    },
    {
      "id": 299,
      "name": "Tabby",
      "type": 2
    },
    {
      "id": 300,
      "name": "Tiger",
      "type": 2
    },
    {
      "id": 301,
      "name": "Tonkinese",
      "type": 2
    },
    {
      "id": 302,
      "name": "Torbie",
      "type": 2
    },
    {
      "id": 303,
      "name": "Tortoiseshell",
      "type": 2
    },
    {
      "id": 304,
      "name": "Turkish Angora",
      "type": 2
    },
    {
      "id": 305,
      "name": "Turkish Van",
      "type": 2
    },
    {
      "id": 306,
      "name": "Tuxedo",
      "type": 2
    }
  ];

  const race_dog = [
    {
      "id": 1,
      "name": "Affenpinscher",
      "type": 1
    },
    {
      "id": 2,
      "name": "Afghan Hound",
      "type": 1
    },
    {
      "id": 3,
      "name": "Airedale Terrier",
      "type": 1
    },
    {
      "id": 4,
      "name": "Akbash",
      "type": 1
    },
    {
      "id": 5,
      "name": "Akita",
      "type": 1
    },
    {
      "id": 6,
      "name": "Alaskan Malamute",
      "type": 1
    },
    {
      "id": 7,
      "name": "American Bulldog",
      "type": 1
    },
    {
      "id": 8,
      "name": "American Eskimo Dog",
      "type": 1
    },
    {
      "id": 9,
      "name": "American Hairless Terrier",
      "type": 1
    },
    {
      "id": 10,
      "name": "American Staffordshire Terrier",
      "type": 1
    },
    {
      "id": 11,
      "name": "American Water Spaniel",
      "type": 1
    },
    {
      "id": 12,
      "name": "Anatolian Shepherd",
      "type": 1
    },
    {
      "id": 13,
      "name": "Appenzell Mountain Dog",
      "type": 1
    },
    {
      "id": 14,
      "name": "Australian Cattle Dog/Blue Heeler",
      "type": 1
    },
    {
      "id": 15,
      "name": "Australian Kelpie",
      "type": 1
    },
    {
      "id": 16,
      "name": "Australian Shepherd",
      "type": 1
    },
    {
      "id": 17,
      "name": "Australian Terrier",
      "type": 1
    },
    {
      "id": 18,
      "name": "Basenji",
      "type": 1
    },
    {
      "id": 19,
      "name": "Basset Hound",
      "type": 1
    },
    {
      "id": 20,
      "name": "Beagle",
      "type": 1
    },
    {
      "id": 21,
      "name": "Bearded Collie",
      "type": 1
    },
    {
      "id": 22,
      "name": "Beauceron",
      "type": 1
    },
    {
      "id": 23,
      "name": "Bedlington Terrier",
      "type": 1
    },
    {
      "id": 24,
      "name": "Belgian Shepherd Dog Sheepdog",
      "type": 1
    },
    {
      "id": 25,
      "name": "Belgian Shepherd Laekenois",
      "type": 1
    },
    {
      "id": 26,
      "name": "Belgian Shepherd Malinois",
      "type": 1
    },
    {
      "id": 27,
      "name": "Belgian Shepherd Tervuren",
      "type": 1
    },
    {
      "id": 28,
      "name": "Bernese Mountain Dog",
      "type": 1
    },
    {
      "id": 29,
      "name": "Bichon Frise",
      "type": 1
    },
    {
      "id": 30,
      "name": "Black and Tan Coonhound",
      "type": 1
    },
    {
      "id": 31,
      "name": "Black Labrador Retriever",
      "type": 1
    },
    {
      "id": 32,
      "name": "Black Mouth Cur",
      "type": 1
    },
    {
      "id": 33,
      "name": "Black Russian Terrier",
      "type": 1
    },
    {
      "id": 34,
      "name": "Bloodhound",
      "type": 1
    },
    {
      "id": 35,
      "name": "Blue Lacy",
      "type": 1
    },
    {
      "id": 36,
      "name": "Bluetick Coonhound",
      "type": 1
    },
    {
      "id": 37,
      "name": "Boerboel",
      "type": 1
    },
    {
      "id": 38,
      "name": "Bolognese",
      "type": 1
    },
    {
      "id": 39,
      "name": "Border Collie",
      "type": 1
    },
    {
      "id": 40,
      "name": "Border Terrier",
      "type": 1
    },
    {
      "id": 41,
      "name": "Borzoi",
      "type": 1
    },
    {
      "id": 42,
      "name": "Boston Terrier",
      "type": 1
    },
    {
      "id": 43,
      "name": "Bouvier des Flanders",
      "type": 1
    },
    {
      "id": 44,
      "name": "Boxer",
      "type": 1
    },
    {
      "id": 45,
      "name": "Boykin Spaniel",
      "type": 1
    },
    {
      "id": 46,
      "name": "Briard",
      "type": 1
    },
    {
      "id": 47,
      "name": "Brittany Spaniel",
      "type": 1
    },
    {
      "id": 48,
      "name": "Brussels Griffon",
      "type": 1
    },
    {
      "id": 49,
      "name": "Bull Terrier",
      "type": 1
    },
    {
      "id": 50,
      "name": "Bullmastiff",
      "type": 1
    },
    {
      "id": 51,
      "name": "Cairn Terrier",
      "type": 1
    },
    {
      "id": 52,
      "name": "Canaan Dog",
      "type": 1
    },
    {
      "id": 53,
      "name": "Cane Corso Mastiff",
      "type": 1
    },
    {
      "id": 54,
      "name": "Carolina Dog",
      "type": 1
    },
    {
      "id": 55,
      "name": "Catahoula Leopard Dog",
      "type": 1
    },
    {
      "id": 56,
      "name": "Cattle Dog",
      "type": 1
    },
    {
      "id": 57,
      "name": "Caucasian Sheepdog (Caucasian Ovtcharka)",
      "type": 1
    },
    {
      "id": 58,
      "name": "Cavalier King Charles Spaniel",
      "type": 1
    },
    {
      "id": 59,
      "name": "Chesapeake Bay Retriever",
      "type": 1
    },
    {
      "id": 60,
      "name": "Chihuahua",
      "type": 1
    },
    {
      "id": 61,
      "name": "Chinese Crested Dog",
      "type": 1
    },
    {
      "id": 62,
      "name": "Chinese Foo Dog",
      "type": 1
    },
    {
      "id": 63,
      "name": "Chinook",
      "type": 1
    },
    {
      "id": 64,
      "name": "Chocolate Labrador Retriever",
      "type": 1
    },
    {
      "id": 65,
      "name": "Chow Chow",
      "type": 1
    },
    {
      "id": 66,
      "name": "Cirneco dell'Etna",
      "type": 1
    },
    {
      "id": 67,
      "name": "Clumber Spaniel",
      "type": 1
    },
    {
      "id": 68,
      "name": "Cockapoo",
      "type": 1
    },
    {
      "id": 69,
      "name": "Cocker Spaniel",
      "type": 1
    },
    {
      "id": 70,
      "name": "Collie",
      "type": 1
    },
    {
      "id": 71,
      "name": "Coonhound",
      "type": 1
    },
    {
      "id": 72,
      "name": "Corgi",
      "type": 1
    },
    {
      "id": 73,
      "name": "Coton de Tulear",
      "type": 1
    },
    {
      "id": 74,
      "name": "Curly-Coated Retriever",
      "type": 1
    },
    {
      "id": 75,
      "name": "Dachshund",
      "type": 1
    },
    {
      "id": 76,
      "name": "Dalmatian",
      "type": 1
    },
    {
      "id": 77,
      "name": "Dandi Dinmont Terrier",
      "type": 1
    },
    {
      "id": 78,
      "name": "Doberman Pinscher",
      "type": 1
    },
    {
      "id": 79,
      "name": "Dogo Argentino",
      "type": 1
    },
    {
      "id": 80,
      "name": "Dogue de Bordeaux",
      "type": 1
    },
    {
      "id": 81,
      "name": "Dutch Shepherd",
      "type": 1
    },
    {
      "id": 82,
      "name": "English Bulldog",
      "type": 1
    },
    {
      "id": 83,
      "name": "English Cocker Spaniel",
      "type": 1
    },
    {
      "id": 84,
      "name": "English Coonhound",
      "type": 1
    },
    {
      "id": 85,
      "name": "English Pointer",
      "type": 1
    },
    {
      "id": 86,
      "name": "English Setter",
      "type": 1
    },
    {
      "id": 87,
      "name": "English Shepherd",
      "type": 1
    },
    {
      "id": 88,
      "name": "English Springer Spaniel",
      "type": 1
    },
    {
      "id": 89,
      "name": "English Toy Spaniel",
      "type": 1
    },
    {
      "id": 90,
      "name": "Entlebucher",
      "type": 1
    },
    {
      "id": 91,
      "name": "Eskimo Dog",
      "type": 1
    },
    {
      "id": 92,
      "name": "Feist",
      "type": 1
    },
    {
      "id": 93,
      "name": "Field Spaniel",
      "type": 1
    },
    {
      "id": 94,
      "name": "Fila Brasileiro",
      "type": 1
    },
    {
      "id": 95,
      "name": "Finnish Lapphund",
      "type": 1
    },
    {
      "id": 96,
      "name": "Finnish Spitz",
      "type": 1
    },
    {
      "id": 97,
      "name": "Flat-coated Retriever",
      "type": 1
    },
    {
      "id": 98,
      "name": "Fox Terrier",
      "type": 1
    },
    {
      "id": 99,
      "name": "Foxhound",
      "type": 1
    },
    {
      "id": 100,
      "name": "French Bulldog",
      "type": 1
    },
    {
      "id": 101,
      "name": "Galgo Spanish Greyhound",
      "type": 1
    },
    {
      "id": 102,
      "name": "German Pinscher",
      "type": 1
    },
    {
      "id": 103,
      "name": "German Shepherd Dog",
      "type": 1
    },
    {
      "id": 104,
      "name": "German Shorthaired Pointer",
      "type": 1
    },
    {
      "id": 105,
      "name": "German Spitz",
      "type": 1
    },
    {
      "id": 106,
      "name": "German Wirehaired Pointer",
      "type": 1
    },
    {
      "id": 107,
      "name": "Giant Schnauzer",
      "type": 1
    },
    {
      "id": 108,
      "name": "Glen of Imaal Terrier",
      "type": 1
    },
    {
      "id": 109,
      "name": "Golden Retriever",
      "type": 1
    },
    {
      "id": 110,
      "name": "Gordon Setter",
      "type": 1
    },
    {
      "id": 111,
      "name": "Great Dane",
      "type": 1
    },
    {
      "id": 112,
      "name": "Great Pyrenees",
      "type": 1
    },
    {
      "id": 113,
      "name": "Greater Swiss Mountain Dog",
      "type": 1
    },
    {
      "id": 114,
      "name": "Greyhound",
      "type": 1
    },
    {
      "id": 115,
      "name": "Harrier",
      "type": 1
    },
    {
      "id": 116,
      "name": "Havanese",
      "type": 1
    },
    {
      "id": 117,
      "name": "Hound",
      "type": 1
    },
    {
      "id": 118,
      "name": "Hovawart",
      "type": 1
    },
    {
      "id": 119,
      "name": "Husky",
      "type": 1
    },
    {
      "id": 120,
      "name": "Ibizan Hound",
      "type": 1
    },
    {
      "id": 121,
      "name": "Illyrian Sheepdog",
      "type": 1
    },
    {
      "id": 122,
      "name": "Irish Setter",
      "type": 1
    },
    {
      "id": 123,
      "name": "Irish Terrier",
      "type": 1
    },
    {
      "id": 124,
      "name": "Irish Water Spaniel",
      "type": 1
    },
    {
      "id": 125,
      "name": "Irish Wolfhound",
      "type": 1
    },
    {
      "id": 126,
      "name": "Italian Greyhound",
      "type": 1
    },
    {
      "id": 127,
      "name": "Italian Spinone",
      "type": 1
    },
    {
      "id": 128,
      "name": "Jack Russell Terrier",
      "type": 1
    },
    {
      "id": 129,
      "name": "Jack Russell Terrier (Parson Russell Terrier)",
      "type": 1
    },
    {
      "id": 130,
      "name": "Japanese Chin",
      "type": 1
    },
    {
      "id": 131,
      "name": "Jindo",
      "type": 1
    },
    {
      "id": 132,
      "name": "Kai Dog",
      "type": 1
    },
    {
      "id": 133,
      "name": "Karelian Bear Dog",
      "type": 1
    },
    {
      "id": 134,
      "name": "Keeshond",
      "type": 1
    },
    {
      "id": 135,
      "name": "Kerry Blue Terrier",
      "type": 1
    },
    {
      "id": 136,
      "name": "Kishu",
      "type": 1
    },
    {
      "id": 137,
      "name": "Klee Kai",
      "type": 1
    },
    {
      "id": 138,
      "name": "Komondor",
      "type": 1
    },
    {
      "id": 139,
      "name": "Kuvasz",
      "type": 1
    },
    {
      "id": 140,
      "name": "Kyi Leo",
      "type": 1
    },
    {
      "id": 141,
      "name": "Labrador Retriever",
      "type": 1
    },
    {
      "id": 142,
      "name": "Lakeland Terrier",
      "type": 1
    },
    {
      "id": 143,
      "name": "Lancashire Heeler",
      "type": 1
    },
    {
      "id": 144,
      "name": "Leonberger",
      "type": 1
    },
    {
      "id": 145,
      "name": "Lhasa Apso",
      "type": 1
    },
    {
      "id": 146,
      "name": "Lowchen",
      "type": 1
    },
    {
      "id": 147,
      "name": "Maltese",
      "type": 1
    },
    {
      "id": 148,
      "name": "Manchester Terrier",
      "type": 1
    },
    {
      "id": 149,
      "name": "Maremma Sheepdog",
      "type": 1
    },
    {
      "id": 150,
      "name": "Mastiff",
      "type": 1
    },
    {
      "id": 151,
      "name": "McNab",
      "type": 1
    },
    {
      "id": 152,
      "name": "Miniature Pinscher",
      "type": 1
    },
    {
      "id": 153,
      "name": "Mountain Cur",
      "type": 1
    },
    {
      "id": 154,
      "name": "Mountain Dog",
      "type": 1
    },
    {
      "id": 155,
      "name": "Munsterlander",
      "type": 1
    },
    {
      "id": 156,
      "name": "Neapolitan Mastiff",
      "type": 1
    },
    {
      "id": 157,
      "name": "New Guinea Singing Dog",
      "type": 1
    },
    {
      "id": 158,
      "name": "Newfoundland Dog",
      "type": 1
    },
    {
      "id": 159,
      "name": "Norfolk Terrier",
      "type": 1
    },
    {
      "id": 160,
      "name": "Norwegian Buhund",
      "type": 1
    },
    {
      "id": 161,
      "name": "Norwegian Elkhound",
      "type": 1
    },
    {
      "id": 162,
      "name": "Norwegian Lundehund",
      "type": 1
    },
    {
      "id": 163,
      "name": "Norwich Terrier",
      "type": 1
    },
    {
      "id": 164,
      "name": "Nova Scotia Duck-Tolling Retriever",
      "type": 1
    },
    {
      "id": 165,
      "name": "Old English Sheepdog",
      "type": 1
    },
    {
      "id": 166,
      "name": "Otterhound",
      "type": 1
    },
    {
      "id": 167,
      "name": "Papillon",
      "type": 1
    },
    {
      "id": 168,
      "name": "Patterdale Terrier (Fell Terrier)",
      "type": 1
    },
    {
      "id": 169,
      "name": "Pekingese",
      "type": 1
    },
    {
      "id": 170,
      "name": "Peruvian Inca Orchid",
      "type": 1
    },
    {
      "id": 171,
      "name": "Petit Basset Griffon Vendeen",
      "type": 1
    },
    {
      "id": 172,
      "name": "Pharaoh Hound",
      "type": 1
    },
    {
      "id": 173,
      "name": "Pit Bull Terrier",
      "type": 1
    },
    {
      "id": 174,
      "name": "Plott Hound",
      "type": 1
    },
    {
      "id": 175,
      "name": "Podengo Portugueso",
      "type": 1
    },
    {
      "id": 176,
      "name": "Pointer",
      "type": 1
    },
    {
      "id": 177,
      "name": "Polish Lowland Sheepdog",
      "type": 1
    },
    {
      "id": 178,
      "name": "Pomeranian",
      "type": 1
    },
    {
      "id": 179,
      "name": "Poodle",
      "type": 1
    },
    {
      "id": 180,
      "name": "Portuguese Water Dog",
      "type": 1
    },
    {
      "id": 181,
      "name": "Presa Canario",
      "type": 1
    },
    {
      "id": 182,
      "name": "Pug",
      "type": 1
    },
    {
      "id": 183,
      "name": "Puli",
      "type": 1
    },
    {
      "id": 184,
      "name": "Pumi",
      "type": 1
    },
    {
      "id": 185,
      "name": "Rat Terrier",
      "type": 1
    },
    {
      "id": 186,
      "name": "Redbone Coonhound",
      "type": 1
    },
    {
      "id": 187,
      "name": "Retriever",
      "type": 1
    },
    {
      "id": 188,
      "name": "Rhodesian Ridgeback",
      "type": 1
    },
    {
      "id": 189,
      "name": "Rottweiler",
      "type": 1
    },
    {
      "id": 190,
      "name": "Saint Bernard",
      "type": 1
    },
    {
      "id": 191,
      "name": "Saluki",
      "type": 1
    },
    {
      "id": 192,
      "name": "Samoyed",
      "type": 1
    },
    {
      "id": 193,
      "name": "Sarplaninac",
      "type": 1
    },
    {
      "id": 194,
      "name": "Schipperke",
      "type": 1
    },
    {
      "id": 195,
      "name": "Schnauzer",
      "type": 1
    },
    {
      "id": 196,
      "name": "Scottish Deerhound",
      "type": 1
    },
    {
      "id": 197,
      "name": "Scottish Terrier Scottie",
      "type": 1
    },
    {
      "id": 198,
      "name": "Sealyham Terrier",
      "type": 1
    },
    {
      "id": 199,
      "name": "Setter",
      "type": 1
    },
    {
      "id": 200,
      "name": "Shar Pei",
      "type": 1
    },
    {
      "id": 201,
      "name": "Sheep Dog",
      "type": 1
    },
    {
      "id": 202,
      "name": "Shepherd",
      "type": 1
    },
    {
      "id": 203,
      "name": "Shetland Sheepdog Sheltie",
      "type": 1
    },
    {
      "id": 204,
      "name": "Shiba Inu",
      "type": 1
    },
    {
      "id": 205,
      "name": "Shih Tzu",
      "type": 1
    },
    {
      "id": 206,
      "name": "Siberian Husky",
      "type": 1
    },
    {
      "id": 207,
      "name": "Silky Terrier",
      "type": 1
    },
    {
      "id": 208,
      "name": "Skye Terrier",
      "type": 1
    },
    {
      "id": 209,
      "name": "Sloughi",
      "type": 1
    },
    {
      "id": 210,
      "name": "Smooth Fox Terrier",
      "type": 1
    },
    {
      "id": 211,
      "name": "South Russian Ovtcharka",
      "type": 1
    },
    {
      "id": 212,
      "name": "Spaniel",
      "type": 1
    },
    {
      "id": 213,
      "name": "Spitz",
      "type": 1
    },
    {
      "id": 214,
      "name": "Staffordshire Bull Terrier",
      "type": 1
    },
    {
      "id": 215,
      "name": "Standard Poodle",
      "type": 1
    },
    {
      "id": 216,
      "name": "Sussex Spaniel",
      "type": 1
    },
    {
      "id": 217,
      "name": "Swedish Vallhund",
      "type": 1
    },
    {
      "id": 218,
      "name": "Terrier",
      "type": 1
    },
    {
      "id": 219,
      "name": "Thai Ridgeback",
      "type": 1
    },
    {
      "id": 220,
      "name": "Tibetan Mastiff",
      "type": 1
    },
    {
      "id": 221,
      "name": "Tibetan Spaniel",
      "type": 1
    },
    {
      "id": 222,
      "name": "Tibetan Terrier",
      "type": 1
    },
    {
      "id": 223,
      "name": "Tosa Inu",
      "type": 1
    },
    {
      "id": 224,
      "name": "Toy Fox Terrier",
      "type": 1
    },
    {
      "id": 225,
      "name": "Treeing Walker Coonhound",
      "type": 1
    },
    {
      "id": 226,
      "name": "Vizsla",
      "type": 1
    },
    {
      "id": 227,
      "name": "Weimaraner",
      "type": 1
    },
    {
      "id": 228,
      "name": "Welsh Corgi",
      "type": 1
    },
    {
      "id": 229,
      "name": "Welsh Springer Spaniel",
      "type": 1
    },
    {
      "id": 230,
      "name": "Welsh Terrier",
      "type": 1
    },
    {
      "id": 231,
      "name": "West Highland White Terrier Westie",
      "type": 1
    },
    {
      "id": 232,
      "name": "Wheaten Terrier",
      "type": 1
    },
    {
      "id": 233,
      "name": "Whippet",
      "type": 1
    },
    {
      "id": 234,
      "name": "White German Shepherd",
      "type": 1
    },
    {
      "id": 235,
      "name": "Wire Fox Terrier",
      "type": 1
    },
    {
      "id": 236,
      "name": "Wire-haired Pointing Griffon",
      "type": 1
    },
    {
      "id": 237,
      "name": "Wirehaired Terrier",
      "type": 1
    },
    {
      "id": 238,
      "name": "Xoloitzcuintle/Mexican Hairless",
      "type": 1
    },
    {
      "id": 239,
      "name": "Yellow Labrador Retriever",
      "type": 1
    },
    {
      "id": 240,
      "name": "Yorkshire Terrier Yorkie",
      "type": 1
    },
    {
      "id": 307,
      "name": "Mixed Breed",
      "type": 1
    }
  ];

  const colors = [
    { id: 0, name: "aucune couleur" }, // pour Color2
    { id: 1, name: "Black" },
    { id: 2, name: "Brown" },
    { id: 3, name: "Golden" },
    { id: 4, name: "Yellow" },
    { id: 5, name: "Cream" },
    { id: 6, name: "Gray" },
    { id: 7, name: "White" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "PureBreed") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
        Breed2: value === "1" ? 0 : prev.Breed2,
      }));
    } else if (name === "Breed1") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
        Breed2: prev.Breed2 === Number(value) ? 0 : prev.Breed2,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  const handleSubmit = async () => {
    // Vérification que tous les champs sont remplis
    for (let key in formData) {
      if (
        formData[key] === "" ||
        formData[key] === null ||
        formData[key] === undefined
      ) {
        alert(`Le champ ${key} est vide, veuillez le remplir.`);
        return;
      }
    }

    setLoading(true);
    setApiResponse(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête API");
      }

      const data = await response.json();
      setApiResponse(data);
      console.log(data);

      // Afficher la modale après la réponse
      const modal = document.getElementById("my_modal_3").showModal();
    } catch (error) {
      console.error(error);
      setApiResponse({ error: "Une erreur est survenue lors de l'envoi." });
    } finally {
      setLoading(false);
    }
  };

  const breedOptions =
    formData.Type === 1 ? race_dog : formData.Type === 2 ? cat : [];

  return (
    <div className="flex justify-center  h-screen w-full">
      <div className="w-2/3 border border-primary rounded-3xl h-fit p-5">
        <div className="gap-4 grid grid-cols-4 w-full ">
          {/* Type */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Type </div>
            <select
              className="select select-primary"
              name="Type"
              value={formData.Type}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Chien</option>
              <option value="2">Chat</option>
            </select>
          </div>

          {/* Age */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Age </div>
            <input
              className="input input-primary"
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Health */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">État de santé </div>
            <select
              className="select select-primary"
              name="Health"
              value={formData.Health}
              onChange={handleChange}
            >
              <option value="0">Non précisé</option>
              <option value="1">En bonne santé</option>
              <option value="2">Blessure légère</option>
              <option value="3">Blessure grave</option>
            </select>
          </div>

          {/* PureBreed */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Pure race ?</div>
            <select
              className="select select-primary"
              name="PureBreed"
              value={formData.PureBreed}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Oui</option>
              <option value="2">Non</option>
            </select>
          </div>

          {/* Breed1 */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Race principale </div>
            <select
              className="select select-primary"
              name="Breed1"
              value={formData.Breed1}
              onChange={handleChange}
              disabled={formData.Type === 0}
            >
              <option value="0">Sélectionner</option>
              {breedOptions.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </select>
          </div>

          {/* Breed2 */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Race secondaire </div>
            <select
              className="select select-primary"
              name="Breed2"
              value={formData.Breed2}
              onChange={handleChange}
              disabled={formData.Type === 0 || formData.PureBreed === 1}
            >
              <option value="0">Sélectionner</option>
              {breedOptions
                .filter((breed) => breed.id !== formData.Breed1)
                .map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Color1 */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Couleur principale </div>
            <select
              className="select select-primary"
              name="Color1"
              value={formData.Color1}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color2 */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Couleur secondaire </div>
            <select
              className="select select-primary"
              name="Color2"
              value={formData.Color2}
              onChange={handleChange}
            >
              <option value="0">aucune couleur</option>
              {colors
                .filter(
                  (color) => color.id !== 0 && color.id !== formData.Color1
                )
                .map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
            </select>
          </div>

          {/* MaturitySize */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Taille adulte </div>
            <select
              className="select select-primary"
              name="MaturitySize"
              value={formData.MaturitySize}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Small</option>
              <option value="2">Medium</option>
              <option value="3">Large</option>
            </select>
          </div>

          {/* FurLength */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Longueur des poils </div>
            <select
              className="select select-primary"
              name="FurLength"
              value={formData.FurLength}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Short</option>
              <option value="2">Medium</option>
              <option value="3">Long</option>
            </select>
          </div>

          {/* Vaccinated */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Vacciné </div>
            <select
              className="select select-primary"
              name="Vaccinated"
              value={formData.Vaccinated}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Oui</option>
              <option value="2">Non</option>
            </select>
          </div>

          {/* Dewormed */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Vermifugé </div>
            <select
              className="select select-primary"
              name="Dewormed"
              value={formData.Dewormed}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Oui</option>
              <option value="2">Non</option>
            </select>
          </div>

          {/* Sterilized */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Stérilisé </div>
            <select
              className="select select-primary"
              name="Sterilized"
              value={formData.Sterilized}
              onChange={handleChange}
            >
              <option value="0">Sélectionner</option>
              <option value="1">Oui</option>
              <option value="2">Non</option>
            </select>
          </div>

          {/* PhotoAmt */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Nombre de photos </div>
            <input
              className="input input-primary"
              type="number"
              name="PhotoAmt"
              value={formData.PhotoAmt}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* PhotoAmt */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Nombre de video </div>
            <input
              className="input input-primary"
              type="number"
              name="VideoAmt"
              value={formData.VideoAmt}
              onChange={handleChange}
              min="0"
            />
          </div>
          {/* Fee */}
          <div className="flex flex-col space-y-2">
            <div className="badge  badge-soft badge-primary ">Frais d'adoption </div>
            <input
              className="input input-primary"
              type="number"
              name="Fee"
              value={formData.Fee}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} className="btn btn-primary w-fit mt-4">
          <Sparkles strokeWidth={1} className="w-4 h-4 " />
          Prédire la vitesse d'adoption
        </button>
      </div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {apiResponse && (
            <div className="mt-6 p-4  rounded-lg flex items-center flex-col">
              <div className="wiggle-animation">
                <Sparkles strokeWidth={1} className="w-30 h-30 text-primary" />
              </div>

              <div className="flex flex-col ">
                <p className="text-lg font-bold text-center mb-4">
                  {apiResponse.prediction === 0
                    ? "Adoption prévue entre 1 et 30 jours"
                    : "Adoption prévue entre 31 et 100 jours"}
                </p>

                <div className="w-full flex space-x-4 items-center">
                  <div className="w-1/2 flex-col bg-base-200 p-5 rounded-3xl">
                    <span className="text-sm ">
                      Probabilité d'adoption rapide
                    </span>
                    <div className="stat-value">
                      {`${(apiResponse.proba_rapide_adoption * 100).toFixed(
                        1
                      )}%`}
                    </div>
                  </div>

                  <div className="w-1/2 flex-col ml-4  bg-base-200  p-5 rounded-3xl">
                    <span className="text-sm ">
                      Probabilité d'adoption lente
                    </span>
                    <div className="stat-value">
                      {`${(apiResponse.proba_lente_adoption * 100).toFixed(
                        1
                      )}%`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Formulaire;
