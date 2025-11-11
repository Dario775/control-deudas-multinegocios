import React from 'react';
import { Plan, PlanPeriod } from '../types';
import { QuoteIcon } from '../components/icons';
import { mockPlanes } from '../data/mockData';

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-xl hover:border-indigo-500 transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{plan.nombre}</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${plan.precio}</span>
            <span className="text-base font-medium">/{plan.periodo}</span>
        </p>
        <ul className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300 flex-grow">
            {plan.caracteristicas.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    {feature}
                </li>
            ))}
        </ul>
        <button className="mt-8 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Comenzar ahora
        </button>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string; role: string; imgSrc: string; }> = ({ quote, author, role, imgSrc }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <QuoteIcon className="w-8 h-8 text-indigo-200 dark:text-indigo-800 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 mb-6">"{quote}"</p>
        <div className="flex items-center">
            <img src={imgSrc} alt={author} className="w-12 h-12 rounded-full mr-4" />
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
            </div>
        </div>
    </div>
);


const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Gestiona tus Clientes y Pagos en un Solo Lugar
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La plataforma definitiva para centralizar la administración de suscripciones, facturación y comunicación con tus clientes. Simple, intuitivo y potente.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a href="#planes" className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Ver Planes
            </a>
            <a href="#" className="px-8 py-3 text-lg font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Solicitar Demo
            </a>
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section id="planes" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold">Planes para cada tipo de negocio</h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Elige el plan que mejor se adapte a tu crecimiento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPlanes.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
           <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold">Lo que dicen nuestros clientes</h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Miles de negocios confían en nosotros para gestionar sus suscripciones.</p>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
                quote="Esta herramienta nos ha ahorrado incontables horas en la gestión de pagos recurrentes. ¡Totalmente recomendada!"
                author="Ana Morales"
                role="CEO de TechSolutions"
                imgSrc="https://randomuser.me/api/portraits/women/44.jpg"
            />
             <TestimonialCard 
                quote="La interfaz es increíblemente fácil de usar. Mis clientes ahora pueden gestionar sus datos y pagos sin problemas."
                author="Javier Castillo"
                role="Fundador de FitClub"
                imgSrc="https://randomuser.me/api/portraits/men/32.jpg"
            />
             <TestimonialCard 
                quote="El soporte al cliente es excepcional. Resolvieron mis dudas en minutos. Un servicio de 10."
                author="Sofia Vega"
                role="Directora de Creativos Digitales"
                imgSrc="https://randomuser.me/api/portraits/women/68.jpg"
            />
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
           <h3 className="text-3xl md:text-4xl font-bold">¿Listo para simplificar tu gestión?</h3>
           <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Únete a miles de negocios que ya están optimizando su tiempo y mejorando la relación con sus clientes.</p>
           <div className="mt-8">
                <a href="#" className="px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Crea tu cuenta gratis
                </a>
           </div>
        </div>
      </section>
    </>
  );
};

export default Home;