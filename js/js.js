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

    //возвращает объект ячейки по положению на оси X Y
    getCell : function(iCol, iRow) {
        arrCols = $(arrRows[iRow]).find("td");
        return $(arrCols[iCol]);
    },

    gun : {
        lastPosition : [0, 0],

        //перемещает объект на заданную позицию
        moveTo : function(x, y) {
            console.log("x=" + x + " y="+y);
            //не допускаем перемещения за пределы поля
            if ((x > playFieldProps.cols - 1 || x < 0) || (y > playFieldProps.rows - 1 || y < 0)) {
                return;
            }
            play.getCell(this.lastPosition[0], this.lastPosition[1]).css("backgroundColor", "#ffffff");
            play.getCell(x, y).css("backgroundColor", "green");

            this.lastPosition[0] = x;
            this.lastPosition[1] = y;
        },

        moveToLeft : function() {
            this.moveTo(this.lastPosition[0] + 1, playFieldProps.rows - 1);
        },

        moveToRight : function() {
            this.moveTo(this.lastPosition[0] - 1, playFieldProps.rows - 1);
        }
    },

   bomb : {
      //начальная позиция снаряда
      beginPosition : function() {
          return [play.gun.lastPosition[0], play.gun.lastPosition[1] - 1];
      },

      speed : 200, //мс

      //выстрел
      shoot : function(){
         //TODO: изменяется позиция по Y пока снаряд не исчезнет за игровое поле или не ударит в препятствие

         var xStart = this.beginPosition()[0];
         var yStart = this.beginPosition()[1];
         var x = xStart;
         var y = yStart;
         var interval = setInterval(function(){
             if (y >= -1) {
                console.log(y);
                play.getCell(x, y).css("backgroundColor", "red");
                if(y != yStart) {
                    play.getCell(x, y + 1).css("backgroundColor", "#ffffff");
                }
             }
             y--;
             if (y < -1) {
                 clearInterval(interval);
             }
         }, this.speed);
      }

   },

   go : function() {
       //Устанавливаем начальное положение пушки
       this.gun.moveTo(Math.round(playFieldProps.cols/2) - 1, playFieldProps.rows - 1);
       //удаляем события с документа
       $(document).off("keydown");
       //устанавливаем события на нажатие клавиш управление
       $(document).on("keydown", function(key){
           console.log(key.keyCode);
           switch(key.keyCode) {
               case 39 :
                   play.gun.moveToLeft();
                   break;
               case 37 :
                   play.gun.moveToRight();
                   break;
               case 0, 32:
                   play.bomb.shoot();
                   break;
           }
       });
   }
};

