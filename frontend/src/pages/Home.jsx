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

/**
 * The cinematic journey: nine worlds, each one a scroll-driven video stage
 * (see `components/cinema/ScrollVideoSection`), in a fixed directorial order.
 */
export default function Home() {
  const { settings, categories, testimonials, ready } = useSite();

  return (
    <>
      <Hero />
      <SignatureMenu categories={categories} />
      <Story />
      <Craft />
      <GalleryPreview />
      <Hospitality />
      <Reviews testimonials={testimonials} ready={ready} />
      <ReservationSection settings={settings} />
      <Closing settings={settings} />
    </>
  );
}
