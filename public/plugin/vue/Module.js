import { loadModule } from './vue3-sfc-loader.esm.js'
export default class Module {
    static getConfig() {
        return {
            moduleCache: {
                vue: Vue,
            },
            async getFile(url) {
                const res = await fetch('./pages/' + url);
                if (!res.ok) {
                    throw Object.assign(new Error(url + ' ' + res.statusText), { res });
                }
                var resText = await res.text();
                return resText;
            },
            addStyle(textContent) {
                console.log(textContent);
                const style = Object.assign(document.createElement('style'), { textContent });
                const ref = document.head.getElementsByTagName('style')[0] || null;
                document.head.insertBefore(style, ref);
            },

            log(type, ...args) {
                console[type](...args);
            },
            compiledCache: {
                set(key, str) {
                    window.localStorage.setItem(key, str);
                },
                get(key) {
                    return window.localStorage.getItem(key);
                },
            },
            handleModule(type, source, path, options) {
                if (type === '.json') {
                    return JSON.parse(source);
                }
                if (type === '.ini') {
                    return source;
                }
            }
        }
    }

    static load(path) {
        path += '.vue';
        return Vue.defineAsyncComponent(() => loadModule(path, Module.getConfig()));
    }
}