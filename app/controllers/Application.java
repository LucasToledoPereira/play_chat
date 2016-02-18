package controllers;

import java.util.HashMap;
import java.util.Map;

import models.UserVO;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import play.*;
import play.mvc.*;
import views.html.*;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http.RequestBody;
import play.mvc.Result;

public class Application extends Controller {
	
	HashMap<String, UserVO> memberList = new HashMap<String, UserVO>();

    public Result index() {
        return ok(index.render());
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
