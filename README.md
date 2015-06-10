# Pongale Play

#### Reproductor de música open source web-based.

## ¿Como funciona?
Corre en tu computador que contiene tus archivos de audio y accede a la aplicación en `<ip del computador>:30010`.

## Instrucciones de instalación
Descarga `Pongale Play` desde esta página `https://github.com/don-chalo/pongale-play`.
También tienes la opción de descargarlo con git:
```
git clone https://github.com/don-chalo/pongale-play.git
```

Ya descargado, ejecuta los siguientes comandos:
```
cd pongale-play/
npm install
```

### Escanear archivos de música
#### Configuración
Para utilizar el reproductor de música primero debes escanear la carpeta que contiene los archivos mp3. Para esto debes editar el archivo `scan.json` de la carpeta `config`.
El atributo `path` indica la carpeta que se escaneará en busca de archivos mp3. Esta carpeta debe ser una subcarpeta, directa o indirectamente, de la carpeta del atributo `src` y sirve para no escanear toda la carpeta que contiene los mp3's.
El atributo `src` corresponde a la carpeta raiz en la cual se encuentran los archivos de audio. Debe ser una carpeta padre del atributo `path`. En base a esta carpeta se referenciaran todos los archivos a reproducir y si este valor cambia los archivos antes escaneados no podrán reproducirse :)
El atributo `modo` indica si los archivos a leer serán agregados a los existentes (con el valor "a") o primero se borrarán completamente los existentes antes de insertar los nuevos valores (con el valor "w").
El atributo `noIncluir` es un array donde se agregan los archivos que no desean ser agregados a la librería.
El atributo `tipos` es para indicar los formatos soportados, pero actualmente solo soporta mp3 :)

Ejemplo:
```
{
    "path": "/Bill Evans",
    "src": "C:/Musica",
    "modo": "w",
    "noIncluir": [],
    "tipos: ["mp3"]
}
```

#### Escaneo
Una vez editado el archivo, debes entrar en la carpeta `scripts` y ejecutar el comando:
```
node scan.js
```
Lo que hace este script es leer los tag de tus mp3 para poblar la base de datos.

El escaneo lo puedes hacer antes o después de ejecutar la aplicación.

### Ejecutar la aplicación
Hecho el escaneo de archivos de música, puedes ejecutar la aplicación:
```
npm start
```

Ve a `localhost:30010` en tu navegador (o la ip del servidor si se está en una máquina diferente).

Puedes reproducir directamente un disco o un tema presionando el botón play en cada uno de estos.

## Características implementadas
- Funcionalidad de buscar banda.
- Lista de reproducción.
- Puedes eliminar temas de la lista de reproducción seleccionando uno y presionar tecla `suprimir`. También puedes eliminar varios manteniendo presionada la tecla `control` cuando seleccionas.
- Funcionalidades básicas (reproducir, pausa, tema siguiente, tema posterior, ajuste de volumen, silencio, barra de busqueda).
- Metadata del archivo de audio.

## Por hacer
- Mejorar lo que es el streaming cuando se reproduce un tema. Actualmente al reproducir un tema no se utiliza streaming.
