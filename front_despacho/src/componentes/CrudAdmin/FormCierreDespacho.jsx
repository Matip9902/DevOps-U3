import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const actualizado = {
      ...despacho,
      intento: Number(data.intento),
      despachado: data.despachado === "true",
    };

    try {
      await axios.put(`/api/despachos/${despacho.idDespacho}`, actualizado);
      await Swal.fire("Despacho actualizado", "Los cambios fueron guardados correctamente.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No fue posible actualizar el despacho.", "error");
    }
  };

  const fieldClass = "block w-full rounded-lg border border-gray-300 p-2 text-base";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pb-6 text-left sm:px-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-teal-600 sm:text-3xl">Actualizar despacho</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-semibold">Despacho<input readOnly value={despacho.idDespacho} className={`${fieldClass} bg-slate-100`} /></label>
        <label className="block font-semibold">Compra<input readOnly value={despacho.idCompra} className={`${fieldClass} bg-slate-100`} /></label>
        <label className="block font-semibold">Fecha<input readOnly value={despacho.fechaDespacho} className={`${fieldClass} bg-slate-100`} /></label>
        <label className="block font-semibold">Patente<input readOnly value={despacho.patenteCamion} className={`${fieldClass} bg-slate-100`} /></label>
      </div>

      <label className="mt-4 block font-semibold">
        Intentos de entrega
        <input type="number" min="0" defaultValue={despacho.intento} className={fieldClass} {...register("intento", { required: true, min: 0 })} />
      </label>
      <label className="mt-4 block font-semibold">
        Estado
        <select defaultValue={String(despacho.despachado)} className={fieldClass} {...register("despachado", { required: true })}>
          <option value="false">Pendiente</option>
          <option value="true">Entregado</option>
        </select>
      </label>
      <label className="mt-4 block font-semibold">Dirección<input readOnly value={despacho.direccionCompra} className={`${fieldClass} bg-slate-100`} /></label>

      <button disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60">
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
};
