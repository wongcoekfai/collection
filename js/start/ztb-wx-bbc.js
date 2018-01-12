//注册兼容sui锚点跳转页面
$.fn.scrollTo =function(options){

  var defaults = {
    toT : 0,    //滚动目标位置
    durTime : 200,  //过渡动画时间
    delay : 30,     //定时器时间
    callback:null   //回调函数
  };
  var opts = $.extend(defaults,options),
    timer = null,
    _this = this,
    curTop = _this.scrollTop(),//滚动条当前的位置
    subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
    index = 0,
    dur = Math.round(opts.durTime / opts.delay),
    smoothScroll = function(t){
      index++;
      var per = Math.round(subTop/dur);
      if(index >= dur){
        _this.scrollTop(t);
        window.clearInterval(timer);
        if(opts.callback && typeof opts.callback == 'function'){
          opts.callback();
        }
        return;
      }else{
        _this.scrollTop(curTop + index*per);
      }
    };
  timer = window.setInterval(function(){
    smoothScroll(opts.toT);
  }, opts.delay);
  return _this;
};
//自定义分享转发
//object arr 分享数据
//url 回调地址

var newshare = function (arr,url) {

    wx.onMenuShareTimeline({
      title: arr.shareTitle,
      link: arr.lineLink,
      imgUrl: arr.imgUrl,
      success: function () {
        var tjData = {
          d:'bbc_share_donateSuccess_moments',
          openUrl:window.location.href,
          shareUrl:arr.lineLink,
        }
        try {
          __TJ__.onEventShare(tjData,false);
        }catch (e){
          console.log(e.message);
        }
        window.location.href = url;
      }
    });
    wx.onMenuShareAppMessage({
      title: arr.shareTitle,
      desc: arr.desc,
      link: arr.lineLink,
      imgUrl: arr.imgUrl,
      type: '',
      dataUrl: '',
      success: function () {
        var tjData = {
          d:'bbc_share_donateSuccess_friends',
          openUrl:window.location.href,
          shareUrl:arr.lineLink,
        }
        try {
          __TJ__.onEventShare(tjData,false);
        }catch (e){
          console.log(e.message);
        }
        window.location.href = url;
      }
    });
    wx.onMenuShareQQ({
      title: arr.shareTitle,
      desc: arr.desc,
      link: arr.lineLink,
      imgUrl: arr.imgUrl,
      success: function () {
        window.location.href = url;
      }
    });
    wx.onMenuShareWeibo({
      title: arr.shareTitle,
      desc: arr.desc,
      link: arr.lineLink,
      imgUrl: arr.imgUrl,
      success: function () {
        window.location.href = url;
      }
    });
}

function CharNumberLimit(){
  document.getElementById('textarea1').onkeydown = function () {
    if(document.getElementById('textarea1').value.length > 80){
      return false;
    }
    document.getElementById('counter').innerHTML = 80 - document.getElementById('textarea1').value.length;
  }
  document.getElementById('textarea1').onkeyup = function () {
    if(document.getElementById('textarea1').value.length > 80){
      return false;
    }
    document.getElementById('counter').innerHTML = 80 - document.getElementById('textarea1').value.length;
  }
}

//图片加载失败
function imgOnError(domain) {
  $('img').bind('error',function () {
    var src = $(this).attr('src');
    src = src.split('/bbc/');
    src = src[1].split('@');
    console.log(src);
    $(this).attr('src',domain+'/bbc/'+src[0]);
    $(this).unbind('error');
  })
}

//分享引导效果
function imgDisapper(){
  $('.share-img-view').css('display','none');
}
//上传图片个数 js控制
function imgNumLimit(number,attribute){
  if(parseInt($("[imageType='"+attribute+"']").length) >= number){
    $.toast('该类型图片只能上传'+number+'张！');
    return true;
  }
}
//js计算n天后的天数
//params days 天数
//params class 类名
function laterDate(days,className) {
  days = Number(days);
  var dd = new Date();
  dd.setDate(dd.getDate()+days);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth()+1)<10 ? ('0'+(dd.getMonth()+1)) : (dd.getMonth()+1);
  var d = dd.getDate() <10 ? ('0'+ dd.getDate()) :dd.getDate();
  var h = dd.getHours();
  var time = y+"-"+m+"-"+d+"   "+h+":00"
  $('.'+className).html(time);
}
