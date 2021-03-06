# Ejercicio Práctico para Mercado Libre

## Dependencias
- Node v6.12

## Ejecución

#### NPM

````bash
$ npm start <Id producto>
````

#### Docker

````bash
$ docker build --tag="ep_pabarch" . 
$ docker run -ti --rm -v $PWD/output:/app/output ep_pabarch npm start <Id producto>
````

Leer output:
```bash
$ cat ./output/output.txt
```


## Características generales

- Configuración por ambiente.
- ESLint (npm run linter).
- Inversion of control container.
- Pruebas unitarias (mocha, chai, chai-as-promised, sinon).
- Code coverage (npm run test:cover).
- Uso de Promises.
- Módulo cache: Persistencia mediante archivos por simplicidad (soporta MongoDB).
- Nivel debug logging.


## Consideraciones de performance

- Cliente API: Solicitud de atributos mediante parámetro "attributes".
- Cache cliente API: Soporte header Cache-Control (max-age, stale-while-revalidate, stale-if-error).
- Cache cliente API: Soporte header "If-None-Match".
- Cliente HTTP: agente HTTP "forever" para mantener conexiones abiertas entre peticiones keep-alive.
- Cliente HTTP: Soporte compresión Gzip.
- Resolución de recursos HTTP en paralelo.

