import Marquee from "react-fast-marquee";

const defaultTestimonials = [
  {
    author_name: "Ana García",
    text: "Excelente espacio de coworking",
    from: "Local Guide",
    profile_photo_url: "/default-avatar-1.png",
    rating: 5,
    relative_time_description: "hace 1 mes",
  },
  {
    author_name: "Carlos Ruiz",
    text: "Ambiente muy profesional",
    from: "Local Guide",
    profile_photo_url: "/default-avatar-2.png",
    rating: 5,
    relative_time_description: "hace 2 meses",
  },
  {
    author_name: "María López",
    text: "Instalaciones modernas",
    from: "Local Guide",
    profile_photo_url: "/default-avatar-3.png",
    rating: 4,
    relative_time_description: "hace 3 meses",
  },
  {
    author_name: "Juan Pérez",
    text: "Muy recomendable",
    from: "Local Guide",
    profile_photo_url: "/default-avatar-4.png",
    rating: 5,
    relative_time_description: "hace 1 semana",
  },
];

export const Marqueee = ({ testimonials = defaultTestimonials }) => {
  return (
    <Marquee className="py-6 bg-black">
      {testimonials?.map(testimonial => (
        <TestimonialCard key={testimonial.author_name} {...testimonial} />
      ))}
    </Marquee>
  );
};

const TestimonialCard = ({
  message,
  author_name,
  from,
  profile_photo_url,
  author_url,
  rating,
  relative_time_description,
}) => {
  const renderRating = rating => {
    return "⭐".repeat(rating);
  };

  const handleImageError = e => {
    e.target.src = "/profile_preview.jpg"; // Imagen por defecto si hay error
    e.target.onerror = null; // Previene loop infinito
  };

  return (
    <div className="flex flex-row items-center bg-zinc-950 cursor-default mx-2 rounded-xl text-white w-96 h-32 p-4">
      <div className="w-16 h-16 mr-4">
        <img
          src={profile_photo_url || "/preview.png"}
          alt={author_name}
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
        />
      </div>
      <div className="ml-4 text-right flex-1">
        <p className="text-xs font-bold">{author_name}</p>
        <p className="text-xs">{from}</p>
        <p className="text-xs">{renderRating(rating)}</p>
        <p className="text-xs text-gray-400">{relative_time_description}</p>
      </div>
    </div>
  );
};
