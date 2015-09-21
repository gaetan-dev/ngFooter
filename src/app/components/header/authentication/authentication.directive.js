(function() {
  'use strict';

  angular
    .module('footer')
    .directive('acmeAuthentication', acmeAuthentication);

  /** @ngInject */
  function acmeAuthentication() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/header/authentication/authentication.html',
      scope: {
      },
      controller: AuthenticationController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function AuthenticationController($rootScope, $scope, userService, authenticationService) {
      var vm = this;
      
      /* Variables */
      vm.firstName = '';
      vm.lastName = '';
      vm.email = '';
      vm.password = '';
      vm.warning = '';
      
      /* Methodes */
      vm.onLoginClick = onLoginClick;
      vm.onRegisterClick = onRegisterClick;
      vm.onSendRegisterClick = onSendRegisterClick;
      vm.onSendLoginClick = onSendLoginClick;
      vm.onLogoutClick = onLogoutClick;
      
      /* Views */
      vm.register = false; 
      vm.login = true;
      vm.logout = false;
      
      /**
      * Action when the user click on the register button
      * Switch on the register view
      * @method onRegisterClick
      */
      function onRegisterClick () {
        vm.register ? function() { return null; } : switchViews();
      }
      
      /**
      * Action when the user click on the login button
      * Switch on the loggin view
      * @method onLoginClick
      */
      function onLoginClick () {
        vm.login ?  function() { return null; } : switchViews();
      }
      
      /**
      * Action when the user click on the logout button
      * Logout the current user
      * @method onLogoutClick
      */
      function onLogoutClick () {
        authenticationService.logout().then(function () {
          $rootScope.user = undefined;
          vm.login = true;
          
          $scope.$parent.vm.registerOrLogin = (!vm.register && !vm.login) ? false : true;
        });        
      }
      
      /**
      * Action when the user click on the send button in the register view
      * Create and authentificate the user 
      * @method onSendRegisterClick
      */
      function onSendRegisterClick () {
        if (vm.firstName === '') { vm.warning = 'Veuillez indiquer votre nom'; return; }
        if (vm.lastName === '') { vm.warning = 'Veuillez indiquer votre prénom'; return; }
        if (vm.email === '') { vm.warning = 'Veuillez indiquer votre email'; return; }
        if (!vm.email.match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)) { vm.warning = 'Adresse email incorrecte'; return; }
        if (vm.password === '') { vm.warning = 'Veuillez indiquer votre mot de passe'; return; }
      
        userService.createUser({
          firstName: vm.firstName,
          lastName: vm.lastName,
          email: vm.email,
          password: vm.password
        })
        .then(function (response) {
          authentication(response.email, response.password);
        });
      }

      /**
      * Action when the user click on the send button in the login view
      * Authentificate the user 
      * @method onSendLoginClick
      */
      function onSendLoginClick () {
        if (vm.email === '') { vm.warning = 'Veuillez indiquer votre email'; return; }
        if (vm.password === '') { vm.warning = 'Veuillez indiquer votre mot de passe'; return; }
        if (!vm.email.match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)) { vm.warning = 'Adresse email incorrecte'; return; }
        
        authentication(vm.email, vm.password);
      }
  
      /**
      * Switch between the register view and the login view
      * @method switchViews
      */
      function switchViews() {
        vm.register = !vm.register;
        vm.login = !vm.login;
        vm.warning = '';
        
        $scope.$parent.vm.registerOrLogin = (!vm.register && !vm.login) ? false : true;
      } 
      
      /**
      * Close the register view and the login view when the user is authentificated
      * @method switchViews
      */
      function closeViews() {
        vm.register = false;
        vm.login = false;
        vm.warning = '';
        
        $scope.$parent.vm.registerOrLogin = (!vm.register && !vm.login) ? false : true;
      } 
      
      function authentication (email, password) {
        authenticationService.login(email, password)
        .then(function (response) {           
          var user = response.user;
          if (user) { 
            $rootScope.user = user; 
            closeViews();
          } else if (response.message.includes('Invalid Password')) {
            vm.warning = 'Mot de passe invalide';
          } else if (response.message.includes('Incorrect email')) {
            vm.warning = 'Email invalide';
          }
        });     
      }
    } 
  }
})();


