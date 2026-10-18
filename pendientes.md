# Pendientes

## Backend / infraestructura

- **CORS del bucket S3 de imágenes** (`smartventa-staging.s3.amazonaws.com`, ruta `media/`). Las respuestas no traen `Access-Control-Allow-Origin`, así que el navegador bloquea las imágenes que `src/components/products/ProductCatalog/catalogPdf.js` descarga (`Image` con `crossOrigin="anonymous"` → canvas) y el catálogo en PDF sale sin imágenes (con aviso). Corrección sugerida: en cada bucket (staging y producción) agregar una regla CORS con `AllowedMethods: ["GET"]`, `AllowedOrigins` con los orígenes del frontend (`http://localhost:3000`, staging y producción) y `AllowedHeaders: ["*"]`. Si tras configurarlo siguen fallando, probar en ventana privada: una imagen cacheada sin cabeceras CORS se reutiliza y vuelve a fallar.
