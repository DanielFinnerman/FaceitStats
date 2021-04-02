const apiUrl = 'https://open.faceit.com/data/v4/players?nickname=';
const apiKey = config.API_KEY;

/*setup search button to trigger the getData function*/
document.getElementById('searchButton').addEventListener('click', () => getData(document.getElementById('userInput').value));

/*setup enter to trigger the getData function*/
let input = document.getElementById("userInput");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById('searchButton').click();
    }
});


const getData = async (nick) => { //async function popped when enter/search button pressed
    document.getElementById('failed').style.display = "none"

    const setti = document.getElementById("setit"); //dont show div before fetch
    setti.style.display="none"

    let para = document.createElement("h3");
    let loadtext = document.createTextNode("Loading..."); //loading text while fetching
    para.appendChild(loadtext);
    var element = document.getElementById("loading");
    element.appendChild(para);

    /*first http request api fetch to get player_id, country, avatar from nickname info*/
    const response = await fetch(apiUrl + nick, { // only proceed once promise is resolved
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        }
        
    });
    if (response.status == 404) { //if nickname is not registered to faceit, cancel next api requests
        para.style.display = "none";
        document.getElementById('failed').style.display = "block"
        document.getElementById('failed').textContent = "Couldn't find requested user"
    } else {

    const data = await response.json();  // only proceed once second promise is resolved

        id = data.player_id;

      /*second api fetch (for detailed data from chosen player)  */
      const response2 = await fetch('https://open.faceit.com/data/v4/players/' + id + '/stats/csgo', {
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        }
    });

    const data2 = await response2.json();

    
    /*api fetch for elo history*/
    const response3 = await fetch('https://api.faceit.com/stats/api/v1/stats/time/users/' + id + '/games/csgo?size=2000', {
    });

    const data3 = await response3.json();


    /*initialize data for elo graph*/
    const elo_items = []; //array for elo history

    /*push data from json request to the array*/
    data3.forEach(element => {
      elo_items.push({y: parseInt(element.elo)});
    });

    elo_items.reverse(); //elo from start till today


    


    kd_ratio = data2.lifetime['Average K/D Ratio']
    wl_ratio = data2.lifetime['Win Rate %']

    //console.log(data);

    currentElo = data.games.csgo.faceit_elo
    lvl = data.games.csgo.skill_level
    console.log(lvl);

    trolling = data.infractions.last_infraction_date


    const { nickname, country, avatar, steam_id_64 } = data;



    //populate the divs
    document.getElementById('nick').textContent = nickname;
    document.getElementById('player_kd').textContent = 'K/D Ratio: ' + kd_ratio;
    //const urli = document.getElementById('steam_id').textContent = 'https://steamcommunity.com/profiles/' + steam_id_64;
    document.getElementById('elo').textContent = 'Elo: ' + currentElo;
    document.getElementById('wl').textContent = 'Win/Lose Ratio: ' + wl_ratio + '%';
    document.getElementById('dodge').textContent = 'Last rage quit: ' + trolling;
    const image = document.getElementById('avatar');
    image.src = avatar;

    const flag_icon = document.getElementById('flag');
    flag_icon.src = 'https://faceitfinder.com/resources/flags/svg/' + country +'.svg';
    flag_icon.height = 25;
    flag_icon.width = 25;



    //icons/images with links
    const lvl_icon = document.getElementById('lvl');
    lvl_icon.src = 'https://faceitfinder.com/resources/ranks/skill_level_' + lvl + '_lg.png';
    const faceit_link = document.getElementById('faceit_link');
    faceit_link.href = 'https://www.faceit.com/en/players/' + nickname;

    const faceit_link2 = document.getElementById('faceit_link2');
    faceit_link2.href = 'https://www.faceit.com/en/players/' + nickname;

    const faceit_link3 = document.getElementById('faceit_link3');
    faceit_link3.href = 'https://www.faceit.com/en/players/' + nickname;
    const faceit_logo = document.getElementById('faceit_img');
    faceit_logo.src = './images/tabIcon.png'

    const steam_icon = document.getElementById('steam_link');
    steam_icon.src = './images/steam_icon.png'
    const steam_link = document.getElementById('steam_id');
    steam_link.href = 'https://steamcommunity.com/profiles/' + steam_id_64;

    para.style.display="none"
    setti.style.display="block"


    //setupping and rendering the elo history chart

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "dark1",
      title:{
        text: "Elo history"
      },
      axisX: {						
        title: "Matches",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
        
      },
      axisY: {						
        title: "Elo",
        crosshair: {
          enabled: true
        }       
      },
      toolTip:{
        shared:true
      },
      data: [{
        lineColor: "#ff6000",
        name: "Elo",        
        type: "line",
            indexLabelFontSize: 16,
            dataPoints: elo_items, //use elo_items array as y-value
            //x value is the amount of elo_items (amount of matches)
      }]
    });
    chart.render();


    }

}
