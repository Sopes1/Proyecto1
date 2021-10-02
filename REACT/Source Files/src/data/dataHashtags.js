var names = ["Hashtag 0", "Hashtag 2", "Hashtag 3", "Hashtag 4", "Hashtag 5"]
var totals = [68.3, 24.2, 7.5, 16, 35]

exports.setNames = (n)=>{
    names = n
}

exports.getNames = ()=>{
    return names
}

exports.setTotals = (n)=>{
    totals = n
}

exports.getTotals = ()=>{
    return totals
}