import"./style.a87c9e06.js";async function t(){miro.board.ui.on("icon:click",async()=>{await miro.board.ui.openPanel({url:"app.html"})}),miro.board.ui.on("custom:roll-with-mod",i=>{var e;const o=(e=i.items[0].content.match(/[+-]?\d+/g))==null?void 0:e[0];o&&miro.board.ui.openPanel({url:`app.html?roll-mod=${parseInt(o)}&cache-buster=${Math.random()*Number.MAX_VALUE}`})}),miro.board.experimental.action.register({event:"roll-with-mod",ui:{label:{en:"Roll 2d6+MOD"},icon:"hexagon",description:"Rolls 2d6 and adds a modifier. The result is displayed in the widget"},scope:"local",predicate:{type:"text"},contexts:{item:{}}}),miro.board.events.on("roll-result",async i=>{let o=String(i);o.length>80&&(o="..."+o.slice(-75)),await miro.board.notifications.showInfo(o)})}t();
