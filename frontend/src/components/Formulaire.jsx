import React, { useState } from "react";
import { Sparkles } from "lucide-react";

const Formulaire = () => {
  const [formData, setFormData] = useState({
    Age: 0,
    PureBreed: 0,
    Gender: 0,
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
    Fee: 0,
    description: "",
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [breedOptions] = useState([
    {
      "BreedID": "1",
      "BreedName": "Affenpinscher"
    },
    {
      "BreedID": "2",
      "BreedName": "Afghan Hound"
    },
    {
      "BreedID": "3",
      "BreedName": "Airedale Terrier"
    },
    {
      "BreedID": "4",
      "BreedName": "Akbash"
    },
    {
      "BreedID": "5",
      "BreedName": "Akita"
    },
    {
      "BreedID": "6",
      "BreedName": "Alaskan Malamute"
    },
    {
      "BreedID": "7",
      "BreedName": "American Bulldog"
    },
    {
      "BreedID": "8",
      "BreedName": "American Eskimo Dog"
    },
    {
      "BreedID": "9",
      "BreedName": "American Hairless Terrier"
    },
    {
      "BreedID": "10",
      "BreedName": "American Staffordshire Terrier"
    },
    {
      "BreedID": "11",
      "BreedName": "American Water Spaniel"
    },
    {
      "BreedID": "12",
      "BreedName": "Anatolian Shepherd"
    },
    {
      "BreedID": "13",
      "BreedName": "Appenzell Mountain Dog"
    },
    {
      "BreedID": "14",
      "BreedName": "Australian Cattle Dog/Blue Heeler"
    },
    {
      "BreedID": "15",
      "BreedName": "Australian Kelpie"
    },
    {
      "BreedID": "16",
      "BreedName": "Australian Shepherd"
    },
    {
      "BreedID": "17",
      "BreedName": "Australian Terrier"
    },
    {
      "BreedID": "18",
      "BreedName": "Basenji"
    },
    {
      "BreedID": "19",
      "BreedName": "Basset Hound"
    },
    {
      "BreedID": "20",
      "BreedName": "Beagle"
    },
    {
      "BreedID": "21",
      "BreedName": "Bearded Collie"
    },
    {
      "BreedID": "22",
      "BreedName": "Beauceron"
    },
    {
      "BreedID": "23",
      "BreedName": "Bedlington Terrier"
    },
    {
      "BreedID": "24",
      "BreedName": "Belgian Shepherd Dog Sheepdog"
    },
    {
      "BreedID": "25",
      "BreedName": "Belgian Shepherd Laekenois"
    },
    {
      "BreedID": "26",
      "BreedName": "Belgian Shepherd Malinois"
    },
    {
      "BreedID": "27",
      "BreedName": "Belgian Shepherd Tervuren"
    },
    {
      "BreedID": "28",
      "BreedName": "Bernese Mountain Dog"
    },
    {
      "BreedID": "29",
      "BreedName": "Bichon Frise"
    },
    {
      "BreedID": "30",
      "BreedName": "Black and Tan Coonhound"
    },
    {
      "BreedID": "31",
      "BreedName": "Black Labrador Retriever"
    },
    {
      "BreedID": "32",
      "BreedName": "Black Mouth Cur"
    },
    {
      "BreedID": "33",
      "BreedName": "Black Russian Terrier"
    },
    {
      "BreedID": "34",
      "BreedName": "Bloodhound"
    },
    {
      "BreedID": "35",
      "BreedName": "Blue Lacy"
    },
    {
      "BreedID": "36",
      "BreedName": "Bluetick Coonhound"
    },
    {
      "BreedID": "37",
      "BreedName": "Boerboel"
    },
    {
      "BreedID": "38",
      "BreedName": "Bolognese"
    },
    {
      "BreedID": "39",
      "BreedName": "Border Collie"
    },
    {
      "BreedID": "40",
      "BreedName": "Border Terrier"
    },
    {
      "BreedID": "41",
      "BreedName": "Borzoi"
    },
    {
      "BreedID": "42",
      "BreedName": "Boston Terrier"
    },
    {
      "BreedID": "43",
      "BreedName": "Bouvier des Flanders"
    },
    {
      "BreedID": "44",
      "BreedName": "Boxer"
    },
    {
      "BreedID": "45",
      "BreedName": "Boykin Spaniel"
    },
    {
      "BreedID": "46",
      "BreedName": "Briard"
    },
    {
      "BreedID": "47",
      "BreedName": "Brittany Spaniel"
    },
    {
      "BreedID": "48",
      "BreedName": "Brussels Griffon"
    },
    {
      "BreedID": "49",
      "BreedName": "Bull Terrier"
    },
    {
      "BreedID": "50",
      "BreedName": "Bullmastiff"
    },
    {
      "BreedID": "51",
      "BreedName": "Cairn Terrier"
    },
    {
      "BreedID": "52",
      "BreedName": "Canaan Dog"
    },
    {
      "BreedID": "53",
      "BreedName": "Cane Corso Mastiff"
    },
    {
      "BreedID": "54",
      "BreedName": "Carolina Dog"
    },
    {
      "BreedID": "55",
      "BreedName": "Catahoula Leopard Dog"
    },
    {
      "BreedID": "56",
      "BreedName": "Cattle Dog"
    },
    {
      "BreedID": "57",
      "BreedName": "Caucasian Sheepdog (Caucasian Ovtcharka)"
    },
    {
      "BreedID": "58",
      "BreedName": "Cavalier King Charles Spaniel"
    },
    {
      "BreedID": "59",
      "BreedName": "Chesapeake Bay Retriever"
    },
    {
      "BreedID": "60",
      "BreedName": "Chihuahua"
    },
    {
      "BreedID": "61",
      "BreedName": "Chinese Crested Dog"
    },
    {
      "BreedID": "62",
      "BreedName": "Chinese Foo Dog"
    },
    {
      "BreedID": "63",
      "BreedName": "Chinook"
    },
    {
      "BreedID": "64",
      "BreedName": "Chocolate Labrador Retriever"
    },
    {
      "BreedID": "65",
      "BreedName": "Chow Chow"
    },
    {
      "BreedID": "66",
      "BreedName": "Cirneco dell'Etna"
    },
    {
      "BreedID": "67",
      "BreedName": "Clumber Spaniel"
    },
    {
      "BreedID": "68",
      "BreedName": "Cockapoo"
    },
    {
      "BreedID": "69",
      "BreedName": "Cocker Spaniel"
    },
    {
      "BreedID": "70",
      "BreedName": "Collie"
    },
    {
      "BreedID": "71",
      "BreedName": "Coonhound"
    },
    {
      "BreedID": "72",
      "BreedName": "Corgi"
    },
    {
      "BreedID": "73",
      "BreedName": "Coton de Tulear"
    },
    {
      "BreedID": "74",
      "BreedName": "Curly-Coated Retriever"
    },
    {
      "BreedID": "75",
      "BreedName": "Dachshund"
    },
    {
      "BreedID": "76",
      "BreedName": "Dalmatian"
    },
    {
      "BreedID": "77",
      "BreedName": "Dandi Dinmont Terrier"
    },
    {
      "BreedID": "78",
      "BreedName": "Doberman Pinscher"
    },
    {
      "BreedID": "79",
      "BreedName": "Dogo Argentino"
    },
    {
      "BreedID": "80",
      "BreedName": "Dogue de Bordeaux"
    },
    {
      "BreedID": "81",
      "BreedName": "Dutch Shepherd"
    },
    {
      "BreedID": "82",
      "BreedName": "English Bulldog"
    },
    {
      "BreedID": "83",
      "BreedName": "English Cocker Spaniel"
    },
    {
      "BreedID": "84",
      "BreedName": "English Coonhound"
    },
    {
      "BreedID": "85",
      "BreedName": "English Pointer"
    },
    {
      "BreedID": "86",
      "BreedName": "English Setter"
    },
    {
      "BreedID": "87",
      "BreedName": "English Shepherd"
    },
    {
      "BreedID": "88",
      "BreedName": "English Springer Spaniel"
    },
    {
      "BreedID": "89",
      "BreedName": "English Toy Spaniel"
    },
    {
      "BreedID": "90",
      "BreedName": "Entlebucher"
    },
    {
      "BreedID": "91",
      "BreedName": "Eskimo Dog"
    },
    {
      "BreedID": "92",
      "BreedName": "Feist"
    },
    {
      "BreedID": "93",
      "BreedName": "Field Spaniel"
    },
    {
      "BreedID": "94",
      "BreedName": "Fila Brasileiro"
    },
    {
      "BreedID": "95",
      "BreedName": "Finnish Lapphund"
    },
    {
      "BreedID": "96",
      "BreedName": "Finnish Spitz"
    },
    {
      "BreedID": "97",
      "BreedName": "Flat-coated Retriever"
    },
    {
      "BreedID": "98",
      "BreedName": "Fox Terrier"
    },
    {
      "BreedID": "99",
      "BreedName": "Foxhound"
    },
    {
      "BreedID": "100",
      "BreedName": "French Bulldog"
    },
    {
      "BreedID": "101",
      "BreedName": "Galgo Spanish Greyhound"
    },
    {
      "BreedID": "102",
      "BreedName": "German Pinscher"
    },
    {
      "BreedID": "103",
      "BreedName": "German Shepherd Dog"
    },
    {
      "BreedID": "104",
      "BreedName": "German Shorthaired Pointer"
    },
    {
      "BreedID": "105",
      "BreedName": "German Spitz"
    },
    {
      "BreedID": "106",
      "BreedName": "German Wirehaired Pointer"
    },
    {
      "BreedID": "107",
      "BreedName": "Giant Schnauzer"
    },
    {
      "BreedID": "108",
      "BreedName": "Glen of Imaal Terrier"
    },
    {
      "BreedID": "109",
      "BreedName": "Golden Retriever"
    },
    {
      "BreedID": "110",
      "BreedName": "Gordon Setter"
    },
    {
      "BreedID": "111",
      "BreedName": "Great Dane"
    },
    {
      "BreedID": "112",
      "BreedName": "Great Pyrenees"
    },
    {
      "BreedID": "113",
      "BreedName": "Greater Swiss Mountain Dog"
    },
    {
      "BreedID": "114",
      "BreedName": "Greyhound"
    },
    {
      "BreedID": "115",
      "BreedName": "Harrier"
    },
    {
      "BreedID": "116",
      "BreedName": "Havanese"
    },
    {
      "BreedID": "117",
      "BreedName": "Hound"
    },
    {
      "BreedID": "118",
      "BreedName": "Hovawart"
    },
    {
      "BreedID": "119",
      "BreedName": "Husky"
    },
    {
      "BreedID": "120",
      "BreedName": "Ibizan Hound"
    },
    {
      "BreedID": "121",
      "BreedName": "Illyrian Sheepdog"
    },
    {
      "BreedID": "122",
      "BreedName": "Irish Setter"
    },
    {
      "BreedID": "123",
      "BreedName": "Irish Terrier"
    },
    {
      "BreedID": "124",
      "BreedName": "Irish Water Spaniel"
    },
    {
      "BreedID": "125",
      "BreedName": "Irish Wolfhound"
    },
    {
      "BreedID": "126",
      "BreedName": "Italian Greyhound"
    },
    {
      "BreedID": "127",
      "BreedName": "Italian Spinone"
    },
    {
      "BreedID": "128",
      "BreedName": "Jack Russell Terrier"
    },
    {
      "BreedID": "129",
      "BreedName": "Jack Russell Terrier (Parson Russell Terrier)"
    },
    {
      "BreedID": "130",
      "BreedName": "Japanese Chin"
    },
    {
      "BreedID": "131",
      "BreedName": "Jindo"
    },
    {
      "BreedID": "132",
      "BreedName": "Kai Dog"
    },
    {
      "BreedID": "133",
      "BreedName": "Karelian Bear Dog"
    },
    {
      "BreedID": "134",
      "BreedName": "Keeshond"
    },
    {
      "BreedID": "135",
      "BreedName": "Kerry Blue Terrier"
    },
    {
      "BreedID": "136",
      "BreedName": "Kishu"
    },
    {
      "BreedID": "137",
      "BreedName": "Klee Kai"
    },
    {
      "BreedID": "138",
      "BreedName": "Komondor"
    },
    {
      "BreedID": "139",
      "BreedName": "Kuvasz"
    },
    {
      "BreedID": "140",
      "BreedName": "Kyi Leo"
    },
    {
      "BreedID": "141",
      "BreedName": "Labrador Retriever"
    },
    {
      "BreedID": "142",
      "BreedName": "Lakeland Terrier"
    },
    {
      "BreedID": "143",
      "BreedName": "Lancashire Heeler"
    },
    {
      "BreedID": "144",
      "BreedName": "Leonberger"
    },
    {
      "BreedID": "145",
      "BreedName": "Lhasa Apso"
    },
    {
      "BreedID": "146",
      "BreedName": "Lowchen"
    },
    {
      "BreedID": "147",
      "BreedName": "Maltese"
    },
    {
      "BreedID": "148",
      "BreedName": "Manchester Terrier"
    },
    {
      "BreedID": "149",
      "BreedName": "Maremma Sheepdog"
    },
    {
      "BreedID": "150",
      "BreedName": "Mastiff"
    },
    {
      "BreedID": "151",
      "BreedName": "McNab"
    },
    {
      "BreedID": "152",
      "BreedName": "Miniature Pinscher"
    },
    {
      "BreedID": "153",
      "BreedName": "Mountain Cur"
    },
    {
      "BreedID": "154",
      "BreedName": "Mountain Dog"
    },
    {
      "BreedID": "155",
      "BreedName": "Munsterlander"
    },
    {
      "BreedID": "156",
      "BreedName": "Neapolitan Mastiff"
    },
    {
      "BreedID": "157",
      "BreedName": "New Guinea Singing Dog"
    },
    {
      "BreedID": "158",
      "BreedName": "Newfoundland Dog"
    },
    {
      "BreedID": "159",
      "BreedName": "Norfolk Terrier"
    },
    {
      "BreedID": "160",
      "BreedName": "Norwegian Buhund"
    },
    {
      "BreedID": "161",
      "BreedName": "Norwegian Elkhound"
    },
    {
      "BreedID": "162",
      "BreedName": "Norwegian Lundehund"
    },
    {
      "BreedID": "163",
      "BreedName": "Norwich Terrier"
    },
    {
      "BreedID": "164",
      "BreedName": "Nova Scotia Duck-Tolling Retriever"
    },
    {
      "BreedID": "165",
      "BreedName": "Old English Sheepdog"
    },
    {
      "BreedID": "166",
      "BreedName": "Otterhound"
    },
    {
      "BreedID": "167",
      "BreedName": "Papillon"
    },
    {
      "BreedID": "168",
      "BreedName": "Patterdale Terrier (Fell Terrier)"
    },
    {
      "BreedID": "169",
      "BreedName": "Pekingese"
    },
    {
      "BreedID": "170",
      "BreedName": "Peruvian Inca Orchid"
    },
    {
      "BreedID": "171",
      "BreedName": "Petit Basset Griffon Vendeen"
    },
    {
      "BreedID": "172",
      "BreedName": "Pharaoh Hound"
    },
    {
      "BreedID": "173",
      "BreedName": "Pit Bull Terrier"
    },
    {
      "BreedID": "174",
      "BreedName": "Plott Hound"
    },
    {
      "BreedID": "175",
      "BreedName": "Podengo Portugueso"
    },
    {
      "BreedID": "176",
      "BreedName": "Pointer"
    },
    {
      "BreedID": "177",
      "BreedName": "Polish Lowland Sheepdog"
    },
    {
      "BreedID": "178",
      "BreedName": "Pomeranian"
    },
    {
      "BreedID": "179",
      "BreedName": "Poodle"
    },
    {
      "BreedID": "180",
      "BreedName": "Portuguese Water Dog"
    },
    {
      "BreedID": "181",
      "BreedName": "Presa Canario"
    },
    {
      "BreedID": "182",
      "BreedName": "Pug"
    },
    {
      "BreedID": "183",
      "BreedName": "Puli"
    },
    {
      "BreedID": "184",
      "BreedName": "Pumi"
    },
    {
      "BreedID": "185",
      "BreedName": "Rat Terrier"
    },
    {
      "BreedID": "186",
      "BreedName": "Redbone Coonhound"
    },
    {
      "BreedID": "187",
      "BreedName": "Retriever"
    },
    {
      "BreedID": "188",
      "BreedName": "Rhodesian Ridgeback"
    },
    {
      "BreedID": "189",
      "BreedName": "Rottweiler"
    },
    {
      "BreedID": "190",
      "BreedName": "Saint Bernard"
    },
    {
      "BreedID": "191",
      "BreedName": "Saluki"
    },
    {
      "BreedID": "192",
      "BreedName": "Samoyed"
    },
    {
      "BreedID": "193",
      "BreedName": "Sarplaninac"
    },
    {
      "BreedID": "194",
      "BreedName": "Schipperke"
    },
    {
      "BreedID": "195",
      "BreedName": "Schnauzer"
    },
    {
      "BreedID": "196",
      "BreedName": "Scottish Deerhound"
    },
    {
      "BreedID": "197",
      "BreedName": "Scottish Terrier Scottie"
    },
    {
      "BreedID": "198",
      "BreedName": "Sealyham Terrier"
    },
    {
      "BreedID": "199",
      "BreedName": "Setter"
    },
    {
      "BreedID": "200",
      "BreedName": "Shar Pei"
    },
    {
      "BreedID": "201",
      "BreedName": "Sheep Dog"
    },
    {
      "BreedID": "202",
      "BreedName": "Shepherd"
    },
    {
      "BreedID": "203",
      "BreedName": "Shetland Sheepdog Sheltie"
    },
    {
      "BreedID": "204",
      "BreedName": "Shiba Inu"
    },
    {
      "BreedID": "205",
      "BreedName": "Shih Tzu"
    },
    {
      "BreedID": "206",
      "BreedName": "Siberian Husky"
    },
    {
      "BreedID": "207",
      "BreedName": "Silky Terrier"
    },
    {
      "BreedID": "208",
      "BreedName": "Skye Terrier"
    },
    {
      "BreedID": "209",
      "BreedName": "Sloughi"
    },
    {
      "BreedID": "210",
      "BreedName": "Smooth Fox Terrier"
    },
    {
      "BreedID": "211",
      "BreedName": "South Russian Ovtcharka"
    },
    {
      "BreedID": "212",
      "BreedName": "Spaniel"
    },
    {
      "BreedID": "213",
      "BreedName": "Spitz"
    },
    {
      "BreedID": "214",
      "BreedName": "Staffordshire Bull Terrier"
    },
    {
      "BreedID": "215",
      "BreedName": "Standard Poodle"
    },
    {
      "BreedID": "216",
      "BreedName": "Sussex Spaniel"
    },
    {
      "BreedID": "217",
      "BreedName": "Swedish Vallhund"
    },
    {
      "BreedID": "218",
      "BreedName": "Terrier"
    },
    {
      "BreedID": "219",
      "BreedName": "Thai Ridgeback"
    },
    {
      "BreedID": "220",
      "BreedName": "Tibetan Mastiff"
    },
    {
      "BreedID": "221",
      "BreedName": "Tibetan Spaniel"
    },
    {
      "BreedID": "222",
      "BreedName": "Tibetan Terrier"
    },
    {
      "BreedID": "223",
      "BreedName": "Tosa Inu"
    },
    {
      "BreedID": "224",
      "BreedName": "Toy Fox Terrier"
    },
    {
      "BreedID": "225",
      "BreedName": "Treeing Walker Coonhound"
    },
    {
      "BreedID": "226",
      "BreedName": "Vizsla"
    },
    {
      "BreedID": "227",
      "BreedName": "Weimaraner"
    },
    {
      "BreedID": "228",
      "BreedName": "Welsh Corgi"
    },
    {
      "BreedID": "229",
      "BreedName": "Welsh Springer Spaniel"
    },
    {
      "BreedID": "230",
      "BreedName": "Welsh Terrier"
    },
    {
      "BreedID": "231",
      "BreedName": "West Highland White Terrier Westie"
    },
    {
      "BreedID": "232",
      "BreedName": "Wheaten Terrier"
    },
    {
      "BreedID": "233",
      "BreedName": "Whippet"
    },
    {
      "BreedID": "234",
      "BreedName": "White German Shepherd"
    },
    {
      "BreedID": "235",
      "BreedName": "Wire Fox Terrier"
    },
    {
      "BreedID": "236",
      "BreedName": "Wire-haired Pointing Griffon"
    },
    {
      "BreedID": "237",
      "BreedName": "Wirehaired Terrier"
    },
    {
      "BreedID": "238",
      "BreedName": "Xoloitzcuintle/Mexican Hairless"
    },
    {
      "BreedID": "239",
      "BreedName": "Yellow Labrador Retriever"
    },
    {
      "BreedID": "240",
      "BreedName": "Yorkshire Terrier Yorkie"
    },
    {
      "BreedID": "307",
      "BreedName": "Mixed Breed"
    },
    {
      "BreedID": "241",
      "BreedName": "Abyssinian"
    },
    {
      "BreedID": "242",
      "BreedName": "American Curl"
    },
    {
      "BreedID": "243",
      "BreedName": "American Shorthair"
    },
    {
      "BreedID": "244",
      "BreedName": "American Wirehair"
    },
    {
      "BreedID": "245",
      "BreedName": "Applehead Siamese"
    },
    {
      "BreedID": "246",
      "BreedName": "Balinese"
    },
    {
      "BreedID": "247",
      "BreedName": "Bengal"
    },
    {
      "BreedID": "248",
      "BreedName": "Birman"
    },
    {
      "BreedID": "249",
      "BreedName": "Bobtail"
    },
    {
      "BreedID": "250",
      "BreedName": "Bombay"
    },
    {
      "BreedID": "251",
      "BreedName": "British Shorthair"
    },
    {
      "BreedID": "252",
      "BreedName": "Burmese"
    },
    {
      "BreedID": "253",
      "BreedName": "Burmilla"
    },
    {
      "BreedID": "254",
      "BreedName": "Calico"
    },
    {
      "BreedID": "255",
      "BreedName": "Canadian Hairless"
    },
    {
      "BreedID": "256",
      "BreedName": "Chartreux"
    },
    {
      "BreedID": "257",
      "BreedName": "Chausie"
    },
    {
      "BreedID": "258",
      "BreedName": "Chinchilla"
    },
    {
      "BreedID": "259",
      "BreedName": "Cornish Rex"
    },
    {
      "BreedID": "260",
      "BreedName": "Cymric"
    },
    {
      "BreedID": "261",
      "BreedName": "Devon Rex"
    },
    {
      "BreedID": "262",
      "BreedName": "Dilute Calico"
    },
    {
      "BreedID": "263",
      "BreedName": "Dilute Tortoiseshell"
    },
    {
      "BreedID": "264",
      "BreedName": "Domestic Long Hair"
    },
    {
      "BreedID": "265",
      "BreedName": "Domestic Medium Hair"
    },
    {
      "BreedID": "266",
      "BreedName": "Domestic Short Hair"
    },
    {
      "BreedID": "267",
      "BreedName": "Egyptian Mau"
    },
    {
      "BreedID": "268",
      "BreedName": "Exotic Shorthair"
    },
    {
      "BreedID": "269",
      "BreedName": "Extra-Toes Cat (Hemingway Polydactyl)"
    },
    {
      "BreedID": "270",
      "BreedName": "Havana"
    },
    {
      "BreedID": "271",
      "BreedName": "Himalayan"
    },
    {
      "BreedID": "272",
      "BreedName": "Japanese Bobtail"
    },
    {
      "BreedID": "273",
      "BreedName": "Javanese"
    },
    {
      "BreedID": "274",
      "BreedName": "Korat"
    },
    {
      "BreedID": "275",
      "BreedName": "LaPerm"
    },
    {
      "BreedID": "276",
      "BreedName": "Maine Coon"
    },
    {
      "BreedID": "277",
      "BreedName": "Manx"
    },
    {
      "BreedID": "278",
      "BreedName": "Munchkin"
    },
    {
      "BreedID": "279",
      "BreedName": "Nebelung"
    },
    {
      "BreedID": "280",
      "BreedName": "Norwegian Forest Cat"
    },
    {
      "BreedID": "281",
      "BreedName": "Ocicat"
    },
    {
      "BreedID": "282",
      "BreedName": "Oriental Long Hair"
    },
    {
      "BreedID": "283",
      "BreedName": "Oriental Short Hair"
    },
    {
      "BreedID": "284",
      "BreedName": "Oriental Tabby"
    },
    {
      "BreedID": "285",
      "BreedName": "Persian"
    },
    {
      "BreedID": "286",
      "BreedName": "Pixie-Bob"
    },
    {
      "BreedID": "287",
      "BreedName": "Ragamuffin"
    },
    {
      "BreedID": "288",
      "BreedName": "Ragdoll"
    },
    {
      "BreedID": "289",
      "BreedName": "Russian Blue"
    },
    {
      "BreedID": "290",
      "BreedName": "Scottish Fold"
    },
    {
      "BreedID": "291",
      "BreedName": "Selkirk Rex"
    },
    {
      "BreedID": "292",
      "BreedName": "Siamese"
    },
    {
      "BreedID": "293",
      "BreedName": "Siberian"
    },
    {
      "BreedID": "294",
      "BreedName": "Silver"
    },
    {
      "BreedID": "295",
      "BreedName": "Singapura"
    },
    {
      "BreedID": "296",
      "BreedName": "Snowshoe"
    },
    {
      "BreedID": "297",
      "BreedName": "Somali"
    },
    {
      "BreedID": "298",
      "BreedName": "Sphynx (hairless cat)"
    },
    {
      "BreedID": "299",
      "BreedName": "Tabby"
    },
    {
      "BreedID": "300",
      "BreedName": "Tiger"
    },
    {
      "BreedID": "301",
      "BreedName": "Tonkinese"
    },
    {
      "BreedID": "302",
      "BreedName": "Torbie"
    },
    {
      "BreedID": "303",
      "BreedName": "Tortoiseshell"
    },
    {
      "BreedID": "304",
      "BreedName": "Turkish Angora"
    },
    {
      "BreedID": "305",
      "BreedName": "Turkish Van"
    },
    {
      "BreedID": "306",
      "BreedName": "Tuxedo"
    }
  ]);

  const colors = [
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

    if (name === "description") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "Breed1" || name === "Breed2") {
      const selectedBreed = breedOptions.find(
        (breed) => breed.BreedName === value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: selectedBreed ? parseInt(selectedBreed.BreedID) : 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    }
  };

  const handlePureBreedChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      PureBreed: value,
      Breed2: value === 1 ? 0 : prev.Breed2,
    }));
  };

  const handleSubmit = async () => {
    for (let key in formData) {
      if (formData[key] === "") {
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

      const data = await response.json();
      setApiResponse(data);
      document.getElementById("my_modal_1").showModal();
    } catch (error) {
      setApiResponse({ error: "Une erreur est survenue lors de l'envoi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6   p-6 rounded-3xl border border-primary">
        <div className="flex w-full">
          <div className="flex flex-col space-y-4 w-1/3">
            <label className=" badge badge-soft badge-neutral">
              Age de l'animal
            </label>
            <input
              type="number"
              name="Age"
              placeholder="en mois"
              className="input  input-primary input-bordered w-full"
              onChange={handleChange}
            />
            <label className=" badge badge-soft badge-neutral">
              Genre de lanimale
            </label>
            <select
              name="Gender"
              className="select select-primary select-bordered w-full"
              onChange={handleChange}
            >
              <option value="">Sélectionner</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
            <label className=" badge badge-soft badge-neutral">
              Description de l'animal
            </label>
            <input
              type="text"
              name="description"
              className="input  input-primary input-bordered w-full"
              onChange={handleChange}
            />
            <label className=" badge badge-soft badge-neutral">
              Nombre de photos
            </label>
            <input
              type="number"
              name="PhotoAmt"
              className="input  input-primary input-bordered w-full"
              onChange={handleChange}
            />
            <label className=" badge badge-soft badge-neutral">
              Montant des frais d'adoption
            </label>
            <input
              type="number"
              name="Fee"
              className="input  input-primary input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div className="flex  flex-col space-y-4 ml-4 w-2/3 ">
            <label className=" badge badge-soft badge-neutral">
              {" "}
              est ce une pure race ?
            </label>
            <select
              name="PureBreed"
              className="select select-primary select-bordered w-full"
              onChange={handlePureBreedChange}
            >
              <option value="">Sélectionner</option>
              <option value="1">Oui</option>
              <option value="2">Non</option>
            </select>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="mb-4 badge badge-soft badge-neutral">
                  Première race
                </label>
                <select
                  name="Breed1"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez une race</option>
                  {breedOptions.map((breed) => (
                    <option key={breed.BreedID} value={breed.BreedName}>
                      {breed.BreedName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="mb-4 badge badge-soft badge-neutral">
                  Deuxième race
                </label>
                <select
                  name="Breed2"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                  disabled={formData.PureBreed === 1}
                  value={
                    formData.PureBreed === 1
                      ? ""
                      : breedOptions.find(
                          (b) => b.BreedID === formData.Breed2?.toString()
                        )?.BreedName || ""
                  }
                >
                  <option value="">Sélectionnez une race</option>
                  {breedOptions.map((breed) => (
                    <option key={breed.BreedID} value={breed.BreedName}>
                      {breed.BreedName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/3">
                <label className=" mb-4 badge badge-soft badge-neutral">
                  Vacciné
                </label>
                <select
                  name="Vaccinated"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Oui</option>
                  <option value="2">Non</option>
                </select>
              </div>

              <div className="w-1/3">
                <label className="mb-4 badge badge-soft badge-neutral">
                  Déparasité
                </label>
                <select
                  name="Dewormed"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Oui</option>
                  <option value="2">Non</option>
                </select>
              </div>

              <div className="w-1/3">
                <label className=" mb-4 badge badge-soft badge-neutral">
                  Stérilisé
                </label>
                <select
                  name="Sterilized"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Oui</option>
                  <option value="2">Non</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className=" w-1/2">
                <label className="badge badge-soft badge-neutral mb-4">
                  Couleur 1
                </label>
                <select
                  name="Color1"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="badge badge-soft badge-neutral mb-4">
                  Couleur 2
                </label>
                <select
                  name="Color2"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="0">Pas de deuxième couleur</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="mb-4  badge badge-soft badge-neutral">
                  Taille de maturité{" "}
                </label>
                <select
                  name="MaturitySize"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Small</option>
                  <option value="2">Medium</option>
                  <option value="3">Large</option>
                </select>
              </div>

              <div className="w-1/2">
                <label className=" mb-4 badge badge-soft badge-neutral">
                  Longueur de fourrure
                </label>
                <select
                  name="FurLength"
                  className="select select-primary select-bordered w-full"
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Short</option>
                  <option value="2">Medium</option>
                  <option value="3">Long</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary w-fit mt-4"
          onClick={handleSubmit}
        >
          <Sparkles className="w-4 h-4 " />
          {loading ? "..." : " Prédire la vitesse d'adoption"}
        </button>

        <dialog id="my_modal_1" className="modal">
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
                  <Sparkles
                    strokeWidth={1}
                    className="w-30 h-30 text-primary"
                  />
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
    </div>
  );
};

export default Formulaire;
