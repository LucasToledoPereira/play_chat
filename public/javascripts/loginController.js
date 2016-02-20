
app.controller("loginController", function($scope, $http, $location){

	var scope = $scope;
	var httpService = $http;
	var location = $location;
	
	//Funcao responsavel pelo login e por mudar para proxima pagina
	$scope.changeLocation = function(){
		if($scope.$parent.justSignOut){
			gapi.auth2.getAuthInstance().signOut();
			$scope.$parent.justSignOut = false;
		}else{
			$location.path("/chat");	
			$scope.$apply();
		}
	}
	
	//Funcao responsavel por setar os valores do usuario
	$scope.setUser = function(user){
		$scope.$parent.userId = user.getId();
		$scope.$parent.userName = user.getName();
		$scope.$parent.userImageUrl = user.getImageUrl();
		$scope.$parent.userEmail = user.getEmail();
	}
	
	//Funcao de callback para o login via google
	$scope.onSuccessLogin = function(googleUser){
		var profile = googleUser.getBasicProfile();
		scope.setUser(profile);
		scope.changeLocation();
	}
	
	//Renderiza o botao de login do google
	gapi.signin2.render("googleLogin", {'onsuccess': $scope.onSuccessLogin});
});