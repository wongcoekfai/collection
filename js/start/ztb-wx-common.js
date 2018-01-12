var joinPreCheck = function(productID, regSource, fID) {
  $.ajax({
    type: "GET",
    async: false,
    url: '/product/apiJoinPreCheck',
    data: {'id':productID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
          // $.router.load("/product/payment1?id="+productID);
          window.location.href="/product/payment1?id="+productID;
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/addMobile?productID="+productID+"&regSource="+regSource+"&fID="+fID;
        }
        // else if(result.message == 'emptyPassword'){
        //   $.router.load("/user/addPassword?productID="+productID);
        // }
        else if(result.message == 'emptyShiMing'){
          window.location.href="/user/addShiMing?productID="+productID;
        }
        else if(result.message == 'cardExist'){
          $.alert("您已经加入计划", function () {
              window.location.href="/card";
          });
        }
        else if(result.message == 'ageInvalid'){
          $.alert("提示：感谢您的关注，很抱歉，您的年龄不在计划范围内。您可以传递爱和保障给您深爱的人们，祝福您健康快乐！");
        }
        else {
          $.alert(result.message, function () {
              window.location.href="/product/view?id="+productID;
          });
        }
      }
    }
  });
}

var mobileCheck = function(productID, regSource, fID, fromurl) {
  var fromurl = arguments[3] || '';
  $.ajax({
    type: "GET",
    async: false,
    url: '/product/apiMobileCheck',
    data: {'id':productID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
          window.location.href="/product/people?productID="+productID;
          //window.location.href="/product/commitment?id="+productID+"&fID="+fID+"&s="+regSource+"&fromurl="+fromurl;
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/addMobile?productID="+productID+"&regSource="+regSource+"&fID="+fID;
        }
        else {
          $.alert(result.message, function () {
              window.location.href="/product/view?id="+productID;
          });
        }
      }
    }
  });
}

var joinPeoplePreCheck = function(productID, peopleID, activityName) {
  var url = "/product/apiJoinPeoplePreCheck?a=1";
  $.each(peopleID,function(index){
    url += '&peopleID[]='+peopleID[index];
  });
  $.ajax({
    type: "GET",
    async: false,
    url: url,
    data: {'id':productID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
          // $.router.load("/product/payment1?id="+productID+"&peopleID="+peopleID+"&cardType=1");
          //实名认证
          if(productID == 9){
            joinPeoplePreCheckIdCard(productID,peopleID,result.data.peopleName,result.data.peopleIDCard,result.data.mobile,result.message);
          }else{
            var url = "/product/payment1?cardType=1&id="+productID;
            $.each(peopleID,function(index){
              url += '&peopleID[]='+peopleID[index];
            });
            // activityName = '<?php echo CHtml::encode($activityName);?>';
            window.location.href= url+"&activityName="+activityName;
          }
      } else {
        // get result.error
        if(result.message == 'cardExist'){
          $.toast("已经加入过此计划");
        }
        else if(result.message == 'ageInvalid'){
          $.alert("提示：感谢您的关注，很抱歉，您的年龄不在计划范围内。您可以传递爱和保障给您深爱的人们，祝福您健康快乐！");
        }
        else {
          $.toast(result.message);
        }
      }
    }
  });
}

var joinPeoplePreCheckIdCard = function(productID, peopleID, peopleName, peopleIDCard ,mobile, apiUrl){
  $.ajax({
    type: "GET",
    async: false,
    url: apiUrl + '/user/checkIDCard?callback=?',
    data: {'name':peopleName, 'idCard':peopleIDCard, 'mobile':mobile, 'v':'1.1'},
    dataType: "jsonp",
    success: function(result) {
      if (result.success == true) {
          //实名认证成功
          window.location.href="/product/payment1?id="+productID+"&peopleID="+peopleID+"&cardType=1";
      } else {
        $.alert('很抱歉，您选择的保障人实名认证失败，如有疑问请联系我们。');
      }
    }
  });
}

var joinByPackagePreCheckIdCard = function(packageGUID, productID, peopleID, peopleName, peopleIDCard ,mobile, apiUrl){
  if(productID != 9){
    joinByPackagePreCheck(packageGUID);
    return true;
  }
  $.ajax({
    type: "GET",
    async: false,
    url: apiUrl + '/user/checkIDCard?callback=?',
    data: {'name':peopleName, 'idCard':peopleIDCard, 'mobile':mobile, 'v':'1.1'},
    dataType: "jsonp",
    success: function(result) {
      if (result.success == true) {
          //实名认证成功
          joinByPackagePreCheck(packageGUID);
      } else {
        $.alert('很抱歉，您的实名认证失败，如有疑问请联系我们。<br/>失败原因：'+result.message,'实名认证失败');
      }
    }
  });
}

var joinByPackagePreCheck = function(packageGUID) {
  $.ajax({
    type: "GET",
    async: false,
    url: '/package/apiJoinByPackagePreCheck',
    data: {'packageGUID':packageGUID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
        if(result.data.type == 2){
          var alertMsg = '成功领取'+result.data.amt+'张互助凭证';
        }else{
          var alertMsg = '成功领取'+result.data.amt+'元互助凭证';
        }
        $.alert(alertMsg, function () {
          if (result.message == 'needScan'){
            window.location.href='/site/qrcode?msg=请关注众托帮微信号获取保障权益';
          } else {
            window.location.href='/card';
          }
        });
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/packageShiMing?packageGUID="+packageGUID;
        }
        else if(result.message == 'emptyShiMing'){
          window.location.href="/user/packageShiMing?packageGUID="+packageGUID;
        }
        else if(result.message == 'ageInvalid'){
          $.alert("提示：感谢您的关注，很抱歉，您的年龄不在计划范围内。您可以传递爱和保障给您深爱的人们，祝福您健康快乐！");
        }
        else if(result.message == '请先激活您已经领到的保障卡'){
          $.toast(result.message);
          setTimeout(function () {
            $.router.load("/card", true);
          }, 2000);
        }
        else if(result.message == '不能重复领取'){
          $.toast(result.message);
          setTimeout(function () {
            $.router.load("/card", true);
          }, 2000);
        }
        else {
          $.toast(result.message);
        }
      }
    }
  });
}

var joinByH5PreCheck = function(productID, fID) {

  $.ajax({
    type: "GET",
    async: false,
    url: '/product/apiJoinByH5PreCheck',
    data: {'productID':productID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
        if (result.message == 'cardExist'){
          $.toast("已经加入过此计划");
          $.router.load('/card', true);
        } else {
          window.location.href="/product/h5Payment?id="+productID;
        }
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/h5ShiMing?productID="+productID+"&fID="+fID;
        }
        else if(result.message == 'emptyShiMing'){
          window.location.href="/product/h5Payment?id="+productID;
        }
        else if(result.message == 'ageInvalid'){
          $.alert("提示：感谢您的关注，很抱歉，您的年龄不在计划范围内。您可以传递爱和保障给您深爱的人们，祝福您健康快乐！");
        }
        else {
          $.toast(result.message);
        }
      }
    }
  });
}

var joinLBPreCheck = function(productID) {
  $.ajax({
    type: "GET",
    async: false,
    url: '/product/apiJoinLBPreCheck',
    data: {'id':productID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
          window.location.href="/product/payment1?id="+productID;
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/addMobileLB?productID="+productID;
        }
        else if(result.message == 'cardExist'){
          $.toast("您已经参与过此活动");
        }
        else {
          $.toast(result.message);
        }
      }
    }
  });
}

var joinCouponPreCheck = function(productID, source, subSource, openid, channel, t, logid, peopleID) {
  $.ajax({
    type: "GET",
    async: false,
    url: '/product/apiJoinCouponPreCheck',
    data: {'id':productID,'source':source,'peopleID':peopleID},
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
          window.location.href="/user/finishCoupon?productID="+productID+"&source="+source+"&subSource="+subSource+"&openid="+openid+"&channel="+channel+"&logid="+logid+"&peopleID="+peopleID+"&t="+t;
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/addMobileCoupon?productID="+productID+"&source="+source+"&subSource="+subSource+"&openid="+openid+"&channel="+channel+"&logid="+logid+"&t="+t;
        }
        else if(result.message == 'selectPeople'){
          window.location.href="/user/peopleCoupon?productID="+productID+"&source="+source+"&subSource="+subSource+"&openid="+openid+"&channel="+channel+"&logid="+logid+"&t="+t;
        }
        else if(result.message == 'emptyShiMing'){
          window.location.href="/user/addShiMingCoupon?productID="+productID+"&source="+source+"&subSource="+subSource+"&openid="+openid+"&channel="+channel+"&logid="+logid+"&t="+t;
        }
        else if(result.message == 'cardExist'){
          $.alert("您已经拥有这份高额保障了，您可以点击右上角将此券转发给家人和好友免费领取", function () {
              window.location.href="/user/coupon?t="+t+"&source="+source;
          });
        }
        else if(result.message == 'ageInvalid'){
          $.alert("提示：感谢您的关注，很抱歉，您的年龄不在计划范围内。您可以传递爱和保障给您深爱的人们，祝福您健康快乐！", function () {
              window.location.href="/user/coupon?t="+t+"&source="+source;
          });
        }
        else {
          $.alert(result.message, function () {
              window.location.href="/user/coupon?t="+t+"&source="+source;
          });
        }
      }
    }
  });
}

var joinQyPreCheck = function() {
  $.ajax({
    type: "GET",
    async: false,
    url: '/product/apiJoinQyPreCheck',
    dataType: "json",
    success: function(result) {
      if (result.success == true) {
          window.location.href="/user/finishQy";
      } else {
        // get result.error
        if(result.message == 'emptyMobile'){
          window.location.href="/user/addMobileQy";
        }
        else if(result.message == 'emptyShiMing'){
          window.location.href="/user/addShiMingQy";
        }
        else if(result.message == 'cardExist'){
          $.toast("您已经加入计划");
        }
        else if(result.message == 'ageInvalid'){
          $.alert("提示：感谢您的关注，很抱歉，您的年龄不在计划范围内。您可以传递爱和保障给您深爱的人们，祝福您健康快乐！");
        }
        else {
          $.toast(result.message);
        }
      }
    }
  });
}

// emoji to utf-8
function utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
            var H, L, code;
            if (char.length===2) {
                H = char.charCodeAt(0); // 取出高位
                L = char.charCodeAt(1); // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
    return str;
}

//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function IdentityCodeValid(code) {
  var pass= true;
  // var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
  // var tip = "";
  // if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
  //   tip = "身份证号格式错误";
  //   pass = false;
  // }
  // else if(!city[code.substr(0,2)]){
  //   tip = "身份证地址编码部分错误";
  //   pass = false;
  // }
  // else{
  //   //18位身份证需要验证最后一位校验位
  //   if(code.length == 18){
  //     code = code.split('');
  //     //∑(ai×Wi)(mod 11)
  //     //加权因子
  //     var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
  //     //校验位
  //     var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
  //     var sum = 0;
  //     var ai = 0;
  //     var wi = 0;
  //     for (var i = 0; i < 17; i++)
  //     {
  //       ai = code[i];
  //       wi = factor[i];
  //       sum += ai * wi;
  //     }
  //     var last = parity[sum % 11];
  //     if(parity[sum % 11] != code[17]){
  //       tip = "身份证校验位错误";
  //       pass =false;
  //     }
  //   }
  // }
  // if(!pass) alert(tip);
  return pass;
}