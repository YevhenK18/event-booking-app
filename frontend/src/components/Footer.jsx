import React from "react";
import { Container } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer>
      <Container className="text-center">
        <div className="mb-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FaFacebook size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FaInstagram size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FaTwitter size={24} />
          </a>
        </div>
        <p>&copy; 2025 Event Booking App. Все права защищены.</p>
      </Container>
    </footer>
  );
}

export default Footer;