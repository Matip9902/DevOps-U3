function Navbar() {
  return (
    <nav className="m-3 rounded-xl bg-teal-600 p-4 text-white md:sticky md:top-3 md:min-h-[calc(100vh-1.5rem)] md:w-[240px]">
      {/* Logo o título */}
      <h2 className="mb-4 text-xl font-bold md:mb-8">Despacho Dashboard</h2>

      {/* Menú de navegación */}
      <ul className="flex gap-2 overflow-x-auto md:block md:space-y-3">
        <li>
          <a
            href="#"
            className="block font-bold py-2 px-3 hover:bg-teal-700 rounded"
          >
            Usuarios
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block font-bold py-2 px-3 hover:bg-teal-700 rounded"
          >
            Productos
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block font-bold py-2 px-3 hover:bg-teal-700 rounded"
          >
            Configuración
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
