# Cambios

## 1.1.0 — 2026-10-24

- Servicio local de TizenBrew para controlar el video real del iframe, sin una PC ni una IP fija.
- Inicio confirmado con avance real, sonido activo y volumen del reproductor al 50 %.
- Play, pausa, saltos de 10 segundos y reanudación desde el avance guardado.
- Conservación de la posición cuando el proveedor DASH reconstruye su fuente al pausar.
- Historial basado en muestras reales; eliminación del contador artificial y rechazo de mensajes ajenos o de sesiones anteriores.
- Manejo de Atrás mediante `tizenhwkey` y `keydown`, retiro inmediato del iframe y restauración del foco.
- Reintento, cambio de servidor y salida disponibles durante una carga fallida.
- Ratón virtual con clic dentro del frame y foco del control conservado en LuminaTV.
- Registro remoto opcional; eliminación del envío de registros a una PC fija.
- URLs de CSS y JavaScript compatibles con la detección MIME del proxy de TizenBrew.

Requiere abrir el módulo en modo Debug de TizenBrew. Para actualizar, recarga los módulos y reinicia TizenBrew por completo. La disponibilidad de cada video y servidor depende del proveedor.
