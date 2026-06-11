import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const despacho = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion.toUpperCase(),
      intento: 0,
      despachado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
    };

    try {
      await axios.post("/api/despachos", despacho);
      await axios.put(`/api/ventas/${venta.idVenta}`, { despachoGenerado: true });
      await Swal.fire("Despacho registrado", "El despacho fue generado correctamente.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No fue posible registrar el despacho.", "error");
    }
  };

  const fieldClass = "block w-full rounded-lg border border-gray-300 p-2 text-base";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pb-6 text-left sm:px-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-teal-600 sm:text-3xl">Nueva orden de despacho</h2>

      <label className="mb-4 block font-semibold">
        Fecha de despacho
        <input type="date" className={fieldClass} {...register("fechaDespacho", { required: true })} />
      </label>
      <label className="mb-4 block font-semibold">
        Patente del camión
        <input type="text" placeholder="ABCD-12" className={fieldClass} {...register("patenteCamion", { required: true })} />
      </label>
      <label className="mb-4 block font-semibold">
        Orden de compra
        <input readOnly value={venta.idVenta} className={`${fieldClass} bg-slate-100 text-slate-500`} />
      </label>
      <label className="mb-4 block font-semibold">
        Dirección de entrega
        <input readOnly value={venta.direccionCompra} className={`${fieldClass} bg-slate-100 text-slate-500`} />
      </label>
      <label className="mb-6 block font-semibold">
        Valor de compra
        <input readOnly value={`$${Number(venta.valorCompra).toLocaleString("es-CL")}`} className={`${fieldClass} bg-slate-100 text-slate-500`} />
      </label>

      <button disabled={isSubmitting} className="w-full rounded-lg bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60">
        {isSubmitting ? "Guardando..." : "Asignar despacho"}
      </button>
    </form>
  );
};
