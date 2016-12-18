// Created by Hivan Du 2015(Siso brand interactive team).

"use strict";

//  limit browser drag move
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
},true);

var app = {
    curRole: null,
    choosedRole: false,
    validBless: false,

    preload: function () {
        app.imgPath = [
            'assets/images/bg01.jpg',
            'assets/images/bg02.jpg',
            'assets/images/bg-boruto.jpg',
            'assets/images/bg-naruto.jpg',
            'assets/images/bg-chutian.jpg',
            'assets/images/bg-zuozhu.jpg',
            'assets/images/bg-dashewan.jpg',
            'assets/images/bg-kai.jpg',
            'assets/images/s03-boruto01.png',
            'assets/images/s03-boruto02.png',
            'assets/images/s03-naruto01.png',
            'assets/images/s03-naruto02.png',
            'assets/images/s03-chutian01.png',
            'assets/images/s03-chutian02.png',
            'assets/images/s03-zuozhu01.png',
            'assets/images/s03-zuozhu02.png',
            'assets/images/s03-dashewan01.png',
            'assets/images/s03-dashewan02.png',
            'assets/images/s03-kai01.png',
            'assets/images/s03-kai02.png',
            'assets/images/s04-boruto.png',
            'assets/images/s04-boruto-title.png',
            'assets/images/s04-naruto.png',
            'assets/images/s04-naruto-title.png',
            'assets/images/s04-chutian.png',
            'assets/images/s04-chutian-title.png',
            'assets/images/s04-zuozhu.png',
            'assets/images/s04-zuozhu-title.png',
            'assets/images/s04-dashewan.png',
            'assets/images/s04-dashewan-title.png',
            'assets/images/s04-kai.png',
            'assets/images/s04-kai-title.png'
        ];
        var imgAmounts;
        var loadedAmounts = 0;
        var isLoaded = false;

        //  get first scene imgs
        $('.scene01 img, .scene02 img, .scene04 img, .scene05 img').each(function () {
            var lazySrc = $(this).attr('lazy-src');
            if (lazySrc) {
                app.imgPath.push(lazySrc);
            }
        });

        imgAmounts = app.imgPath.length;

        //  load first scene imgs
        for (var i = 0; i < app.imgPath.length; i++) {
            var img = new Image();
            img.src = app.imgPath[i];

            img.onload = function () {
                loadedAmounts++;

                /* check img load progress */
                if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                    goCreatingProcess();
                }
            };

            img.onerror = function (error) {
                console.log(123);
                /* check img load progress */
                if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                    goCreatingProcess();
                }
            };
        }

        function goCreatingProcess () {
            isLoaded = true;

            $('.share-tips').show();

            $('.scene img').each(function () {
                var lazySrc = $(this).attr('lazy-src');
                if (lazySrc) { $(this).attr('src', lazySrc) }
            });

            setTimeout(function () {
                $('.loading').hide();
                $('.swiper-container').show();
                app.start();
            }, 200);
        }

        function checkIsAllMainImagesLoaded () {
            if (isLoaded == false) {
                var loadedRate = 0.98;
                $('.loading-txt span').text(parseInt(loadedAmounts / imgAmounts * 100));
                return loadedAmounts / imgAmounts >= loadedRate;
            }
        }
    },

    create: function (){
        var that = this;
        console.log('app preload success...');

        var blessTimer = null;
        var blessWallTimer = null;
        var roleShareTimer = null;
        var arrowTimer = null;

        arrowTimer = setTimeout(function () {
            $('.arrow').fadeIn();
        }, 1600);

        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            parallax : true,

            noSwiping: false,

            // init
            onInit: function () {
                setTimeout(function () {
                    scene01Animation();
                }, 1000);
            },

            onTransitionStart: function (swiper) {
            },

            onTransitionEnd: function (swiper) {
                animationCancel();

                if (swiper.activeIndex == 0) {
                    clearTimeout(arrowTimer);
                    arrowTimer = setTimeout(function () {
                        $('.arrow').fadeIn();
                    }, 1800);
                    app.mySwiper.unlockSwipeToNext();
                    scene01Animation();
                } else if (swiper.activeIndex == 1) {
                    $('.arrow').hide();

                    if (that.choosedRole == false) {
                        app.mySwiper.lockSwipeToNext();
                    }

                } else if (swiper.activeIndex == 2) {
                    app.mySwiper.unlockSwipeToNext();

                    clearTimeout(arrowTimer);
                    arrowTimer = setTimeout(function () {
                        $('.arrow').fadeIn();
                    }, 1800);
                } else if (swiper.activeIndex == 3) {
                    scene04Animation();
                    app.mySwiper.lockSwipeToNext();
                } else if (swiper.activeIndex == 4) {
                    scene05Animation();
                }

                if (swiper.activeIndex != 0 && swiper.activeIndex != 2) {
                    clearTimeout(arrowTimer);
                    $('.arrow').fadeOut();
                }
            }
        });

        //  choose role
        $('.scene02 .role').click(function () {
            chooseRole($(this).index());
        });

        //  random choose role
        $('.scene02 .btn-random').click(function () {
            chooseRole(getRandomArbitrary(0, 5));
        });

        //  confirm bless content
        $('.scene04 .btn-confirm').click(function () {
            if ($('.scene04 .textarea').val().trim().length > 0) {
                that.validBless = true;
                app.mySwiper.unlockSwipeToNext();
                app.mySwiper.slideTo(4, 500);

                //  save bless txt to server
                that.server.saveBlessTxt(window.userName ? window.userName : '哥哥', $('.scene04 .textarea').val().trim());
            }
        });

        // share tips
        var shareTimer = null;

        $('.scene05 .btn-share').click(function () {
            clearTimeout(shareTimer);
            $('.share-tips').addClass('active');

            shareTimer = setTimeout(function () {
                $('.share-tips').removeClass('active');
            }, 3000);
        });


        $('.scene05 .share-tips').click(function () {
            clearTimeout(shareTimer);
            $('.share-tips').removeClass('active');
        });

        function chooseRole (index) {
            var roleList = [
                'naruto',
                'chutian',
                'boruto',
                'zuozhu',
                'dashewan',
                'kai'
            ];

            var roleListChinese = [
                '鸣人',
                '雏田',
                '博人',
                '佐助',
                '大蛇丸',
                '凯'
            ];

            //  set part
            that.curRole = roleList[index];
            that.roleName = roleListChinese[index];
            that.roleIndex = index;
            setTimeout(function () {
                that.choosedRole = true;
                app.mySwiper.unlockSwipeToNext();
                app.mySwiper.slideTo(2, 500);

                //  show arrow
                clearTimeout(arrowTimer);
                arrowTimer = setTimeout(function () {
                    $('.arrow').fadeIn();
                }, 1800);
            }, 300);

            //  update textarea
            $('.textarea').prop('placeholder', '#你想要' + that.roleName + '替你和你朋友说点什么吗#');

            $('.scene03 .part01 .picture').prop('src', '').prop('src', 'assets/images/s03-' + roleList[index] + '01.png');
            $('.scene03 .part02 .picture').prop('src', '').prop('src', 'assets/images/s03-' + roleList[index] + '02.png');

            //  set para
            $('.scene03 .part01 .para').prop('src', '').prop('src', 'assets/images/s03-' + roleList[index] + '-text01.png');
            $('.scene03 .part02 .para').prop('src', '').prop('src', 'assets/images/s03-' + roleList[index] + '-text02.png');

            //  set background
            $('.scene03').css({'background-image': 'none'}).css({'background-image': 'url("assets/images/bg-' + roleList[index] + '.jpg")'});
            $('.scene04').css({'background-image': 'none'}).css({'background-image': 'url("assets/images/bg-' + roleList[index] + '.jpg")'});

            //  set scene04 role and title
            $('.scene04 .title').prop('src', '').prop('src', 'assets/images/s04-' + roleList[index] + '-title.png');
            $('.scene04 .role').prop('src', '').prop('src', 'assets/images/s04-' + roleList[index] + '.png');

        }

        function scene01Animation () {
            var curIndex = 1;
            var arr = ['.boruto-bless', '.naruto-bless', '.zuozhu-bless', '.shala-bless', '.chutian-bless', '.kai-bless', '.dashewan-bless'];

            animationCancel();

            setTimeout(function () {
                $(arr[0]).addClass('active')
                    .siblings('.bless').removeClass('active');

                blessTimer = setInterval(function () {
                    $(arr[curIndex++]).addClass('active')
                        .siblings('.bless').removeClass('active');

                    if (curIndex == arr.length) { curIndex = 0; }
                }, 2000);
            }, 1400);
        }

        function scene04Animation () {
            setTimeout(function () {
                $('.scene04 .role').addClass('active');
            }, 1400);
        }

        function scene05Animation () {
            roleShareTimer = setTimeout(function () {
                $('.scene05 .role').addClass('active');
            }, 1800);
        }

        function animationCancel () {
            //  scene01
            clearInterval(blessTimer);
            $('.scene01 .bless').removeClass('active');

            // scene04
            $('.scene04 .role').removeClass('active');

            // scene05
            clearTimeout(roleShareTimer);
            $('.scene05 .role').removeClass('active');
        }

        function getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //  first time play BGM
        $('#audio')[0].play();
        var initSound = function () {
            //  delay play
            $('#audio')[0].play();

            document.removeEventListener('touchstart', initSound, false);
        };
        document.addEventListener('touchstart', initSound, false);
    },

    server: {
        init: function () {
            console.log("Initializing server...");
            this.socket = io.connect('http://120.26.48.94:1247');
        },

        saveBlessTxt: function (name, bless) {
            //  generate image object which will be send to server
            var blessTxt = {};
            var blessTxtID = 'a' + new Date().getTime();
            blessTxt[blessTxtID] = {
                name: name,
                text: bless,
                index: app.roleIndex
            };

            //  save bless
            console.log('saved bless');
            this.socket.emit('saveBlessText', blessTxt);

            this.socket.on('saveBlessTextResult', function (result) {
                if (result.result == true) {
                    window.blessTxtID = blessTxtID;

                    //  update wechatShare
                    app.wechatShare();
                }
            });
        }
    },

    wechatShare: function () {
        /** initia wechat config as default */
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: (app.roleName ? app.roleName : '火影忍者') + ':火影电影给您拜年啦', // 分享标题
            link: 'http://www.sisobrand.com/h5/naruto_newyear/read.html?blessTxtID=' + window.blessTxtID, // 分享链接
            imgUrl: 'http://www.sisobrand.com/h5/naruto_newyear/assets/images/share-img.jpg', // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: (app.roleName ? app.roleName : '火影忍者') + ':火影电影给您拜年啦', // 分享标题
            desc: '', // 分享描述
            link: 'http://www.sisobrand.com/h5/naruto_newyear/read.html?blessTxtID=' + window.blessTxtID, // 分享链接
            imgUrl: 'http://www.sisobrand.com/h5/naruto_newyear/assets/images/share-img.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            },
            cancel: function () {
            }
        });
    },

    start: function (){
        this.create();
        this.server.init();

        //  init wechat share
        /** initia wechat config as default */
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.ready(function(){
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: '鸣人:火影电影给您拜年啦', // 分享标题
                link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb66fe8e6ed2e6e02&redirect_uri=http://www.sisobrand.com/h5/naruto_newyear&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect', // 分享链接
                imgUrl: 'http://www.sisobrand.com/h5/naruto_newyear/assets/images/share-img.jpg', // 分享图标
                success: function () {
                },
                cancel: function () {
                }
            });

            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                title: '鸣人:火影电影给您拜年啦', // 分享标题
                desc: '', // 分享描述
                link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb66fe8e6ed2e6e02&redirect_uri=http://www.sisobrand.com/h5/naruto_newyear&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect', // 分享链接
                imgUrl: 'http://www.sisobrand.com/h5/naruto_newyear/assets/images/share-img.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                },
                cancel: function () {
                }
            });
        });
    }
};

$(function (){
    // init app
    app.preload();
    console.log('app started success...');
});

