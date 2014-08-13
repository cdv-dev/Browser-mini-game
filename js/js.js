/**
 * Created by cdv on 11.08.2014.
 */
var arrRows, arrCols;
//свойства игрового поля
var playFieldProps = {
    rows : 15,
    cols : 15,
    styleTD : {
        width : "10px",
        height : "10px",
        border : "1px solid black"
    },
    html : ""
};

(function(){
    //строим таблицу игрового поля
    var trs = "",
        tds = "";
    for (var j = 0; j < playFieldProps.cols; j++) {
        tds = tds + "<td></td>";
    }
    for (var i = 0; i < playFieldProps.rows; i++) {
        trs = trs + "<tr>" + tds + "</tr>";
    }
    playFieldProps.html = "<table>" + trs + "</table>";

    //применяем стили игровому полю
    var divPlay = $("#playField");
    divPlay.html(playFieldProps.html);
    divPlay.find("td").css({
        width  : playFieldProps.styleTD.width,
        height : playFieldProps.styleTD.height,
        border : playFieldProps.styleTD.border
    });
    divPlay.css({
        width : divPlay.find("table").width() + "px",
        //центрирование
        marginRight : "auto",
        marginLeft : "auto"
    });
    arrRows = divPlay.find("table").find("tr");

    //событие на кнопку play
    $("#controlBtns").find("input[type=button]").on("click", function(){
        play.go();
    })
}());


var play = {
   lastPosition : [0, 0],

   //возвращает объект ячейки по координатам
   getCell : function(iCol, iRow) {
       arrCols = $(arrRows[iRow]).find("td");
       return $(arrCols[iCol]);
   },
   //перемещает объект на заданную позицию
   moveTo : function(x, y) {
       console.log("x=" + x + " y="+y);
       //не допускаем перемещения за пределы поля
       if ((x > playFieldProps.cols - 1 || x < 0) || (y > playFieldProps.rows - 1 || y < 0)) {
           return;
       }
       this.getCell(this.lastPosition[0], this.lastPosition[1]).css("backgroundColor", "#ffffff");
       this.getCell(x, y).css("backgroundColor", "green");
       
       this.lastPosition[0] = x;
       this.lastPosition[1] = y;
   },

   moveToLeft : function() {
      this.moveTo(this.lastPosition[0] + 1, playFieldProps.rows - 1);
   },

   moveToRight : function() {
      this.moveTo(this.lastPosition[0] - 1, playFieldProps.rows - 1);
   },

   shoot : function (){
      //опеределяем начальную позицию снаряда
      
   },

   go : function() {
       //Устанавливаем начальное положение объекта
       this.moveTo(Math.round(playFieldProps.cols/2) - 1, playFieldProps.rows - 1);
       this.lastPosition = [0, 0];
       //Отлавливаем нажатия клавиш
       $(document).on("keydown", function(key){
           console.log(key.keyCode);
           switch(key.keyCode) {
               case 39 :
                   play.moveToLeft();
                   break;
               case 37 :
                   play.moveToRight();
                   break;
               case 0:
                   play.shoot();
                   break;
           }
       });
   }
};

