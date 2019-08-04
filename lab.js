var dht1;
var ph;
var power;
var dht2;
var dht;
var matrix;
var photocell;
var photocell_value;
var _E7_B9_BC_E9_9B_BB_E5_99_A8;
var _E9_9B_BB_E6_BA_90_E9_96_8B_E9_97_9C;
var temp;
var myData;
var myFirebase;

function get_date(t) {
  var varDay = new Date(),
    varYear = varDay.getFullYear(),
    varMonth = varDay.getMonth() + 1,
    varDate = varDay.getDate();
  var varNow;
  if (t == "ymd") {
    varNow = varYear + "/" + varMonth + "/" + varDate;
  } else if (t == "mdy") {
    varNow = varMonth + "/" + varDate + "/" + varYear;
  } else if (t == "dmy") {
    varNow = varDate + "/" + varMonth + "/" + varYear;
  } else if (t == "y") {
    varNow = varYear;
  } else if (t == "m") {
    varNow = varMonth;
  } else if (t == "d") {
    varNow = varDate;
  }
  return varNow;
}

function get_time(t) {
  var varTime = new Date(),
    varHours = varTime.getHours(),
    varMinutes = varTime.getMinutes(),
    varSeconds = varTime.getSeconds();
  var varNow;
  if (t == "hms") {
    varNow = varHours + ":" + varMinutes + ":" + varSeconds;
  } else if (t == "h") {
    varNow = varHours;
  } else if (t == "m") {
    varNow = varMinutes;
  } else if (t == "s") {
    varNow = varSeconds;
  }
  return varNow;
}


boardReady({device: 'o857'}, function (board) {
  board.samplingInterval = 1000;
  dht1 = 0;
  ph = 0;
  power = 0;
  dht2 = 0;
  dht = getDht(board, 11);
  matrix = getMax7219(board, 3, 5, 6);
  photocell = getPhotocell(board, 5);
  photocell_value = 0;
  _E7_B9_BC_E9_9B_BB_E5_99_A8 = getLed(board, 10);
  _E9_9B_BB_E6_BA_90_E9_96_8B_E9_97_9C = 0;
  temp = new Firebase('https://youoktemp.firebaseio.com/');
  dht.read(function(evt){
    dht1 = dht.temperature;
    dht2 = dht.humidity;
    photocell.measure(function (val) {
      photocell.detectedVal = val;
      photocell_value = Math.round(((photocell.detectedVal - (0)) * (1/((1)-(0)))) * ((100)-(0)) + (0));
    });
    var varData = [max7219_number(dht1), max7219_number(dht2), max7219_number(photocell_value)];
    matrix.animateStop();
    matrix.on('0000000000000000');
    matrix.animate(varData, 1000);
    myData= {};
    myData.sheetUrl = 'https://docs.google.com/spreadsheets/d/1U6Pl3GaoN_kDqvHnIYgg7A_dkbG1NqSh2GVwwzmeVFU/edit?usp=sharing';
    myData.sheetName = '工作表1';
    myData.column0 = get_date("ymd");
    myData.column1 = get_time("hms");
    myData.column2 = dht1;
    myData.column3 = dht2;
    myData.column4 = photocell_value;
    writeSheetData(myData);
    document.getElementById('demo-area-01-show').innerHTML = (['現在時間<BR>',get_date("ymd"),'-',get_time("hms"),'<BR>溫度(C)/濕度(%)<BR>',dht1,'/',dht2,'<BR>光感度<BR>',photocell_value].join(''));
    myFirebase.set({});
    temp.push({
      temp: dht1,
      hum: dht2,
      photocell: photocell_value,
      power: "",
      ph: ""
    });
  }, 1000);
  document.getElementById('demo-area-05-btn1').addEventListener('click',function () {
    if (_E9_9B_BB_E6_BA_90_E9_96_8B_E9_97_9C == 0) {
      _E7_B9_BC_E9_9B_BB_E5_99_A8.on();
      _E9_9B_BB_E6_BA_90_E9_96_8B_E9_97_9C = 1;
    } else {
      _E7_B9_BC_E9_9B_BB_E5_99_A8.off();
      _E9_9B_BB_E6_BA_90_E9_96_8B_E9_97_9C = 0;
    }
  });
});
