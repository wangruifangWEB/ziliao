var app = getApp();
Page({
    data: {
        personInfo: '',
        enrollNum: '0',
        joinNum: '0',
        scaleCount: {},
        checkSex: '',
        male_checked: true,
        famale_checked: false,
        unknown_label: false,

        noticeText: '',
        alertModel: false,
        waitPerfect: false,
        waitEdit: false,

        userInfo: '姓名',
        telInfo: '电话',
        cardInfo: '身份证号',
        ageInfo: '年龄',
        statureInfo: '身高（cm）',
        nowWeightInfo: '当前体重（kg）',
        aimWeightInfo: '目标体重（kg）',
        quarterInfo: false,
        industryInfo: false,
        male: true,
        famale: false,
        unknown: false,
        port_image: '',
        arrayIndustry: ['工作行业'],
        industryIndex: 0,
        arrayQuarter: ["工作岗位"],
        quarterIndex: 0,
        quarterIndexValue: '',
        jobInfo: ['工作岗位'],


        checked_edit: true,
        checked_save: false,

        userText: false,
        telText: false,
        cardText: false,
        ageText: false,
        statureText: false,
        nowWeightText: false,
        aimWeightText: false,
        industryText: false,
        quarterText: false,


        grayUserNotice: false,
        redUserNotice: false,
        greenUserNotice: false,
        grayTelNotice: false,
        redTelNotice: false,
        greenTelNotice: false,
        grayIndustryNotice: false,
        redIndustryNotice: false,
        greenIndustryNotice: false,
        grayQuarterNotice: false,
        redQuarterNotice: false,
        greenQuarterNotice: false,
        grayCardNotice: false,
        redCardNotice: false,
        greenCardNotice: false,
        grayAgeNotice: false,
        redAgeNotice: false,
        greenAgeNotice: false,
        grayStatureNotice: false,
        redStatureNotice: false,
        greenStatureNotice: false,
        grayNowWeightNotice: false,
        redNowWeightNotice: false,
        greenNowWeightNotice: false,
        grayAimWeightNotice: false,
        redAimWeightNotice: false,
        greenAimWeightNotice: false,


        userInfoHolder: true,
        telInfoHolder: true,
        cardInfoHolder: true,
        ageInfoHolder: true,
        statureInfoHolder: true,
        nowWeightInfoHolder: true,
        aimWeightInfoHolder: true,
        statusMsg: '',
        statusIcon: '',
    },

    onShow: function () {
        var that = this;
        var timer=null;
        timer=setInterval(function(){
            var session3rd = wx.getStorageSync('3rdSession');
            if (session3rd==""){
                return
            }else{
                clearInterval(timer);
                var session3rd = wx.getStorageSync('3rdSession');


                wx.request({
                    url: app.globalData.globalUrl + "/index.php/Home/Wxprogram/modify",
                    data: {
                        "session3rd": session3rd
                    },
                    method: 'get',
                    success: function (data) {
                        var data = data.data;
                        var url = app.globalData.globalUrl + 'Public';
                        that.dataVerify(data);

                        that.setData({
                            port_image: url + data.port_image,
                            checkSex: data.sex,
                            enrollNum: data.signup_num,
                            joinNum: data.join_num,
                            userInfo: data.uname,
                            telInfo: data.telephone,
                            cardInfo: data.idcards,
                            ageInfo: data.age,
                            statureInfo: data.height,
                            nowWeightInfo: data.weight,
                            aimWeightInfo: data.target_weight,
                            quarterIndexValue: data.work_id,
                            id: data.id
                        })

                        that.checkSex(data);
                        that.job(data);
                        that.checkFormStatus();
                    }
                })

                that.scaleCountFn();
                var personInfo = wx.getStorageSync('userInfo');
                for (var i in personInfo) {
                    that.setData({
                        personInfo: personInfo
                    })
                }
            }
        },1000)
    },
    onHide: function () {
        var that = this;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: '200'
        })
        that.animation = animation;
        animation.width('0%').step();
        that.setData({
            scaleCount: animation.export()
        })
    },
    dataVerify: function (data) {
        if (data.uname == "") {
            data.uname = "姓名"
        }
        if (data.telephone == "") {
            data.telephone = "电话"
        }
        if (data.idcards == "") {
            data.idcards = "身份证号";
        }
        if (data.age == "0") {
            data.age = "年龄";
        }
        if (data.height == "0") {
            data.height = "身高（cm）";
        }
        if (data.weight == "0") {
            data.weight = "当前体重（kg）";
        }
        if (data.target_weight == null) {
            data.target_weight = "目标体重（kg）";
        }
        if (data.industry_id ==  null) {
            data.industry_id = 0;
        }
    },
    job: function (data) {
        var that = this;
        var arrJob = data.arr_job;
        var industry = [];
        for (var i in arrJob) {
            that.data.arrayIndustry.push(arrJob[i].text);
            that.data.jobInfo.push(arrJob[i].children);
        }
        var industry = that.data.arrayIndustry;
        var jobInfo = that.data.jobInfo;
        that.setData({
            arrayIndustry: industry
        })
        
        var workId=that.data.jobInfo[data.industry_id];
        var j;
        for (var i = 0; i < workId.length;i++){
            if (workId[i].value == that.data.quarterIndexValue){
                j=i;
            }
        }
        if (workId == "工作岗位") {
            that.setData({
                quarterIndex: 0
            })
        } else {
            that.setData({
                quarterIndex: j+1
            })
        }
        
        var quarterarr = ["工作岗位"];
        for (var i = 0; i < jobInfo[data.industry_id].length; i++) {
            quarterarr.push(jobInfo[data.industry_id][i].text);
        }
        that.setData({
            arrayQuarter: quarterarr,
            industryIndex: data.industry_id,
            quarterIndex: that.data.quarterIndex
        })
    },
    editfn: function () {
        this.setData({
            checked_edit: false,
            checked_save: true
        })
    },
    savefn: function () {
        var userInfo = this.data.userInfo;
        var telInfo = this.data.telInfo;
        var industryIndex = this.data.industryIndex;
        var quarterIndex = this.data.quarterIndex;
        var quarterIndexValue = this.data.quarterIndexValue;
        var cardInfo = this.data.cardInfo;
        var ageInfo = this.data.ageInfo;
        var statureInfo = this.data.statureInfo;
        var nowWeightInfo = this.data.nowWeightInfo;
        var aimWeightInfo = this.data.aimWeightInfo;
        var checkSex = this.data.checkSex;
        var userReg = /^(((\s?[\u4e00-\u9fa5]+\s?)+)|([a-zA-Z]+\s?)+)$/;
        var cardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        var telReg = /^1(3|4|5|7|8)\d{9}$/;

        if (userInfo == '' || telInfo == '' || industryIndex == 0 || quarterIndex == 0 || cardInfo == '' || ageInfo == '' || statureInfo == '' || nowWeightInfo == '' || aimWeightInfo == '') {
            this.setData({
                alertModel: true,
                waitPerfect: true,
                waitEdit: false,
            })
        } else if (!userReg.test(userInfo) || !telReg.test(telInfo) || !cardReg.test(cardInfo)) {
            this.setData({
                alertModel: true,
                waitPerfect: false,
                waitEdit: true,
            })
        } else {
            var session3rd = wx.getStorageSync('3rdSession');
            console.log('industryIndex:' + industryIndex);
            console.log('quarterIndex:' + quarterIndex);
            console.log('quarterIndexValue:' + quarterIndexValue);
            console.log('userInfo：' + userInfo);
            console.log('cardInfo:' + cardInfo);
            console.log('telInfo:' + telInfo);
            console.log('ageInfo:' + ageInfo);
            console.log('statureInfo:' + statureInfo);
            console.log('nowWeightInfo:' + nowWeightInfo);
            console.log('aimWeightInfo:' + aimWeightInfo);
            console.log('checkSex:' + checkSex);
            this.setData({
                alertModel: false,
                checked_edit: true,
                checked_save: false
            })
            var that = this;
            wx.request({
                url: app.globalData.globalUrl + "/index.php/Home/Wxprogram/updataModify",
                data: {
                    "session3rd": session3rd,
                    "industryIndex": industryIndex,
                    "quarterIndex": quarterIndex,
                    "quarterIndexValue": quarterIndexValue,
                    "userInfo": userInfo,
                    "cardInfo": cardInfo,
                    "telInfo": telInfo,
                    "ageInfo": ageInfo,
                    "statureInfo": statureInfo,
                    "nowWeightInfo": nowWeightInfo,
                    "aimWeightInfo": aimWeightInfo,
                    "checkSex": checkSex,
                    "id": that.data.id
                },
                method: 'GET',
                success: function (data) {
                    console.log(data.data);
                    var statusCode = data.data.status;

                    that.setData({
                        alertSave: true,
                        statusMsg: data.data.conment,
                        greenUserNotice: false,
                        greenTelNotice: false,
                        greenIndustryNotice: false,
                        greenQuarterNotice: false,
                        greenCardNotice: false,
                        greenAgeNotice: false,
                        greenStatureNotice: false,
                        greenNowWeightNotice: false,
                        greenAimWeightNotice: false,
                    })
                    var statusMsg = data.data.conment;
                    if (statusCode == "0") {
                        that.setData({
                            statusIcon: "cancel",
                        })
                    }
                    if (statusCode == "1") {
                        that.setData({
                            statusIcon: "warn"
                        })
                    }
                    if (statusCode == "2") {
                        that.setData({
                            statusIcon: "success",
                            
                        })
                    }
                    setInterval(function () {
                        that.setData({
                            alertSave: false
                        })
                    }, 1500)
                },
                fail: function () {
                    wx.showToast({
                        title: '保存失败',
                    })
                }
            })

        }
    },
    check_male: function () {
        this.setData({
            male_checked: true,
            famale_checked: false,
            unknown_label: false
        })
    },
    check_famale: function () {
        this.setData({
            male_checked: false,
            famale_checked: true,
            unknown_label: false
        })
    },
    check_unkoown: function () {
        this.setData({
            male_checked: false,
            famale_checked: false,
            unknown_label: true
        })
    },
    closeAlert: function () {
        this.setData({
            alertModel: false,
        })
    },
    // 性别
    sexChange: function (event) {
        this.setData({
            checkSex: event.detail.value
        })
    },
    // 用户名
    userFocusfn: function () {
        this.setData({
            userText: true,
            grayUserNotice: true,
            redUserNotice: false,
            greenUserNotice: false
        })
        if (this.data.userInfo == "姓名") {
            this.setData({
                userInfoHolder: false,
                userInfo: '',
            })
        }
    },
    userBlurfn: function (event) {
        var userReg = /^(((\s?[\u4e00-\u9fa5]+\s?)+)|([a-zA-Z]+\s?)+)$/;
        if (!userReg.test(event.detail.value)) {
            this.setData({
                grayUserNotice: false,
                redUserNotice: true,
                greenUserNotice: false,
                userInfo: event.detail.value
            })
        } else {
            this.setData({
                grayUserNotice: false,
                redUserNotice: false,
                greenUserNotice: true,
                userInfo: event.detail.value
            })
        }
    },

    // 电话
    telFocusfn: function () {
        this.setData({
            telText: true,
            grayTelNotice: true,
            redTelNotice: false,
            greenTelNotice: false
        })
        if (this.data.telInfo == "电话") {
            this.setData({
                telInfoHolder: false,
                telInfo: '',
            })
        }
    },
    telBlurfn: function (event) {
        var telReg = /^1(3|4|5|7|8)\d{9}$/;
        if (!telReg.test(event.detail.value)) {
            this.setData({
                grayTelNotice: false,
                redTelNotice: true,
                greenTelNotice: false,
                telInfo: event.detail.value,
            })
        } else {
            this.setData({
                telInfo: event.detail.value,
                grayTelNotice: false,
                redTelNotice: false,
                greenTelNotice: true
            })

        }
    },
    // 身份证号
    cardFocusfn: function () {
        this.setData({
            cardText: true,
            grayCardNotice: true,
            redCardNotice: false,
            greenCardNotice: false,
        })
        if (this.data.cardInfo == "身份证号") {
            this.setData({
                cardInfoHolder: false,
                cardInfo: '',
            })
        }
    },
    cardBlurfn: function (event) {
        var cardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (!cardReg.test(event.detail.value)) {
            this.setData({
                grayCardNotice: false,
                redCardNotice: true,
                greenCardNotice: false,
                cardInfo: event.detail.value
            })
        } else {
            this.setData({
                grayCardNotice: false,
                redCardNotice: false,
                greenCardNotice: true,
                cardInfo: event.detail.value
            })
        }
    },

    // 年龄
    ageFocusfn: function () {
        this.setData({
            ageText: true,
            grayAgeNotice: true,
            redAgeNotice: false,
            greenAgeNotice: false,
        })
        if (this.data.ageInfo == "年龄") {
            this.setData({
                ageInfoHolder: false,
                ageInfo: '',
            })
        }
    },
    ageBlurfn: function (event) {
        if (event.detail.value == "") {
            this.setData({
                grayAgeNotice: false,
                redAgeNotice: true,
                greenAgeNotice: false,
                ageInfo: event.detail.value,
            })
        } else {
            this.setData({
                ageInfo: event.detail.value,
                grayAgeNotice: false,
                redAgeNotice: false,
                greenAgeNotice: true,
            })
        }
    },

    // 身高
    statureFocusfn: function () {
        this.setData({
            statureText: true,
            grayStatureNotice: true,
            redStatureNotice: false,
            greenStatureNotice: false,
        })
        if (this.data.statureInfo == "身高（cm）") {
            this.setData({
                statureInfoHolder: false,
                statureInfo: '',
            })
        }
    },
    statureBlurfn: function (event) {
        if (event.detail.value == "") {
            this.setData({
                grayStatureNotice: false,
                redStatureNotice: true,
                greenStatureNotice: false,
                statureInfo: event.detail.value,
            })
        } else {
            this.setData({
                statureInfo: event.detail.value,
                grayStatureNotice: false,
                redStatureNotice: false,
                greenStatureNotice: true,
            })
        }
    },
    // 当前体重
    nowWeightFocusfn: function () {
        this.setData({
            nowWeightText: true,
            grayNowWeightNotice: true,
            redNowWeightNotice: false,
            greenNowWeightNotice: false,
        })
        if (this.data.nowWeightInfo == "当前体重（kg）") {
            this.setData({
                nowWeightInfoHolder: false,
                nowWeightInfo: '',
            })
        }
    },
    nowWeightBlurfn: function (event) {
        if (event.detail.value == "") {
            this.setData({
                grayNowWeightNotice: false,
                redNowWeightNotice: true,
                greenNowWeightNotice: false,
                nowWeightInfo: event.detail.value,
            })
        } else {
            this.setData({
                nowWeightInfo: event.detail.value,
                grayNowWeightNotice: false,
                redNowWeightNotice: false,
                greenNowWeightNotice: true,
            })
        }
    },
    // 目标体重
    aimWeightFocusfn: function () {
        this.setData({
            aimWeightText: true,
            grayAimWeightNotice: true,
            redAimWeightNotice: false,
            greenAimWeightNotice: false,
        })
        if (this.data.aimWeightInfo == "目标体重（kg）") {
            this.setData({
                aimWeightInfoHolder: false,
                aimWeightInfo: '',
            })
        }
    },
    aimWeightBlurfn: function (event) {
        if (event.detail.value == "") {
            this.setData({
                grayAimWeightNotice: false,
                redAimWeightNotice: true,
                greenAimWeightNotice: false,
                aimWeightInfo: event.detail.value,
            })
        } else {
            this.setData({
                aimWeightInfo: event.detail.value,
                grayAimWeightNotice: false,
                redAimWeightNotice: false,
                greenAimWeightNotice: true,
            })
        }
    },


    // 工作行业
    industryfn: function (event) {
        this.setData({
            industryText: true,
            industryIndex: event.detail.value
        })
        var industryIndex = this.data.industryIndex;
        var quarterarr = this.data.jobInfo[industryIndex];
        var quarter = ['工作岗位'];
        if (this.data.jobInfo[industryIndex] == "工作岗位") {
            quarter = quarter;
            this.setData({
                grayQuarterNotice: false,
                redQuarterNotice: false,
                greenQuarterNotice: false
            })
        } else {
            for (var i = 0; i < quarterarr.length; i++) {
                // console.log(quarterarr[i].text);
                quarter.push(quarterarr[i].text);
            }
        }
        this.setData({
            arrayQuarter: quarter
        })
        if (this.data.industryIndex == 0) {
            this.setData({
                quarterIndex: 0,
                quarterText: false,
                industryText: false,
                quarterInfo: false,
                industryInfo: false,
                grayIndustryNotice: false,
                redIndustryNotice: true,
                greenIndustryNotice: false,
            })

        } else {
            this.setData({
                quarterIndex: 1,
                industryText: true,
                industryInfo: true,
                grayIndustryNotice: false,
                redIndustryNotice: false,
                greenIndustryNotice: true,
            })
        }

    },
    // 工作岗位
    quarterfn: function (event) {
        this.setData({
            quarterText: true,
            quarterIndex: event.detail.value
        })

        var quarterI = this.data.jobInfo[this.data.industryIndex];
        var quarterIndex = this.data.quarterIndex - 1;
        var quarterIndexI;
        for (var i = 1; i <= quarterI.length; i++) {
            if (i == 1) {
                this.setData({
                    grayQuarterNotice: false,
                    redQuarterNotice: true,
                    greenQuarterNotice: false
                })
            } else {
                quarterIndexI = quarterI[quarterIndex].value;
                this.setData({
                    quarterIndexValue: quarterIndexI
                })
            }
        }
        if (this.data.quarterIndex == 0) {
            this.setData({
                quarterInfo: false,
                grayQuarterNotice: false,
                redQuarterNotice: true,
                greenQuarterNotice: false,
                quarterText: false,
                industryText: false,
            })
        } else {
            this.setData({
                quarterText: true,
                quarterInfo: true,
                grayQuarterNotice: false,
                redQuarterNotice: false,
                greenQuarterNotice: true,
            })
        }
    },

    // 活跃度动画
    scaleCountFn: function () {
        var that = this;
        var enrollNum = that.data.enrollNum;
        var joinNum = that.data.joinNum;
        that.data.scaleCount = parseInt(joinNum) / parseInt(enrollNum) * 100 + '%';
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: '200'
        })
        that.animation = animation;
        animation.width(that.data.scaleCount).step();
        that.setData({
            scaleCount: animation.export()
        })
    },
    // 检测页面文字显示颜色
    checkFormStatus: function () {
        if (this.data.industryIndex == 0) {
            this.setData({
                industryInfo: false
            })
        } else {
            this.setData({
                industryInfo: true,
                industryText: true
            })
        }

        if (this.data.quarterIndex == 0) {
            this.setData({
                quarterInfo: false
            })
        } else {
            this.setData({
                quarterInfo: true,
                quarterText: true
            })
        }

        if (this.data.userInfo == "姓名") {
            this.setData({
                userInfoHolder: true
            })
        } else {
            this.setData({
                userText: true,
                userInfoHolder: false
            })
        }
        if (this.data.telInfo == "电话") {
            this.setData({
                telInfoHolder: true
            })
        } else {
            this.setData({
                telText: true,
                telInfoHolder: false
            })
        }
        if (this.data.cardInfo == "身份证号") {
            this.setData({
                cardInfoHolder: true
            })
        } else {
            this.setData({
                cardText: true,
                cardInfoHolder: false
            })
        }
        if (this.data.ageInfo == "年龄") {
            this.setData({
                ageInfoHolder: true
            })
        } else {
            this.setData({
                ageText: true,
                ageInfoHolder: false
            })
        }
        if (this.data.statureInfo == "身高（cm）") {
            this.setData({
                statureInfoHolder: true
            })
        } else {
            this.setData({
                statureText: true,
                statureInfoHolder: false
            })
        }
        if (this.data.nowWeightInfo == "当前体重（kg）") {
            this.setData({
                nowWeightInfoHolder: true
            })
        } else {
            this.setData({
                nowWeightText: true,
                nowWeightInfoHolder: false
            })
        }
        if (this.data.aimWeightInfo == "目标体重（kg）") {
            this.setData({
                aimWeightInfoHolder: true
            })
        } else {
            this.setData({
                aimWeightText: true,
                aimWeightInfoHolder: false
            })
        }
    },
    checkSex: function (data) {
        var that = this;
        if (data.sex == 1) {
            that.setData({
                male: true,
                famale: false,
                unknown: false,
                male_checked: true,
                famale_checked: false,
                unknown_label: false
            })
        }
        if (data.sex == 2) {
            that.setData({
                male: false,
                famale: true,
                unknown: false,
                male_checked: false,
                famale_checked: true,
                unknown_label: false
            })
        }
        if (data.sex == 0) {
            that.setData({
                male: false,
                famale: false,
                unknown: true,
                male_checked: false,
                famale_checked: false,
                unknown_label: true
            })
        }
    }
})