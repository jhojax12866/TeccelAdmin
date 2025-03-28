"use client";

import { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const socialLinks = [
  { href: "tel:+123456789", icon: FaPhoneAlt },
  { href: "mailto:contacto@teccelmocoa.com", icon: FaEnvelope },
  { href: "https://www.google.com/maps?q=TECCEL+MOCOA", icon: FaMapMarkerAlt },
  { href: "https://wa.me/123456789", icon: FaWhatsapp },
  { href: "https://www.facebook.com/teccelmocoa", icon: FaFacebook },
  { href: "https://www.instagram.com/teccelmocoa", icon: FaInstagram },
  { href: "https://twitter.com/teccelmocoa", icon: FaTwitter },
];

export default function IconLinks({ className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-wrap justify-center md:justify-start gap-6 text-[#e41e26] text-5xl ${className}`}>
      {socialLinks.map(({ href, icon: Icon }, index) => (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`transform transition duration-500 ease-out hover:scale-125 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
