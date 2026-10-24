# 📺 LuminaTV - Streaming Client para Samsung Smart TV (TizenBrew)

**LuminaTV** es una aplicación moderna y minimalista diseñada específicamente para televisores **Samsung Smart TV (Tizen)** a través de **TizenBrew**. Resuelve por completo el problema de incompatibilidad con el control remoto, soporta servidores embed mediante un cursor virtual interactivo, guarda automáticamente el progreso de reproducción y cuenta con modos Día y Noche.

---

## ✨ Características Principales

1. **100% Compatible con el Control Remoto (D-Pad):**
   - Navegación espacial bidimensional fluida.
   - Indicadores de foco brillantes y animados para pantallas grandes de 10 pies.
   - Soporte para botones nativos del control de Samsung: Flechas, Enter/OK, Botón Volver/Atrás (`10009`), Play, Pausa, Adelantar (+10s), Retroceder (-10s).

2. **Ratón Virtual Integrado (Solución a Servidores Embed):**
   - Para servidores web (como AutoEmbed o VidSrc) que requieren hacer clic en el botón de Play del video, LuminaTV incluye un **Cursor Virtual** que se mueve con las flechas del control y emula un clic de ratón con el botón OK.

3. **Guardado de Progreso y Reanudación Automática (Resume):**
   - Registra el minuto y segundo exacto de reproducción cada 3 segundos.
   - Fila destacada **"Continuar Viendo"** en la pantalla principal con barras de avance.
   - Botón **"Reanudar (mm:ss)"** al abrir un título para continuar donde lo dejaste.

4. **Diseño Moderno Flat (Modo Día y Noche):**
   - **Modo Día:** Interfaz limpia y brillante con fondos blancos (`#f8fafc`), tarjetas suaves y acentos azul cielo (`#0284c7`).
   - **Modo Noche:** Fondo azul medianoche profundo (`#070b14`) con acentos cian brillante (`#38bdf8`), ideal para ver películas con la luz apagada.

---

## 🚀 Publicación e Instalación en TizenBrew

Existen dos maneras de instalarla en tu televisor a través de TizenBrew:

### Opción A: Vía GitHub (Gratis y sin cuenta NPM)
1. Sube esta carpeta a un repositorio público en tu GitHub (por ejemplo: `mi-usuario/luminatv`).
2. En tu televisor, abre **TizenBrew > Module Manager > Agregar módulo de GitHub (Add GitHub Module)**.
3. Escribe:
   ```text
   tu-usuario/luminatv
   ```
4. Presiona **Completado**, pulsa la flecha **Arriba ⬆️** para guardar y ¡listo!

### Opción B: Vía NPM
1. En esta carpeta, inicia sesión en npm en tu computadora:
   ```bash
   npm login
   ```
2. Publica el paquete:
   ```bash
   npm publish --access public
   ```
   *(Nota: si el nombre `luminatv` ya está en uso, puedes cambiar el nombre en `package.json` a `@tu-usuario/luminatv`).*
3. En el televisor, ve a **TizenBrew > Module Manager > Agregar módulo NPM** y escribe tu paquete.
