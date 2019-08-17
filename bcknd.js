console.log('HELLO')

//const socket = io.connect('http://localhost:7000')
const socket = io.connect('https://5c75bf42.ngrok.io')

const user = document.getElementById('user')
const msgs = document.getElementById('msgs')
const mbox = document.getElementById('mbox')
const clear = document.getElementById('clear')
const exit = document.getElementById('exit')

var str1,str2,str3='CHATS'

mbox.addEventListener('keydown',(event)=>{
    if(event.which === 13)
    { 
        str1=user.value
        str2=mbox.value
        str3+=`<br> ${str1} : ${str2}`
        
        //msgs.textContent=str3
        msgs.innerHTML=str3
        console.log(msgs.value)
        
        socket.emit('newuser',{
            name:str1,
            chat:str2,
        })
    }
})

socket.on('newmsg',(data)=>{
        
    var chatlog=data.chat
    var Name=data.name
    
    str3+=`<br>${Name} : ${chatlog}`
    console.log('backup!')
    msgs.innerHTML=str3
})

clear.addEventListener('click',(event)=>{
    document.location.reload()
})

exit.addEventListener('click',(event)=>{
    //document.
    socket.emit('clear',str1)
    console.log('exeunt !')
})