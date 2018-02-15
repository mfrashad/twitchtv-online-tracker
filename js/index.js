var userName = ["ESL_SC2",  "cretetion", "freecodecamp", "storbeck", "habathcx","OgamingSC2", "RobotCaleb", "noobs2ninjas"]
var userId;
var user;
var streams = [];
var channels = [];

$(document).ready(function() {
  getUser();
  $("#btn").on("click",initElement);
})

function getStreamer(){
  $.ajax({
    type:"GET",
    url:"https://api.twitch.tv/kraken/streams/?stream_type=all&channel="+userId.join(),
    headers: {
   'Client-ID': 'k4w8h82cjou6m8bt6902sgipk1yc04',
   'Accept': 'application/vnd.twitchtv.v5+json'
    },
    success:function(data) {
      console.log(user);
      streams = data.streams;
      console.log(streams);
      initChannels();
    },
    error:function(){
      alert("Error");
    }
  });
}

function getUser(){
  $.ajax({
    type:'GET',
    url:'https://api.twitch.tv/kraken/users?login='+userName.join(),
    headers: {
   'Client-ID': 'k4w8h82cjou6m8bt6902sgipk1yc04',
   'Accept': 'application/vnd.twitchtv.v5+json'
    },
    success: function(data){
      console.log(data.users);
      user = data.users;
      userId = user.map(x => x._id);
      getStreamer();
    },
    error: function(){
      alert("error");
    }
    
  });
};

function initChannels() {
  for(i=0;i<user.length;i++){
    channels[i] = {};
    channels[i].id = user[i]._id;
    channels[i].displayName = user[i].display_name;
    channels[i].bio = user[i].bio;
    channels[i].logo = user[i].logo;
    channels[i].url = "https://www.twitch.tv/"+channels[i].displayName;
    channels[i].live = null;
    for(j=0;j<streams.length;j++){
      if(channels[i].id==streams[j].channel._id){
        channels[i].live = {game:streams[j].channel.game,
                          status:streams[j].channel.status};
      }
    }
  }
  console.log(channels);
  initElement(channels,$("#all"));
  initElement(channels.filter(channels => channels.live),$("#online"));
  initElement(channels.filter(channels => !channels.live),$("#offline"));
}

function initElement(channels, tabObj){
  for(i=0;i<channels.length;i++){
    var row = $("<div>", {"class":"streamer-container row"});
    
    var logo = $("<img>", {src:channels[i].logo, "class":"logo"});
    var colLogo = $("<div>",{"class":"col-md-2 text-center vertical"}).append(logo);
    var header = $("<h4>").text(channels[i].displayName);
    var colHeader = $("<div>",{"class":"col-md-2 vertical"}).append(header);
    
    var status = $("<h5>",{"class":"text-center"});
    if(channels[i].live!==null){
      status.html(channels[i].live.game+" :<br><small id='small'>"+channels[i].live.status+"</small>");
      $(row).addClass("live");
    } else {
      status.text("Offline");
    }
    var colStatus = $("<div>",{"class":"col-md-8 text-center"}).append(status);
    
    row.append(colLogo).append(colHeader).append(colStatus);
    row = $("<a>",{href:channels[i].url, target:"_blank"}).append(row);
    
    tabObj.append(row);
  }
 
}