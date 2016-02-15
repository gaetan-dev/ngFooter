(function () {
  'use strict';

  angular
    .module('footer')
    .controller('AdminController', AdminController);

  /** @ngInject */
  function AdminController(users, userService) {
    var vm = this;

    /* Variables */
    vm.users = users;
    vm.newPassword = '';

    /* Methodes */
    vm.clickOnResetPassword = clickOnResetPassword;

    function clickOnResetPassword(user) {
      if (vm.newPassword.length >= 6) {
        user.password = vm.newPassword;
        userService.updateUser(user.id, user);
      } else {
        console.log("Mot de passe trop court (6 charactères min)");
      }
    }

  }
})();
