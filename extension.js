
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;

let text, button, icon; 

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function _changeIcon(color) {
    if(color == 0)
        icon = new St.Icon({style_class: 'redcircle-icon'});
    else if(color == 1)
        icon = new St.Icon({style_class: 'greencircle-icon'});
    else if(color == 2)
        icon = new St.Icon({style_class: 'greycircle-icon'});
    button.set_child(icon);
}

function _startPings() {
    let num = 2;
    while(true) {
        GLib.timeout_add_seconds(1, 1, function() { 
            let command = "python pingscript.py 192.168.3.13";
            let arr = command.split(" ");
            let [result, output] = GLib.spawn_sync(null, arr, null, GLib.SpawnFlags.SEARCH_PATH, null);
            if(output != "null")
                _changeIcon(output);
        });
    }
    
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    icon = new St.Icon({style_class: 'greycircle-icon'});
    
    /*const exec = require('child_process').exec;
    exec ('python pingscript.py 4.4.4.4', (error, stdout, stderr) => {
        if (stdout) {
            icon = new St.Icon({style_class: 'redcircle-icon'});
        }
        else {
            icon = new St.Icon({style_class: 'greencircle-icon'});
        }
    });*/

    /*jQuery.ajax({
    type: "POST",
    url: 'runpython.php',
    dataType: 'json',
    data: {arguments: ["4.4.4.4"]},

    success: function (obj, textstatus) {
                  if( !('error' in obj) ) {
                      icon = new St.Icon({style_class: 'greencircle-icon'});
                  }
                  else {
                      icon = new St.Icon({style_class: 'redcircle-icon'});
                  }
             }
    });*/
    
    //Util.spawn(['/usr/bin/python pingscript.py', 'www.google.com']);
    
    button.set_child(icon);
    button.connect('button-press-event', _showHello);

    _startPings();
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
