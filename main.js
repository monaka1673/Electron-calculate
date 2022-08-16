'use strict';

// C:\Users\xxx\electron-test\node_modules\electron\dist\electron.exe
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;
var calc = require('./app/calculate.js');

// 最後のウィンドウが閉じられたとき、アプリケーションを終了する
app.on('window-all-closed',function(){
    if (process.platform !== 'darwin'){
        app.quit();
    }
})

app.on('ready',function(){
    mainWindow = new BrowserWindow({width:250,height:310});
    mainWindow.setResizable(false);
    mainWindow.loadURL('file://'+__dirname+'public/index.html');
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
});

const {ipcMain} = require('electron');

// IPC通信のレンダラープロセスからのリクエストに対してレスポンスを返す。
ipcMain.on('push-num-button',(event,arg)=>{
    console.log(arg);
    if(arg.operand === 'ac' || arg.operand === 'reverse'){
        //ACや +/- が押された場合
        arg.result = calc[arg.operand]();
    }else{
        if(arg.operand === 'append'){
            // 数字が押された場合
            if(!cals.is_append){
                calc.is_append = true;
                calc.sum = 0;
            }
            arg.result = calc.append(arg.input);
        }else if(arg.input ==='.'){
            // 小数点が押された場合
            arg.result = calc.point();
        }else{
            // 数字以外が押された場合
            // (AllClear や +/- 以外)
            if ( Number(calc.sum) != 0 && Number(carc.reserve) !=0 && calc.operand!='reverse'){
                //計算を実行
                calc[calc.operand](calc.sum);
            }
            //電卓のディスプレイに表示
            arg.result  = calc.sum;
            //演算子を保存
            calc.operand = arg.operand;
            //これまでの計算結果を保持
            calc.reserve = calc.sum;

            if(calc.operand !== 'equal'){
                calc.restart();
            }
        }
    }
    console.log(calc);
    event.returnValue = arg;
})