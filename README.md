# Chespirito Burger's — Pedidos por WhatsApp

App estática (sin backend, sin base de datos) para que el cliente arme su pedido
y lo envíe directo a tu WhatsApp. No guarda ningún dato del cliente en ningún
servidor: el mensaje se genera en el propio navegador y se abre en `wa.me`.

## Estructura

```
chespirito-burgers/
├── index.html          # Estructura de la página
├── css/style.css        # Estilos (negro/rojo, tema "tiquete de pedido")
├── js/app.js             # Lógica: carrito, render, mensaje de WhatsApp
├── data/menu.json        # Menú completo — edítalo aquí, no en el código
└── README.md
```

## Personalizar

- **Número de WhatsApp:** en `data/menu.json`, campo `restaurant.phone`.
  Debe ir en formato internacional sin `+` ni espacios (ej. `573134304522`
  para Colombia: `57` + el número).
- **Productos y precios:** también en `data/menu.json`. Cada categoría tiene
  una lista de `items` con `id`, `name`, `price`, `description` y, opcional,
  `badge` (para una etiqueta tipo "Especial").
- **Colores:** variables CSS al inicio de `css/style.css` (`--red`, `--gold`,
  `--black`, etc).

El carrito recuerda la selección del cliente en su propio navegador
(`localStorage`) mientras arma el pedido; si prefieres que no persista nada
entre visitas, borra las llamadas a `localStorage` en `js/app.js`
(`Cart.restore` y el método privado `#persist`).

## Cómo funciona el envío

Al presionar "Enviar pedido por WhatsApp", la app arma un texto con los
productos, cantidades y total, y abre:

```
https://wa.me/<numero>?text=<mensaje-codificado>
```

Eso abre WhatsApp (app o web) con el mensaje ya escrito, listo para que el
cliente le dé enviar. Nada pasa por un servidor tuyo.

## Cómo probarlo localmente

Como usa `fetch()` para cargar `menu.json`, no puedes simplemente abrir
`index.html` con doble clic (los navegadores bloquean `fetch` sobre `file://`).
Levanta un servidor local simple:

```bash
# con Python
python3 -m http.server 8000

# o con Node
npx serve .
```

Y abre `http://localhost:8000`.

## Dónde alojarlo gratis

Cualquiera de estas opciones sirve, son 100% gratis para un sitio estático
como este:

### Opción A — GitHub Pages (recomendada, ya que mencionaste GitHub)
1. Crea un repositorio nuevo en GitHub y sube esta carpeta (o su contenido).
2. Ve a **Settings → Pages**.
3. En "Source" elige la rama `main` y la carpeta `/root`.
4. Guarda. En un par de minutos tu sitio queda en
   `https://tu-usuario.github.io/tu-repo/`.
5. Cada vez que hagas `git push` con cambios, el sitio se actualiza solo.

### Opción B — Netlify (la más rápida para empezar)
1. Entra a [app.netlify.com](https://app.netlify.com) y crea una cuenta gratis.
2. Arrastra la carpeta `chespirito-burgers` completa a la zona de "Deploy".
3. Netlify te da una URL al instante (puedes cambiarle el subdominio).

### Opción C — Vercel
1. Entra a [vercel.com](https://vercel.com), conecta tu cuenta de GitHub.
2. Importa el repositorio (mismo repo de la Opción A funciona).
3. Deploy automático, sin configuración adicional (es un sitio estático).

Las tres opciones incluyen HTTPS gratis, que es importante porque
WhatsApp Web/`wa.me` funciona mejor desde sitios servidos por HTTPS.

## Notas de privacidad

- No hay base de datos, no hay backend, no hay analítica ni cookies.
- El nombre/nota que el cliente escribe solo viaja dentro del mensaje de
  WhatsApp que él mismo envía; la app no lo transmite ni almacena en
  ningún otro lugar.
