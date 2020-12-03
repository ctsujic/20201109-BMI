let btn = document.querySelector('.btn');
let list = document.querySelector('.list');
let msg = document.querySelector('.msg');
let BMI = 0;
//控制style
let BmiStyle = {
  '過輕':{
    class: 'blue'
  },
  '理想':{
    class: 'green'
  },
  '過重':{
    class: 'orange'
  },
  '輕度肥胖':{
    class: 'orange'
  },
  '中度肥胖':{
    class: 'orange'
  },
  '重度肥胖':{
    class: 'red'
  }
};


//把localStorage 取出來的資料先轉成 array
let data = JSON.parse(localStorage.getItem('BMIData')) || [];

btn.addEventListener('click', clickBtn);

function clickBtn() {
  let color = ''; //紀錄顏色
  let Today = new Date();
  Today = (Today.getMonth()+1)+'-'+Today.getDate()+'-'+Today.getFullYear();
  let result = ''; //紀錄計算結果

  // 先把取得的值轉成數字
  let cm = Number(document.querySelector('.cmText').value);
  let kg = Number(document.querySelector('.kgText').value);
  
  if(cm === 0 && kg === 0) { //什麼都沒填的話是0
    msg.textContent = '※ 身高、體重 必填';
  }else if(cm === 0) {
    msg.textContent = '※ 身高 必填';
  }else if(kg === 0) {
    msg.textContent = '※ 體重 必填';
  }else{
    msg.textContent = '';

    // Math.pow(要計算的值,幾次方)。公分要先換算成公尺
    BMI = kg / Math.pow(cm / 100, 2);
    BMI = BMI.toFixed(1); //取到小數第1位

    if (BMI < 18.5) {
      result = '過輕';
    } else if (BMI >= 18.5 && BMI <= 25) {
      result = '理想';
    } else if (BMI >= 25 && BMI < 30) {
      result = '過重';
    } else if (BMI >= 30 && BMI < 35) {
      result = '輕度肥胖';
    } else if (BMI >= 35 && BMI < 40) {
      result = '中度肥胖';
    } else if (BMI >= 40) {
      result = '重度肥胖';
    }
    
      let list = {
        result: result,
        BMI: BMI,
        weight: cm,
        height: kg,
        date: Today
      };

      data.push(list);

      // 存到 localStorage 前先將 array 轉成 string
      localStorage.setItem('BMIData',JSON.stringify(data));

      updateList(data);

      btnChange(BMI, result);
  }
}

function btnChange(BMI, result){
  //以下處理按鈕變化
  let bn = '';//組合顯示按鈕的結果
  let btnS = document.querySelector('.inputBtn');
  bn = `
  <div class="box box-${BmiStyle[result].class}">
    <p class="value">${BMI}</p>
    <p class="bmi bmi-${BmiStyle[result].class}">BMI</p>
    <p class="img img-${BmiStyle[result].class}"></p>
  </div>
  <div class="result result-${BmiStyle[result].class}">${result}</div>`;
  btnS.innerHTML = bn;

  // 按圖片的話刷新頁面
  // let imgclick = document.querySelector('.img');
  // imgclick.addEventListener('click',function(e){window.location.reload();});

  // 按重整圖片的話變回「看結果」而且清空欄位資料，並重新監聽按鈕事件
  let imgclick = document.querySelector('.img');
  imgclick.addEventListener('click',Change)
  function Change(){
    btnS.innerHTML = `<input type="button" value="看結果" class="btn">`;
    document.querySelector('.cmText').value = '';
    document.querySelector('.kgText').value = '';
    let btnR = document.querySelector('.btn');
    btnR.addEventListener('click', clickBtn);
  };
    
  /* 助教的寫法是在html上分別做「看結果」和「顯示結果」
  然後用下面兩行來控制顯示及隱藏 display:none;
  statusBtn.classList.add("hidebtn");
  changeBtn.classList.remove("hidebtn");  
  
  function newBtn(bmi,status){
   statusBtn.classList.remove("hidebtn");
   changeBtn.classList.add("hidebtn");
    result.addEventListener('click',function(e) {
        if(e.target.className === 'submit-btn'){
          var resultnb = document.querySelector(".result-nb");
          var staustext = document.querySelector(".staus-text");
          result.setAttribute("class",`${BMIColor[status].class}`);
          resultnb.textContent = `${bmi}`;
          staustext.textContent = `${status}`;
        } else if(e.target.className === 'refresh') { 
         statusBtn.classList.add("hidebtn");
         changeBtn.classList.remove("hidebtn");  
        document.getElementById('height').value = "";
        document.getElementById('weight').value = "";  
        } 
    },false);
}
  */
}

function updateList(data) {
  let str = ''; //組顯示資料用
   
  for(let i=0;i<data.length;i++){
    let Bstyle = data[i].result; //取得狀態值要取BmiStyle物件用
    str += `
    <table>
      <tr>
        <td class="${BmiStyle[Bstyle].class}"></td>
        <td align="left" width="150px">　${data[i].result}</td>
        <td><span>BMI</span> ${data[i].BMI}</td>
        <td><span>weight</span> ${data[i].weight} kg</td>
        <td><span>height</span> ${data[i].height} cm</td>
        <td><span>${data[i].date}</span></td>
        <td><a href="#" data-index="${i}">X</td>
      </tr>
    </table>`;
  }  

  if (data.length == 0) {
    list.innerHTML = '<h4>目前暫無紀錄</h4>';
  }else{
    list.innerHTML = str + '<h4><a href="#" id="delData">清除所有紀錄</a></h4>';
    //清除紀錄
    let dalData = document.getElementById('delData');
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
  let index = e.target.dataset.index;
  data.splice(index, 1); // 取得index位置,刪掉一筆紀錄
  localStorage.setItem('BMIData',JSON.stringify(data));//存到localStorage
  updateList(data); // 更新資料
}

updateList(data);