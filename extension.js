
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const Lang = imports.lang;

let text, button, icon, ip, numMiss, isGreen;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: "Hello World" });
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

function _ping() {
    let ip = "192.168.3.13";
    let command = "ping -w 1 -c 1 " + ip;
    let arr = command.split(" ");
    let [result, output] = GLib.spawn_sync(null, arr, null, GLib.SpawnFlags.SEARCH_PATH, null);
    let regex = GLib.Regex.match_simple("1 received", output.toString(), GLib.RegexCompileFlags.OPTIMIZE, GLib.RegexMatchFlags.NOTEMPTY);
    if(regex == true)
        numMiss = 0;
    else if (regex == false && numMiss != 3)
        numMiss+= 1;
    
    if(numMiss == 3)
        _changeIcon(0);
    else if(numMiss == 0 && !isGreen)
        _changeIcon(1);
}

function _startPings() {
    this.timer = Mainloop.timeout_add_seconds(1, Lang.bind(this, function() {
        let ip = "192.168.3.13";
        let command = "ping -w 1 -c 1 " + ip;
        let arr = command.split(" ");
        let [result, output] = GLib.spawn_sync(null, arr, null, GLib.SpawnFlags.SEARCH_PATH, null);
        let regex = GLib.Regex.match_simple("1 received", output.toString(), GLib.RegexCompileFlags.OPTIMIZE, GLib.RegexMatchFlags.NOTEMPTY);
        
        if(regex == true)
            numMiss = 0;
        else if(regex == false && numMiss != 3)
            numMiss+= 1;
    
        if(numMiss == 3)
            _changeIcon(0);
        else if(numMiss == 0 && !isGreen)
            _changeIcon(1);
        return true;
    }));
}

function init() {
    numMiss = 0;
    isGreen = false;
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    icon = new St.Icon({style_class: 'greycircle-icon'});
    
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
