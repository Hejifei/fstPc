import $ from 'jquery';
import Vue from 'vue';

// import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import axios from 'axios'
import qs from 'qs';

import  { LoadingPlugin } from 'vux';
Vue.use(LoadingPlugin)
// import promise from 'es6-promise';
// promise.polyfill();

Vue.use(VueRouter);
// Vue.use(VueResource);

function install(Vue, options) {
    // let APIURL = 'http://172.16.0.60:8080'
    // let APIURL = 'http://localhost:13306';
    // let APIURL = 'http://221.224.53.27:10019' 
    // let APIURL = 'http://localhost:8080';
    // let APIURL = 'http://61.155.212.1:8080';
    let APIURL = 'http://221.224.99.248:13306' //20181009打包api
    

    //ajax全局配置_url接口名称 a参数 b成功方法(code 1)  c失败方法(code other)
    const _ajax = function(that,_url, a, b, c) {
        // 统一错误提示
        if (typeof c != "function") {
            c = function (data) {
                Toast(2,data.desc)
            }
        }
        that.$vux.loading.show({
            text: 'Loading'
        })
        axios({
            method: 'post',
            url: APIURL + _url,
            data: qs.stringify(a)
          }).then(function(res){
            that.$vux.loading.hide();
            if(a.code !== undefined){
                code =''
            }
            let d = res.data;
            d = (typeof(d) == 'string') ? JSON.parse(d) : d;
            d.code == '200' ? b(d) : c(d);
          }).catch(function(err){
            that.$vux.loading.hide();
            console.log('报错：' +err);
            if(a.code !== undefined){
                code =''
            }
          })
        
    }

    const _imgajax = function(that,_url, a, b, c,head) {
        // 统一错误提示
        if (typeof c != "function") {
            c = function (data) {
                Toast(2,data.desc)
            }
        }
        axios({
            method: 'post',
            url: APIURL + _url,
            data: a,
            head
          }).then(function(res){
            let d = res.data;
            d = (typeof(d) == 'string') ? JSON.parse(d) : d;
            d.code == '200' ? b(d) : c(d);
          }).catch(function(err){
            console.log('报错：' +err);
          })
    }

    //Ajax提交增、改操作
    ///FormId-表单Id，BtnId-提交按钮Id,Url-接口地址，Success-成功回调函数，Fail-失败回调函数
    ///类名 required--必填,int--正整数,password--密码（6-20位数字字母）,plus--正数,phone--手机号
    const AjaxSumbit = function (that,successhref, Url, Success, Fail, FormId, BtnId) {
        var Form = FormId ? $(FormId) : $("#AjaxForm");
        var Btn =  BtnId ? $(BtnId) :$("#SubmitBtn");
        Url = APIURL+ Url;

        Form.find(".required").blur(function () {
            let textname = $(this).parents(".form-group").find("label").text();
            var Tip = $(this).parents(".form-group").find(".tip");
            if ($(this).val() == "") {
                Tip.text(textname+'为必填项！');
                that.Toast(2,textname+'为必填项！')
                throw "";
            } else {
                Tip.text("");
            }
        })
        Form.find(".required").change(function () {
            let textname = $(this).parents(".form-group").find("label").text();
            var Tip = $(this).parents(".form-group").find(".tip");
            if ($(this).val() == "") {
                Tip.text(textname+'为必选项！');
                that.Toast(2,textname+'为必选项！')
                throw "";
            } else {
                Tip.text("");
            }
        })
        Form.find(".int").blur(function () {
            var Tip = $(this).next(".tip");
            if ($(this).val() != "") {
                var reg = /^[0-9]*$/;
                if (!reg.test($(this).val())) {
                    Tip.text("应是非负数！");
                    throw "";
                } else {
                    Tip.text("");
                }
            } else if (!$(this).hasClass("required")) {
                Tip.text("");
            }
        })
        Form.find(".password").blur(function () {
            var Tip = $(this).next(".tip");
            if ($(this).val() != "") {
                var reg = /^[0-9a-zA-Z]{6,20}$/;
                if (!reg.test($(this).val())) {
                    Tip.text("请使用6-20位数字或字母密码！");
                    throw "";
                } else {
                    Tip.text("");
                }
            } else if (!$(this).hasClass("required")) {
                Tip.text("");
            }
        })
        Form.find(".newpasswordrept").blur(function () {
            var Tip = $(this).next(".tip");
            if ($(this).val() != "") {
                var reg = $(".newpassword").val();
                if ($(this).val() != reg) {
                    Tip.text("两次输入的密码不同！");
                    throw "";
                } else {
                    Tip.text("");
                }
            } else if (!$(this).hasClass("required")) {
                Tip.text("");
            }
        })
        Form.find(".timeend").blur(function () {
            // 验证开始时间不能大于结束时间
            var Tip = $(this).next(".tip");
            if ($(this).val() != "") {
                var reg = $(".timestart").val();
                if ((new Date($(this).val())) < (new Date(reg))) {
                    Tip.text("开始时间不能大于结束时间");
                    that.Toast(2,"开始时间不能大于结束时间")
                    throw "";
                }else  if ((new Date($(this).val())) - (new Date(reg)) === 0) {
                    Tip.text("开始时间不能等于结束时间");
                    that.Toast(2,"开始时间不能等于结束时间");
                    throw "";
                } else {
                    Tip.text("");
                }
            } else if (!$(this).hasClass("required")) {
                Tip.text("");
            }
        })
        Form.find(".phone").blur(function () {
            var Tip = $(this).next(".tip");
            let textname = $(this).parents(".form-group").find("label").text();
            if ($(this).val() != "") {
                var reg = /^[1][0-9]{10}$/;
                if (!reg.test($(this).val())) {
                    Tip.text("手机号格式错误！");
                    that.Toast(2,'手机号格式错误！')
                    throw "";
                } else {
                    Tip.text("");
                }
            } else if (!$(this).hasClass("required")) {
                Tip.text("");
            }
        })
        Form.find(".idcard").blur(function () {
            var Tip = $(this).next(".tip");
            let textname = $(this).parents(".form-group").find("label").text();
            if ($(this).val() != "") {
                var pId = $(this).val();
                var arrVerifyCode = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
                var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                var Checker = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

                if (pId.length != 15 && pId.length != 18) {
                    Tip.text("身份证号格式错误！");
                    that.Toast(2,'身份证号格式错误！')
                    throw "";
                };

                var Ai = pId.length == 18 ? pId.substring(0, 17) : pId.slice(0, 6) + "19" + pId.slice(6, 16);

                if (!/^\d+$/.test(Ai)) {
                    Tip.text("身份证号格式错误！");
                    that.Toast(2,'身份证号格式错误！')
                    throw "";
                };

                var yyyy = Ai.slice(6, 10), mm = Ai.slice(10, 12) - 1, dd = Ai.slice(12, 14);

                var d = new Date(yyyy, mm, dd), now = new Date();
                var year = d.getFullYear(), mon = d.getMonth(), day = d.getDate();

                if (year != yyyy || mon != mm || day != dd || d > now || year < 1940) {
                    Tip.text("身份证号格式错误！");
                    that.Toast(2,'身份证号格式错误！')
                    throw "";
                };

                for (var i = 0, ret = 0; i < 17; i++) ret += Ai.charAt(i) * Wi[i];
                Ai += arrVerifyCode[ret %= 11];

                return pId.length == 18 && pId != Ai ? function () {
                    Tip.text("身份证号格式错误！");
                    that.Toast(2,'身份证号格式错误！')
                    throw "";
                } : function () {
                    Tip.text("");
                };
            } else if (!$(this).hasClass("required")) {
                Tip.text("");
            }
        })
        Btn.click(function () {
            Form.find(".required").each(function () {
                $(this).blur();
                $(this).change();
            })
            var flag = true;
            var testNoList=[];
            Form.find(".tip").each(function () {
                if ($(this).text() != "" && !$(this).is(":hidden")) {
                    flag = false;
                    testNoList.push($(this).attr('testNo'));
                }
            })
            if (flag) {
                flag = false;
                Btn.prop("disabled", true);
                Success();
            }else{
            }
            
        })
    }

    // type:1 成功 2失败
    const Toast = function(type,text){
        let toasthtml2=`
        <div class="vux-toast" id='mytoast'>
            <div class="weui-mask_transparent" ></div> 
            <div class="weui-toast ${type === 1 ?'weui-toast_success' :'weui-toast_cancel'}" style="width: 3.6em !important;min-height: 3.6em !important;" >
                <i class="weui-icon-success-no-circle weui-icon_toast"></i>
                <p class="weui-toast__content">${text}</p>
            </div>
        </div>`
        setTimeout(()=>{
            $('#mytoast').remove();
        },2000)
        $('html').append(toasthtml2)

    }

    //获取地址栏参数
    const getUrl = function (url) {
        url = !url ? location.search : url;
        var temp = {};
        if (url.indexOf("?") != -1) {
            var params = url.substr(url.indexOf("?") + 1).split("&");
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split("=");
                temp[param[0]] = param[1];
            }
            return temp;
        } else {
            return false;
        }
    }

    // 倒计时
    var countdown = 60;
    const settime =function() {
        if (countdown == 0) {
            $("#getSmsVerify").html("获取验证码");
            $("#getSmsVerify").removeClass("graybtn");
            countdown = 60;
            return;
        } else {
            $("#getSmsVerify").html(countdown + "s后重新获取");
            $("#getSmsVerify").addClass("graybtn");
            countdown--;
        }
        setTimeout(function () {
            settime();
        }, 1000);
    }

    //Unix时间戳转换
    // 正常时间转unix时间戳
    const unixChange=function(_str){
        if(_str != ''){
            var date = new Date(_str);
            var time1 = date.getTime(); 
            return time1/1000;
        }else{
            return '';
        }
    }
    // unix转普通时间
    const formatTime =function(time) {
        let unixtime = time;
        let unixTimestamp = new Date(unixtime * 1000);
        let Y = unixTimestamp.getFullYear();
        let M = unixTimestamp.getMonth() + 1;
        let D = unixTimestamp.getDate();
        let toDay = Y + '-' + size2(M) + '-' + D;
        return toDay;
    }

    const Format = function (timestamp ) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear();
        let M = date.getMonth()+1 ;
        let D = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return Y+'-'+size2(M)+'-'+size2(D)+ ' '+size2(h)+':'+size2(m)+':'+size2(s);
    }

    const Format_nmdhm = function (timestamp ) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear();
        let M = date.getMonth()+1 ;
        let D = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        return Y+'-'+size2(M)+'-'+size2(D)+ ' '+size2(h)+':'+size2(m);
    }

    const sethide = (e)=>{
        $(e).hide();
    }

    const setshow = (e)=>{
        $(e).show();
    }

    // 图片上传
    const imginputchange = function(inputid,sucFun){
        var ele=$(inputid);
        var all=ele[0].files;
          var reader = new FileReader();
          var album=[];
          var length=all.length;
          var i=0;
          var recur=function(){
              reader.readAsDataURL(all[i]);
              var One=all[i];
              reader.onload=function(e){
                  One.data=this.result;
                  album.push(One);
                  i++;
                  if(i<length){
                      recur();
                  }else{
                      ele.value = '';
                      //alert(i);
                      callBack(album,sucFun);
                  };
              };
          };
          recur();
    }

    var callBack=function(album,sucFun){
		var arg = album[0].data;
		var imgName = album[0].name;
		var imgType= album[0].type;
		var size= parseInt(album[0].size / 1024);//大小kb
		var  img = '<img class="scaleImg" src="' +arg+'" alt="">';
		var canvas=$("<canvas>")[0];
		var canvasCtx=canvas.getContext("2d");
		
		$(img)[0].onload=function(){
        var imgWidth=$(img)[0].width;
                var imgHeight=$(img)[0].height;
                // var orient = getPhotoOrientation($(img)[0]);
                var orient = 0;
                canvas.width=imgWidth;
                canvas.height=imgHeight;
                canvasCtx.drawImage($(img)[0],0,0,imgWidth,imgHeight);
                switch(orient){  
                    case 6://需要顺时针（向左）90度旋转  
    //	                alert('需要顺时针（向左）90度旋转');  
                        rotateImg($(img)[0],'left',canvas);  
                        break;  
                    case 8://需要逆时针（向右）90度旋转  
    //	                alert('需要顺时针（向右）90度旋转');  
                        rotateImg($(img)[0],'right',canvas);  
                        break;  
                    case 3://需要180度旋转  
    //	                alert('需要180度旋转');  
                        rotateImg($(img)[0],'right',canvas);//转两次  
                        rotateImg($(img)[0],'right',canvas);  
                        break;  
                } 
                
                var base64 ="";
                var ratio = 1;
                if(size > 10 * 1024){
                    ratio = 0.02;
                }else if(size > 1 * 1024){
                    ratio = 0.25;
                }else if(size > 200){
                    ratio = 0.6;
                }else{
                    
                }
    //			console.log(ratio);
    //			console.log(base64)
                if(ratio == 1){
                    base64 = arg;
                }else{
                    base64=canvas.toDataURL("image/jpeg",ratio);
                }
                
                var picFile=uploadPic(base64,imgType);
                var imgEnd = '<img class="scaleImg" src="' +base64+'" alt="">';
                sendPic(picFile,imgEnd,imgName,sucFun)
            }
    }
    function uploadPic(basestr,type) {
        var text = window.atob(basestr.split(",")[1]);
    
        var buffer = new ArrayBuffer(text.length);
    
        var ubuffer = new Uint8Array(buffer);
    
        var pecent = 0, loop = null;
    
        for (var i = 0; i < text.length; i++) {
          ubuffer[i] = text.charCodeAt(i);
        }
    
    
        var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
    
        var blob;
    
        if (Builder) {
          var builder = new Builder();
          builder.append(buffer);
          blob = builder.getBlob(type);
        } else {
          blob = new window.Blob([buffer], {type: type});
        }
        return blob;
      }
    //获取照片的元信息（拍摄方向）
    function getPhotoOrientation(img) {
        var orient;
        EXIF.getData(img, function() {
        orient = EXIF.getTag(this, 'Orientation');
        });
        return orient;
    }
    //对图片旋转处理  
    function rotateImg(img, direction,canvas) {    
        //最小与最大旋转方向，图片旋转4次后回到原方向    
        var min_step = 0;    
        var max_step = 3;    
        //var img = document.getElementById(pid);    
        if (img == null)return;    
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
        var height = img.height;    
        var width = img.width;    
        var step = 2;    
        if (step == null) {    
            step = min_step;    
        }    
        if (direction == 'right') {    
            step++;    
            //旋转到原位置，即超过最大值    
            step > max_step && (step = min_step);    
        } else {    
            step--;    
            step < min_step && (step = max_step);    
        }    
        //旋转角度以弧度值为参数    
        var degree = step * 90 * Math.PI / 180;    
        var ctx = canvas.getContext('2d');    
        switch (step) {    
            case 0:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.drawImage(img, 0, 0);    
                break;    
            case 1:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, 0, -height);    
                break;    
            case 2:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, -height);    
                break;    
            case 3:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, 0);    
                break;    
        }    
    }    
    function sendPic(picFile,img,fileName,sucFun) {
        var formData = new FormData();
        formData.append('file',picFile,fileName);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                var jsonData=JSON.parse(xhr.responseText);
                if(jsonData.code==200){
                    sucFun(jsonData)
                }else{
                    Toast(2,data.desc)
                }
            }
          }
        };
        xhr.onloadend = function(){
          //无论失败或成功
          // layer.closeAll();
        }
        xhr.onerror = function(){
          //网络失败
          console.log('网络失败')
        };
        // 开始上传
        
        xhr.open("POST",APIURL+'/get/common/picture/upload', true);
        xhr.send(formData);
    
    }
    // var getRequest = this.getRequest();
    
    var code=queryString('code');
    function queryString(key) {
        return (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
    } 
    const ifhascode = (that,succFun)=>{
        if (code) {
            succFun();
        } else {
            var pageUrl = window.location.href
            .replace(/[/]/g, "%2f")
            .replace(/[:]/g, "%3a")
            .replace(/[#]/g, "%23")
            .replace(/[&]/g, "%26")
            .replace(/[=]/g, "%3d");
            var url =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            "wxb5d008c4068e1228" +
            "&redirect_uri=" +
            pageUrl + //这里放当前页面的地址
            "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
            window.location.href = url;
        }
    }
    const size2 = (val)=>{
        if(val < 10){
            return '0'+val;
        }else{
            return val;
        }

    }
    Vue.prototype.APIURL=APIURL;
    Vue.prototype.code=code;
    Vue.prototype._ajax=_ajax;
    Vue.prototype._imgajax=_imgajax;
    Vue.prototype.AjaxSumbit = AjaxSumbit;
    Vue.prototype.Toast = Toast;
    Vue.prototype.getUrl=getUrl;
    Vue.prototype.settime=settime;
    Vue.prototype.unixChange=unixChange;
    Vue.prototype.formatTime=formatTime;
    Vue.prototype.Format=Format;
    Vue.prototype.Format_nmdhm=Format_nmdhm;
    Vue.prototype.sethide=sethide;
    Vue.prototype.setshow=setshow;
    Vue.prototype.imginputchange=imginputchange;
    Vue.prototype.ifhascode= ifhascode;
    Vue.prototype.size2= size2;
}
export default install;




