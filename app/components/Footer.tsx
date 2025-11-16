export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Noor Ul Fityan</h3>
            <p className="text-sm text-gray-400">Building a stronger community through charitable initiatives, education and social impact.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Pages</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/pages/about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="/pages/help" className="text-gray-400 hover:text-white">Help</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/user/donations" className="text-gray-400 hover:text-white">Donate</a></li>
              <li><a href="/user/events" className="text-gray-400 hover:text-white">Events</a></li>
              <li><a href="/news" className="text-gray-400 hover:text-white">News</a></li>
              <li><a href="/auth/register" className="text-gray-400 hover:text-white">Join Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Noor Ul Fityan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
