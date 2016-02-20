package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.UserVO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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

/**
 * Classe responsavel pelo controle da aplicacao
 * @author Lucas
 *
 */
public class Application extends Controller {


	private static Map<String, List<EventSource>> socketsPerRoom = new HashMap<String, List<EventSource>>();
	private JsonNode membersRoom;
	private EventSource currentSocket;

	//Responsavel pela inicializacao e renderizacao do html inicial Index
	public Result index() {
		return ok(index.render());
	}

	//Responsavel por repassar as mensagens enviadas para os demais usuarios
	public Result postMessage() {
		sendEvent(request().body().asJson());
		return ok();
	}

	//Executa e envia um evento para todos os (browser) usuarios logados
	public void sendEvent(JsonNode msg) {
		String room  = msg.findPath("room").textValue();
		if(socketsPerRoom.containsKey(room)) {
			socketsPerRoom.get(room).stream().forEach(es -> es.send(EventSource.Event.event(msg)));
		}
	}
	
	//Cria as conexoes dos membros 
	public Result chatFeed(String room) {
		JsonNode json = request().body().asJson();
	
		String remoteAddress = request().remoteAddress();

		return ok(new EventSource() {
			@Override
			public void onConnected() {
				currentSocket = this;

				this.onDisconnected(() -> {
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

	
	// Adiciona membros ao chat e envia um evento para todos avisando que ha um novo membro
	public Result chatMembers() {
		JsonNode members = request().body().asJson();
		HashMap<String,String> map = new Gson().fromJson(members.toString(), new TypeToken<HashMap<String, String>>(){}.getType());
		String room = map.get("room");
		String user = map.get("userName");
		String image = map.get("imageURL");
		String email = map.get("email");
		String addRemove = map.get("action");
		UserVO vo = new UserVO(user, image, email);

		String memberString = vo.toString();

		if(membersRoom == null){
			membersRoom = members;	
			((ObjectNode) membersRoom).removeAll();
			((ObjectNode) membersRoom).put("Type", "Members");
			((ObjectNode) membersRoom).put("room", room);
		}

		if(addRemove.equals("remove")){
			if(membersRoom.has(email)){
				((ObjectNode) membersRoom).remove(email);				
			}
		}else{
			((ObjectNode) membersRoom).put(email, memberString);			
		}
	

		sendEvent(membersRoom);
		return ok();
	}


	//Remove o usuario e a conexao
	public Result signOut(){
		JsonNode json = request().body().asJson();
		String email = json.get("email").textValue();
		String username = json.get("userName").textValue();
		
		((ObjectNode) membersRoom).remove(email);
		sendEvent(membersRoom);
		
		((ObjectNode) json).removeAll();
		((ObjectNode) json).put("Type", "Warn");
		((ObjectNode) json).put("room", membersRoom.get("room").textValue());
		((ObjectNode) json).put("warn", username+" left the room");
		
		sendEvent(membersRoom);
		sendEvent(json);
		currentSocket.close();
		socketsPerRoom.get(membersRoom.get("room").textValue()).remove(currentSocket);
		
		return ok();
	}

}
