

function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-xl mb-4">About Us</h3>
              <div className="max-w-sm">
                    <p className="text-sm">
    We are dedicated to providing top-quality courses to help you
    achieve your goals. Join us and start your learning journey today!
                    </p>
                </div>

            </div>
  
            {/* Navigation Links */}
            <div>
              <h3 className="font-bold text-xl mb-4">Quick Links</h3>
              <ul>
                <li>
                  <a href="/" className="text-sm hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/courses" className="text-sm hover:underline">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-sm hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-sm hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Contact & Social Media */}
            <div>
              <h3 className="font-bold text-xl mb-4">Contact Us</h3>
              <p className="text-sm">
                Email: Learnify@edu.in
                <br />
                Phone: +91 10000 10000
              </p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
  
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
           Sample © {new Date().getFullYear()} Learnify. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  