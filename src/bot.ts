import * as config from './config.json'
import * as configGas from './configGas.json'
import { CurrencyMonitor, GasTracker } from './currencyMonitor'

config.bots.forEach(bot => {
    const currencyMonitor = new CurrencyMonitor(bot.symbol, bot.token)
    currencyMonitor.run()
})

configGas.bot.forEach(bot =>{
    const gasTracker = new GasTracker(bot.token)
    gasTracker.run()
})

