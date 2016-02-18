
app.controller("chatController", function($scope, $http, $location){
	debugger;

	$scope.userId = $scope.$parent.userId;
	$scope.userName = $scope.$parent.userName;
	$scope.userImageUrl = $scope.$parent.userImageUrl;
//	$scope.userImageUrl = "http://www.imagensgratis.blog.br/imagens/imagens-imagens-que-se-mexem-para-celular-16.jpg";
	$scope.userEmail = $scope.$parent.userEmail
	
	$http.get("/getMembers").success(function(data){
		debugger;
	})

	$scope.signOut = function(){
		var logout = gapi.auth2.getAuthInstance().signOut();
		if(!logout.wc){
			$location.path("/login");
		}
	}
});