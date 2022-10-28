import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from 'dotenv' 
import { delay } from './config.json'
dotenv.config()
if (!process.env.TOKEN_CRYPTOCOMPARE) {
    console.error('НЕТ АПИ ТОКЕНА')
}

export class CurrencyMonitor {
    private symbol: string
    private discordToken: string
    private client: Client

    constructor(symbol: string, discordToken: string) {
        this.symbol = symbol;
        this.discordToken = discordToken;
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }

    public async run() {
        const url: string = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${this.symbol}&tsyms=USD&api_key=${process.env.TOKEN_CRYPTOCOMPARE}`
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
            this.client.login
            setInterval(() => {
                axios.get(url)
                    .then((response) => {
                        const { DISPLAY }: { DISPLAY: any } = response.data;
                        const displayNewUSD = `${DISPLAY[this.symbol].USD.PRICE}`
                        const changePctHour: string = DISPLAY[this.symbol].USD.CHANGEPCTHOUR
                        this.client.user?.setPresence({ activities: [{ name: `${displayNewUSD} | ${changePctHour.startsWith('-') ? changePctHour : `+${changePctHour}`}%` }], status: 'online' })
                        console.log(displayNewUSD)
                    })
            }, delay);
        })
        this.client.login(this.discordToken);
    }
}

export class GasTracker{
    private discordToken: string
    private client: Client

    constructor(discordToken: string){
        this.discordToken = discordToken;
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }

    public async run(){
        const url:string = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.TOKEN_GAS}`
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
            this.client.login
            setInterval(() => {
                axios.get(url)
                    .then((response) => {
                        const { result }: { result:any } = response.data
                        this.client.user?.setPresence({ activities: [{ name: `🚀 ${result.FastGasPrice} | 🕺 ${result.ProposeGasPrice} | 🐌 ${result.SafeGasPrice}` }], status: 'online' })
                    })
            }, delay);
        })
        this.client.login(this.discordToken);
    }
}