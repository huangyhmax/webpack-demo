import _ from 'lodash';
// import $ from 'jquery';
// import foo from './foo';

// function component() {
//   // var element = document.createElement('div');
//   var element = j('<div></div>');

//   // Lodash, currently included via a script, is required for this line to work
//   // Lodash, now imported by this script
//   // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//   element.html(_.join(['Hello','test jquery haha'], ' '))

//   // return element;
//   return element.get(0);
// }

// document.body.appendChild(component());
// console.log(foo)
// console.log(foo())

$(function(){
    function Carousel($ct){
        this.$ct=$ct;
        this.init();
        this.bind();
        // this.tipsShow();
    }
    Carousel.prototype.init=function(){
        this.$preBtn=this.$ct.find('.arrow.pre');
        this.$nextBtn=this.$ct.find('.arrow.next');
        this.list=this.$ct.find('.pics>li');
        var imgWidth=this.imgWidth=this.$ct.find('img').width();
        var listCount=this.listCount=this.list.length;
        this.$imgCt=this.$ct.find('.pics');
        this.pageIndex=0;
        this.$tipsBtn=this.$ct.find('.tipchoose>li');

        this.isAminate=false;

        this.$imgCt.css({left:-imgWidth});
        this.$imgCt.append(this.list.first().clone());
        this.$imgCt.prepend(this.list.last().clone());
        console.log(listCount);
        console.log(imgWidth);
        this.$imgCt.width(((listCount)+2)*imgWidth);
        console.log(this.$imgCt)
        console.log(this.$imgCt.width())
        console.log("init部分结束")
    }

    Carousel.prototype.bind=function(){
        var _this=this
        console.log(this.$preBtn)
        console.log('测试'+this.pageIndex)
        
        this.$preBtn.on('click',function(){
            _this.playPre(1)
        })
        this.$nextBtn.on('click',function(){
            _this.playNext(1)
        })
        this.$tipsBtn.on('click',function(){
            var _thistb=this
            var index=$(_thistb).index();
            console.log(index);
            // console.log(_this.pageIndex);
            if(index>_this.pageIndex){
                _this.playNext(index-_this.pageIndex);
            }else if(index<_this.pageIndex){
                _this.playPre(_this.pageIndex-index);
            }
        })
    }
    Carousel.prototype.playPre=function(len){
        this.len=len;
        console.log(len);
        console.log(this.len);
        var _this=this;
        console.log('外面pageindex是:'+this.pageIndex)
        if(_this.isAminate) return;
        _this.isAminate=true;
        console.log(this.len*this.imgWidth)
        this.$imgCt.animate({left:'+='+this.len*this.imgWidth},function(){
            _this.pageIndex -=_this.len;
            console.log('pageindex是:'+_this.pageIndex)
            // pageIndex--;
            if(_this.pageIndex<0){
                _this.pageIndex=_this.listCount-1;
                _this.$imgCt.css({left:-_this.imgWidth*_this.listCount});
            }
            console.log(_this.pageIndex);  
            _this.tipsShow() 
            _this.isAminate=false;
        })
    }

    Carousel.prototype.playNext=function(len){
        this.len=len;
        var _this=this
        if(_this.isAminate) return;
        _this.isAminate=true;
        _this.$imgCt.animate({left:'-='+this.len*this.imgWidth},function(){
            _this.pageIndex +=_this.len;
            // pageIndex++;
            if(_this.pageIndex==_this.listCount){
                _this.pageIndex=0;
                _this.$imgCt.css({left:-_this.imgWidth});
            }
            console.log(_this.pageIndex);
            _this.tipsShow()
            _this.isAminate=false;
        })  
    }
    Carousel.prototype.tipsShow=function(){
        var _this=this
        _this.$tipsBtn.removeClass('active').eq(_this.pageIndex).addClass('active');
    }
    var a=new Carousel($('#carousel'));




    var curPage=1
    var perPageCount=7
    var liwidth=$('.item').outerWidth(true);
    var waterfallarr=[]
    var arrlen=parseInt($('.pic').width()/liwidth)
    for(var i=0;i<arrlen;i++){
        waterfallarr[i]=0
    }
    /*
    1、获取数据（ajax）
    2、将数据拼装成dom，通过瀑布流算法渲染显示到页面
    （这里，数据获取加载之后，我才能知道img的高度是多少，需要做个load事件）
    3、懒加载，隐藏的.load元素显示时，就请求数据加载显示，循环回第一步
    */
    Loaddata()
    function Loaddata(){
        getData(function(newsList){
            $.each(newsList,function(idx,news){
                var $nodes=getNodes(news)
                $nodes.find('img').load(function(){
                    $('.pic').append($nodes)
                    // console.log($nodes,'loading。。。')
                    waterFallPlace($nodes)
                })
            })
        })
    }
    /*当浏览器窗口放大缩小时*/
    $(window).resize(function(){
        Loaddata()
    })
    $('.loadpicture').on('click',function(){
        Loaddata()
    })
    /*从接口获取数据*/
    //新浪新闻接口： http://platform.sina.com.cn/slide/album_tech?jsoncallback=func&app_key=1271687855&num=3&page=4
    //http://platform.sina.com.cn/slide/album_tech
    function getData(callback){
        $.ajax({
            url:'http://platform.sina.com.cn/slide/album_tech',
            dataType:'jsonp',
            jsonp:'jsoncallback',
            data:{
                app_key:'1271687855',
                num:perPageCount,
                page:curPage
            }
        }).done(function(res){
            if(res && res.status && res.status.code==="0"){
                callback(res.data); 
                curPage++
            }else{
                console.log('get data error');
            }
        })
    }
    /*html的拼装*/
    function getNodes(item){
        var html=''
        html += '<li><a href="' +item.url+ '" class="link">'
        html += '<img src="'+item.img_url+'" alt="" class="waterimg"></a></li>'
        return $(html)
        //返回一个jquery对象
    }
    //瀑布流
    function waterFallPlace($nodes){
        $nodes.each(function(){
            var minValue=Math.min.apply(null,waterfallarr)
            var minIndex=waterfallarr.indexOf(minValue)
            $(this).css({
                top:waterfallarr[minIndex],
                left:$(this).outerWidth(true) * minIndex, //计算包括外边距
                opacity:1
            })
            waterfallarr[minIndex] += $(this).outerHeight(true);
            $('.pic').height(Math.max.apply(null,waterfallarr));
        })
    }




    var $portfoliowrapper=$('.portfolio-wrapper');
    $portfoliowrapper.on('mouseenter','li',function(){
        console.log(1)
        $(this).addClass('change').siblings().removeClass('change')
    }).on('mouseleave','li',function(){
        $(this).removeClass('change')
    })
   
    var $navs=$('.tipscroll>li>a'),
    $sections=$('.section'),
    // $window=$(window),
    navlength=$navs.length-1;
    console.log(navlength);
    console.log($sections);
    console.log($navs);

    $(window).scroll(function(){
        // var scrollTop=$(window).scrollTop();
        var scrollY=$(document).scrollTop();
        var len=navlength;
        // console.log('scrollTop: '+scrollTop);
        // console.log('scrollY: '+scrollY);
        if(scrollY>200){
            $('.navscroll').removeClass('hidden').addClass('show');
            $('.navbackground').removeClass('show').addClass('hidden');
        }else{
            $('.navscroll').removeClass('show').addClass('hidden');
            $('.navbackground').removeClass('hidden').addClass('show');
        }
        console.log(2)
        
        for(;len>-1;len--){
            var that=$sections.eq(len);
            if(scrollY>=that.offset().top){
                $navs.removeClass('current').eq(len).addClass('current');
                break;
            }
        }
        // $navs.click(function(e){
        //     e.preventDefault();
        //     $('html,body').animate({
        //         'scrollY': $($(this).attr('href')).offset().top
        //     },400);
        // });
    })
    $navs.on('click', function(e) {
        var scrollTop = $(window).scrollTop();
        console.log(1111);
        e.preventDefault();
        $('html, body').animate({
            'scrollTop': $($(this).attr('href')).offset().top
        }, 400);
        console.log(scrollTop)
    });

    var $gotop=$('.gotop')
    $gotop.on('click',function(){
        $(window).scrollTop(0);
        return;
    })
})