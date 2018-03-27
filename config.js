Importer.loadQtBinding( "qt.core");
Importer.loadQtBinding( "qt.gui");
Importer.loadQtBinding( "qt.uitools" );

var config= Array();
config["language"] = QLocale.system().name().substring(0,2);

try {
	var languageFileName = 'lang/' + config["language"] + '.js';
	if (QFile.exists(Amarok.Info.scriptPath() + '/' + languageFileName)) {
		Importer.include(languageFileName);
	} else {
		Importer.include('lang/en.js');
	}
	var configEdit = new configurationEditor();

	Amarok.Window.addSettingsMenu("configAmarok2LibreFM",TEXT_SETTINGS_ENTRY);
	Amarok.Window.SettingsMenu.configAmarok2LibreFM['triggered()'].connect( configureDialog );
} catch ( err ) {
	Amarok.debug ( err );
}

// based on Lyrics Workshop

function configurationEditor() {
	this.dlg = new QWidget(this);

	this.accept = function () {
		this.saveConfiguration();
		this.dlg.close();
	};

	this.close = function() {
		this.dlg.close();
	};

	this.onConfigure = function() {
		this.toggleChange.checked = config["showChange"];
	}

	this.show = function() {
		this.onConfigure();
		this.dlg.show();
	};

	this.readConfiguration = function() {
		try {
			if (Amarok.Script.readConfig("showChange", "true") == "true") config["showChange"] = true;
			else config["showChange"] = false;
		} catch(err) {
			Amarok.debug('error: ' + err);
		}
		return true;
	};

	this.saveConfiguration = function() {
		try {
			config["showChange"] = this.toggleChange.checked;
			if (config["showChange"]) Amarok.Script.writeConfig("showChange", "true");
			else Amarok.Script.writeConfig("showChange", "false");
		} catch(err) {
			Amarok.debug('error: ' + err);
		}
		return true;
	};

	this.readConfiguration();

	this.toggleBox = new QVBoxLayout();
	this.toggleChange = new QCheckBox(TEXT_TITLE_CHANGE, this.dlg);
	this.toggleBox.addWidget(this.toggleChange,0,0);

	this.buttonBox = new QDialogButtonBox();
	this.buttonBox.addButton( QDialogButtonBox.Ok );
	this.buttonBox.addButton( QDialogButtonBox.Cancel );

	this.buttonBox.accepted.connect( this, this.accept );
	this.buttonBox.rejected.connect( this, this.close );

	this.vblMain = new QVBoxLayout(this.dlg);
	this.vblMain.addLayout(this.toggleBox);
	this.vblMain.addWidget(this.buttonBox,0,0);

	this.dlg.setLayout(this.vblMain);
	this.dlg.sizeHint = new QSize(220,80);
	this.dlg.size = new QSize(220,80);
	this.dlg.minimumSize = new QSize(220,80);
	this.dlg.setWindowTitle(TEXT_CONFIG_TITLE);

	return true;
}


function configureDialog() {
	configEdit.show();
}
