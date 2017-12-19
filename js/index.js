// 初始化 发送jsonp和Ajax请求
jsonp("http://cdn.weather.hao.360.cn/api_weather_info.php?app=hao360&_jsonp=Callback&code=101010100")
ajax("get", "../weatherCode.xml", null, "XML", handleData);

// 获取页面元素节点
var btn = document.getElementById("btn");
var input = document.getElementsByTagName("input")[0];
var btn2 = document.getElementById("button");
var ul = document.getElementById("ul");


var province = document.getElementById("province");
var city = document.getElementById("city");
var county = document.getElementById("county");

// 保存所有城市名  &&  保存三级联动数据
var allCounty = null;
var current = {
    province: "",
    city: "",
    county: "",
    weatherCode: ""
}

// 点击按钮/enter 查询天气
btn.addEventListener("click", fn, false);
input.addEventListener("keyup", fun, false);
document.onclick = function (e) {
    var e = e || window.event;
    if (e.target.id != ul) {
        ul.innerHTML = "";
    }
}
function fn() {
    jsonp(setUrl(coding(input.value)));
}
function fun(e) {
    var e = e || window.event;
    if (e.keyCode == 13) {
        fn();
    } else {
        lenovo()
    }
}
// 下拉选择地点  刷新
btn2.addEventListener("click", func, false);
function func() {
    jsonp(setUrl(current.weatherCode))
}

// 城市名 联想输入
function lenovo() {
    ul.innerHTML = "";
    var val = input.value;
    // 使用 for in 报错
    // for(var k in allCounty){
    //     if(allCounty[k].getAttribute("name").search(input.value) != -1){
    //         var ol = document.createElement("ol");
    //         ol.innerHTML = allCounty[k].getAttribute("name");
    //         ul.appendChild(ol);
    //     }
    // }
    for (var i = 0, len = allCounty.length; i < len; i++) {
        if (allCounty[i].getAttribute("name").search(val) != -1) {
            var li = document.createElement("li");
            li.id = allCounty[i].getAttribute("weatherCode");
            li.innerHTML = allCounty[i].getAttribute("name");
            ul.appendChild(li);
        }
    }
    // 给li添加 点击事件
    var li = document.getElementsByTagName("li");
    for (var j = 0, leng = li.length; j < len; j++) {
        li[j].onclick = function () {
            var that = this;
            liClick(that);
        };
    }
}

// 城市名 转 天气编码
function coding(val) {
    for (var k in allCounty) {
        if (val == allCounty[k].getAttribute("name")) {
            return allCounty[k].getAttribute("weatherCode")
        }
    }
}

// li点击事件
function liClick(that) {
    jsonp(setUrl(that.id));
    ul.innerHTML = "";
    console.log(that)
    input.value = that.innerText;
}

// 处理 Ajax 返回数据
function handleData(res) {
    // 城市名 转编码用
    allCounty = res.getElementsByTagName("county");
    //下拉列表用
    var $province = res.getElementsByTagName("province");
    for (var i = 0, len = $province.length; i < len; i++) {
        var option = document.createElement("option");
        option.value = $province[i].getAttribute("id");
        option.innerHTML = $province[i].getAttribute("name");
        province.appendChild(option);
    }
    current.provinve = $province;
}

// 下拉列表 !!! 
province.onchange = function () {
    city.innerHTML = "<option>请选择城市</option>";
    county.innerHTML = "<option>请选择县区</option>";
    current.city = current.provinve[this.value].getElementsByTagName("city");
    for (var i = 0, len = current.city.length; i < len; i++) {
        var option = document.createElement("option");
        option.value = current.city[i].getAttribute("id");
        option.innerHTML = current.city[i].getAttribute("name");
        city.appendChild(option);
    }
}
city.onchange = function () {
    county.innerHTML = "<option>请选择县区</option>";
    current.county = current.city[this.value].getElementsByTagName("county");
    for (var i = 0, len = current.county.length; i < len; i++) {
        var option = document.createElement("option");
        option.value = current.county[i].getAttribute("weatherCode");
        option.innerHTML = current.county[i].getAttribute("name");
        county.appendChild(option);
    }
}
county.onchange = function () {
    // 城市天气编码
    current.weatherCode = this.value;
}

// jsonp 接收函数
function Callback(response) {
    setData(response)
}

// 数据处理函数
function setData(res) {
    // 获取星期 && 星期数组
    var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    var week = new Date(res.time * 1000).getDay();
    // 背景图片位置
    var bgis = res.weather[0].info.day[0];
    // 图片函数封装 要用2次所以封装 
    bgiP = imgPosition(bgis);
    // 获取需要添加内容的数组,并添加内容
    var infos = document.getElementsByClassName("info");
    infos[0].style.backgroundPosition = bgiP;
    infos[1].innerHTML = res.area[2][0];
    infos[2].innerHTML = res.pubdate;
    infos[3].innerHTML = weeks[week];
    infos[4].innerHTML = res.pubtime;
    infos[5].innerHTML = res.weather[0].info.day[1];
    infos[6].innerHTML = res.weather[0].info.day[2];
    infos[7].innerHTML = res.weather[0].info.day[3];
    infos[8].innerHTML = res.weather[0].info.day[4];
    infos[9].innerHTML = res.weather[0].info.night[1];
    infos[10].innerHTML = res.weather[0].info.night[2];
    infos[11].innerHTML = res.weather[0].info.night[3];
    infos[12].innerHTML = res.weather[0].info.night[4];
    // 添加 traverse-info 部分  底下的五个小块
    var itemBoxs = document.getElementsByClassName("footer-item");
    // 创建日起数组
    var dateArr = ["今天", "明天", res.weather[2].date, res.weather[3].date, res.weather[4].date];
    for (var i = 0, len = itemBoxs.length; i < len; i++) {
        var traverses = itemBoxs[i].getElementsByClassName("traverse-info");
        var bgiPositin = imgPosition(res.weather[i].info.day[0])
        traverses[0].innerHTML = dateArr[i];
        traverses[1].innerHTML = res.weather[i].date.substr(5);
        traverses[2].style.backgroundPosition = bgiPositin;
        traverses[3].innerHTML = res.weather[i].info.day[1];
        traverses[4].innerHTML = res.weather[i].info.day[2] + "°";
        traverses[5].innerHTML = res.weather[i].info.day[3];
    }
    // 把 第3/4/5 个小格子不带年份的日期去掉
    for (var i = 2, len = itemBoxs.length; i < len; i++) {
        var traverses = itemBoxs[i].getElementsByClassName("traverse-info");
        traverses[1].innerHTML = "";
    }
}

// 图片函数封装
function imgPosition(bgis) {
    var bgiP = null;
    if (bgis > 17) {
        bgiP = (-(bgis - 18) * 70 + -(bgis - 18) * 2) + "px" + " " + "-216px";
    } else if (bgis > 11) {
        bgiP = (-(bgis - 12) * 70 + -(bgis - 12) * 2) + "px" + " " + "-144px";
    } else if (bgis > 5) {
        bgiP = (-(bgis - 6) * 70 + -(bgis - 6) * 2) + "px" + " " + "-72px";
    } else {
        bgiP = (-bgis * 70 + -bgis * 2) + "px" + " " + "0px";
    }
    return bgiP;
}

// jsonp设置 url
// 原始url  "http://cdn.weather.hao.360.cn/api_weather_info.php?app=hao360&_jsonp=weather&code=101010100"
function setUrl(val) {
    if (val == undefined) {
        var url = "http://cdn.weather.hao.360.cn/api_weather_info.php?app=hao360&_jsonp=Callback&code=101010100";
    } else {
        var url = "http://cdn.weather.hao.360.cn/api_weather_info.php?app=hao360&_jsonp=Callback&code=" + val;
    }
    return url;
}

// 封装 jsonp
function jsonp(url) {
    var newTag = document.createElement("script");
    newTag.src = url;
    document.getElementsByTagName("head")[0].appendChild(newTag);
};

// 封装 ajax
function ajax(method, url, header, dataType, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (method == "post") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(header);
    } else {
        xhr.send();
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (dataType === 'XML') {
                var res = xhr.responseXML;
            } else {
                var res = xhr.responseText;
            }
            fn(res);
        }
    }
}