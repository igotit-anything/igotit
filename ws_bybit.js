// file : ws_bybit.js

// WebSocket Creation
const my_ws = new WebSocket("wss://stream.bybit.com/v5/public/linear");

// event handler : websocket open  
my_ws.addEventListener("open", function (event) {
 
  //document.write("bybit WebSocket Opened<br>");
  my_ws.send('{"op": "subscribe","args": ["publicTrade.BTCUSDT"]}');
});

// event handler : websocket close
my_ws.addEventListener("close", function (event) {
  //document.write("WebSocket Closed<br>");
});

// event handler : received data
my_ws.addEventListener("message", function (event) {
  
  parsing(event.data);
  
});

function parsing(str_json)
{
  const obj_json = JSON.parse(str_json);
  var data_arr = obj_json.data;
  //const num_arr = data_arr.length;
  //document.write(num_arr+"<br>");
  for(var idx=0; idx < data_arr.length;idx++)
  {
     //document.write("Side : " + data_arr[idx].S + ", ");
     //document.write("Price : " + data_arr[idx].p + ", ");
     //document.write("Volume : " + data_arr[idx].v + "<br>");
     renew_chart(Number(data_arr[idx].T) ,Number(data_arr[idx].p));
  }

};

///////////  chart 
var data_real = new Array(2);
for(var i=0;i<2;i++){
  data_real[i] = new Array(2);
}
for(var i=0;i<2;i++){
  for(var j=0; j<2; j++){
    data_real[i][j] = 30000;
  }
}


let opts = {
  title: "BTCUSDT tick from bybit",
  id: "chart1",
  class: "my-chart",
  width: 400,
  height: 200,
  series: [
    {},
    {
      // initial toggled state (optional)
      show: true,

      spanGaps: false,

      // series style
      stroke: "red",
      width: 2,
      fill: "rgba(0, 0, 200, 0.3)",
      //dash: [10, 5],
    }
  ],
};

let my_uplot = new uPlot(opts, data_real, document.body);


	/** sets the chart data & redraws. (default resetScales = true) */
//	setData(data: uPlot.AlignedData, resetScales?: boolean): void;
function renew_chart(_time, _price)
{
  data_real[0].push(_time/1000); 
   
  data_real[1].push(_price);
  
  if(data_real[0].length >= 100){
  data_real[0].shift() ;// 배열 첫요소 제거.
  data_real[1].shift(); 

  }

  my_uplot.setData(data_real);
};

