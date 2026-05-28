import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Home = () => {
  //Slides for hero slider
  const slides = [
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Nishtar_Hospital_Multan_Close_View.jpg',
      title: 'Quality Healthcare Services',
      description: 'Find trusted hospitals and medical facilities across Multan.',
    },
    {
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/4d/11/94/exterior-facade.jpg?w=900&h=500&s=1',
      title: 'Explore Top Restaurants',
      description: 'Discover the best dining experiences and local food spots.',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Yaadgaar-E-Shauhda_Multan_Cantt.jpg',
      title: 'Relax in Beautiful Parks',
      description: 'Enjoy nature and outdoor spaces for relaxation and family time.',
    },
  ];

  //Categories for the Service Cards
  const categories = [
    {
      title: 'Hospitals',
      desc: 'Find nearby hospitals and healthcare services quickly.',
      link: "/services/hospitals",
      bgImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Nishtar_Hospital_Multan_Close_View.jpg'
    },
    {
      title: 'Restaurants',
      desc: 'Discover the best food spots and dining experiences.',
      link: "/services/restaurants",
      bgImg: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/4d/11/94/exterior-facade.jpg?w=900&h=500&s=1'
    },
    {
      title: 'Parks',
      desc: 'Explore parks and outdoor spaces to relax and enjoy.',
      link: "/services/parks",
      bgImg: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Yaadgaar-E-Shauhda_Multan_Cantt.jpg'
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // FIXED: Added automatic rotation loop with interval cleanup
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* HERO SLIDER */}
      <section className="relative w-full h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            // FIXED: Added conditional z-index so hidden slides don't block button clicks
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center">
              <div className="max-w-5xl px-10 md:px-20">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-white/80 text-lg mb-6 max-w-2xl">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* FIXED: Increased z-index layer to guarantee elements remain on top */}
        <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-white z-20 cursor-pointer">
          <FiChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-white z-20 cursor-pointer">
          <FiChevronRight size={24} />
        </button>
      </section>

      {/* HERO TEXT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Services in Multan</h1>
        <p className="max-w-2xl mx-auto mb-8 text-lg" style={{ color: 'var(--muted)' }}>
          Explore hospitals, restaurants, parks and more — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/services" className="bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition shadow-lg font-medium">
            Explore Services
          </Link>
        </div>
      </section>

      {/* POPULAR CATEGORIES (WITH BLURRED BG IMAGES) */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="relative h-80 rounded-2xl overflow-hidden group border border-transparent hover:border-emerald-500 transition-all duration-500 shadow-lg"
            >
              {/* Blurred Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 blur-[1px]"
                style={{ backgroundImage: `url(${item.bgImg})` }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-colors" />

              {/* Card Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;