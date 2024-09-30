# Instalacion del frontend base
### Requisitos
#### 1. Nodejs 14 o superior
#### 2. Git

### 1. Clonar el proyecto en local:
```sh
    git clone git@gitlab.justicia.gob.bo:atic/frontend-base.git
```

### 2. Instalar 

### 3. Acceder a la carpeta clonada y ejecutar:

```sh
$ yarn global add @quasar/cli
# or
$ npm install -g @quasar/cli   
```

### 4. Instalar las dependencias en el proyecto con los comandos

```sh
$ yarn install
# or
$ npm install
```


### 5. para levantar el proyecto en desarrollo, ejecutar:

```sh
$ quasar dev
```


### 5. para levantar el proyecto en produccioon, ejecutar:

```sh
# build for production
$ quasar build

# SSR
$ quasar build -m ssr

# PWA
$ quasar build -m pwa

# Mobile App
$ quasar build -m cordova -T [android|ios]
# or the short form:
$ quasar build -m [android|ios]

# passing extra parameters and/or options to
# underlying "cordova" executable:
$ quasar build -m ios -- some params --and options --here

# Electron App
$ quasar build -m electron
```

