/**
 * Created by cdv on 11.08.2014.
 */
var arrRows, arrCols;
/**
 * Объект игрового поля
 * properties - настройки игрового поля
 * rows - кол-во ячеек по оси Y
 * cols - кол-во ячеек по оси X
 * styleCell - стиль ячейки
 */
var playField = {

    properties : {
        rows: 15,
        cols: 25,
        styleCell: {
            width: "10px",
            height: "10px",
            border: "1px solid black",
            emptyBackground : "#ffffff"
        }
    },

    /**
     * Полная очистка игрового поля
     */
    clearAllCells : function(){
        arrRows.find("td").css("backgroundColor", this.properties.styleCell.emptyBackground);
      //  console.log("clearAllCells");
    },

    /**
     * Определение какую ячейку заполнять.
     * @param iCol
     * @param iRow
     * @returns объект ячейки по положению на оси X Y
     */
    getCell : function(iCol, iRow) {
        arrCols = $(arrRows[iRow]).find("td");
        return $(arrCols[iCol]);
    },

    /**
     * Очистка ячейки.
     * @param x
     * @param y
     */
    clearCell : function(x, y){
        var oCell = this.getCell(x, y);
        oCell.css("backgroundColor", this.properties.styleCell.emptyBackground);
        oCell.removeAttr("targetId");
    },

    /**
     * Заполнение ячейки.
     * @param x
     * @param y
     * @param bgColor - цвет ячейки
     */
    fillCell :  function(x, y, bgColor, obj) {
     //   console.log("fillCell (" + x + ", " + y + ")");
        var oCell = this.getCell(x, y);
        oCell.css("backgroundColor", bgColor);
        if (obj instanceof Object) {
            for (var prop in obj) {
                if (prop == "targetId") {
                    oCell.attr(prop, obj[prop]);
                }
                if (prop == "destroyTarget") {
                    if (oCell.attr("targetId") != undefined) {
                        clearInterval(oCell.attr("targetId"));
                    }
                }
            }
        }
    },

    blockUnblockPlayBtn : function(block) {
        var playBtn = $(".playBtn");
        if (block) {
            playBtn.attr("disabled", "disabled");
        } else {
            playBtn.removeAttr("disabled");
        }
    }
};

(function(){
    //строим таблицу игрового поля
    var trs = "",
        tds = "";
    for (var j = 0; j < playField.properties.cols; j++) {
        tds = tds + "<td></td>";
    }
    for (var i = 0; i < playField.properties.rows; i++) {
        trs = trs + "<tr>" + tds + "</tr>";
    }
    playField.html = "<table>" + trs + "</table>";

    //применяем стили игровому полю
    var divPlay = $("#playField");
    divPlay.html(playField.html);
    divPlay.find("td").css({
        width  : playField.properties.styleCell.width,
        height : playField.properties.styleCell.height,
        border : playField.properties.styleCell.border
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

    bGameOver : false,

    setGameOver : function() {
        this.bGameOver = true;
        playField.blockUnblockPlayBtn(false);
    },

    /**
     * Пушка.
     */
    gun : {
        lastPosition : [-1, -1],
        backgroundColor : "green",

        //перемещает объект на заданную позицию
        moveTo : function(x, y) {
            //если игра закончена, пушка не должна двигаться
            if (play.bGameOver) {
                return;
            }
          //  console.log("moveTo(" + x + ", "+ y + ")");
            //не допускаем перемещения за пределы поля
            if ((x > playField.properties.cols - 1 || x < 0) || (y > playField.properties.rows - 1 || y < 0)) {
                return;
            }

            if (!((this.lastPosition[0] == -1) && (this.lastPosition[1] == -1))) {
                playField.clearCell(this.lastPosition[0], this.lastPosition[1]);
            }
            playField.fillCell(x, y, this.backgroundColor);

            this.lastPosition[0] = x;
            this.lastPosition[1] = y;
        },

        moveToLeft : function() {
            this.moveTo(this.lastPosition[0] + 1, playField.properties.rows - 1);
        },

        moveToRight : function() {
            this.moveTo(this.lastPosition[0] - 1, playField.properties.rows - 1);
        },

        activate : function(){
            this.moveTo(Math.round(playField.properties.cols/2) - 1, playField.properties.rows - 1);
         //   console.log("gun activate");
        }
    },

    /**
     * Снаряд.
     */
   bomb : {

       backgroundColor : "red",
       speed : 100, //мс

      //начальная позиция снаряда
      beginPosition : function() {
          return [play.gun.lastPosition[0], play.gun.lastPosition[1] - 1];
      },

      //выстрел
      shoot : function(){
         //если игра окончена, стрелять нельзя
         if (play.bGameOver) {
             return;
         }
          
         var xStart = this.beginPosition()[0];
         var yStart = this.beginPosition()[1];
         var x = xStart;
         var y = yStart;
         var interval = setInterval(function(){
             if (y >= -1) {
                //console.log("interval : " + interval);
                playField.fillCell(x, y, play.bomb.backgroundColor, {destroyTarget : true});
                if(y != yStart) {
                    playField.clearCell(x, y + 1);
                }
             }
             //выстрел улетел за поле - очищаем интервал
             if (y < 0) {
                 clearInterval(interval);
           //  } else if () {

             } else {
                 y--;
             }
         }, this.speed);
      }

   },

    /**
     * Мишень.
     */
    target : {
        backgroundColor : "black",
        speed : 1000, //мс

        xStart : function () {
            return Math.floor(Math.random() * playField.properties.cols);
        },

        create : function(){
            var xStart = this.xStart();
            var yStart = 0;
            var x = xStart;
            var y = yStart;

            if (isNaN(x) || isNaN(y)) {
                return; //TODO: тут бы ошибку куда то вывести
            }

            //Создание и движение одной ячейки
            var oneCellDo = function (x, y){
                var interval = setInterval(function(){
                    console.log("interval = " + interval);
                    if (play.bGameOver) {
                        clearInterval(interval);
                        return;
                    }
                    if (y > yStart){
                        playField.clearCell(x, y - 1);
                    }
                    playField.fillCell(x, y, play.target.backgroundColor, {targetId : interval});
                    //если мишень достигла края игрового поля - это проигрыш
                    if (y >= (playField.properties.rows - 1)) {
                        clearInterval(interval);
                        play.setGameOver();
                    } else {
                        y++;
                    }
                }, play.target.speed);
            };

            oneCellDo(x, y);

        },

        activate : function() {
            var interval = setInterval( function(){
               if (play.bGameOver) {
                   clearInterval(interval);
               } else {
                   play.target.create();
               }
            }, play.target.speed);
        }

    },

    /**
     * Запуск игры.
     */
   go : function() {
       //блокировка кнопки PLAY
       playField.blockUnblockPlayBtn(true);
       //очистка игрового поля
       playField.clearAllCells();
       //сброс признака окончания игры
       play.bGameOver = false;
       //удаляем события с документа
       $(document).off("keydown");
       //устанавливаем события на нажатие клавиш управление
       $(document).on("keydown", function(key){
          // console.log(key.keyCode);
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

       //активация пушки
       this.gun.activate();
       //запуск движение мишени
       this.target.activate();
   }
};

