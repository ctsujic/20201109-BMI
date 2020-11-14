var btn = document.querySelector('.btn');
var list = document.querySelector('.list');
var BMI = 0;

//把localStorage 取出來的資料先轉成 array
var data = JSON.parse(localStorage.getItem('BMIData')) || [];


btn.addEventListener('click', clickBtn);


function clickBtn() {
  var color = ''; //紀錄顏色
  var Today = new Date();
  Today = (Today.getMonth()+1)+'-'+Today.getDate()+'-'+Today.getFullYear();
  var result = ''; //紀錄計算結果

  // 先把取得的值轉成數字
  var cm = Number(document.querySelector('.cmText').value);
  var kg = Number(document.querySelector('.kgText').value);

  if (cm == '') { alert('請輸入身高'); }
  if (kg == '') { alert('請輸入體重'); }

  if (typeof (cm) !== 'number' || typeof (kg) !== 'number') {
    alert('只能填入數字唷!!');
  }

    // Math.pow(要計算的值,幾次方)。公分要先換算成公尺
    BMI = kg / Math.pow(cm / 100, 2);
    BMI = BMI.toFixed(1); //取到小數第1位

    if (BMI < 18.5) {
      result = '過輕'; color = '#31BAF9'; style = 'txt2';
    } else if (BMI >= 18.5 && BMI <= 25) {
      result = '理想'; color = '#86D73F'; style = 'txt1';
    } else if (BMI >= 25 && BMI < 30) {
      result = '過重'; color = '#FF982D'; style = 'txt3';
    } else if (BMI >= 30 && BMI < 35) {
      result = '輕度肥胖'; color = '#FF6C02'; style = 'txt4';
    } else if (BMI >= 35 && BMI < 40) {
      result = '中度肥胖'; color = '#FF6C02'; style = 'txt5';
    } else if (BMI >= 40) {
      result = '重度肥胖'; color = '#FF1200'; style = 'txt6';
    }
    
    if(BMI !== "NaN"){
      var list = {
        result: result,
        BMI: BMI,
        weight: cm,
        height: kg,
        date: Today,
        color: color,
        style: style
      };

      data.push(list);

      // 存到 localStorage 前先將 array 轉成 string
      localStorage.setItem('BMIData',JSON.stringify(data));

      updateList(data);


      //以下處理按鈕變化
      var bn = '';//組合顯示按鈕的結果
      var btnS = document.querySelector('.inputBtn');
      bn = '<div class="box" style="border: 6px solid '+ color +';color:'+ color +';"><p class="value">'+ BMI +'</p><p class="bmi" style="color:'+ color +';">BMI</p><p class="img" style="background-color:'+ color +'"></p></div><div class="result" style="color:'+ color +';">'+ result +'</div>';
      btnS.innerHTML = bn;

      //按圖片的話刷新頁面
      var imgclick = document.querySelector('.img');
      imgclick.addEventListener('click',function(e){window.location.reload();});
    }
}


function updateList(data) {
  var str = ''; //組顯示資料用
   
  for(var i=0;i<data.length;i++){
    str += '<table><tr><td class="'+ data[i].style +'"></td><td align="left" width="150px">　'+ data[i].result +'</td><td><span>BMI</span> '+ data[i].BMI +'</td><td><span>weight</span> '+ data[i].weight +'kg</td><td><span>height</span> '+ data[i].height +'cm</td><td><span>'+ data[i].date +'</span></td><td><a href="#" data-index="'+i+'">X</td></tr></table>';
  }  

  if (data.length == 0) {
    list.innerHTML = '<h4>目前暫無紀錄</h4>';
  }else{
    list.innerHTML = str + '<h4><a href="#" id="delData">清除所有紀錄</a></h4>';
    //清除紀錄
    var dalData = document.getElementById('delData');
    dalData.addEventListener('click', delData);
  }  
}


//執行清除紀錄
function delData(e){
  e.preventDefault();
  localStorage.removeItem('BMIData'); //清除所有紀錄
  data = [];
  updateList(data);
}

list.addEventListener('click', delList);
function delList(e){
  e.preventDefault();
  if(e.target.nodeName !== 'A'){return}; //如果點的不是A則跳出FUNCTION
  var index = e.target.dataset.index;
  data.splice(index, 1); // 取得index位置,刪掉一筆紀錄
  localStorage.setItem('BMIData',JSON.stringify(data));//存到localStorage
  updateList(data); // 更新資料
}

updateList(data);