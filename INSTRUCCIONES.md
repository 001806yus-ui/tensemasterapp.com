# TenseMaster — versión corregida

Esta versión mantiene el precio actual del código: **$5.99 USD al mes**.

## Qué cambió

- La aplicación comienza en inglés.
- El selector de la barra superior permite elegir entre 14 idiomas y guardar la elección.
- Cada lección tiene su propio selector de idioma.
- Se añadieron explicaciones en inglés para los 12 tiempos y las instrucciones y respuestas explicadas de los 132 ejercicios.
- Las frases que el alumno estudia y las respuestas de los ejercicios se conservan en inglés.
- Cada ejemplo muestra su propia traducción; ya no repite la traducción del primer ejemplo.
- El panel de membresía ya no muestra el precio anterior de $1.99.
- Se corrigió un error que podía impedir abrir Mi progreso.
- Los alumnos nuevos comienzan con progreso y XP en cero.

## Para abrir el proyecto en la computadora

1. Extrae el ZIP en una carpeta.
2. Instala Node.js 24 si todavía no está instalado.
3. Abre una terminal dentro de esa carpeta.
4. Ejecuta `npm ci` y luego `npm run dev`.
5. Abre `http://localhost:3000` en el navegador.

No hace falta una clave de IA para estudiar el curso en inglés. Para el tutor y las traducciones completas de textos adicionales, hace falta configurar el servicio de IA en el servidor. Las traducciones principales de los menús y del panel de membresía ya están incluidas; los textos adicionales se traducen al conectarse al servicio y se guardan en el dispositivo.

## Lo que falta antes de vender membresías

### Audio más natural

El menú de voces permite escuchar muestras y elegir una voz en inglés realmente instalada en el dispositivo. Ya no promete voces específicas que quizá no estén disponibles. Se corrigieron la selección de voz, la velocidad y la cancelación para que no se superpongan audios ni se corte una frase a los 200 caracteres.

También se preparó una conexión con voz de IA de estilo cálido y conversacional para ejemplos de las lecciones. Está apagada de forma predeterminada y todavía necesita configurarse, activarse y probarse de oído. Mientras tanto se usan las voces del dispositivo. No se generaron audios de pago ni se hicieron cobros. La voz del tutor con respuestas nuevas seguirá usando el dispositivo hasta conectar cuentas reales y límites de uso.

No basta con subir el ZIP para activar la voz de IA: hace falta que el servidor tenga el servicio de audio configurado. La configuración está explicada en README.md y .env.example; las claves privadas se guardan en el servidor.

### Página publicada y tiendas móviles

La revisión del 11 de octubre de 2026 confirmó que www.tensemasterapp.com sigue mostrando la versión anterior, con precios de $1 y $1.99. Este ZIP contiene los cambios nuevos, pero no se ha publicado en ese dominio.

El orden recomendado es: publicar y probar la versión corregida; conectar registro, inicio de sesión y progreso del alumno; configurar membresías verificadas; preparar las versiones de Android y iPhone y sus publicaciones.

Como el objetivo incluye Google Play y App Store, los cobros dentro de las aplicaciones deben diseñarse según las reglas de cada tienda y país. Stripe puede servir para la página web. No hace falta abrir una cuenta de cobros para probar primero el funcionamiento del curso y las voces.

El pago del proyecto original era una demostración: no verificaba cobros. Esta versión muestra «Las inscripciones abrirán pronto» y permite estudiar las dos lecciones gratuitas.

Todavía hace falta conectar la cuenta del alumno con un pago real, confirmar el cobro desde el servidor, desbloquear su acceso y permitir administrar o cancelar la suscripción. Un enlace de Stripe por sí solo no hace todo eso.

El foro, los duelos y la tabla de posiciones siguen siendo demostraciones locales. No hay aún una comunidad conectada entre alumnos.

El ZIP contiene el código corregido. La aplicación que ya está publicada necesita recibir esta nueva versión antes de mostrar los cambios.

Las comprobaciones de código, compilación y pruebas de interacción pasaron. No se realizaron pagos ni llamadas a la IA de pago durante esta revisión. Falta probar el audio y la presentación visual en navegadores y teléfonos reales, además de las conexiones de IA y cobro.
