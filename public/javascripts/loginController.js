
app.controller("loginController", function($scope, $http, $location){
//	// get names using AngularJS AJAX API  
//	debugger;
//	$http.get('/getNames').success(function(data){
//		$scope.names = data;
//	});
//	$scope.teste = function (){
//		var args = [$scope.password, $scope.user]
//		$http.get('/teste/teste').success(function(data){
//			debugger;
//		});
//	}
	$scope.doLogin = function (){
//		var auth2 = gapi.auth2.getAuthInstance();
		$location.path("/chat");
	}
	var scope = $scope;
	var httpService = $http;
	var location = $location;
	
	$scope.changeLocation = function(){
		if($scope.$parent.justSignOut){
			gapi.auth2.getAuthInstance().signOut();
			$scope.$parent.justSignOut = false;
		}else{
			$location.path("/chat");	
			$scope.$apply();
		}
	}
	
	$scope.setUser = function(user){
		$scope.$parent.userId = user.getId();
		$scope.$parent.userName = user.getName();
		$scope.$parent.userImageUrl = user.getImageUrl();
		$scope.$parent.userEmail = user.getEmail();
	}
	
	$scope.onSuccessLogin = function(googleUser){
		var profile = googleUser.getBasicProfile();
		scope.setUser(profile);
		scope.changeLocation();
	}
	gapi.signin2.render("googleLogin", {'onsuccess': $scope.onSuccessLogin});
});