app.config(function($routeProvider, $locationProvider)
{
   // remove o # da url
   $locationProvider.html5Mode({
	   enabled: true,
	   requireBase: false
	 });
   $routeProvider
   .when('/login', {
      templateUrl : 'assets/templates/login.html',
      controller  : 'loginController',
   }).
   when('/chat', {
	   templateUrl : 'assets/templates/chat.html',
	   controller  : 'chatController',
   })
   
   // caso não seja nenhum desses, redirecione para a rota '/'
   .otherwise ({ redirectTo: '/login' });
});