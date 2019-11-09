import fs from './modules/androidFileSystem';
/**
 * @typedef {object} fileBrowserSettings
 * @property {string} showHiddenFiles
 * @property {string} sortByName
 */

/**
 * @typedef {object} searchAndFindSettings
 * @property {boolean} wrap
 * @property {boolean} caseSensitive
 * @property {boolean} regExp
 */

/**
 * @typedef {object} settingsValue
 * @property {fileBrowserSettings} fileBrowser
 * @property {number} maxFileSize
 * @property {string[]} filesNotAllowed
 * @property {searchAndFindSettings} search
 * @property {string} lang
 */

class Settings {
    constructor(lang) {
        lang = lang || "en-us";
        /**
         * @type {settingsValue}
         */
        this.defaultSettings = {
            fileBrowser: {
                showHiddenFiles: 'off',
                sortByName: 'off'
            },
            maxFileSize: 5,
            filesNotAllowed: ['zip', 'apk', 'doc', 'docx', 'mp3', 'mp4', 'avi', 'flac', 'mov', 'png', 'jpg', 'jpeg', 'rar', 'pdf', 'gif'],
            search: {
                caseSensitive: false,
                regExp: false,
                wholeWord: false,
                backwards: true
            },
            lang,
            fontSize: "12px",
            editorTheme: "ace/theme/textmate",
            appTheme: "default",
            textWrap: true,
            softTab: true,
            tabSize: 2,
            linenumbers: true,
            beautify: false,
            compileSCSS: false,
            linting: false,
            autoCorrect: true,
            previewMode: 'none',
            initFlag: false
        };
        this.settingsFile = cordova.file.externalApplicationStorageDirectory + 'settings.json';
        this.loaded = false;
        this.onload = null;
        this.onsave = null;

        if ('globalSettings' in localStorage) {
            try {
                const savedSettings = JSON.parse(localStorage.getItem('globalSettings'));
                localStorage.removeItem('globalSettings');
                this.value = savedSettings;
                this.loaded = true;
                this.checkSettings();
                this.update();
            } catch (error) {
                this.reset();
            }
        } else {
            fs.readFile(this.settingsFile)
                .then((res) => {
                    const decoder = new TextDecoder();
                    const settings = JSON.parse(decoder.decode(res.data));
                    this.value = settings;
                    this.checkSettings();
                    this.loaded = true;
                    if (this.onload) this.onload();
                }).catch(() => {
                    fs.writeFile(this.settingsFile, JSON.stringify(this.value), true, false)
                        .then(() => {
                            this.value = this.defaultSettings;
                            this.loaded = true;
                            if (this.onload) this.onload();
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                });
        }
    }
    update(showToast = true) {
        fs.writeFile(this.settingsFile, JSON.stringify(this.value), true, false)
            .then(() => {
                if (this.onsave) this.onsave();
                if (showToast)
                    plugins.toast.showShortBottom(strings['settings saved']);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    reset() {
        this.value = this.defaultSettings;
        this.update(false);
    }

    checkSettings() {
        let falg = false;
        for (let key in this.defaultSettings) {
            if (!(key in this.value)) {
                this.value[key] = this.defaultSettings[key];
                falg = true;
            }
        }
        if (falg)
            this.update();
    }
}

export default Settings;