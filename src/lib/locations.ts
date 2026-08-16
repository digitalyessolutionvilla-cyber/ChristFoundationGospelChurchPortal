// Static location data for all CFGC branches organized by district

export interface Branch {
  name: string;
  address: string;
  poBox?: string;
  phones: string[];
  isHq?: boolean;
}

export interface District {
  name: string;
  branches: Branch[];
}

export const headquarters: Branch = {
  name: 'Headquarters',
  address: '7, Olusoji Street, Orile Oshodi',
  poBox: 'P. O. Box 983, Mushin, Lagos',
  phones: ['+2347030090757', '+2348027723788', '+2348060279123'],
  isHq: true,
};

export const nationalCampGround: Branch = {
  name: 'National Camp Ground — Mountain of Salvation',
  address: 'Ilupeju Quarters, Magada-Ibafo, Lagos-Ibadan Express Way, Ibafo, Ogun State',
  phones: ['+2348053035335'],
};

export const districts: District[] = [
  {
    name: 'Lagos District',
    branches: [
      {
        name: 'Olowora Branch',
        address: '2a, Olatunde Sule Street, Olowora, By Isheri, Lagos State',
        phones: ['+2348169057554'],
      },
      {
        name: 'Bariga Branch',
        address: '25, Alubarika Street, Laide Bus Stop, Bariga, Lagos State',
        phones: ['+2348067057058'],
      },
      {
        name: 'Ikotun Branch',
        address: '3, Akanbi Oguntoyinbo Street, Off Asalu Mosque Road, Ola Farm Bus Stop, Via Abaranje, Ikotun, Lagos State',
        phones: ['+2348059780005', '+2348183229135'],
      },
    ],
  },
  {
    name: 'Badagry District',
    branches: [
      {
        name: 'Badagry Branch',
        address: 'Akilapa Compound, Off Aradagun Road, Mowo-Badagry, Lagos State',
        phones: ['+2348035712722'],
      },
    ],
  },
  {
    name: 'Iroko District',
    branches: [
      {
        name: 'Iroko Branch — District Hqtrs.',
        address: '5-13 Tijani Ayoola Street, Iroko Town, Ajegunle Bus Stop, Via Sango Ota Toll Gate, Ogun State',
        phones: ['+2347038430418'],
        isHq: true,
      },
      {
        name: 'Orija Branch',
        address: '18, Moshood Amusa Street, Orija Estate, Iroko Town, Ajegunle Bus Stop, Via Sango Ota Toll Gate, Ogun State',
        phones: ['+2348079233938'],
      },
      {
        name: 'Mosafejo Branch',
        address: 'Ijamala Area, Mosafejo, Via Ijoko Ota, Ogun State',
        phones: ['+2347038307476'],
      },
      {
        name: 'Oyero Branch',
        address: '10, Irepodun Street, Oyero, Via Ijoko Ota, Ogun State',
        phones: ['+2348023962465'],
      },
    ],
  },
  {
    name: 'Ota District',
    branches: [
      {
        name: 'Konifewo Branch — District Hqtrs.',
        address: '2, Oore-ofe Street, Okititan Town, Via Konifewo, Ogun State',
        phones: ['+2348039294323'],
        isHq: true,
      },
      {
        name: 'Ota 1 Branch',
        address: '124, Idiroko Road, Opposite Fowobi Filling Station, Ota, Ogun State',
        phones: ['+2348136285333'],
      },
      {
        name: 'Ota 2 Branch',
        address: '104 Anglican Road, Ota, Ogun State',
        phones: ['+2348169610408'],
      },
    ],
  },
  {
    name: 'Ifo District',
    branches: [
      {
        name: 'Ifo Branch — District Hqtrs.',
        address: '91, Awolowo Avenue, Ikoritameje, Ifo, Ogun State',
        phones: ['+2348028396903'],
        isHq: true,
      },
      {
        name: 'Ibogun Akiode Branch',
        address: 'Ibogun Akiode Junction, Akiode Bus Stop, Via Ifo, Ogun State',
        phones: ['+2347038601072'],
      },
      {
        name: 'Oko-Ireke Branch',
        address: 'Ayedaade Oko-Ireke Along Ifo Ibogun Road, After The Stream Beside Piggery, Ogun State',
        phones: ['+2347038184764'],
      },
    ],
  },
  {
    name: 'Arigbajo District',
    branches: [
      {
        name: 'Arigbajo Branch — District Hqtrs.',
        address: 'Behind Methodist High School, Along Ifo-Abeokuta Express Way, Arigbajo Town, Ogun State',
        phones: ['+2348035677373'],
        isHq: true,
      },
      {
        name: 'Ososun Branch',
        address: 'Gasline Area, Off Alaja Road, Ososun Titun, Via Ifo, Ogun State',
        phones: ['+2347035386956'],
      },
      {
        name: 'Apomu Branch',
        address: 'Apomu Village, Via Arigbajo, Ogun State',
        phones: ['+2348060659212'],
      },
    ],
  },
  {
    name: 'Ilaro District',
    branches: [
      {
        name: 'Ilaro Branch — District Hqtrs.',
        address: '10, Seriki Street, Sabo, Ilaro, Ogun State',
        phones: ['+2348031301380', '+2348055444431'],
        isHq: true,
      },
      {
        name: 'Olorunda Station Branch',
        address: 'Olorunda Station, Opp. Railway Station, Via Egbeda, Ifo, Ogun State',
        phones: ['+2347030749197'],
      },
      {
        name: 'Oja Odan Branch',
        address: 'Papa Olasun, Oja-Odan, Ogun State',
        phones: ['+2348148145504'],
      },
      {
        name: 'Idogo Branch',
        address: 'Elefun Compound, Alagbado Road, Oke-Ola, Idogo Town, Via Ilaro, Ogun State',
        phones: ['+2347030749197'],
      },
      {
        name: 'Obele Branch',
        address: 'Pedepo Road, Border Town, Obele, Ogun State',
        phones: ['+2348148145504'],
      },
    ],
  },
  {
    name: 'Abeokuta South District',
    branches: [
      {
        name: 'Oke-Aregba Branch — District Hqtrs.',
        address: '6, Alani Kayode Street, Oke-Aregba, Itoko Titun, Adatan',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348060152193'],
        isHq: true,
      },
      {
        name: 'Oke-Ijeun Branch',
        address: '152, Beside Onjoko House Oke-Ijeun',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348033951383'],
      },
      {
        name: 'Idosan Branch',
        address: 'Idosa Fagada Village, Obafemi Owode LGA',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348033753539'],
      },
      {
        name: 'Sigo-Opalola Branch',
        address: 'Sigo-Opalola Village, Ifo-Abeokuta Express Road Bye Pass, Near Wasimi',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348089517867'],
      },
      {
        name: 'Ojeke Branch',
        address: 'Ojeke Village Near Obafemi Owode',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2347037905257'],
      },
    ],
  },
  {
    name: 'Odeda District',
    branches: [
      {
        name: 'Gbonagun Branch — District Hqtrs.',
        address: '19, Gbonagun Road, Near Obantoko, Odo-Eran',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348060152193'],
        isHq: true,
      },
      {
        name: 'Osaara Branch',
        address: 'Osaara Community, Via Gbonagun Area, Odeda LGA',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348032496100'],
      },
      {
        name: 'Ologburugburu Branch',
        address: 'Ologburugburu Village, Odeda LGA',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2348061699925'],
      },
      {
        name: 'Akintoye Branch',
        address: 'Akintoye Village, Along Abeokuta-Ibadan Road',
        poBox: 'P. O. Box 6480, Sapon, Abeokuta, Ogun State',
        phones: ['+2347038595729'],
      },
    ],
  },
  {
    name: 'Keesan District',
    branches: [
      {
        name: 'Olorunda Branch — District Hqtrs.',
        address: 'Olorunda Town, Along Abeokuta-Ayetoro Road, Via Imala, Ogun State',
        phones: ['+2348035022586'],
        isHq: true,
      },
      {
        name: 'Ayetoro Branch',
        address: 'Joga-Ayetoro-Ilaro Road Bye Pass, Via Olorunda Town, Ogun State',
        phones: ['+2348162594661'],
      },
      {
        name: 'Keesan Branch',
        address: 'Keesan Village, Abeokuta-Ayetoro Road Bye Pass, Via Olorunda Town, Ogun State',
        phones: ['+2348167643853'],
      },
    ],
  },
  {
    name: 'Ibafo District',
    branches: [
      {
        name: 'Ibafo Camp Church',
        address: 'Mountain of Salvation, Ilupeju Quarters, Magada-Ibafo, Lagos-Ibadan Express Way, Ibafo, Ogun State',
        phones: ['+2348053035335'],
      },
      {
        name: 'Ibafo 1 — District Hqtrs.',
        address: 'Bayo Oluokun Street, Opp. Police Station, Along Lagos-Ibadan Express Way, Ibafo, Ogun State',
        phones: ['+2347032048282'],
        isHq: true,
      },
      {
        name: 'Ibafo 2 Branch',
        address: 'Surulere Quarters Off Olusoji Street, Ebut Road, Ibafo, Ogun State',
        phones: ['+2348134721711'],
      },
      {
        name: 'Mowe Branch',
        address: '2, Famuyiwa Street, Opp. Iyaniwura Medical Centre, Along Lagos-Ibadan Express Way, Mowe, Ogun State',
        phones: ['+2348084933510'],
      },
      {
        name: 'Isefu Branch',
        address: 'Isefu Village, Via Ibafo, Ogun State',
        phones: ['+2348067172400'],
      },
    ],
  },
  {
    name: 'Ijebu District',
    branches: [
      {
        name: 'Ijebu-Ode — District Hqtrs.',
        address: '131, Molipa Road, Molipa Ijebu-Ode, Ogun State',
        phones: ['+2348052251365'],
        isHq: true,
      },
      {
        name: 'Ago-Iwoye Branch',
        address: 'Ag E2/51, Fabigbade Road, Ago-Iwoye, Ogun State',
        phones: ['+2348163045897'],
      },
      {
        name: 'Ijebu-Igbo Branch',
        address: '6, Pelumi Street, Oke-Alaafia, Ijebu-Igbo, Ogun State',
        phones: ['+2348140900140'],
      },
    ],
  },
  {
    name: 'Ibadan District',
    branches: [
      {
        name: 'Ibadan 1 — District Hqtrs.',
        address: '3, Kalejaiye Street, Oke-Itunu, Mokola, Ibadan, Oyo State',
        phones: ['+2348029563118'],
        isHq: true,
      },
      {
        name: 'Ibadan 2 Branch',
        address: 'Farae Estate, Sanyo Bus Stop, Iwo Road, Ibadan, Oyo State',
        phones: ['+2348061638931'],
      },
    ],
  },
  {
    name: 'Ekiti District',
    branches: [
      {
        name: 'Okemesi Branch',
        address: 'Ijana Street, Okemesi, Ekiti State',
        phones: ['+2348127134428'],
      },
    ],
  },
];
