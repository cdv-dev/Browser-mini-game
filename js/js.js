/**
 * Created by cdv on 11.08.2014.
 */
var arrRows, arrCols;

(function(){
    //свойства игрового поля
    var fieldProp = {
        rows : 15,
        cols : 15,
        styleTD : {
            width : "10px",
            height : "10px",
            border : "1px solid black"
        },
        html : ""
    };

    //строим таблицу игрового поля
    var trs = "",
        tds = "";
    for (var j = 0; j < fieldProp.cols; j++) {
        tds = tds + "<td></td>";
    }
    for (var i = 0; i < fieldProp.rows; i++) {
        trs = trs + "<tr>" + tds + "</tr>";
    }
    fieldProp.html = "<table>" + trs + "</table>";

    //применяем стили игровому полю
    var divPlay = $("#playField");
    divPlay.html(fieldProp.html);
    divPlay.find("td").css({
        width  : fieldProp.styleTD.width,
        height : fieldProp.styleTD.height,
        border : fieldProp.styleTD.border
    });
    divPlay.css({
        width : divPlay.find("table").width() + "px",
        //центрирование
        marginRight : "auto",
        marginLeft : "auto"
    });
    arrRows = divPlay.find("table").find("tr");
}());


var play = {
   lastPosition : [0, 0],

   //возвращает объект ячейки по координатам
   getCell : function(iCol, iRow) {
       arrCols = $(arrRows[iRow]).find("td");
       return $(arrCols[iCol]);
   },

   moveTo : function(x, y) {
       this.getCell(this.lastPosition[0], this.lastPosition[1]).css("backgroundColor", "#ffffff");
       this.getCell(x, y).css("backgroundColor", "green");
       
       this.lastPosition[0] = x;
       this.lastPosition[1] = y;
   },

   moveToLeft : function() {

   },

   moveToRight : function() {

   },

   go : function() {
      for (var k = 0; k < arrRows.length; k++) {

          setInterval(function(){
              console.log(k);
              play.moveTo(0, k);
          }, 1000)
      }
   }
};

