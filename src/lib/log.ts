import Chalk from 'chalk';
import moment = require('moment');

export const consoleColours = {
    info: Chalk.cyan,
    start: Chalk.green,
    success: Chalk.green,
    stop: Chalk.red,
    error: Chalk.red,
    status: Chalk.magenta,
    warning: Chalk.yellow,
    debug: Chalk.magentaBright
}

export function log(type: string, message: string, stringReplace: object = {}): void {
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const logTypeLower = type.toLowerCase()
    const logTypeUpper = type.charAt(0).toUpperCase()+type.toLowerCase().slice(1)
    if (process.env.NODE_ENV === 'production' && logTypeLower === 'debug') return
    message = message.replace(/<.+>/g,match => {
        return Chalk.italic.blue(match)
    })
    for (let replaceKey in stringReplace) {
        message = message.replace(`{${replaceKey}}`,stringReplace[replaceKey])
    }
    if (consoleColours.hasOwnProperty(logTypeLower)) {
        const logTypeFormat = consoleColours[logTypeLower](`[${logTypeUpper}]`)
        console.log(Chalk`{grey ${dateTime}} ${logTypeFormat} ${message}`)
    } else {
        console.log(Chalk`{grey ${dateTime}} [${logTypeUpper}] ${message}`)
    }
}

export function debugLog(message: string, stringReplace: object = {}): void {
    debugLog(message,stringReplace)
}

export function errorLog(message: string, stringReplace: object = {}): void {
    log('error',message,stringReplace)
}