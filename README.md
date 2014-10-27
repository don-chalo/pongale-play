Pongale Play
=================
#### Reproductor de música open source web-based.

### ¿Como funciona?
Corre en tu computador que contiene tu archivos de audio y accede a la aplicación en `<ip del computador>:3000`.

### Instrucciones de instalación
Una vez descargado, edita el archivo "config.json" antes de ejecutar el reproductor.
El atributo "path" corresponde a la carpeta que será escaneada en busca de archivos mp3.
El atributo "inicializarDB" indica si se debe inicializar la base de datos al iniciar la aplicación, lo que debería realizarce al ejecutar la aplicación la primera vez.
El array "noIncluir" contiene los archivos de audio que no serán incluidos o carpetas que no serán escaneadas al momento de inicializar la base de datos.
El array "tipos" contiene los tipos de archivos de audio soportados (actualmente solo soporta formato mp3).


Instalar con los siguientes comandos:
```
git clone https://github.com/don-chalo/pongale-play
cd PongalePlay/
npm install
```

Y ejecuta el servido con:
```
npm start
```

Si la aplicación esta escaneando por primera vez en busca de archivos, la aplicación demorará en mostrar bandas disponibles para escuchar, dependiendo de los archivos disponibles (20000 archivos ~ 10 minutos).
Ve a `localhost:3000` en tu navegador (o la ip del servidor si se está en una máquina diferente).

Para ejecutar las pruebas funcionales debes descargar el Selenium WebDriver (selenium-server-standalone-x.xx.x.jar) y copiarlo en la carpeta /lib. Actualmente solo se ejecutan en Firefox.
Para ejecutar las pruebas unitarias, la aplicación debe estar funcionando ya que uno de los test es sobre la api Rest de la aplicación.
La cobertura de las pruebas es mínima, solo se implementaron con el fin de interiorizarce con la tecnología.

### Características implementadas

- Funcionalidad de buscar banda.
- Lista de reproducción.
- Funcionalidades básicas (reproducir, pausa, tema siguiente, tema posterior, ajuste de volumen, silencio, barra de busqueda).
- Metadata del archivo de audio.
