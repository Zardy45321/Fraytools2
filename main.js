// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');

let mainWindow = null;

/*
let mainWindow;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
   mainWindow.webContents.openDevTools()
}
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'favicon.ico') // path to your icon file
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    //remoteMain.enable(win.webContents);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// Function to open dialog for selecting folder

/*
async function openFolderDialog() {
    const { dialog } = require('electron');
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            // Result will contain the selected folder path
            console.log('Selected folder:', result.filePaths[0]);
            return result.filePaths[0];
        }
    }).catch(err => {
        console.log(err);
    });
}

// Expose the function to renderer process
ipcMain.handle('open-folder-dialog', async () => {
    filePath = await openFolderDialog();
    return filePath;
});

*/

ipcMain.handle('open-folder-dialog', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  return result.filePaths[0];
});


ipcMain.handle('open-file-dialog', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    filters: [
        {name: 'Entity',extensions:['entity']}
    ],
    properties: ['openFile']
  });

  return result.filePaths[0];
});

ipcMain.handle('run-gif-import', async (event, arg) => {
    
    return runGifImport(arg,event.sender);
});

function runGifImport(arg, sender) {
  return new Promise((resolve, reject) => {
    //console.log(arg);
      var arguments = [];
      var i = 1;
      for (const a of arg) {
          arguments.push('--param'+i+'='+a);
          i += 1;
      }
    //var testArgs = [`--param1=test`, `--param2=test2`];
      
    const pythonProcess = spawn(path.join(process.cwd(),'resources','scripts','exe','gifImport.exe'), arguments);
    sender.send('progress-update', `Error: ${path.join(process.cwd(),'resources','scripts','exe','gifImport.exe')}`);

    pythonProcess.stdout.on('data', (data) => {
        const message = data.toString();
      //resolve(data.toString());
        sender.send('progress-update',message);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        sender.send('progress-update', `Error: ${data.toString()}`);
        reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            resolve(`We done`);
        } else {
            reject(`Python script exited with code ${code}`);
        }
    });
  });
}


/*
ipcMain.handle('run-python-script', async (event, arg) => {
    
    return runPythonScript(arg,event.sender);
});
*/

// Python Gif Import
/*function runPythonScript(arg, sender) {
  return new Promise((resolve, reject) => {
      
    const pythonProcess = spawn('python', ['gifImport.py', arg]);

    pythonProcess.stdout.on('data', (data) => {
        const message = data.toString();
      //resolve(data.toString());
        sender.send('progress-update',message);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        sender.send('progress-update', `Error: ${data.toString()}`);
        reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            resolve(`We done`);
        } else {
            reject(`Python script exited with code ${code}`);
        }
    });
  });
}
*/
