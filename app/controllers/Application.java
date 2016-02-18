package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.UserVO;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import play.*;
import play.mvc.*;
import views.html.*;
import play.libs.EventSource;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http.RequestBody;
import play.mvc.Result;

public class Application extends Controller {
	
	HashMap<String, UserVO> memberList = new HashMap<String, UserVO>();
	
	/** Keeps track of all connected browsers per room **/
	  private static Map<String, List<EventSource>> socketsPerRoom = new HashMap<String, List<EventSource>>();
	  

    public Result index() {
        return ok(index.render());
    }
    
    /**
     * Controller action for POSTing chat messages
     */
    public Result postMessage() {
      sendEvent(request().body().asJson());
      return ok();
    }
    
    /**
     * Send event to all channels (browsers) which are connected to the room
     */
    public void sendEvent(JsonNode msg) {
      String room  = msg.findPath("room").textValue();
      if(socketsPerRoom.containsKey(room)) {
        socketsPerRoom.get(room).stream().forEach(es -> es.send(EventSource.Event.event(msg)));
      }
    }
    
    
    /**
     * Establish the SSE HTTP 1.1 connection.
     * The new EventSource socket is stored in the socketsPerRoom Map
     * to keep track of which browser is in which room.
     *
     * onDisconnected removes the browser from the socketsPerRoom Map if the
     * browser window has been exited.
     * @return
     */
    public Result chatFeed(String room) {
      String remoteAddress = request().remoteAddress();
      Logger.info(remoteAddress + " - SSE conntected");

      return ok(new EventSource() {
        @Override
        public void onConnected() {
          EventSource currentSocket = this;

          this.onDisconnected(() -> {
            Logger.info(remoteAddress + " - SSE disconntected");
            socketsPerRoom.compute(room, (key, value) -> {
              if(value.contains(currentSocket))
                value.remove(currentSocket);
              return value;
            });
          });

          // Add socket to room
          socketsPerRoom.compute(room, (key, value) -> {
            if(value == null){
            	 ArrayList<EventSource> currentArray = new ArrayList<EventSource>();
            	 currentArray.add(currentSocket);
              return currentArray;
            }else
              value.add(currentSocket); return value;
          });
        }
      });
    }
    
	
    
    
	public Result getMembers(){
		return ok(Json.toJson(memberList));
	}
	
	
	
	 public Result addMember() {
		 JsonNode teste = request().body().asJson();
		 HashMap<String,String> map = new Gson().fromJson(teste.toString(), new TypeToken<HashMap<String, String>>(){}.getType());
		 String user = map.get("userName");
		 String image = map.get("imageURL");
		 String email = map.get("email");
		 UserVO vo = new UserVO(user, image, email);
		 memberList.put(email, vo);
	     return ok(Json.toJson(memberList));   
	 }
	 
	 public Result renderLogin(){
		 return ok(login.render());
	 }
	 
	 public Result renderChat(){
		 return ok(chat.render());
	 }
	 
}
