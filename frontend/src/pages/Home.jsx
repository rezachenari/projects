import Hero from '../components/home/Hero';
import SignatureMenu from '../components/home/SignatureMenu';
import Story from '../components/home/Story';
import Craft from '../components/home/Craft';
import GalleryPreview from '../components/home/GalleryPreview';
import Hospitality from '../components/home/Hospitality';
import Reviews from '../components/home/Reviews';
import ReservationSection from '../components/home/ReservationSection';
import Closing from '../components/home/Closing';
import { useSite } from '../lib/site-context';

export default function Home() {
  const { settings, categories, testimonials } = useSite();

  return (
    <>
      <Hero />
      <SignatureMenu categories={categories} />
      <Story />
      <Craft />
      <GalleryPreview />
      <Hospitality />
      <Reviews testimonials={testimonials} />
      <ReservationSection settings={settings} />
      <Closing />
    </>
  );
}
