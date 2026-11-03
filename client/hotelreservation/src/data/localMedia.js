import aeHotel from '../assets/images/AEHOTEL.png';
import hotelDining from '../assets/images/HOTEL1.jpg';
import hotelNightPool from '../assets/images/HOTEL2.jpg';
import bakuA from '../assets/images/bakuhotel.jpg';
import bakuB from '../assets/images/bakuhotel1.jpg';
import bakuC from '../assets/images/bakuhotel2.jpg';
import bakuD from '../assets/images/bakuhotel3.jpg';
import maldivesA from '../assets/images/hotelmaldivler.jpg';
import maldivesB from '../assets/images/hotelmaldivler1.jpg';
import maldivesC from '../assets/images/hotelmaldivler2.jpg';
import maldivesD from '../assets/images/hotelmaldivler3.jpg';
import resortA from '../assets/images/hotell.jpg';
import resortB from '../assets/images/hotelll.jpg';
import resortC from '../assets/images/qebele otel.jpg';
import newA from '../assets/images/hotelyeni.jpg';
import newB from '../assets/images/hotelyeni1.jpg';
import newC from '../assets/images/hotelyeni3.jpg';
import newD from '../assets/images/hotelyeni4.jpg';
import tourCastleDay from '../assets/images/TUR1.jpg';
import tourBalloons from '../assets/images/TUR2.jpg';
import tourBoats from '../assets/videos/VIDE01.png';
import tourCastleNight from '../assets/videos/VIDEOO.png';
import tourGondolas from '../assets/videos/VIDEOO.png';
import hotelPromo from '../assets/videos/aehotel-promo.mp4';
import tourVideo from '../assets/videos/YENITURVIDEOS.mp4';
import flightVideo from '../assets/videos/UCUS1.mp4';
import hotelVideo from '../assets/videos/OTELVIDEOS.mp4';

export const MEDIA = {
  aeHotel,
  hotelDining,
  hotelNightPool,
  tourCastleDay,
  tourBalloons,
  tourBoats,
  tourCastleNight,
  tourGondolas,
  hotelPromo,
  tourVideo,
  flightVideo,
  hotelVideo,
};

const HOTEL_FALLBACKS = [aeHotel, hotelDining, hotelNightPool];
const TOUR_FALLBACKS = [tourCastleDay, tourBalloons, tourBoats, tourCastleNight, tourGondolas];

// Every file below is a different photo. A hotel's gallery is built from them
// without repeating a photo, preferring the ones that match its destination.
const GENERAL_HOTEL_PHOTOS = [newA, resortA, newB, resortB, newC, resortC, newD];
const THEMED_HOTEL_PHOTOS = [
  { match: /maldiv|maafushi|vaadhoo|male/i, photos: [maldivesA, maldivesB, maldivesC, maldivesD] },
  { match: /bak[ıi]|baku|azerbaycan|azerbaijan|flame|boulevard/i, photos: [bakuA, bakuB, bakuC, bakuD] },
];

export function hotelGallery(hotel, mainFile, size = 3, preset = []) {
  const id = Math.abs(Number(hotel?.id) || 0);
  const text = [hotel?.title, hotel?.city, hotel?.country, hotel?.address].filter(Boolean).join(' ');
  const themed = THEMED_HOTEL_PHOTOS.find((group) => group.match.test(text))?.photos || [];
  const rotate = (list) => (list.length ? [...list.slice(id % list.length), ...list.slice(0, id % list.length)] : []);
  const gallery = [];
  [...preset, mainFile, ...rotate(themed), ...rotate(GENERAL_HOTEL_PHOTOS), ...THEMED_HOTEL_PHOTOS.flatMap((group) => group.photos)].forEach((src) => {
    if (src && !gallery.includes(src) && gallery.length < size) gallery.push(src);
  });
  return gallery;
}

export const uniqueHotelImage = (id) => HOTEL_FALLBACKS[Math.abs(Number(id) || 0) % HOTEL_FALLBACKS.length];

export const uniqueTourImage = (id) => TOUR_FALLBACKS[Math.abs(Number(id) || 0) % TOUR_FALLBACKS.length];

export function uniqueListImages(items, key = "image") {
  const used = new Set();
  let next = 0;
  return (items || []).map((item) => {
    let image = item[key];
    if (!image || used.has(image)) {
      while (next < TOUR_FALLBACKS.length - 1 && used.has(TOUR_FALLBACKS[next])) next += 1;
      image = TOUR_FALLBACKS[next % TOUR_FALLBACKS.length];
      next += 1;
    }
    used.add(image);
    return {
      ...item,
      [key]: image,
      images: [image, ...(item.images || []).filter((src) => src !== image)],
    };
  });
}

export const GALLERY_EXTRAS = [
  { src: aeHotel, alt: 'AE Hotel girişi' },
  { src: hotelDining, alt: 'Kanal restoran' },
  { src: hotelNightPool, alt: 'Gecə hovuz' },
  { src: tourCastleDay, alt: 'Tur şəhəri' },
  { src: tourBalloons, alt: 'Hava şarları' },
  { src: tourBoats, alt: 'Dəniz turu' },
  { src: tourCastleNight, alt: 'Gecə turu' },
  { src: tourGondolas, alt: 'Qondola turu' },
];
