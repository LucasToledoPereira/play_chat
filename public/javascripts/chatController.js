
app.controller("chatController", function($scope, $http, $location){
	debugger;

	$scope.userId = $scope.$parent.userId;
	$scope.userName = $scope.$parent.userName;
	$scope.userImageUrl = $scope.$parent.userImageUrl;
//	$scope.userImageUrl = "http://www.imagensgratis.blog.br/imagens/imagens-imagens-que-se-mexem-para-celular-16.jpg";
	$scope.userEmail = $scope.$parent.userEmail;
	$scope.currentRoom = {name: 'Room 1', value: 'room1'};	
	$scope.msgs = [];
	
	$http.get("/getMembers").success(function(data){
		debugger;
	})

	$scope.signOut = function(){
		var logout = gapi.auth2.getAuthInstance().signOut();
		if(!logout.wc){
			$location.path("/login");
		}
	}
	
	
	
    /** handle incoming messages: add to messages array */
    $scope.addMsg = function (msg) {
        $scope.$apply(function () { $scope.msgs.push(JSON.parse(msg.data)); });
    };
    
    
    /** posting chat text to server */
    $scope.submitMsg = function () {
        $http.post("/chat", { text: $scope.inputText, user: $scope.userName,
            time: (new Date()).toUTCString(), room: $scope.currentRoom.value });
        $scope.inputText = "";
    };
    
	
    /** start listening on messages from selected room */
    $scope.listen = function () {
        $scope.chatFeed = new EventSource("/chatFeed/" + $scope.currentRoom.value);
        $scope.chatFeed.addEventListener("message", $scope.addMsg, false);
    };
    
    $scope.listen();
    
});