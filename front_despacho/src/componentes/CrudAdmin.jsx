import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";

import { PruebaCards } from "./CrudAdmin/PruebaCards";
import Reviews from "./Layouts/Reviews";

export const CrudAdmin = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 md:grid md:grid-cols-[auto_1fr]">
        <div className="col-span-1">
          {/* Columna 1: Navbar (ancho fijo) */}
          <Navbar />
        </div>

        {/* Columna 2: Contenido principal (ocupa el espacio restante) */}
        <main className="min-w-0 overflow-y-auto p-3 sm:p-6">
          {" "}
          {/* Por si el contenido es muy largo */}
          <PruebaCards />
          <Reviews />
          <Footer />
        </main>
      </div>
    </>
  );
};
