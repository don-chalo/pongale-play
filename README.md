# Pongale Play

#### Reproductor de música open source web-based.

## ¿Como funciona?
Corre en tu computador que contiene tus archivos de audio y accede a la aplicación en `<ip del computador>:30010`.

## Instrucciones de instalación

Instalar con los siguientes comandos:
```
git clone https://github.com/don-chalo/pongale-play.git
cd PongalePlay/
npm install
```

### Escanear archivos de música
#### Configuración
Para utilizar el reproductor de música primero debes escanear la carpeta que contiene los archivos mp3. Para esto debes editar el archivo `scan.json` de la carpeta `config`.
El atributo `path` indica la carpeta que se escaneará en busca de archivos mp3.
El atributo `src` corresponde a la carpeta raiz en la cual se encuentran los archivos de audio. Debe ser una carpeta padre del atributo `path`.
El atributo `modo` indica si los archivos a leer serán agregados a los existentes (con el valor "a") o primero se borrarán completamente los existentes antes de insertar los nuevos valores (con el valor "w").
El atributo `noIncluir` es un array donde se agregan los archivos que no desean ser agregados.
El atributo `tipos` es para indicar los formatos soportados, pero actualmente solo soporta mp3 :)

Ejemplo:
```
{
    "path": "C:/Musica/Bill Evans",
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

### Ejecutar la aplicación
Hecho el escaneo de archivos de música, puedes ejecutar la aplicación:
```
npm start
```

El escaneo lo puedes hacer antes o después de ejecutar la aplicación.

Ve a `localhost:30010` en tu navegador (o la ip del servidor si se está en una máquina diferente).


## Características implementadas
- Funcionalidad de buscar banda.
- Lista de reproducción.
- Funcionalidades básicas (reproducir, pausa, tema siguiente, tema posterior, ajuste de volumen, silencio, barra de busqueda).
- Metadata del archivo de audio.
