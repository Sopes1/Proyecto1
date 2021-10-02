var number = 0;
var notifications = [
    
];

exports.setNumber = (n)=>{
    number = n;
}

exports.getNumber = ()=>{
    return number;
}

exports.getNotifications = () =>{
    return notifications;
}

exports.setNotifications = (n,p) =>{
    notifications.push(n)
    console.log('From ' + p)
}