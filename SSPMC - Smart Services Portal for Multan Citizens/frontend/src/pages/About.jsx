import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const slides = [
    {
      id: 1,
      title: 'Welcome to Multan',
      subtitle: 'The historic City of Saints, rich in culture and heritage.',
      image:
        'https://multan.punjab.gov.pk/system/files/multan-fort_0.jpg',
      link: '/services',
    },
    {
      id: 2,
      title: 'SSPMC Initiative',
      subtitle: 'Connecting citizens with essential public services digitally.',
      image:
        'https://investin.pk/wp-content/uploads/2016/05/Top-Housing-Schemes-in-Multan.webp',
      link: '/services',
    },
    {
      id: 3,
      title: 'Modern Multan Development',
      subtitle: 'Blending tradition with smart city infrastructure.',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=80',
      link: '/contact',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {/* HERO SLIDER */}
      <div className="relative h-screen w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay */}
            <div className="w-full h-full bg-black/60 flex items-center">
              <div className="max-w-5xl px-10 md:px-20">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h1>

                <p className="text-white/80 text-lg mb-6 max-w-2xl">
                  {slide.subtitle}
                </p>

                {/* PLACEHOLDER LINK */}
                <Link
                  to={slide.link}
                  className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 transition rounded-lg text-white font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* DOTS */}
        <div className="absolute bottom-5 w-full flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? 'bg-emerald-500' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ABOUT CONTENT */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About Multan & SSPMC
          </h1>

          <p className="text-lg max-w-3xl" style={{ color: 'var(--muted)' }}>
            Learn more about the historic city of Multan and the platform
            designed to connect citizens with essential services.
          </p>
        </div>

        {/* ABOUT MULTAN */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 mb-16 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              The City of Saints – Multan
            </h2>

            <p className="mb-4" style={{ color: 'var(--muted)' }}>
              Multan is one of the oldest cities in South Asia, known for its
              Sufi shrines, history, and cultural heritage. It is widely called
              the “City of Saints” due to its spiritual significance.
            </p>

            <p style={{ color: 'var(--muted)' }}>
              Today, it stands as a growing metropolitan hub combining tradition
              with modern development and infrastructure.
            </p>
          </div>

          <div
            className="h-64 md:h-80 rounded-xl"
            style={{
              background:
                "url('https://www.thecubicfeetdesign.com/blog/wp-content/uploads/2022/04/412.png') center/cover no-repeat",
              border: '1px solid var(--border)',
            }}
          ></div>
        </div>

        {/* ABOUT SSPMC */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-4">About SSPMC Platform</h2>

          <p className="mb-4" style={{ color: 'var(--muted)' }}>
            SSPMC is a digital platform designed to centralize public service
            information in Multan. It helps citizens quickly discover hospitals,
            parks, restaurants, and civic services.
          </p>

          <p style={{ color: 'var(--muted)' }}>
            The goal is to improve accessibility, transparency, and digital
            governance for the city.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
