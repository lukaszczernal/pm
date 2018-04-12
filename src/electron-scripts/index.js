const {app, BrowserWindow} = require('electron');
const updater = require('./auto-updater');

const isWindows = process.platform === 'win32';
let win;

// TODO make it configurable
// process.argv
process.env.NODE_ENV = 'production';

function createWindow() {
    win = new BrowserWindow({ show: false })

    win.loadURL(`file://${__dirname}/index.html`)

    if (process.env.NODE_ENV == 'development')
        win.webContents.openDevTools();

    win.on('ready-to-show', () => win.show());

    win.on('closed', () => {
        win = null
    })

    updater.init();
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (isWindows)
        app.quit();
})

app.on('activate', () => {
    if (win === null)
        createWindow();
})