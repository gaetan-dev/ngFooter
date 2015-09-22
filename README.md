# ngFooter
Footer Website (Angular)

## Getting started

To install the node-modules run:

```sh
$ npm install
```

To install the bower-component run:

```sh
$ bower install
```

## Run with gulp

This application use the gulp task-runner: 

### Local database (mock)

```sh
$ gulp serve stubby config --env=mock
```

### Connect with the footer API database

```sh
$ gulp serve config --env=dev
```

## Security
### Authentication

This application use the cookie authentification: 

```javascript
function config($logProvider, toastr, $httpProvider) {
    /*
    ...
    */
    
    $httpProvider.defaults.withCredentials = true;
}
```

## Auhtorization

[Stackoverflow: angular ui-router login authentication](http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication)





