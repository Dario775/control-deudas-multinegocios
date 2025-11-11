import React from 'react';
import { TwitterIcon, GithubIcon, DribbbleIcon } from '../icons';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Gestor Inc. Todos los derechos reservados.
          </p>
          <div className="flex mt-4 sm:mt-0 space-x-4">
            <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <DribbbleIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
