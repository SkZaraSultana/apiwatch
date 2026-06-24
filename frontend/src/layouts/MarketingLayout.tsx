import { Link, NavLink, Outlet } from "react-router-dom";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import Button from "../components/ui/Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${
    isActive
      ? "text-plum-600"
      : "text-slate-600 hover:text-plum-500"
  }`;

const MarketingLayout = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-plum-coral text-white font-bold">
              A
            </div>
            <span className="text-xl font-bold text-dark-slate">APIWatch</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="md">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="md">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-dark-slate text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-plum-coral text-white font-bold">
                  A
                </div>
                <span className="text-lg font-bold">APIWatch</span>
              </div>
              <p className="text-sm text-slate-400">
                API monitoring for teams that care about reliability.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <FiTwitter size={18} />
                </a>
                <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <FiLinkedin size={18} />
                </a>
                <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <FiGithub size={18} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
                <li><a href="#" className="hover:text-white transition">Guides</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2026 APIWatch. All rights reserved.</p>
            <p>Made with care for modern DevOps teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
