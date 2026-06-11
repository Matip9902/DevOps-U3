import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const cargarDespachos = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/despachos");
      setDespachos(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible cargar los despachos. Verifica que el backend este disponible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDespachos();
  }, []);

  return (
    <>
      <section className="mb-8 w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Despachos</h2>
              <p className="text-sm text-slate-500">Seguimiento de entregas e intentos realizados.</p>
            </div>
            <button onClick={cargarDespachos} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
              Actualizar
            </button>
          </div>

          {loading && <p className="py-8 text-center text-slate-500">Cargando despachos...</p>}
          {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
          {!loading && !error && despachos.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">Todavía no existen despachos.</p>
          )}

          {!loading && !error && despachos.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Despacho</th>
                    <th className="px-4 py-3">Compra</th>
                    <th className="px-4 py-3">Dirección</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Patente</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Intentos</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {despachos.map((despacho) => (
                    <tr key={despacho.idDespacho} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold">#{despacho.idDespacho}</td>
                      <td className="px-4 py-4">#{despacho.idCompra}</td>
                      <td className="px-4 py-4">{despacho.direccionCompra}</td>
                      <td className="px-4 py-4">{despacho.fechaDespacho}</td>
                      <td className="px-4 py-4">{despacho.patenteCamion}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${despacho.despachado ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {despacho.despachado ? "Entregado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-4">{despacho.intento}</td>
                      <td className="px-4 py-4 text-right">
                        {!despacho.despachado && (
                          <button
                            onClick={() => {
                              setDespachoSeleccionado(despacho);
                              setOpenModal(true);
                            }}
                            className="whitespace-nowrap rounded-lg bg-orange-200 px-4 py-2 font-semibold hover:bg-orange-300"
                          >
                            Actualizar entrega
                          </button>
                        )}
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
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              cargarDespachos();
            }}
          />
        )}
      </Modal>
    </>
  );
};
