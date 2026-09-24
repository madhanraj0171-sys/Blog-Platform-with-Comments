import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-16 text-stone-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-sm font-bold">
                W
              </span>
              <span className="font-serif text-lg font-bold text-stone-900">WriteSpace</span>
            </div>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              A clean, accessible full-stack blogging platform created for college project evaluation and knowledge sharing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-stone-900 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blogs')} className="hover:text-stone-900 transition-colors">
                  All Blogs & Discussions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/create-post')} className="hover:text-stone-900 transition-colors">
                  Publish an Article
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">Project Tech Stack</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              MERN Stack: React.js, Node.js + Express.js, MongoDB + Mongoose, JWT + bcrypt authentication.
            </p>
            <div className="mt-2 text-xs text-stone-400">
              Evaluator Note: Demo accounts for both Admin & Student are available on the Login page.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-2">
          <div>
            © {new Date().getFullYear()} WriteSpace. "Write. Share. Discuss."
          </div>
          <div>
            Full-Stack Web Development Internship Project
          </div>
        </div>
      </div>
    </footer>
  );
};
