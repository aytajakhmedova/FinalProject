import aeHotel from '../assets/images/AEHOTEL.png';
import hotelDining from '../assets/images/HOTEL1.jpg';
import hotelNightPool from '../assets/images/HOTEL2.jpg';
import tourCastleDay from '../assets/images/TUR1.jpg';
import tourBalloons from '../assets/images/TUR2.jpg';
import tourBoats from '../assets/videos/VIDE01.png';
import tourCastleNight from '../assets/videos/VIDEOO.png';
import tourGondolas from '../assets/videos/TUR VIDEOS.png';
import hotelPromo from '../assets/videos/aehotel-promo.mp4';

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
};

const HOTEL_FALLBACKS = [aeHotel, hotelDining, hotelNightPool];
const TOUR_FALLBACKS = [tourCastleDay, tourBalloons, tourBoats, tourCastleNight, tourGondolas];

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
