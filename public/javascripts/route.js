app.config(function($routeProvider, $locationProvider)
{
   // remove o # da url
   $locationProvider.html5Mode({
	   enabled: true,
	   requireBase: false
	 });
   $routeProvider
   .when('/login', {
      templateUrl : 'login',
      controller  : 'loginController',
   }).
   when('/chat', {
	   templateUrl : 'chat',
	   controller  : 'chatController',
   })
   
   // caso não seja nenhum desses, redirecione para a rota '/'
   .otherwise ({ redirectTo: '/login' });
});