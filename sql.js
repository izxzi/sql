let log = document.getElementById('log')
let sql = document.getElementById('sql')

const PREPARING = 'Preparing: '
const PARAMETERS = 'Parameters: '

var parse = () => {
    let text = log.value.replace(/==> +/g, '').replace(/\n/g, '')
    let preparing = text.substring(text.indexOf(PREPARING) + PREPARING.length, text.indexOf(PARAMETERS))
    let parameters = text
        .substr(text.indexOf(PARAMETERS) + PARAMETERS.length)
        .replace(/null/g, 'null(NULL)')
        .replace(/ \(String\)/g, "''(NULL)")
        .split(',')
        .map(i => / ?(?<param>.+)\((?<type>\w+)\)/s.exec(i).groups)
    sql.value = preparing.replace(/\?/g, () => {
        let {param, type} = parameters.shift()
        if(type == 'String' || type == 'Timestamp') {
            return `'${param}'`
        }
        return param
    })
    sql.value = beautify(sql.value)
}

var beautify = (sql) => {
    return sql
        .replace(/(?<=\S),/ig, ',\n      ')
        .replace(/from/ig, '\n  from')
        .replace(/values/ig, '\nvalues')
        .replace(/where/ig, '\n where')
        .replace(/ on /ig, '\n    on ')
        .replace(/\s=\s/ig, '=')
        .replace(/=/ig, ' = ')
        .replace(/and/ig, '\n   and')
        .replace(/order by/ig, '\n order by')
}

var cls = () => {
    log.value = ''
}

var copy = () => {
    sql.select()
    document.execCommand("Copy")
    document.getSelection().empty()
}

var lowercase = () => {
    sql.value = sql.value.toLocaleLowerCase()
}

var initPoet = async () => {
    let poetry = document.getElementById('poetry')
    let res = await fetch('https://v1.jinrishici.com/all.txt')
    let text = await res.text()
    poetry.innerText = text
}

var initTime = () => {
    let time = document.getElementById('time')
    time.innerText = /\S+(?= GMT)/.exec(new Date())[0]
    setInterval(() => {
        time.innerText = /\S+(?= GMT)/.exec(new Date())[0]
    }, 1000)
}

var init = () => {
    initTime()
    initPoet()
}

init()
