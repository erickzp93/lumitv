# LuminaTV para Samsung TizenBrew

Cliente de catálogo y reproducción con navegación por control remoto, temas día/noche y progreso de reproducción confirmado.

## Actualización 1.1.0

- Play, pausa y saltos de 10 segundos actúan sobre el video real del servidor.
- El inicio activa el sonido y ajusta el volumen del reproductor al 50 %. El volumen de la TV sigue bajo el control habitual del televisor.
- Se eliminó el contador artificial. Solo se guarda el tiempo confirmado por el reproductor, sin mezclar títulos ni episodios.
- Atrás atiende tanto `keydown` como `tizenhwkey`. El iframe se retira antes de que Tizen reenvíe el evento, y se restaura el foco del catálogo.
- El foco permanece en LuminaTV. Arriba/Abajo muestran los controles; OK alterna reproducción y pausa; Izquierda/Derecha saltan 10 segundos cuando los controles están ocultos.
- El ratón virtual (0) utiliza el servicio para pulsar dentro del frame. Debug (9) muestra los diagnósticos.
- Una carga fallida ofrece reintentar, cambiar servidor o volver.
- Se eliminó la telemetría a una dirección fija de PC. El registro remoto es opcional.

## Instalar o actualizar

1. En TizenBrew, agrega o actualiza el módulo de GitHub `erickzp93/lumitv`.
2. Cierra TizenBrew por completo y vuelve a abrirlo para recargar los metadatos y su servicio. La versión del módulo debe indicar **1.1.0**.
3. Mantén habilitado el modo desarrollador y el modo Debug de TizenBrew. Su configuración habitual usa la IP de desarrollador `127.0.0.1`.
4. Abre LuminaTV, selecciona un título y pulsa OK en **Pulsa OK para reproducir**.

La reproducción no necesita una PC ni una IP fija de la TV. El servicio se ejecuta en el propio TizenBrew y encuentra su conexión local de depuración. Si el servicio no está conectado, el reproductor muestra instrucciones y permite salir.

## Cómo funciona el control

`src/service.js` se incluye como `serviceFile` de TizenBrew, empaquetado en `dist/service.js`. Descubre los puertos locales que ya están escuchando, identifica exclusivamente la página de este módulo y utiliza el protocolo de depuración que TizenBrew ya habilita.

El servicio registra un binding solo en el contexto principal de LuminaTV. Sus comandos permitidos operan exclusivamente sobre el frame de `#player-iframe`: estado, play, pausa, alternar, saltar, activar sonido y clic. No abre un servidor público, ejecuta comandos de shell, modifica ajustes de seguridad ni expone evaluación arbitraria. Cada petición y muestra lleva una sesión para descartar respuestas de videos anteriores. Una actualización reemplaza la instancia anterior del servicio.

El navegador sigue aplicando sus restricciones entre dominios. El código de la página no intenta leer `iframe.contentWindow.document` ni supone que los mensajes de progreso del proveedor sean una API de control. `MEDIA_DATA`, que contiene historial guardado del proveedor, no se usa como reloj en vivo.

La disponibilidad, idiomas, subtítulos y formatos dependen de cada servidor. Un servidor puede fallar aunque otro funcione.

## Desarrollo

Se requiere Node.js 18 o posterior en la PC para las herramientas de desarrollo.

```sh
npm ci
npm run build
npm test
```

La salida del servicio se transpila para los motores Node antiguos usados por TizenBrew; no se necesita instalar dependencias en la TV. Después de editar `src/service.js`, vuelve a generar `dist/service.js` antes de publicar.

El registro remoto se puede activar guardando una URL propia en `localStorage.lumina_logger_url`. De forma predeterminada no se envían registros a ninguna PC.
