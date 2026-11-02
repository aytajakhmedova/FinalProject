import { FaGlobeEurope } from 'react-icons/fa';
import { AE, AT, AZ, CH, CN, CZ, DE, EG, ES, FR, GB, GE, GR, IN, IR, IT, JP, KZ, MV, NL, PT, QA, RU, SA, TH, TR, UA, US, UZ } from 'country-flag-icons/react/3x2';

const FLAGS = { AE, AT, AZ, CH, CN, CZ, DE, EG, ES, FR, GB, GE, GR, IN, IR, IT, JP, KZ, MV, NL, PT, QA, RU, SA, TH, TR, UA, US, UZ };

// Country names as the catalog stores them (Azerbaijani first) mapped to ISO 3166-1 alpha-2 codes.
const CODES = {
  azərbaycan: 'AZ',
  türkiyə: 'TR',
  türkiye: 'TR',
  turkey: 'TR',
  bəə: 'AE',
  'birləşmiş ərəb əmirlikləri': 'AE',
  italiya: 'IT',
  i̇taliya: 'IT',
  italy: 'IT',
  fransa: 'FR',
  france: 'FR',
  almaniya: 'DE',
  germany: 'DE',
  ingiltərə: 'GB',
  'böyük britaniya': 'GB',
  'united kingdom': 'GB',
  ispaniya: 'ES',
  i̇spaniya: 'ES',
  spain: 'ES',
  gürcüstan: 'GE',
  georgia: 'GE',
  tayland: 'TH',
  thailand: 'TH',
  'maldiv adaları': 'MV',
  maldives: 'MV',
  rusiya: 'RU',
  abş: 'US',
  yaponiya: 'JP',
  çin: 'CN',
  hindistan: 'IN',
  misir: 'EG',
  yunanıstan: 'GR',
  portuqaliya: 'PT',
  niderland: 'NL',
  avstriya: 'AT',
  isveçrə: 'CH',
  i̇sveçrə: 'CH',
  çexiya: 'CZ',
  qətər: 'QA',
  səudiyyə: 'SA',
  'səudiyyə ərəbistanı': 'SA',
  qazaxıstan: 'KZ',
  özbəkistan: 'UZ',
  ukrayna: 'UA',
  iran: 'IR',
};

const countryCode = (name) => CODES[String(name || '').trim().toLowerCase()] || '';

// The ISO code comes from the Countries table; the name lookup only covers rows without one.
const CountryFlag = ({ name, isoCode, className = '' }) => {
  const Flag = FLAGS[String(isoCode || '').toUpperCase()] || FLAGS[countryCode(name)];
  if (!Flag) {
    return <FaGlobeEurope className={`${className} flag-fallback`} aria-hidden="true" />;
  }
  return <Flag className={`${className} flag-svg`} title={name} aria-hidden="true" />;
};

export default CountryFlag;
