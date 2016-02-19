app.controller("chatController", function($scope, $http, $location, $timeout){

	$scope.userId = $scope.$parent.userId;
	$scope.userName = $scope.$parent.userName;
	$scope.userImageUrl = $scope.$parent.userImageUrl;;
	$scope.userEmail = $scope.$parent.userEmail;
	$scope.currentRoom = {name: 'Room 1', value: 'room1'};	
	$scope.msgs = [];
	$scope.membersRoom = [];
	$scope.warnText=""; 
	

	$scope.signOut = function(){
		var logout = gapi.auth2.getAuthInstance().signOut();
		$scope.$parent.justSignOut = true;
		$http.post("/signOut", {userName: $scope.userName, email:$scope.userEmail});;
		if(!logout.wc){
			$location.path("/login");
		}
	}
	   
    
    $scope.addMsg = function (msg) {
        $scope.$apply(function () {
        	var msgData = JSON.parse(msg.data);
        	if(msgData.Type === "Members"){
        		$scope.membersRoom = [];
        		delete msgData['Type'];
        		delete msgData['room'];
        		angular.forEach(msgData, function (memb){
        			memb = JSON.parse(memb);
        			$scope.membersRoom.push(memb);
        		});
        	}else if(msgData.Type === "Warn"){
        		$scope.warnText = msgData.warn;
        	}else{
        		msgData.time = new Date(msgData.time);
        		$scope.msgs.push(msgData);         		
        		var messagesDiv = document.getElementById("messages_div");
        		messagesDiv.scrollTop = messagesDiv.scrollHeight;
        	}
        });
    };
    
    
    
    /* posting chat text to server */
    $scope.submitMsg = function () {
        $http.post("/chat", { text: $scope.inputText, user: $scope.userName,
            time: (new Date()).toUTCString(), room: $scope.currentRoom.value, imageUrl: $scope.userImageUrl});
        $scope.inputText = "";
    };
    
	
    /* start listening on messages from selected room */
    $scope.listenMsg = function () {
        $scope.chatFeed = new EventSource("/chatFeed/" + $scope.currentRoom.value);
        $scope.chatFeed.addEventListener("message", $scope.addMsg, false);
        $timeout(setMember, 500);

    };
    
   function setMember(){
	   $http.post("/chatMembers", {userName: $scope.$parent.userName,
       	imageURL:$scope.$parent.userImageUrl, email:$scope.$parent.userEmail, action: "add", room: $scope.currentRoom.value});
   }
   
   $scope.$watch("warnText", function(newValue){
	   if(newValue){
		   $timeout(function(){
			   $scope.warnText=""; 			   
		   }, 5000);
	   }
   });
   
   $scope.blurFunction = function(){
//	   $timeout(function(){
//		   debugger;
//		   if(!document.hasFocus()){
//			   debugger; 
//			   $scope.$scope.signOut();
//		   }
//	   }, 3000)
	   
	   //TODO
   }
    
    $scope.listenMsg();    
});