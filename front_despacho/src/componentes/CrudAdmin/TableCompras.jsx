import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const compras = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/ventas");
      setVentas(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible cargar las ventas. Verifica que el backend este disponible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compras();
  }, []);

  const ventasPendientes = ventas.filter((venta) => !venta.despachoGenerado);

  return (
    <>
      <section className="mb-8 w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Ventas pendientes</h2>
              <p className="text-sm text-slate-500">Órdenes que todavía no tienen despacho.</p>
            </div>
            <button onClick={compras} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
              Actualizar
            </button>
          </div>

          {loading && <p className="py-8 text-center text-slate-500">Cargando ventas...</p>}
          {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
          {!loading && !error && ventasPendientes.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">No hay ventas pendientes.</p>
          )}

          {!loading && !error && ventasPendientes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Orden</th>
                    <th className="px-4 py-3">Dirección</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ventasPendientes.map((venta) => (
                    <tr key={venta.idVenta} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold">#{venta.idVenta}</td>
                      <td className="px-4 py-4">{venta.direccionCompra}</td>
                      <td className="px-4 py-4">{venta.fechaCompra}</td>
                      <td className="px-4 py-4">${Number(venta.valorCompra).toLocaleString("es-CL")}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => {
                            setVentaSeleccionada(venta);
                            setOpenModal(true);
                          }}
                          className="whitespace-nowrap rounded-lg bg-orange-200 px-4 py-2 font-semibold hover:bg-orange-300"
                        >
                          Generar despacho
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => {
              setOpenModal(false);
              compras();
            }}
          />
        )}
      </Modal>
    </>
  );
};
