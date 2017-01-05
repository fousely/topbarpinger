
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const Lang = imports.lang;

let text, button, icon, ip, numMiss, isGreen;

function _hideNotify() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

/*function _buttonPress() {
    this._window = new Gtk.ApplicationWindow({
            application: this.application,
            window_position: Gtk.WindowPosition.CENTER,
            default_height: 100,
            default_width: 300,
            border_width: 10,
            title: "Enter IP"
    });

    // Create the text entry box
    this.entry = new Gtk.Entry();
    this._window.add(this.entry);

    // Connect the text entry box to a function that responds to what you type in
    this.entry.connect("activate", Lang.bind (this, function() {
        ip = this.entry.get_text();
        this._greeter = new Gtk.MessageDialog ({
        transient_for: this._window,
        modal: true,
        text: "Using " + this.entry.get_text(),
        message_type: Gtk.MessageType.OTHER,
        buttons: Gtk.ButtonsType.OK,
        });

        // Show the popup dialog
        this._greeter.show();

        // Bind the OK button to the function that closes the popup
        this._greeter.connect("response", Lang.bind(this, function() {
            this._greeter.destroy();
        }));


    }));

    // Show the window and all child widgets
    this._window.show_all();
}*/

function _notifyUser(option) {
    if (!text) {
        if(option == 0)
            text = new St.Label({ style_class: 'lostconnection-label', text: "Lost Connection to " + ip });
        if(option == 1)
            text = new St.Label({ style_class: 'gainedconnection-label', text: "Re-established Connection" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 255,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideNotify });
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
    this.timer = Mainloop.timeout_add_seconds(1, Lang.bind(this, function() {
        let command = "ping -w 1 -c 1 " + ip;
        let arr = command.split(" ");
        let [result, output] = GLib.spawn_sync(null, arr, null, GLib.SpawnFlags.SEARCH_PATH, null);
        let regex = GLib.Regex.match_simple("1 received", output.toString(), GLib.RegexCompileFlags.OPTIMIZE, GLib.RegexMatchFlags.NOTEMPTY);

        if(regex == true)
            numMiss = 0;
        else if(regex == false && numMiss != 3)
            numMiss += 1;

        if(numMiss == 3 && isGreen) {
            _changeIcon(0);
            _notifyUser(0);
            isGreen = false;
        }
        else if(numMiss == 0 && !isGreen) {
            _changeIcon(1);
            _notifyUser(1);
            isGreen = true;
        }
        return true;
    }));
}

function init() {
    numMiss = 0;
    isGreen = false;
    ip = "192.168.3.13";

    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    icon = new St.Icon({style_class: 'greycircle-icon'});

    button.set_child(icon);
    //this._initMenus();
    //button.connect('button-press-event', _buttonPress);

    _startPings();
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
