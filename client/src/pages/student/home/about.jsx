import NirmalImage from "@/assets/nirmal.jpg";
function AboutPage() {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 lg:px-8">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to our platform! We are committed to providing high-quality
            courses to help you achieve your personal and professional goals.
            Whether you're looking to learn a new skill, advance your career, or
            explore a passion, we are here to guide you every step of the way.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Mission Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is to make learning accessible and affordable for
              everyone. We aim to bridge the gap between education and
              opportunities by offering courses that are engaging, practical, and
              impactful For Free.
            </p>
          </div>
  
          {/* Vision Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              We envision a world where everyone has the tools and resources to
              grow and succeed. By empowering individuals with knowledge, we aim
              to create a community of lifelong learners who inspire positive
              change.
            </p>
          </div>
        </div>
  
        <div className="mt-12 max-w-4xl w-full">
          {/* Team Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Team Leader"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-800">Chandan L S</h3>
              <p className="text-sm text-gray-600">Founder Chairperson</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Team Member"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-800">Member 2</h3>
              <p className="text-sm text-gray-600">CEO</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Team Member"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-800">Member 3
              </h3>
              <p className="text-sm text-gray-600">Course Director</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default AboutPage;
  