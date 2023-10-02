import English from '../lang/en.json';
import Kazakh from '../lang/kk.json';
import Russian from '../lang/ru.json';

export type Lang = 'en' | 'kk' | 'ru'
const messages = {
    'en': English,
    'kk': Kazakh,
    'ru': Russian,
};

const lang_mode = document.getElementsByTagName('base')[0].dataset.lang_mode as string

export interface ILangOption {
    code: Lang
    name: string
}

export default class LangConfig {
    getLangMode() {
        return lang_mode
    }
    getLang(): Lang {
        if(this.getLangMode() == '1'){
            return 'kk'
        }
        const dLang = localStorage.getItem('lang') || 'en'
        return dLang as Lang
    }
    setLang(dLang: string) {
        if (Object.keys(messages).includes(dLang)) {
            localStorage.setItem('lang', dLang)
        }
    }
    getLangConfig() {
        const lang = this.getLang()
        return { lang, messages: messages[lang] }
    }
}