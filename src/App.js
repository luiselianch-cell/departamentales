import { useState } from "react";

// eslint-disable-next-line no-unused-vars
const mesActual = new Date().toLocaleString("es-ES", { month: "long", year: "numeric" });

const C = {
  bg: "#f4f6f9",
  card: "#ffffff",
  primary: "#003366",
  accent: "#0066CC",
  accentLight: "#e8f0fb",
  border: "#d0dce8",
  text: "#1a1a2e",
  textSub: "#4a5568",
  textMuted: "#8898aa",
  inputBg: "#f8fafd",
  inputDisabled: "#eef2f7",
  error: "#e53e3e",
  success: "#276749",
  successBg: "#f0fff4",
  successBorder: "#9ae6b4",
  errorBg: "#fff5f5",
  errorBorder: "#feb2b2",
  warningBg: "#fffbeb",
  warningBorder: "#f6e05e",
  warningText: "#744210",
  histBg: "#f0f5ff",
  histBorder: "#c3d4f0",
};

const TIPOS_ENTREGA = [
  "Lugar de residencia / trabajo",
  "Punto de encuentro (Gasolinera, parque, centro comercial etc)",
  "En agencia de mensajeria (Cliente pasará a recoger)",
];

const DEPARTAMENTOS = [
  "SANTA ANA", "SAN MIGUEL", "AHUACHAPAN", "CABAÑAS",
  "CHALATENANGO", "CUSCATLAN", "LA LIBERTAD", "LA UNION",
  "LA PAZ", "MORAZAN", "SONSONATE", "SAN SALVADOR",
  "SAN VICENTE", "USULUTAN",
];

const FORMAS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "PayPal", "Otro"];
const TIPOS_COMPROBANTE = ["Ticket", "Factura", "Sin comprobante"];
const COMENTARIOS_PREDET = ["Sin comentario", "Frágil", "Urgente", "Con cambio"];
const PERFILES = ["Instagram", "Facebook", "TikTok", "WhatsApp", "Referido", "Otro"];
const QUIEN_INGRESA = [
  "Tecno Gadget - Fer",
  "Tecno Gadget - Jefferson",
  "Tecno Gadget - Wendy",
  "Tecno Gadget - Liss",
  "Tecno Gadget - Isa",
];

const today = () => new Date().toISOString().split("T")[0];

const initialForm = {
  fecha_orden: today(),
  articulos: "",
  nombre_cliente: "",
  numero_contacto: "",
  tipo_entrega: "",
  departamento: "",
  municipio: "",
  direccion_entrega: "",
  total_pagar: "",
  forma_pago: "",
  tipo_comprobante: "",
  comentario_predet: "",
  perfil_salio: "",
  quien_ingresa: "",
  comentario_libre: "",
};

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <label style={{
        display: "block", fontSize: "0.75rem", fontWeight: 700,
        color: C.primary, letterSpacing: "0.06em",
        textTransform: "uppercase", marginBottom: "0.35rem",
      }}>
        {label}{required && <span style={{ color: C.error, marginLeft: 3 }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: "0.4rem", marginTop: 0 }}>{hint}</p>}
      {children}
    </div>
  );
}

const inputStyle = (disabled) => ({
  width: "100%",
  background: disabled ? C.inputDisabled : C.inputBg,
  border: "1px solid " + C.border,
  borderRadius: "0.45rem",
  padding: "0.65rem 0.85rem",
  color: disabled ? C.textMuted : C.text,
  fontSize: "0.93rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
});

function CustomSelect({ name, value, onChange, disabled, options, placeholder = "Selecciona…" }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => !disabled && setOpen(!open)} style={{
        ...inputStyle(disabled), cursor: "pointer",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", userSelect: "none",
      }}>
        <span style={{ color: value ? C.text : C.textMuted }}>{value || placeholder}</span>
        <span style={{ color: C.accent }}>{open ? "^" : "v"}</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid " + C.border,
          borderRadius: "0.45rem",
          boxShadow: "0 8px 32px rgba(0,51,102,0.15)",
          zIndex: 999, maxHeight: 220, overflowY: "auto",
        }}>
          {options.map((opt) => (
            <div key={opt} onClick={() => { onChange({ target: { name, value: opt } }); setOpen(false); }}
              style={{
                padding: "0.7rem 0.85rem", cursor: "pointer",
                color: value === opt ? C.accent : C.text,
                background: value === opt ? C.accentLight : "transparent",
                fontWeight: value === opt ? 600 : 400,
                borderBottom: "1px solid " + C.border,
              }}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", paddingTop: "0.5rem" }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, fontWeight: 700, whiteSpace: "nowrap" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      {children}
    </div>
  );
}

export default function FormularioDepartamentales() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [historial, setHistorial] = useState([]);

  const isLoading = status === "loading";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  }

  function validate() {
    const required = [
      "fecha_orden", "articulos", "tipo_entrega", "departamento",
      "municipio", "total_pagar", "forma_pago", "tipo_comprobante",
      "perfil_salio", "quien_ingresa",
    ];
    const errs = {};
    required.forEach((k) => { if (!form[k]) errs[k] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function guardarEnSupabase(orden) {
    const hoy = new Date().toISOString().split("T")[0];
    const resContador = await fetch(process.env.REACT_APP_SUPABASE_URL + "/rest/v1/contadores_diarios?fecha=eq." + hoy, {
      headers: {
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: "Bearer " + process.env.REACT_APP_SUPABASE_KEY,
      },
    });
    const contadores = await resContador.json();
    let numeroFicha = 1;
    if (contadores.length === 0) {
      await fetch(process.env.REACT_APP_SUPABASE_URL + "/rest/v1/contadores_diarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.REACT_APP_SUPABASE_KEY,
          Authorization: "Bearer " + process.env.REACT_APP_SUPABASE_KEY,
        },
        body: JSON.stringify({ fecha: hoy, ultimo_numero: 1 }),
      });
    } else {
      numeroFicha = contadores[0].ultimo_numero + 1;
      await fetch(process.env.REACT_APP_SUPABASE_URL + "/rest/v1/contadores_diarios?fecha=eq." + hoy, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.REACT_APP_SUPABASE_KEY,
          Authorization: "Bearer " + process.env.REACT_APP_SUPABASE_KEY,
        },
        body: JSON.stringify({ ultimo_numero: numeroFicha }),
      });
    }
    const res = await fetch(process.env.REACT_APP_SUPABASE_URL + "/rest/v1/ordenes_departamentales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: "Bearer " + process.env.REACT_APP_SUPABASE_KEY,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ ...orden, numero_ficha: numeroFicha }),
    });
    if (!res.ok) throw new Error("Error al guardar en base de datos");
    return await res.json();
  }

  async function enviarWhatsApp(orden) {
    await fetch("https://dbpqfplomejtkoxjpvrn.supabase.co/functions/v1/super-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: process.env.REACT_APP_WA_PHONE,
        apikey: process.env.REACT_APP_WA_APIKEY,
        message: "Ficha #" + orden.numero_ficha + " — Departamental" +
          "\n" + orden.fecha_orden +
          "\n" + orden.articulos +
          "\n" + (orden.nombre_cliente || "Sin nombre") +
          "\n" + (orden.numero_contacto || "-") +
          "\n" + orden.tipo_entrega +
          "\n" + orden.departamento + " — " + orden.municipio +
          "\n" + (orden.direccion_entrega || "-") +
          "\n" + orden.total_pagar +
          "\n" + orden.forma_pago +
          "\n" + orden.tipo_comprobante +
          "\n" + orden.perfil_salio +
          "\n" + orden.quien_ingresa +
          "\n" + (orden.comentario_libre || "Sin notas"),
      }),
    });
  }

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    try {
      const orden = { ...form, creado_en: new Date().toISOString() };
      const [saved] = await guardarEnSupabase(orden);
      await enviarWhatsApp({ ...orden, numero_ficha: saved.numero_ficha });
      setHistorial((p) => [saved, ...p].slice(0, 6));
      setForm({ ...initialForm, fecha_orden: today() });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
    }
  }

  const err = (k) => errors[k] ? { border: "1px solid " + C.error } : {};

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "2rem 1rem 4rem" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.75rem", textAlign: "center" }}>
          <div style={{
            display: "inline-block", background: C.primary, color: "#fff",
            fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
            fontWeight: 700, padding: "0.3rem 0.9rem", borderRadius: "2rem", marginBottom: "0.75rem",
          }}>{"TECNO GADGET · " + mesActual.toUpperCase()}</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: C.primary, margin: 0, lineHeight: 1.15 }}>Orden Departamental</h1>
          <p style={{ color: C.textMuted, fontSize: "0.82rem", marginTop: "0.35rem", marginBottom: 0 }}>
            Los campos con <span style={{ color: C.error }}>*</span> son obligatorios.
          </p>
        </div>

        {status === "success" && (
          <div style={{ background: C.successBg, border: "1px solid " + C.successBorder, borderRadius: "0.5rem", padding: "0.8rem 1rem", color: C.success, fontSize: "0.88rem", marginBottom: "1.25rem" }}>
            ✅ Orden guardada y notificación enviada por WhatsApp.
          </div>
        )}
        {status === "error" && (
          <div style={{ background: C.errorBg, border: "1px solid " + C.errorBorder, borderRadius: "0.5rem", padding: "0.8rem 1rem", color: C.error, fontSize: "0.88rem", marginBottom: "1.25rem" }}>
            ⚠️ Ocurrió un error. Revisa la consola o las credenciales.
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div style={{ background: C.warningBg, border: "1px solid " + C.warningBorder, borderRadius: "0.5rem", padding: "0.8rem 1rem", color: C.warningText, fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            ⚠️ Completa los campos marcados en rojo antes de continuar.
          </div>
        )}

        <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: "1rem", padding: "1.75rem", boxShadow: "0 4px 24px rgba(0,51,102,0.08)" }}>

          <Section title="Información de la orden">
            <Field label="Fecha en que se ingresa la orden" required>
              <input type="date" name="fecha_orden" value={form.fecha_orden} onChange={handleChange} disabled={isLoading} style={{ ...inputStyle(isLoading), ...err("fecha_orden") }} />
            </Field>
            <Field label="Artículos a enviar" required hint="Si el producto tiene código o modelo, ingrésalo para facilitar la preparación del paquete.">
              <textarea name="articulos" value={form.articulos} onChange={handleChange} disabled={isLoading} placeholder="Ej: 2x Modelo-A001…" autoComplete="off" style={{ ...inputStyle(isLoading), ...err("articulos"), resize: "vertical", minHeight: 72 }} />
            </Field>
          </Section>

          <Section title="Datos del cliente">
            <Field label="Nombre del cliente">
              <input name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} disabled={isLoading} placeholder="Nombre completo" autoComplete="off" style={inputStyle(isLoading)} />
            </Field>
            <Field label="Número de contacto" hint="Ingresar todos los números juntos. Ejemplo: 71002233">
              <input name="numero_contacto" value={form.numero_contacto} onChange={handleChange} disabled={isLoading} placeholder="71002233" type="tel" autoComplete="off" style={inputStyle(isLoading)} />
            </Field>
          </Section>

          <Section title="Entrega">
            <Field label="Tipo de entrega departamental" required>
              <CustomSelect name="tipo_entrega" value={form.tipo_entrega} onChange={handleChange} disabled={isLoading} options={TIPOS_ENTREGA} />
              {errors.tipo_entrega && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Departamento de entrega" required>
              <CustomSelect name="departamento" value={form.departamento} onChange={handleChange} disabled={isLoading} options={DEPARTAMENTOS} />
              {errors.departamento && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Municipio de entrega" required>
              <input name="municipio" value={form.municipio} onChange={handleChange} disabled={isLoading} placeholder="Municipio" autoComplete="off" style={{ ...inputStyle(isLoading), ...err("municipio") }} />
            </Field>
            <Field label="Dirección de entrega">
              <textarea name="direccion_entrega" value={form.direccion_entrega} onChange={handleChange} disabled={isLoading} placeholder="Calle, número, colonia, referencias…" autoComplete="off" style={{ ...inputStyle(isLoading), resize: "vertical", minHeight: 64 }} />
            </Field>
          </Section>

          <Section title="Pago y comprobante">
            <Field label="Total a pagar" required hint='Usar formato: $00.00 — ejemplo: $24.50 (incluir el envío en el total)'>
              <input name="total_pagar" value={form.total_pagar} onChange={handleChange} disabled={isLoading} placeholder="$24.50" autoComplete="off" style={{ ...inputStyle(isLoading), ...err("total_pagar") }} />
            </Field>
            <Field label="Forma de pago" required>
              <CustomSelect name="forma_pago" value={form.forma_pago} onChange={handleChange} disabled={isLoading} options={FORMAS_PAGO} />
              {errors.forma_pago && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Tipo de comprobante" required>
              <CustomSelect name="tipo_comprobante" value={form.tipo_comprobante} onChange={handleChange} disabled={isLoading} options={TIPOS_COMPROBANTE} />
              {errors.tipo_comprobante && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Comentarios predeterminados (no obligatorio)">
              <CustomSelect name="comentario_predet" value={form.comentario_predet} onChange={handleChange} disabled={isLoading} options={COMENTARIOS_PREDET} placeholder="Sin comentario" />
            </Field>
          </Section>

          <Section title="Origen y operador">
            <Field label="Perfil donde salió la orden" required>
              <CustomSelect name="perfil_salio" value={form.perfil_salio} onChange={handleChange} disabled={isLoading} options={PERFILES} />
              {errors.perfil_salio && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="¿Quién ingresa la orden?" required>
              <CustomSelect name="quien_ingresa" value={form.quien_ingresa} onChange={handleChange} disabled={isLoading} options={QUIEN_INGRESA} />
              {errors.quien_ingresa && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Comentario libre">
              <textarea name="comentario_libre" value={form.comentario_libre} onChange={handleChange} disabled={isLoading} placeholder="Cualquier detalle adicional…" autoComplete="off" style={{ ...inputStyle(isLoading), resize: "vertical", minHeight: 72 }} />
            </Field>
          </Section>

          <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            <button onClick={handleSubmit} disabled={isLoading} style={{
              width: "100%", padding: "0.85rem",
              background: isLoading ? C.border : C.primary,
              color: isLoading ? C.textMuted : "#ffffff",
              border: "none", borderRadius: "0.55rem",
              fontWeight: 600, fontSize: "0.95rem",
              cursor: isLoading ? "default" : "pointer",
              letterSpacing: "0.02em",
            }}>
              {isLoading ? "Guardando y notificando…" : "💾 Guardar orden y notificar por WhatsApp"}
            </button>
            <button onClick={() => { setForm({ ...initialForm, fecha_orden: today() }); setErrors({}); }} disabled={isLoading} style={{
              width: "100%", padding: "0.7rem", background: "transparent",
              color: C.textMuted, border: "1px solid " + C.border,
              borderRadius: "0.55rem", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
            }}>
              Limpiar formulario
            </button>
          </div>
        </div>

        {historial.length > 0 && (
          <div style={{ marginTop: "1.75rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textMuted, marginBottom: "0.6rem" }}>Órdenes registradas esta sesión</div>
            {historial.map((o) => (
              <div key={o.id} style={{ background: C.histBg, border: "1px solid " + C.histBorder, borderRadius: "0.5rem", padding: "0.65rem 0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <div>
                  <div style={{ color: C.primary, fontSize: "0.85rem", fontWeight: 600 }}>{o.nombre_cliente || "Sin nombre"} — {o.departamento}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: 2 }}>{o.articulos?.slice(0, 40)}{o.articulos?.length > 40 ? "…" : ""}</div>
                </div>
                <div style={{ color: C.accent, fontWeight: 700, fontSize: "0.9rem", marginLeft: "1rem", whiteSpace: "nowrap" }}>{o.total_pagar}</div>
              </div>
            ))}
          </div>
        )}

        <p style={{ textAlign: "center", color: "#8898aa", fontSize: "0.75rem", marginTop: "2rem" }}>
          Con tecnologia de No Just a Forms.
        </p>
      </div>
    </div>
  );
}

